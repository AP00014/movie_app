import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import '../styles/auth.css';

const ProfilePage = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(true);

  // Fetch profile data from database
  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.id) {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();

        if (!error && data) {
          setName(data.full_name || '');
        }
      }
      setLoading(false);
    };

    fetchProfile();
  }, [user?.id]);
  
  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return 'U';
    const nameParts = user.name.split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: name,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user!.id);

      if (error) {
        console.error('Error updating profile:', error);
        alert('Failed to update profile');
      } else {
        alert('Profile updated successfully');
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Error:', err);
      alert('An error occurred while updating profile');
    }

    setLoading(false);
  };

  return (
    <div className="page-container">
      <div className="auth-container profile-container">
        <h1>My Profile</h1>
        
        <div className="profile-header">
          <div className="profile-avatar">{getUserInitials()}</div>
          <h2>{name || user?.name || 'User'}</h2>
          <p>{user?.email}</p>
        </div>
        
        {isEditing ? (
          <form onSubmit={handleSubmit} className="auth-form">

            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled
              />
            </div>
            
            <div className="form-actions">
              <button type="button" className="btn btn-outline" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-info">
            <div className="profile-section">
              <h3>Account Information</h3>
              <div className="profile-detail">
                <span className="profile-label">Full Name:</span>
                <span className="profile-value">{name || 'Not set'}</span>
              </div>
              <div className="profile-detail">
                <span className="profile-label">Email:</span>
                <span className="profile-value">{user?.email}</span>
              </div>
              <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;