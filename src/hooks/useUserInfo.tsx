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

  const fetchUserInfo = () => {
    try {
      const storedUserInfo = localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo');
      
      if (storedUserInfo) {
        const userInfoData = JSON.parse(storedUserInfo);

        if (userInfoData && userInfoData.username) {
          setUserInfo({
            userName: userInfoData.username,
            userRole: userInfoData.role,
            employeeTag: userInfoData.employee_tag,
            hireDate: userInfoData.hire_date,
            phoneNumber: userInfoData.phoneNumber,
            position: userInfoData.position
          });
        } else {
          console.error('Invalid user info data');
          if (history) {
            history.push('/login'); // Ensure history is available before pushing
          }
        }
      } else {
        if (history) {
          history.push('/login'); // Ensure history is available before pushing
        }
      }
    } catch (error) {
      console.error('Error parsing user info:', error);
      if (history) {
        history.push('/login'); // Ensure history is available before pushing
      }
    }
  };

  useEffect(() => {
    fetchUserInfo(); // Fetch user info when the component mounts

    // Optional: Set an interval to refresh user info periodically
    const intervalId = setInterval(() => {
      fetchUserInfo();
    }, 6000); // Refresh every 60 seconds

    return () => {
      clearInterval(intervalId); // Clean up the interval on unmount
    };
  }, [history]); // Only run once on mount

  return userInfo;
};

export default useUserInfo;
