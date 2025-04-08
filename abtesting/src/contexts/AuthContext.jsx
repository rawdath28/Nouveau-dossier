import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    const session = supabase.auth.getSession();
    setCurrentUser(session?.user ?? null);
    setLoading(false);

    // Listen for changes on auth state (signed in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sign up function
  const signup = async (email, password) => {
    return await supabase.auth.signUp({
      email,
      password,
    });
  };

  // Sign in function
  const signin = async (email, password) => {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  };

  // Sign out function
  const signout = async () => {
    return await supabase.auth.signOut();
  };

  // Reset password function
  const resetPassword = async (email) => {
    return await supabase.auth.resetPasswordForEmail(email);
  };

  // Update password function
  const updatePassword = async (password) => {
    return await supabase.auth.updateUser({
      password: password
    });
  };

  const value = {
    currentUser,
    signup,
    signin,
    signout,
    resetPassword,
    updatePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 