"use client";

import { useAuth } from '@/app/context/AuthContext';
import AuthModal from './AuthModal';

export default function AuthModalWrapper() {
  const { isAuthModalOpen, setAuthModalOpen } = useAuth();

  return (
    <AuthModal 
      isOpen={isAuthModalOpen} 
      onClose={() => setAuthModalOpen(false)} 
    />
  );
}
