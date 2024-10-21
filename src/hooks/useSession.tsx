import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

interface UseSessionReturn {
  isAuthenticated: boolean;
  loading: boolean;
  checkSession: () => void;
  logout: () => void;
}

export const useSession = (): UseSessionReturn => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const history = useHistory(); // Initialize history for navigation

  // Function to check if the session token is valid
  const checkSession = async () => {
    setLoading(true);

    // Retrieve session token from localStorage or sessionStorage
    const sessionToken = localStorage.getItem('session_token') || sessionStorage.getItem('session_token');

    if (!sessionToken) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost/pos-endpoint/verify_session.php', {
        method: 'GET',
        headers: {
          'Authorization': sessionToken, // Pass the token in the Authorization header
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for session management
      });

      const data = await response.json();

      if (data.success) {
        // If the session is valid, mark the user as authenticated
        setIsAuthenticated(true);
      } else {
        // If session is invalid, log out the user
        setIsAuthenticated(false);
        logout();
      }
    } catch (error) {
      console.error('Error verifying session:', error);
      setIsAuthenticated(false);
    }

    setLoading(false);
  };

  const logout = () => {
    // Remove all stored session and user information
    localStorage.removeItem('session_token');
    sessionStorage.removeItem('session_token');
    localStorage.removeItem('userInfo');
    sessionStorage.removeItem('userInfo');
    
    // Redirect the user to the login page
    history.push('/login');
  };

  useEffect(() => {
    // Call checkSession on component mount
    checkSession();
  }, []); // Empty dependency array ensures this runs once

  return { isAuthenticated, loading, checkSession, logout };
};
