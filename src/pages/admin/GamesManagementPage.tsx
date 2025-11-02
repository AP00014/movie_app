import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '../../lib/supabase'
import { Button, Input, Textarea, Select, Modal, Table, TableHeader, TableBody, TableRow, TableCell } from '../../components/ui'
import type { Database } from '../../types/supabase'

type Game = Database['public']['Tables']['games']['Row']
type GameInsert = Database['public']['Tables']['games']['Insert']

const gameSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  genre: z.array(z.string()).min(1, 'At least one genre is required'),
  platform: z.array(z.string()).min(1, 'At least one platform is required'),
  release_date: z.string().min(1, 'Release date is required'),
  icon_url: z.string().url().optional().or(z.literal('')),
  cover_url: z.string().url().optional().or(z.literal('')),
  file_url: z.string().url().optional().or(z.literal('')),
  status: z.enum(['draft', 'published'])
})

type GameFormData = z.infer<typeof gameSchema>

const genreOptions = [
  'Action', 'Adventure', 'RPG', 'Strategy', 'Simulation',
  'Sports', 'Racing', 'Puzzle', 'Platformer', 'Shooter',
  'Fighting', 'Horror', 'MMORPG', 'Indie', 'Other'
]

const platformOptions = [
  'PC', 'PlayStation 5', 'PlayStation 4', 'Xbox Series X/S',
  'Xbox One', 'Nintendo Switch', 'Mobile', 'VR', 'Mac', 'Linux'
]

