import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

interface UserInfo {
  userName: string;
  userRole: string;
  employeeTag: string;
  hireDate: string;
  phoneNumber: string;
}

const useUserInfo = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    userName: '',
    userRole: '',
    employeeTag: '',
    hireDate: '',
    phoneNumber: ''
  });

  const history = useHistory();

  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo');
    if (storedUserInfo) {
      const userInfoData = JSON.parse(storedUserInfo);
      setUserInfo({
        userName: userInfoData.username,
        userRole: userInfoData.role,
        employeeTag: userInfoData.employee_tag,
        hireDate: userInfoData.hire_date,
        phoneNumber: userInfoData.phoneNumber
      });
    } else {
      history.push('/login'); // Redirect to login if no user info is found
    }
  }, [history]);

  return userInfo;
};

export default useUserInfo;
