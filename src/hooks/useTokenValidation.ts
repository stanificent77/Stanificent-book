import { useEffect } from 'react';

const useTokenValidation = (
  token: string,
  setErrors: React.Dispatch<React.SetStateAction<string[]>>
) => {
  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await fetch('http://localhost/pos-endpoint/tokenValidation.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include your token if needed
          },
          body: JSON.stringify({ token }), // Send the token if required
        });

        // Check if response is ok
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Check for errors in the response structure
        if (data.errors && Array.isArray(data.errors)) {
          // Ensure errors is an array before using it
          setErrors(prevErrors => [...prevErrors, ...data.errors]);
        } else if (data.error) {
          // Handle the case where there's a single error
          setErrors(prevErrors => [...prevErrors, data.error]);
        } else {
          // Handle unexpected response structure
          console.error("Unexpected response structure:", data);
          setErrors(prevErrors => [...prevErrors, "Unexpected response structure"]);
        }
      } catch (error) {
        // Log and update errors on failure
        console.error("Error validating token:", error);
        setErrors(prevErrors => [...prevErrors, "Error validating token"]);
      }
    };

    // Validate the token immediately on mount and then at intervals
    validateToken(); // Validate token on mount
    const intervalId = setInterval(validateToken, 60000); // Validate token every minute

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [token, setErrors]);
};

export default useTokenValidation;
