export const hasPrivilege = (userRole: string, privilege: string, section: string): boolean => {
    // Get the privileges stored in sessionStorage
    const privileges = JSON.parse(sessionStorage.getItem("privileges") || '{}');
  
    // Check if the 'view' privilege array contains the required section
    if (privileges[privilege]) {
      return privileges[privilege].includes(section);
    }
  
    return false;  // If the privilege array doesn't exist or doesn't include the section
  };
  