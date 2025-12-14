"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types for Media
export type MediaType = 'video' | 'audio';

export interface MediaItem {
    id: string; // unique
    title: string;
    src: string;
    type: MediaType;
    posterUrl?: string; // For audio or video thumb
    artist?: string; // For audio
    duration?: number; // Optional initial duration
}

interface PlayerContextType {
    activeMedia: MediaItem | null;
    isMinimized: boolean;
    isPlaying: boolean;
    playMedia: (media: MediaItem) => void;
    closePlayer: () => void;
    toggleMinimize: () => void;
    togglePlay: () => void;
    seekTo: (time: number) => void; // handled by ref in global player really, but actions here
    // We update status from the player
    setPlayingStatus: (playing: boolean) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
    const [activeMedia, setActiveMedia] = useState<MediaItem | null>(null);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    const playMedia = (media: MediaItem) => {
        // If same media, just maximize if minimized
        if (activeMedia?.id === media.id) {
            setIsMinimized(false);
            setIsPlaying(true);
            return;
        }
        
        setActiveMedia(media);
        setIsMinimized(false);
        setIsPlaying(true);
    };

    const closePlayer = () => {
        setActiveMedia(null);
        setIsMinimized(false);
        setIsPlaying(false);
    };

    const toggleMinimize = () => {
        setIsMinimized(prev => !prev);
    };

    const togglePlay = () => {
        setIsPlaying(prev => !prev);
    };

    const setPlayingStatus = (status: boolean) => {
        setIsPlaying(status);
    };
    
    // Seek logic usually requires ref access to the media element, 
    // so it's often better handled inside the component or via a more complex store.
    // For specific control from outside (like "Play Episode 2"), playMedia is enough.
    const seekTo = (time: number) => {
        // Placeholder
    };

    return (
        <PlayerContext.Provider value={{
            activeMedia, 
            isMinimized, 
            isPlaying, 
            playMedia, 
            closePlayer, 
            toggleMinimize, 
            togglePlay,
            seekTo,
            setPlayingStatus
        }}>
            {children}
        </PlayerContext.Provider>
    );
}

export function usePlayer() {
    const context = useContext(PlayerContext);
    if (context === undefined) {
        throw new Error('usePlayer must be used within a PlayerProvider');
    }
    return context;
}
