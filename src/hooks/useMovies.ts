import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Database } from '../types/supabase'

type Movie = Database['public']['Tables']['movies']['Row']

export const useMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMovies = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setMovies(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const createMovie = async (movie: Database['public']['Tables']['movies']['Insert']) => {
    try {
      const { data, error } = await supabase
        .from('movies')
        .insert([movie])
        .select()
        .single()

      if (error) throw error
      setMovies(prev => [data, ...prev])
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  const updateMovie = async (id: string, updates: Database['public']['Tables']['movies']['Update']) => {
    try {
      const { data, error } = await supabase
        .from('movies')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      setMovies(prev => prev.map(movie => movie.id === id ? data : movie))
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  const deleteMovie = async (id: string) => {
    try {
      const { error } = await supabase
        .from('movies')
        .delete()
        .eq('id', id)

      if (error) throw error
      setMovies(prev => prev.filter(movie => movie.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  useEffect(() => {
    fetchMovies()
  }, [])

  return {
    movies,
    loading,
    error,
    fetchMovies,
    createMovie,
    updateMovie,
    deleteMovie
  }
}