"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { Suspense } from 'react';
import './error.css';

function ErrorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const message = searchParams.get('message') || 'An error occurred during authentication';

  return (
    <div className="error-container">
      <div className="error-card">
        <div className="error-icon">
          <AlertCircle size={48} />
        </div>
        
        <h1>Verification Failed</h1>
        <p className="error-message">{message}</p>
        
        <div className="error-suggestions">
          <p className="suggestions-title">What you can try:</p>
          <ul>
            <li>Check if the link has expired (links expire after 24 hours)</li>
            <li>Request a new confirmation email</li>
            <li>Make sure you clicked the most recent email link</li>
            <li>Check your spam folder for the confirmation email</li>
          </ul>
        </div>

        <div className="error-actions">
          <button 
            className="back-btn"
            onClick={() => router.push('/')}
          >
            <ArrowLeft size={18} />
            Back to Home
          </button>
          
          <button 
            className="retry-btn"
            onClick={() => router.push('/?signup=true')}
          >
            <RefreshCw size={18} />
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="error-container">
        <div className="error-card">
          <p>Loading...</p>
        </div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
}
