// hooks/useSession.ts
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import useUserInfo from '../hooks/useUserInfo';

interface UseSessionReturn {
  isAuthenticated: boolean;
  loading: boolean;
  checkSession: () => void;
  logout: () => void;
}

export const useSession = (): UseSessionReturn => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { employeeTag } = useUserInfo();
  const history = useHistory();

  const checkSession = async () => {
    setLoading(true);
    const sessionToken = sessionStorage.getItem('session_token');

    if (!sessionToken) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://stanificentglobal.com/api/verify_session.php', {
        method: 'GET',
        headers: {
          'Authorization': sessionToken,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        await logout(); // Wait for logout to complete
      }
    } catch (error) {
      console.error('Error verifying session:', error);
      setIsAuthenticated(false);
    }

    setLoading(false);
  };

  const logout = async () => {
    try {
      const response = await fetch('https://stanificentglobal.com/api/logout.php', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ employeeTag })
      });

      const result = await response.json();
      if (result.success) {
        console.log(result.message);
        sessionStorage.removeItem('session_token');
        sessionStorage.removeItem('userInfo');
        setIsAuthenticated(false);
        history.push('/login'); // Redirect to login page after logout
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  return { isAuthenticated, loading, checkSession, logout };
};
