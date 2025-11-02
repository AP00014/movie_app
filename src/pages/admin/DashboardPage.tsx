import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/admin.css';

interface RecentUpload {
  id: string;
  title: string;
  created_at: string;
  type: string;
}

interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

const DashboardPage: React.FC = () => {
  const { user, isAdmin } = useAuth();

  const [stats, setStats] = useState({
    totalMovies: 0,
    totalMusic: 0,
    totalGames: 0,
    totalUsers: 0,
    recentUploads: [] as RecentUpload[]
  });
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);

  const [siteSettings, setSiteSettings] = useState({
    siteName: 'Synergize Studio',
    logoUrl: '',
    primaryColor: '#ff6b6b',
    secondaryColor: '#ee5a24',
    backgroundColor: '#121212',
    textColor: '#f5f5f5',
    headerText: 'Welcome to Synergize Studio',
    footerText: '© 2024 Synergize Studio. All rights reserved.',
    featuredBackground: '',
    metaDescription: 'Your ultimate entertainment destination'
  });

  const [activeTab, setActiveTab] = useState('overview');

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch counts from Supabase - only fetch user count for admins
      const moviesCount = await supabase.from('movies').select('*', { count: 'exact', head: true });
      const musicCount = await supabase.from('music').select('*', { count: 'exact', head: true });
      const gamesCount = await supabase.from('games').select('*', { count: 'exact', head: true });
      const usersCount = isAdmin() ? await supabase.from('profiles').select('*', { count: 'exact', head: true }) : { count: 0 };

      // Fetch recent uploads (combined from all tables)
      const [recentMovies, recentMusic, recentGames] = await Promise.all([
        supabase.from('movies').select('id, title, created_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('music').select('id, title, created_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('games').select('id, title, created_at').order('created_at', { ascending: false }).limit(5)
      ]);

      const recentUploads = [
        ...recentMovies.data?.map(item => ({ ...item, type: 'Movie' })) || [],
        ...recentMusic.data?.map(item => ({ ...item, type: 'Music' })) || [],
        ...recentGames.data?.map(item => ({ ...item, type: 'Game' })) || []
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 10);

      setStats({
        totalMovies: moviesCount.count || 0,
        totalMusic: musicCount.count || 0,
        totalGames: gamesCount.count || 0,
        totalUsers: usersCount.count || 0,
        recentUploads
      });

      // Prepare chart data
      setChartData([
        { name: 'Movies', value: moviesCount.count || 0, color: '#8884d8' },
        { name: 'Music', value: musicCount.count || 0, color: '#82ca9d' },
        { name: 'Games', value: gamesCount.count || 0, color: '#ffc658' }
      ]);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleSettingChange = (key: string, value: string) => {
    setSiteSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = async () => {
    try {
      // In a real app, this would save to Supabase
      console.log('Saving settings:', siteSettings);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1 className="admin-title">
          {isAdmin() ? 'Admin Dashboard' : 'Editor Dashboard'}
        </h1>
        <div className="admin-actions">
          <span className="text-sm text-gray-600 mr-4">
            Welcome, {user?.name || user?.email}
          </span>
          <Button variant="outline" onClick={fetchDashboardData} disabled={loading}>
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </Button>
        </div>
      </div>

      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        {isAdmin() && (
          <>
            <button
              className={`admin-tab ${activeTab === 'appearance' ? 'active' : ''}`}
              onClick={() => setActiveTab('appearance')}
            >
              Site Appearance
            </button>
            <button
              className={`admin-tab ${activeTab === 'content' ? 'active' : ''}`}
              onClick={() => setActiveTab('content')}
            >
              Content Management
            </button>
          </>
        )}
      </div>

      {activeTab === 'overview' && (
        <div>
          <div className="dashboard-stats">
            <div className="stat-card">
              <div className="stat-card-title">Total Movies</div>
              <div className="stat-card-value">{loading ? '...' : stats.totalMovies}</div>
              <div className="stat-card-change positive">Live data</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-title">Total Music</div>
              <div className="stat-card-value">{loading ? '...' : stats.totalMusic}</div>
              <div className="stat-card-change positive">Live data</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-title">Total Games</div>
              <div className="stat-card-value">{loading ? '...' : stats.totalGames}</div>
              <div className="stat-card-change positive">Live data</div>
            </div>

            {isAdmin() && (
              <div className="stat-card">
                <div className="stat-card-title">Total Users</div>
                <div className="stat-card-value">{loading ? '...' : stats.totalUsers}</div>
                <div className="stat-card-change positive">Live data</div>
              </div>
            )}
          </div>

          <div className="dashboard-charts">
            <div className="chart-container">
              <h3 className="chart-title">Content Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-container">
              <h3 className="chart-title">Monthly Growth</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'appearance' && isAdmin() && (
        <div className="admin-form-container">
          <h2 className="admin-form-title">Site Appearance Settings</h2>
          <div className="admin-form-grid">
            <div className="form-group">
              <label htmlFor="siteName">Site Name</label>
              <input
                id="siteName"
                type="text"
                className="form-input"
                value={siteSettings.siteName}
                onChange={(e) => handleSettingChange('siteName', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="primaryColor">Primary Color</label>
              <input
                id="primaryColor"
                type="color"
                className="form-input"
                value={siteSettings.primaryColor}
                onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="secondaryColor">Secondary Color</label>
              <input
                id="secondaryColor"
                type="color"
                className="form-input"
                value={siteSettings.secondaryColor}
                onChange={(e) => handleSettingChange('secondaryColor', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="backgroundColor">Background Color</label>
              <input
                id="backgroundColor"
                type="color"
                className="form-input"
                value={siteSettings.backgroundColor}
                onChange={(e) => handleSettingChange('backgroundColor', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="textColor">Text Color</label>
              <input
                id="textColor"
                type="color"
                className="form-input"
                value={siteSettings.textColor}
                onChange={(e) => handleSettingChange('textColor', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="logoUrl">Logo URL</label>
              <input
                id="logoUrl"
                type="text"
                className="form-input"
                value={siteSettings.logoUrl}
                onChange={(e) => handleSettingChange('logoUrl', e.target.value)}
                placeholder="https://example.com/logo.png"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="headerText">Header Welcome Text</label>
            <input
              id="headerText"
              type="text"
              className="form-input"
              value={siteSettings.headerText}
              onChange={(e) => handleSettingChange('headerText', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="footerText">Footer Text</label>
            <input
              id="footerText"
              type="text"
              className="form-input"
              value={siteSettings.footerText}
              onChange={(e) => handleSettingChange('footerText', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="metaDescription">Meta Description</label>
            <textarea
              id="metaDescription"
              className="form-input"
              rows={3}
              value={siteSettings.metaDescription}
              onChange={(e) => handleSettingChange('metaDescription', e.target.value)}
            />
          </div>

          <div className="admin-form-footer">
            <button className="btn btn-primary" onClick={saveSettings}>
              Save Appearance Settings
            </button>
          </div>
        </div>
      )}

      {activeTab === 'content' && isAdmin() && (
        <div className="admin-form-container">
          <h2 className="admin-form-title">Content Management</h2>
          <div className="admin-form-grid">
            <div className="form-group">
              <label htmlFor="featuredBackground">Featured Background Image URL</label>
              <input
                id="featuredBackground"
                type="text"
                className="form-input"
                value={siteSettings.featuredBackground}
                onChange={(e) => handleSettingChange('featuredBackground', e.target.value)}
                placeholder="https://example.com/featured-bg.jpg"
              />
            </div>
          </div>

          <div className="admin-form-footer">
            <button className="btn btn-primary" onClick={saveSettings}>
              Save Content Settings
            </button>
          </div>
        </div>
      )}

      <div className="admin-table-container">
        <h2 className="admin-form-title">Recent Uploads</h2>
        {stats.recentUploads.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Upload Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentUploads.map((item: RecentUpload) => (
                <tr key={`${item.type}-${item.id}`}>
                  <td>{item.title}</td>
                  <td>{item.type}</td>
                  <td>{new Date(item.created_at).toLocaleDateString()}</td>
                  <td className="admin-table-actions">
                    <button className="admin-table-action">Edit</button>
                    <button className="admin-table-action btn-danger">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500 py-8">No recent uploads found.</p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;