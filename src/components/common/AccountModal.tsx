
import { Link } from 'react-router-dom';
import { FaUser, FaHistory, FaBookmark, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaCog } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/components.css';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AccountModal = ({ isOpen, onClose }: AccountModalProps) => {
  const { user, logout } = useAuth();

  if (!isOpen) return null;

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // If user is not logged in, show login/signup options
  if (!user) {
    return (
      <div className="modal-overlay">
        <div className="account-modal">
          <div className="account-modal-header">
            <h3>Welcome to MovieFlix</h3>
            <p>Please sign in to access your account</p>
          </div>

          <div className="account-modal-content">
            <Link to="/login" className="account-modal-item" onClick={onClose}>
              <FaSignInAlt className="account-modal-icon" />
              <span>Login</span>
            </Link>

            <Link to="/register" className="account-modal-item" onClick={onClose}>
              <FaUserPlus className="account-modal-icon" />
              <span>Sign Up</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If user is logged in, show account options
  return (
    <div className="modal-overlay">
      <div className="account-modal">
        <div className="account-modal-header">
          <h3>{user?.name || 'User'}</h3>
          <p>{user?.email}</p>
        </div>

        <div className="account-modal-content">
          <Link to="/profile" className="account-modal-item" onClick={onClose}>
            <FaUser className="account-modal-icon" />
            <span>Profile</span>
          </Link>

          <Link to="/watchlist" className="account-modal-item" onClick={onClose}>
            <FaBookmark className="account-modal-icon" />
            <span>My Watchlist</span>
          </Link>

          <Link to="/history" className="account-modal-item" onClick={onClose}>
            <FaHistory className="account-modal-icon" />
            <span>Watch History</span>
          </Link>


          {(user?.role === 'admin') && (
            <Link to="/admin" className="account-modal-item" onClick={onClose}>
              <FaCog className="account-modal-icon" />
              <span>Admin Dashboard</span>
            </Link>
          )}

          <button className="account-modal-item logout" onClick={handleLogout}>
            <FaSignOutAlt className="account-modal-icon" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountModal;