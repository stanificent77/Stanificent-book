import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSession } from './useSession';

const useTokenValidation = (
  token: string,
  setErrors: React.Dispatch<React.SetStateAction<string[]>>
) => {
  const navigate = useHistory();
  const { logout } = useSession();

  useEffect(() => {
    
    const validateToken = async () => {
      if(navigator.onLine){
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
            setErrors(prevErrors => [...prevErrors, ...data.errors]);
          } else if (data.error) {
            setErrors(prevErrors => [...prevErrors, data.error]);
          } else if (!data.valid) {
            // If the token is invalid, redirect to login
            console.log("Invalid token");
            const success = await logout();
            if (success) {
              navigate('/login'); // Redirect only if logout succeeds
            }
            setErrors(prevErrors => [...prevErrors, "Token is invalid. Redirecting to login."]);
          } else {
            console.log("Token is valid");
          }
        } catch (error) {
          console.error("Error validating token:", error);
          setErrors(prevErrors => [...prevErrors, "Error validating token"]);
        }
      }else{
        console.log("Token can't be validated while oflline");
      }
    };

    // Validate the token immediately on mount and at intervals

    const intervalId = setInterval(validateToken, 10000); // Validate every 10 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [token, setErrors, logout, navigate]); // Ensure dependencies are set correctly
};

export default useTokenValidation;
