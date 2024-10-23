import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSession } from './useSession';

const useTokenValidation = (
  token: string,
  setErrors: React.Dispatch<React.SetStateAction<string[]>>
) => {
  const history = useHistory();
  const { isAuthenticated, loading, checkSession, logout } = useSession();

  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await fetch('https://stanificentglobal.com/api/tokenValidation.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include your token if needed
          },
          body: JSON.stringify({ token }), // Send the token if required
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Handle errors in the response structure
        if (data.errors && Array.isArray(data.errors)) {
          // Ensure errors is an array before using it
          setErrors(prevErrors => [...prevErrors, ...data.errors]);
        } else if (data.error) {
          setErrors(prevErrors => [...prevErrors, data.error]);
        } else if (!data.valid) {
          // If the token is invalid, redirect to login
          console.log("invalid token");
          logout();
          history.push('/login'); // Change the path as needed
          setErrors(prevErrors => [...prevErrors, "Token is invalid. Redirecting to login."]);
        } else {
          console.log("Token is valid");
        }
      } catch (error) {
        console.error("Error validating token:", error);
        setErrors(prevErrors => [...prevErrors, "Error validating token"]);
      }
    };

    // Validate the token immediately on mount
    validateToken();

    // Validate the token at intervals
    const intervalId = setInterval(validateToken, 9000); // Every 60 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [token, setErrors]); // Include setErrors in dependencies
};

export default useTokenValidation;
