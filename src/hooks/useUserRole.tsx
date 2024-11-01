// src/hooks/useUserRole.ts

import { useState, useEffect } from 'react';

const useUserRole = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const userRole = sessionStorage.getItem('userRole'); // Assuming you store user role in sessionStorage
    if (userRole === 'admin') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, []);

  return isAdmin;
};

export default useUserRole;
