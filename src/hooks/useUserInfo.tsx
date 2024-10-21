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
    const storedUserInfo = localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo');
    if (storedUserInfo) {
      const userInfoData = JSON.parse(storedUserInfo);
      setUserInfo({
        userName: userInfoData.username,
        userRole: userInfoData.role,
        employeeTag: userInfoData.employee_tag,
        hireDate: userInfoData.hire_date,
        phoneNumber: userInfoData.phoneNumber,
        position: userInfoData.position
      });
    } else {
      history.push('/login'); // Redirect to login if no user info is found
    }
  };

  useEffect(() => {
    fetchUserInfo(); // Fetch user info when component mounts

    // Optional: Set an interval to refresh user info periodically
    const intervalId = setInterval(() => {
      fetchUserInfo();
    }, 15000); // Refresh every 60 seconds (adjust as needed)

    return () => {
      clearInterval(intervalId); // Clean up the interval on unmount
    };
  }, [history]);

  return userInfo;
};

export default useUserInfo;
