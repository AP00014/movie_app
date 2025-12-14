"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Sparkles, ArrowRight } from 'lucide-react';
import './confirmed.css';

export default function EmailConfirmedPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="confirmed-container">
      <div className="confirmed-card">
        <div className="confirmed-icon">
          <div className="icon-ring">
            <CheckCircle size={48} />
          </div>
          <Sparkles className="sparkle sparkle-1" size={20} />
          <Sparkles className="sparkle sparkle-2" size={16} />
          <Sparkles className="sparkle sparkle-3" size={14} />
        </div>
        
        <h1>Email Confirmed!</h1>
        <p className="confirmed-message">
          Your email has been verified successfully. Welcome to Snergize Movies!
        </p>
        
        <div className="confirmed-features">
          <div className="feature-item">
            <span className="feature-check">✓</span>
            <span>Access to all movies & series</span>
          </div>
          <div className="feature-item">
            <span className="feature-check">✓</span>
            <span>Create your personal watchlist</span>
          </div>
          <div className="feature-item">
            <span className="feature-check">✓</span>
            <span>Track your watch history</span>
          </div>
        </div>

        <button 
          className="continue-btn"
          onClick={() => router.push('/')}
        >
          Start Watching <ArrowRight size={20} />
        </button>

        <p className="redirect-notice">
          Redirecting to home in <span className="countdown">{countdown}</span> seconds...
        </p>
      </div>
    </div>
  );
}
