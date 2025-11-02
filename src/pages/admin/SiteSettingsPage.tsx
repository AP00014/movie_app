import React, { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '../../lib/supabase'
import { Button, Input, Textarea } from '../../components/ui'

const siteSettingsSchema = z.object({
  siteName: z.string().min(1, 'Site name is required'),
  logoUrl: z.string().url().optional().or(z.literal('')),
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
  secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
  backgroundColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
  textColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
  headerText: z.string().min(1, 'Header text is required'),
  footerText: z.string().min(1, 'Footer text is required'),
  featuredBackground: z.string().url().optional().or(z.literal('')),
  metaDescription: z.string().min(1, 'Meta description is required')
})

type SiteSettingsFormData = z.infer<typeof siteSettingsSchema>

const SiteSettingsPage: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<SiteSettingsFormData>({
    resolver: zodResolver(siteSettingsSchema)
  })

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')

      if (error) throw error

      // Convert array of key-value pairs to object
      const settings: Record<string, string> = {}
      data?.forEach(setting => {
        settings[setting.key] = setting.value
      })

      // Set form values
      reset({
        siteName: settings.siteName || 'Synergize Studio',
        logoUrl: settings.logoUrl || '',
        primaryColor: settings.primaryColor || '#ff6b6b',
        secondaryColor: settings.secondaryColor || '#ee5a24',
        backgroundColor: settings.backgroundColor || '#121212',
        textColor: settings.textColor || '#f5f5f5',
        headerText: settings.headerText || 'Welcome to Synergize Studio',
        footerText: settings.footerText || '© 2024 Synergize Studio. All rights reserved.',
        featuredBackground: settings.featuredBackground || '',
        metaDescription: settings.metaDescription || 'Your ultimate entertainment destination'
      })
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }, [reset])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  const onSubmit = async (data: SiteSettingsFormData) => {
    try {
      setSaving(true)

      // Convert object to array of key-value pairs for upsert
      const settingsToUpsert = Object.entries(data).map(([key, value]) => ({
        key,
        value: value || ''
      }))

      const { error } = await supabase
        .from('site_settings')
        .upsert(settingsToUpsert, { onConflict: 'key' })

      if (error) throw error

      alert('Settings saved successfully!')
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Error saving settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="admin-page">
        <div className="text-center py-8">Loading settings...</div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1 className="admin-title">Site Settings</h1>
        <Button onClick={fetchSettings} variant="outline">
          Refresh
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="admin-form-container">
          <h2 className="admin-form-title">General Settings</h2>
          <div className="admin-form-grid">
            <Input
              label="Site Name"
              {...register('siteName')}
              error={errors.siteName?.message}
            />

            <Input
              label="Logo URL"
              {...register('logoUrl')}
              error={errors.logoUrl?.message}
              placeholder="https://example.com/logo.png"
            />

            <Textarea
              label="Meta Description"
              {...register('metaDescription')}
              error={errors.metaDescription?.message}
              rows={3}
            />
          </div>
        </div>

        <div className="admin-form-container">
          <h2 className="admin-form-title">Color Scheme</h2>
          <div className="admin-form-grid">
            <div>
              <label className="form-label block text-sm font-medium text-gray-700 mb-1">
                Primary Color
              </label>
              <input
                type="color"
                {...register('primaryColor')}
                className="form-input h-10 w-full"
              />
              {errors.primaryColor && (
                <p className="mt-1 text-sm text-red-600">{errors.primaryColor.message}</p>
              )}
            </div>

            <div>
              <label className="form-label block text-sm font-medium text-gray-700 mb-1">
                Secondary Color
              </label>
              <input
                type="color"
                {...register('secondaryColor')}
                className="form-input h-10 w-full"
              />
              {errors.secondaryColor && (
                <p className="mt-1 text-sm text-red-600">{errors.secondaryColor.message}</p>
              )}
            </div>

            <div>
              <label className="form-label block text-sm font-medium text-gray-700 mb-1">
                Background Color
              </label>
              <input
                type="color"
                {...register('backgroundColor')}
                className="form-input h-10 w-full"
              />
              {errors.backgroundColor && (
                <p className="mt-1 text-sm text-red-600">{errors.backgroundColor.message}</p>
              )}
            </div>

            <div>
              <label className="form-label block text-sm font-medium text-gray-700 mb-1">
                Text Color
              </label>
              <input
                type="color"
                {...register('textColor')}
                className="form-input h-10 w-full"
              />
              {errors.textColor && (
                <p className="mt-1 text-sm text-red-600">{errors.textColor.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="admin-form-container">
          <h2 className="admin-form-title">Content Settings</h2>
          <div className="admin-form-grid">
            <Input
              label="Header Welcome Text"
              {...register('headerText')}
              error={errors.headerText?.message}
            />

            <Input
              label="Footer Text"
              {...register('footerText')}
              error={errors.footerText?.message}
            />

            <Input
              label="Featured Background Image URL"
              {...register('featuredBackground')}
              error={errors.featuredBackground?.message}
              placeholder="https://example.com/featured-bg.jpg"
            />
          </div>
        </div>

        <div className="admin-form-footer">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default SiteSettingsPage