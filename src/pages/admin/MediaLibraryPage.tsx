import React, { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import { Button, Modal } from '../../components/ui'

interface FileMetadata {
  size?: number
  mimetype?: string
  cacheControl?: string
  lastModified?: string
}

interface FileItem {
  name: string
  id: string
  updated_at: string
  created_at: string
  last_accessed_at: string
  metadata: FileMetadata | null
}

const MediaLibraryPage: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBucket, setSelectedBucket] = useState('posters')
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  const buckets = [
    { id: 'posters', name: 'Movie Posters', accept: 'image/*' },
    { id: 'music-covers', name: 'Music Covers', accept: 'image/*' },
    { id: 'game-assets', name: 'Game Assets', accept: 'image/*' },
    { id: 'avatars', name: 'User Avatars', accept: 'image/*' }
  ]

  const fetchFiles = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.storage
        .from(selectedBucket)
        .list('', {
          limit: 100,
          sortBy: { column: 'created_at', order: 'desc' }
        })

      if (error) throw error
      setFiles(data || [])
    } catch (error) {
      console.error('Error fetching files:', error)
    } finally {
      setLoading(false)
    }
  }, [selectedBucket])

  useEffect(() => {
    fetchFiles()
  }, [fetchFiles])

  const uploadFile = async (file: File) => {
    try {
      setUploading(true)
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from(selectedBucket)
        .upload(fileName, file)

      if (uploadError) throw uploadError

      fetchFiles()
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Error uploading file')
    } finally {
      setUploading(false)
    }
  }

  const deleteFile = async (fileName: string) => {
    if (!confirm(`Are you sure you want to delete "${fileName}"?`)) return

    try {
      const { error } = await supabase.storage
        .from(selectedBucket)
        .remove([fileName])

      if (error) throw error

      fetchFiles()
    } catch (error) {
      console.error('Error deleting file:', error)
      alert('Error deleting file')
    }
  }

  const getFileUrl = (fileName: string) => {
    const { data } = supabase.storage
      .from(selectedBucket)
      .getPublicUrl(fileName)

    return data.publicUrl
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      uploadFile(file)
    }
    // Reset input
    e.target.value = ''
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const isImageFile = (fileName: string) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
    return imageExtensions.some(ext => fileName.toLowerCase().endsWith(ext))
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1 className="admin-title">Media Library</h1>
        <div className="flex space-x-4">
          <select
            value={selectedBucket}
            onChange={(e) => setSelectedBucket(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            {buckets.map((bucket) => (
              <option key={bucket.id} value={bucket.id}>
                {bucket.name}
              </option>
            ))}
          </select>
          <div>
            <input
              type="file"
              accept={buckets.find(b => b.id === selectedBucket)?.accept}
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
              disabled={uploading}
            />
            <label
              htmlFor="file-upload"
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {uploading ? 'Uploading...' : 'Upload File'}
            </label>
          </div>
          <Button onClick={fetchFiles} variant="outline">
            Refresh
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading files...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {files.map((file) => (
            <div key={file.name} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                {isImageFile(file.name) ? (
                  <img
                    src={getFileUrl(file.name)}
                    alt={file.name}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => {
                      setSelectedFile(file)
                      setShowPreview(true)
                    }}
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-xs mt-1">File</p>
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-gray-900 truncate" title={file.name}>
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(file.created_at).toLocaleDateString()}
                </p>
                {file.metadata && (
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.metadata.size || 0)}
                  </p>
                )}
                <div className="mt-2 flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(getFileUrl(file.name), '_blank')}
                    className="flex-1"
                  >
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => deleteFile(file.name)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {files.length === 0 && !loading && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No files</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by uploading a file to this bucket.
          </p>
        </div>
      )}

      <Modal
        isOpen={showPreview}
        onClose={() => {
          setShowPreview(false)
          setSelectedFile(null)
        }}
        title={selectedFile?.name || 'File Preview'}
      >
        {selectedFile && (
          <div className="text-center">
            {isImageFile(selectedFile.name) ? (
              <img
                src={getFileUrl(selectedFile.name)}
                alt={selectedFile.name}
                className="max-w-full max-h-96 mx-auto"
              />
            ) : (
              <div className="text-gray-500">
                <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="mt-2">File preview not available</p>
              </div>
            )}
            <div className="mt-4 text-left">
              <p><strong>Name:</strong> {selectedFile.name}</p>
              <p><strong>Created:</strong> {new Date(selectedFile.created_at).toLocaleString()}</p>
              <p><strong>Modified:</strong> {new Date(selectedFile.updated_at).toLocaleString()}</p>
              {selectedFile.metadata && (
                <p><strong>Size:</strong> {formatFileSize(selectedFile.metadata.size || 0)}</p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default MediaLibraryPage