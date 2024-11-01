import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

interface UserInfo {
  userName: string;
  userRole: string;
  employeeTag: string;
  hireDate: string;
  phoneNumber: string;
  position: string;
}

const useUserInfo = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    userName: '',
    userRole: '',
    employeeTag: '',
    hireDate: '',
    phoneNumber: '',
    position: ''
  });

  const history = useHistory();

  // Function to fetch user info from local or session storage
  const fetchUserInfo = () => {
    try {
      const storedUserInfo = localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo');
      
      console.log("Stored User Info:", storedUserInfo); // Debugging line

      if (storedUserInfo) {
        // Ensure storedUserInfo is a string
        const userInfoData = JSON.parse(storedUserInfo);

        if (userInfoData && userInfoData.username) {
          // Update state with user info
          setUserInfo({
            userName: userInfoData.username,
            userRole: userInfoData.role,
            employeeTag: userInfoData.employee_tag,
            hireDate: userInfoData.hire_date,
            phoneNumber: userInfoData.phoneNumber,
            position: userInfoData.position
          });
        } else {
          console.error('Invalid user info data:', userInfoData);
          redirectToLogin();
        }
      } else {
        redirectToLogin(); // No user info found, redirect to login
      }
    } catch (error) {
      console.error('Error parsing user info:', error);
      redirectToLogin();
    }
  };

  // Function to redirect to the login page
  const redirectToLogin = () => {
    if (history) {
      history.push('/login'); // Ensure navigate is available before pushing
    }
  };

  // Handle offline user info retrieval
  const handleOfflineUserInfo = () => {
    // Check if the app is offline and if localStorage has user credentials
    if (!navigator.onLine) {
      const storedCredentials = localStorage.getItem('user_credentials');
      if (storedCredentials) {
        const users = JSON.parse(storedCredentials);
        const lastUser = users.find((user: { login_id: string }) => user.login_id === userInfo.userName);

        if (lastUser) {
          // Retrieve last user info using their login ID
          const lastUserInfo = localStorage.getItem(`user_info_${lastUser.login_id}`);
          if (lastUserInfo) {
            const userInfoData = JSON.parse(lastUserInfo);
            setUserInfo({
              userName: userInfoData.username,
              userRole: userInfoData.role,
              employeeTag: userInfoData.employee_tag,
              hireDate: userInfoData.hire_date,
              phoneNumber: userInfoData.phoneNumber,
              position: userInfoData.position
            });
          }
        }
      }
    }
  };

  useEffect(() => {
    fetchUserInfo(); // Fetch user info when the component mounts
    handleOfflineUserInfo(); // Handle offline user info

    // Optional: Set an interval to refresh user info periodically
    const intervalId = setInterval(() => {
      fetchUserInfo();
    }, 10000); // Refresh every 10 seconds

    return () => {
      clearInterval(intervalId); // Clean up the interval on unmount
    };
  }, [history]); // Only run once on mount

  return userInfo;
};

export default useUserInfo;
