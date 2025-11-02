import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '../../lib/supabase'
import { Button, Input, Select, Modal, Table, TableHeader, TableBody, TableRow, TableCell } from '../../components/ui'
import type { Database } from '../../types/supabase'

type Music = Database['public']['Tables']['music']['Row']
type MusicInsert = Database['public']['Tables']['music']['Insert']

const musicSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  artist: z.string().min(1, 'Artist is required'),
  album: z.string().optional(),
  genre: z.array(z.string()).min(1, 'At least one genre is required'),
  release_date: z.string().min(1, 'Release date is required'),
  cover_url: z.string().url().optional().or(z.literal('')),
  preview_url: z.string().url().optional().or(z.literal('')),
  file_url: z.string().url().optional().or(z.literal('')),
  duration: z.number().min(0).optional(),
  status: z.enum(['draft', 'published'])
})

type MusicFormData = z.infer<typeof musicSchema>

const genreOptions = [
  'Pop', 'Rock', 'Hip Hop', 'R&B', 'Jazz', 'Classical',
  'Electronic', 'Country', 'Blues', 'Reggae', 'Folk',
  'Metal', 'Punk', 'Alternative', 'Indie', 'Other'
]

const MusicManagementPage: React.FC = () => {
  const [music, setMusic] = useState<Music[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingMusic, setEditingMusic] = useState<Music | null>(null)
  const [uploading, setUploading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<MusicFormData>({
    resolver: zodResolver(musicSchema),
    defaultValues: {
      status: 'draft',
      genre: []
    }
  })

  const selectedGenres = watch('genre') || []

  useEffect(() => {
    fetchMusic()
  }, [])

  const fetchMusic = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('music')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setMusic(data || [])
    } catch (error) {
      console.error('Error fetching music:', error)
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

  const uploadFile = async (file: File, bucket: string): Promise<string | null> => {
    try {
      setUploading(true)
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `music/${fileName}`

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

  const onSubmit = async (data: MusicFormData) => {
    try {
      const musicData: MusicInsert = {
        ...data,
        album: data.album || null,
        cover_url: data.cover_url || null,
        preview_url: data.preview_url || null,
        file_url: data.file_url || null,
        duration: data.duration || null
      }

      if (editingMusic) {
        const { error } = await supabase
          .from('music')
          .update(musicData)
          .eq('id', editingMusic.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('music')
          .insert([musicData])

        if (error) throw error
      }

      setShowModal(false)
      setEditingMusic(null)
      reset()
      fetchMusic()
    } catch (error) {
      console.error('Error saving music:', error)
      alert('Error saving music')
    }
  }

  const handleEdit = (musicItem: Music) => {
    setEditingMusic(musicItem)
    setValue('title', musicItem.title)
    setValue('artist', musicItem.artist)
    setValue('album', musicItem.album || '')
    setValue('genre', musicItem.genre)
    setValue('release_date', musicItem.release_date)
    setValue('cover_url', musicItem.cover_url || '')
    setValue('preview_url', musicItem.preview_url || '')
    setValue('file_url', musicItem.file_url || '')
    setValue('duration', musicItem.duration || undefined)
    setValue('status', musicItem.status as 'draft' | 'published')
    setShowModal(true)
  }

  const handleDelete = async (musicItem: Music) => {
    if (!confirm(`Are you sure you want to delete "${musicItem.title}" by ${musicItem.artist}?`)) return

    try {
      const { error } = await supabase
        .from('music')
        .delete()
        .eq('id', musicItem.id)

      if (error) throw error
      fetchMusic()
    } catch (error) {
      console.error('Error deleting music:', error)
      alert('Error deleting music')
    }
  }

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = await uploadFile(file, 'music-covers')
      if (url) {
        setValue('cover_url', url)
      }
    }
  }

  const formatDuration = (seconds?: number | null) => {
    if (!seconds) return 'N/A'
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1 className="admin-title">Music Management</h1>
        <Button onClick={() => {
          setEditingMusic(null)
          reset()
          setShowModal(true)
        }}>
          Add New Music
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading music...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell header>Cover</TableCell>
              <TableCell header>Title</TableCell>
              <TableCell header>Artist</TableCell>
              <TableCell header>Album</TableCell>
              <TableCell header>Genre</TableCell>
              <TableCell header>Duration</TableCell>
              <TableCell header>Status</TableCell>
              <TableCell header>Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {music.map((musicItem) => (
              <TableRow key={musicItem.id}>
                <TableCell>
                  {musicItem.cover_url && (
                    <img
                      src={musicItem.cover_url}
                      alt={musicItem.title}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                </TableCell>
                <TableCell>{musicItem.title}</TableCell>
                <TableCell>{musicItem.artist}</TableCell>
                <TableCell>{musicItem.album || 'N/A'}</TableCell>
                <TableCell>{musicItem.genre.join(', ')}</TableCell>
                <TableCell>{formatDuration(musicItem.duration)}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs ${
                    musicItem.status === 'published'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {musicItem.status}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(musicItem)}
                    className="mr-2"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(musicItem)}
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
          setEditingMusic(null)
          reset()
        }}
        title={editingMusic ? 'Edit Music' : 'Add New Music'}
        size="xl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Title"
            {...register('title')}
            error={errors.title?.message}
          />

          <Input
            label="Artist"
            {...register('artist')}
            error={errors.artist?.message}
          />

          <Input
            label="Album"
            {...register('album')}
            error={errors.album?.message}
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

          <Input
            label="Release Date"
            type="date"
            {...register('release_date')}
            error={errors.release_date?.message}
          />

          <Input
            label="Duration (seconds)"
            type="number"
            min="0"
            {...register('duration', { valueAsNumber: true })}
            error={errors.duration?.message}
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
            label="Preview URL"
            {...register('preview_url')}
            error={errors.preview_url?.message}
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
                setEditingMusic(null)
                reset()
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={uploading}>
              {editingMusic ? 'Update Music' : 'Add Music'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default MusicManagementPage