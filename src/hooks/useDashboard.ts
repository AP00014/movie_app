import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

interface RecentUpload {
  id: string
  title: string
  created_at: string
  type: 'Movie' | 'Music' | 'Game'
}

export const useDashboard = () => {
  const [stats, setStats] = useState({
    totalMovies: 0,
    totalMusic: 0,
    totalGames: 0,
    totalUsers: 0,
    recentUploads: [] as RecentUpload[]
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch counts from Supabase
      const [moviesCount, musicCount, gamesCount, usersCount] = await Promise.all([
        supabase.from('movies').select('*', { count: 'exact', head: true }),
        supabase.from('music').select('*', { count: 'exact', head: true }),
        supabase.from('games').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true })
      ])

      // Fetch recent uploads (combined from all tables)
      const [recentMovies, recentMusic, recentGames] = await Promise.all([
        supabase.from('movies').select('id, title, created_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('music').select('id, title, created_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('games').select('id, title, created_at').order('created_at', { ascending: false }).limit(5)
      ])

      const recentUploads: RecentUpload[] = [
        ...recentMovies.data?.map(item => ({ ...item, type: 'Movie' as const })) || [],
        ...recentMusic.data?.map(item => ({ ...item, type: 'Music' as const })) || [],
        ...recentGames.data?.map(item => ({ ...item, type: 'Game' as const })) || []
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 10)

      setStats({
        totalMovies: moviesCount.count || 0,
        totalMusic: musicCount.count || 0,
        totalGames: gamesCount.count || 0,
        totalUsers: usersCount.count || 0,
        recentUploads
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  return {
    stats,
    loading,
    error,
    refetch: fetchDashboardData
  }
}