const GamesManagementPage: React.FC = () => {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingGame, setEditingGame] = useState<Game | null>(null)
  const [uploading, setUploading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<GameFormData>({
    resolver: zodResolver(gameSchema),
    defaultValues: {
      status: 'draft',
      genre: [],
      platform: []
    }
  })

  const selectedGenres = watch('genre') || []
  const selectedPlatforms = watch('platform') || []

  useEffect(() => {
    fetchGames()
  }, [])

  const fetchGames = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setGames(data || [])
    } catch (error) {
      console.error('Error fetching games:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenreChange = (genre: string, checked: boolean) => {
    const currentGenres = selectedGenres
    if (checked) {
      setValue('genre', [...currentGenres, genre])
    } else {
      setValue('genre', currentGenres.filter((g: string) => g !== genre))
    }
  }

  const handlePlatformChange = (platform: string, checked: boolean) => {
    const currentPlatforms = selectedPlatforms
    if (checked) {
      setValue('platform', [...currentPlatforms, platform])
    } else {
      setValue('platform', currentPlatforms.filter((p: string) => p !== platform))
    }
  }

  const uploadFile = async (file: File, bucket: string): Promise<string | null> => {
    try {
      setUploading(true)
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `games/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

      return data.publicUrl
    } catch (error) {
      console.error('Error uploading file:', error)
      return null
    } finally {
      setUploading(false)
    }
  }

  const onSubmit = async (data: GameFormData) => {
    try {
      const gameData: GameInsert = {
        ...data,
        description: data.description || null,
        icon_url: data.icon_url || null,
        cover_url: data.cover_url || null,
        file_url: data.file_url || null
      }

      if (editingGame) {
        const { error } = await supabase
          .from('games')
          .update(gameData)
          .eq('id', editingGame.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('games')
          .insert([gameData])

        if (error) throw error
      }

      setShowModal(false)
      setEditingGame(null)
      reset()
      fetchGames()
    } catch (error) {
      console.error('Error saving game:', error)
      alert('Error saving game')
    }
  }

  const handleEdit = (game: Game) => {
    setEditingGame(game)
    setValue('title', game.title)
    setValue('description', game.description || '')
    setValue('genre', game.genre)
    setValue('platform', game.platform)
    setValue('release_date', game.release_date)
    setValue('icon_url', game.icon_url || '')
    setValue('cover_url', game.cover_url || '')
    setValue('file_url', game.file_url || '')
    setValue('status', game.status as 'draft' | 'published')
    setShowModal(true)
  }

  const handleDelete = async (game: Game) => {
    if (!confirm(`Are you sure you want to delete "${game.title}"?`)) return

    try {
      const { error } = await supabase
        .from('games')
        .delete()
        .eq('id', game.id)

      if (error) throw error
      fetchGames()
    } catch (error) {
      console.error('Error deleting game:', error)
      alert('Error deleting game')
    }
  }

  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = await uploadFile(file, 'game-assets')
      if (url) {
        setValue('icon_url', url)
      }
    }
  }

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = await uploadFile(file, 'game-assets')
      if (url) {
        setValue('cover_url', url)
      }
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1 className="admin-title">Games Management</h1>
        <Button onClick={() => {
          setEditingGame(null)
          reset()
          setShowModal(true)
        }}>
          Add New Game
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading games...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell header>Icon</TableCell>
              <TableCell header>Title</TableCell>
              <TableCell header>Genre</TableCell>
              <TableCell header>Platform</TableCell>
              <TableCell header>Release Date</TableCell>
              <TableCell header>Status</TableCell>
              <TableCell header>Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {games.map((game) => (
              <TableRow key={game.id}>
                <TableCell>
                  {game.icon_url && (
                    <img
                      src={game.icon_url}
                      alt={game.title}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                </TableCell>
                <TableCell>{game.title}</TableCell>
                <TableCell>{game.genre.join(', ')}</TableCell>
                <TableCell>{game.platform.join(', ')}</TableCell>
                <TableCell>{new Date(game.release_date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs ${
                    game.status === 'published'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {game.status}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(game)}
                    className="mr-2"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(game)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setEditingGame(null)
          reset()
        }}
        title={editingGame ? 'Edit Game' : 'Add New Game'}
        size="xl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Title"
            {...register('title')}
            error={errors.title?.message}
          />

          <Textarea
            label="Description"
            {...register('description')}
            error={errors.description?.message}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Genres
            </label>
            <div className="grid grid-cols-3 gap-2">
              {genreOptions.map((genre) => (
                <label key={genre} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedGenres.includes(genre)}
                    onChange={(e) => handleGenreChange(genre, e.target.checked)}
                    className="mr-2"
                  />
                  {genre}
                </label>
              ))}
            </div>
            {errors.genre && (
              <p className="mt-1 text-sm text-red-600">{errors.genre.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Platforms
            </label>
            <div className="grid grid-cols-3 gap-2">
              {platformOptions.map((platform) => (
                <label key={platform} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedPlatforms.includes(platform)}
                    onChange={(e) => handlePlatformChange(platform, e.target.checked)}
                    className="mr-2"
                  />
                  {platform}
                </label>
              ))}
            </div>
            {errors.platform && (
              <p className="mt-1 text-sm text-red-600">{errors.platform.message}</p>
            )}
          </div>

          <Input
            label="Release Date"
            type="date"
            {...register('release_date')}
            error={errors.release_date?.message}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Icon Upload
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleIconUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {uploading && <p className="text-sm text-blue-600 mt-1">Uploading...</p>}
          </div>

          <Input
            label="Icon URL"
            {...register('icon_url')}
            error={errors.icon_url?.message}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cover Upload
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {uploading && <p className="text-sm text-blue-600 mt-1">Uploading...</p>}
          </div>

          <Input
            label="Cover URL"
            {...register('cover_url')}
            error={errors.cover_url?.message}
          />

          <Input
            label="File URL"
            {...register('file_url')}
            error={errors.file_url?.message}
          />

          <Select
            label="Status"
            {...register('status')}
            error={errors.status?.message}
            options={[
              { value: 'draft', label: 'Draft' },
              { value: 'published', label: 'Published' }
            ]}
          />

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowModal(false)
                setEditingGame(null)
                reset()
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={uploading}>
              {editingGame ? 'Update Game' : 'Add Game'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default GamesManagementPage