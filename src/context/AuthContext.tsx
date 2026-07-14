import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Profile } from '../types';
import { authService } from '../services/auth';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  isGuest: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Failsafe timeout to unblock loading state if Supabase hangs (e.g. offline/poor connection)
    const failsafe = setTimeout(() => {
      setLoading(false);
      console.warn('Auth session retrieval timed out. Forcing loading to false.');
    }, 4000);

    // Check active sessions — wrapped in try/catch so loading is always resolved
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        clearTimeout(failsafe);
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id);
        } else {
          setLoading(false);
        }
      })
      .catch((error) => {
        clearTimeout(failsafe);
        console.error('Failed to get session:', error);
        setLoading(false); // Always unblock the splash screen
      });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      clearTimeout(failsafe);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      clearTimeout(failsafe);
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const profileData = await authService.getProfile(userId);
      setProfile(profileData as any);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
    } catch (error) {
      console.error('Error during Supabase signOut:', error);
    } finally {
      // Failsafe: always clear local session, user, and profile states to ensure the user logs out immediately
      setSession(null);
      setUser(null);
      setProfile(null);
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signOut,
    refreshProfile: () => user ? fetchProfile(user.id) : Promise.resolve(),
    isGuest: !user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
