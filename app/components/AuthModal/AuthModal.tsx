"use client";

import { useState } from 'react';
import { X, Mail, Lock, User, ArrowRight, Calendar, Loader2, CheckCircle, AlertCircle, MailCheck, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import './AuthModal.css';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { signIn, signUp } = useAuth();

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setDateOfBirth('');
    setError(null);
    setSuccess(null);
    setShowEmailConfirmation(false);
    setSubmittedEmail('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isSignUp) {
        // Sign up flow
        if (!fullName.trim()) {
          setError('Please enter your full name');
          setIsLoading(false);
          return;
        }
        if (!dateOfBirth) {
          setError('Please enter your date of birth');
          setIsLoading(false);
          return;
        }

        const { error } = await signUp(email, password, fullName, dateOfBirth);
        
        if (error) {
          setError(error.message);
        } else {
          // Show email confirmation screen
          setSubmittedEmail(email);
          setShowEmailConfirmation(true);
        }
      } else {
        // Sign in flow
        const { error } = await signIn(email, password);
        
        if (error) {
          // Check for email not confirmed error
          if (error.message.includes('Email not confirmed')) {
            setError('Please confirm your email before signing in. Check your inbox for the verification link.');
          } else {
            setError(error.message);
          }
        } else {
          setSuccess('Signed in successfully!');
          setTimeout(() => {
            onClose();
            resetForm();
          }, 1000);
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeSwitch = () => {
    setIsSignUp(!isSignUp);
    setError(null);
    setSuccess(null);
    setShowEmailConfirmation(false);
  };

  const handleClose = () => {
    resetForm();
    setIsSignUp(false);
    onClose();
  };

  const handleBackToForm = () => {
    setShowEmailConfirmation(false);
    setEmail('');
    setPassword('');
    setFullName('');
    setDateOfBirth('');
  };

  if (!isOpen) return null;

  // Email Confirmation View
  if (showEmailConfirmation) {
    return (
      <div className="auth-overlay" onClick={handleClose}>
        <div className="auth-modal email-confirm-modal" onClick={(e) => e.stopPropagation()}>
          <button className="close-btn" onClick={handleClose}>
            <X size={24} color="#888" />
          </button>

          <div className="email-confirm-content">
            <div className="email-icon-container">
              <div className="email-icon-ring">
                <MailCheck size={40} />
              </div>
              <div className="email-icon-pulse"></div>
            </div>

            <h2>Check Your Email</h2>
            <p className="email-confirm-text">
              We've sent a confirmation link to:
            </p>
            <p className="email-address">{submittedEmail}</p>

            <div className="email-instructions">
              <div className="instruction-step">
                <span className="step-number">1</span>
                <span>Open your email inbox</span>
              </div>
              <div className="instruction-step">
                <span className="step-number">2</span>
                <span>Click the confirmation link in the email</span>
              </div>
              <div className="instruction-step">
                <span className="step-number">3</span>
                <span>Return here to sign in</span>
              </div>
            </div>

            <div className="email-tips">
              <p className="tips-title">Didn't receive the email?</p>
              <ul>
                <li>Check your spam or junk folder</li>
                <li>Make sure the email address is correct</li>
                <li>Wait a few minutes and check again</li>
              </ul>
            </div>

            <button className="back-to-signin-btn" onClick={handleBackToForm}>
              <ArrowLeft size={18} />
              Back to Sign Up
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Regular Auth Form View
  return (
    <div className="auth-overlay" onClick={handleClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={handleClose}>
          <X size={24} color="#888" />
        </button>

        <div className="auth-header">
          <h2>{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
          <p>{isSignUp ? 'Start your journey with us.' : 'Please sign in to continue.'}</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="auth-message error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="auth-message success">
            <CheckCircle size={18} />
            <span>{success}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          {isSignUp && (
            <>
              <div className="input-group">
                <User size={20} className="input-icon" />
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="input-group">
                <Calendar size={20} className="input-icon" />
                <input 
                  type="date" 
                  placeholder="Date of Birth" 
                  className="date-input" 
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  disabled={isLoading}
                  required 
                />
              </div>
            </>
          )}
          
          <div className="input-group">
            <Mail size={20} className="input-icon" />
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="input-group password-group">
            <Lock size={20} className="input-icon" />
            <input 
              type={showPassword ? "text" : "password"}
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              minLength={6}
              required
            />
            <button 
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff size={18} className="eye-icon" />
              ) : (
                <Eye size={18} className="eye-icon" />
              )}
            </button>
          </div>

          {isSignUp && (
            <p className="email-notice">
              <MailCheck size={14} />
              You'll need to confirm your email before signing in
            </p>
          )}

          <button className="submit-btn" type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 size={20} className="spinner" />
                {isSignUp ? 'Creating Account...' : 'Signing In...'}
              </>
            ) : (
              <>
                {isSignUp ? 'Sign Up' : 'Sign In'} <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <span>{isSignUp ? 'Already have an account?' : 'Don\'t have an account?'}</span>
          <button className="link-btn" onClick={handleModeSwitch} disabled={isLoading}>
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
}
