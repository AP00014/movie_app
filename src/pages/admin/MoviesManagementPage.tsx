import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '../../lib/supabase'
import { Button, Input, Textarea, Select, Modal, Table, TableHeader, TableBody, TableRow, TableCell } from '../../components/ui'
import type { Database } from '../../types/supabase'

type Movie = Database['public']['Tables']['movies']['Row']
type MovieInsert = Database['public']['Tables']['movies']['Insert']

const movieSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  genre: z.array(z.string()).min(1, 'At least one genre is required'),
  country: z.string().min(1, 'Country is required'),
  release_date: z.string().min(1, 'Release date is required'),
  rating: z.number().min(0).max(10).optional(),
  poster_url: z.string().url().optional().or(z.literal('')),
  trailer_url: z.string().url().optional().or(z.literal('')),
  file_url: z.string().url().optional().or(z.literal('')),
  status: z.enum(['draft', 'published'])
})

type MovieFormData = z.infer<typeof movieSchema>

const genreOptions = [
  'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary',
  'Drama', 'Family', 'Fantasy', 'Horror', 'Mystery', 'Romance',
  'Sci-Fi', 'Thriller', 'War', 'Western'
]

const countryOptions = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'France',
  'Germany', 'Italy', 'Spain', 'Japan', 'South Korea', 'China',
  'India', 'Brazil', 'Mexico', 'Russia', 'Other'
]

const MoviesManagementPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null)
  const [uploading, setUploading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<MovieFormData>({
    resolver: zodResolver(movieSchema),
    defaultValues: {
      status: 'draft',
      genre: []
    }
  })

  const selectedGenres = watch('genre') || []

  useEffect(() => {
    fetchMovies()
  }, [])

  const fetchMovies = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setMovies(data || [])
    } catch (error) {
      console.error('Error fetching movies:', error)
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
      const filePath = `movies/${fileName}`

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

  const onSubmit = async (data: MovieFormData) => {
    try {
      const movieData: MovieInsert = {
        ...data,
        rating: data.rating || null,
        poster_url: data.poster_url || null,
        trailer_url: data.trailer_url || null,
        file_url: data.file_url || null
      }

      if (editingMovie) {
        const { error } = await supabase
          .from('movies')
          .update(movieData)
          .eq('id', editingMovie.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('movies')
          .insert([movieData])

        if (error) throw error
      }

      setShowModal(false)
      setEditingMovie(null)
      reset()
      fetchMovies()
    } catch (error) {
      console.error('Error saving movie:', error)
      alert('Error saving movie')
    }
  }

  const handleEdit = (movie: Movie) => {
    setEditingMovie(movie)
    setValue('title', movie.title)
    setValue('description', movie.description || '')
    setValue('genre', movie.genre)
    setValue('country', movie.country)
    setValue('release_date', movie.release_date)
    setValue('rating', movie.rating || undefined)
    setValue('poster_url', movie.poster_url || '')
    setValue('trailer_url', movie.trailer_url || '')
    setValue('file_url', movie.file_url || '')
    setValue('status', movie.status as 'draft' | 'published')
    setShowModal(true)
  }

  const handleDelete = async (movie: Movie) => {
    if (!confirm(`Are you sure you want to delete "${movie.title}"?`)) return

    try {
      const { error } = await supabase
        .from('movies')
        .delete()
        .eq('id', movie.id)

      if (error) throw error
      fetchMovies()
    } catch (error) {
      console.error('Error deleting movie:', error)
      alert('Error deleting movie')
    }
  }

  const handlePosterUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = await uploadFile(file, 'posters')
      if (url) {
        setValue('poster_url', url)
      }
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1 className="admin-title">Movies Management</h1>
        <Button onClick={() => {
          setEditingMovie(null)
          reset()
          setShowModal(true)
        }}>
          Add New Movie
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading movies...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell header>Poster</TableCell>
              <TableCell header>Title</TableCell>
              <TableCell header>Genre</TableCell>
              <TableCell header>Country</TableCell>
              <TableCell header>Release Date</TableCell>
              <TableCell header>Rating</TableCell>
              <TableCell header>Status</TableCell>
              <TableCell header>Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movies.map((movie) => (
              <TableRow key={movie.id}>
                <TableCell>
                  {movie.poster_url && (
                    <img
                      src={movie.poster_url}
                      alt={movie.title}
                      className="w-12 h-16 object-cover rounded"
                    />
                  )}
                </TableCell>
                <TableCell>{movie.title}</TableCell>
                <TableCell>{movie.genre.join(', ')}</TableCell>
                <TableCell>{movie.country}</TableCell>
                <TableCell>{new Date(movie.release_date).toLocaleDateString()}</TableCell>
                <TableCell>{movie.rating ? `${movie.rating}/10` : 'N/A'}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs ${
                    movie.status === 'published'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {movie.status}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(movie)}
                    className="mr-2"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(movie)}
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
          setEditingMovie(null)
          reset()
        }}
        title={editingMovie ? 'Edit Movie' : 'Add New Movie'}
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

          <Select
            label="Country"
            {...register('country')}
            error={errors.country?.message}
            options={countryOptions.map(country => ({ value: country, label: country }))}
          />

          <Input
            label="Release Date"
            type="date"
            {...register('release_date')}
            error={errors.release_date?.message}
          />

          <Input
            label="Rating (0-10)"
            type="number"
            min="0"
            max="10"
            step="0.1"
            {...register('rating', { valueAsNumber: true })}
            error={errors.rating?.message}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Poster Upload
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePosterUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {uploading && <p className="text-sm text-blue-600 mt-1">Uploading...</p>}
          </div>

          <Input
            label="Poster URL"
            {...register('poster_url')}
            error={errors.poster_url?.message}
          />

          <Input
            label="Trailer URL"
            {...register('trailer_url')}
            error={errors.trailer_url?.message}
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
                setEditingMovie(null)
                reset()
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={uploading}>
              {editingMovie ? 'Update Movie' : 'Add Movie'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default MoviesManagementPage