import { useEffect, useState } from 'react';
import useUserInfo from '../hooks/useUserInfo';
import {useHistory}  from 'react-router-dom';

interface UseSessionReturn {
  isAuthenticated: boolean;
  loading: boolean;
  checkSession: () => void;
  logout: () => Promise<boolean>;
}

export const useSession = (): UseSessionReturn => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { employeeTag } = useUserInfo(); // Assuming this hook provides user information
  const navigate = useHistory();

  const checkSession = async () => {
    setLoading(true);
    const sessionToken = sessionStorage.getItem('session_token');

    if (!sessionToken) {
      console.warn('No session token found, checking offline login.');
      const loginId = sessionStorage.getItem("login_id");
      if (loginId) {
        const storedUserInfo = localStorage.getItem('user_info');
        if (storedUserInfo) {
          const userInfoData = JSON.parse(storedUserInfo);
          // Assuming you have a way to set user info in your state
          // For example: setUserInfo(userInfoData);
          setIsAuthenticated(true); // Offline login successful
          console.log("User logged in offline:", userInfoData);
        } else {
          console.warn('No stored user info found, logging out.');
          setIsAuthenticated(false);
          await logout(); // Logout and redirect to login
        }
      } else {
        console.warn('No login ID found, logging out.');
        setIsAuthenticated(false);
        await logout(); // Logout and redirect to login
      }
      setLoading(false);
      return;
    }

  if(navigator.onLine){
    try {
      const response = await fetch('https://stanificentglobal.com/api/verify_session.php', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${sessionToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        console.error('Failed to verify session, logging out.', response.statusText);
        setIsAuthenticated(false);
        await logout();
      } else {
        const data = await response.json();
        if (data.success) {
          setIsAuthenticated(true); // Session is valid
        } else {
          console.warn('Session verification failed:', data.message);
          setIsAuthenticated(false);
          await logout();
        }
      }
    } catch (error) {
      console.error('Error verifying session:', error);
      setIsAuthenticated(false);
      await logout();
    } finally {
      setLoading(false);
    }
  }
  };

  const logout = async (): Promise<boolean> => {
    const token = sessionStorage.getItem("session_token");

    if (!token) {
      console.warn('No employee tag found, skipping logout request.');
      sessionStorage.clear();
      setIsAuthenticated(false);
      navigate.push('/login'); // Redirect to login
      return false;
    }

    
    try {
      const response = await fetch('https://stanificentglobal.com/api/logout.php', {
        method: 'POST',
        credentials: 'include',
        headers: {
          "Authorization": `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ employeeTag })
      });

      if (!response.ok) {
        console.error('Logout request failed:', response.statusText);
        return false;
      }

      const result = await response.json();
      if (result.success) {
        console.log('Logout successful:', result.message);
        sessionStorage.clear();
        setIsAuthenticated(false);
        navigate('/login'); // Redirect to login
        return true;
      } else {
        console.warn('Logout unsuccessful:', result.message);
        sessionStorage.clear();
        setIsAuthenticated(false);
        navigate('/login'); // Redirect to login
        return false;
      }
    } catch (error) {
      console.error('Logout failed:', error);
      return false;
    }
  };

  useEffect(() => {
    checkSession(); // Check session validity on mount
  }, []); // Runs once on mount to check session

  return { isAuthenticated, loading, checkSession, logout };
};
