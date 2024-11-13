import React from 'react';
import style from './PrivilegeSelector.module.css';

// Assuming initialPrivileges is imported
const initialPrivileges = {
  view: ['Tracker', 'Tracker List', 'Customer', 'Customer List', 'Employee', 'Employee List', 'Supplier', 'Supplier List', 'Partner', 'Partner List', 'Contractor', 'Contractor List', 'Excel Import',],
  add: ['Tracker', 'Customer', 'EmployeeList', 'SupplierList', 'ContractorList', 'Partner', 'Contractor'], 
  edit: ['Tracker', 'Customer', 'EmployeeList', 'SupplierList', 'ContractorList'],
  delete: ['EmployeeList'],
  import: ['ExcelImport'],
  export: ['Import', 'Customer list', 'Employee list', 'Supplier list', 'Partner list', 'Contractor list',],
};

interface PrivilegesSelectorProps {
  selectedPrivileges: Record<string, string[]>;
  onPrivilegesChange: (privileges: Record<string, string[]>) => void;
}

const PrivilegesSelector: React.FC<PrivilegesSelectorProps> = ({ selectedPrivileges, onPrivilegesChange }) => {
  const handleCheckboxChange = (privilege: string, page: string) => {
    const newPrivileges = { ...selectedPrivileges };

    // Toggle the page for the selected privilege
    if (newPrivileges[privilege]?.includes(page)) {
      newPrivileges[privilege] = newPrivileges[privilege].filter(p => p !== page);
    } else {
      if (!newPrivileges[privilege]) {
        newPrivileges[privilege] = [];
      }
      newPrivileges[privilege].push(page);
    }

    onPrivilegesChange(newPrivileges);
  };

  // Handle the "Check All" checkbox for each privilege type
  const handleCheckAllChange = (privilege: string) => {
    const newPrivileges = { ...selectedPrivileges };
    const allPages = initialPrivileges[privilege];

    // Check if all pages are selected for this privilege type
    if (allPages.every(page => newPrivileges[privilege]?.includes(page))) {
      // If all are selected, uncheck them all
      newPrivileges[privilege] = [];
    } else {
      // If not all are selected, check all
      newPrivileges[privilege] = [...allPages];
    }

    onPrivilegesChange(newPrivileges);
  };

  return (
    <div className={style.field}>
      <h1>Permissions</h1>
      <div className={style.privil}>
        {Object.keys(initialPrivileges).map((privilege) => (
          <div key={privilege}>
            <h3>{privilege.charAt(0).toUpperCase() + privilege.slice(1)}             {/* Check All checkbox */}
            <label>
              <input
                type="checkbox"
                checked={initialPrivileges[privilege].every(page => selectedPrivileges[privilege]?.includes(page))}
                onChange={() => handleCheckAllChange(privilege)}
              />
            </label></h3>
            


            {initialPrivileges[privilege].map((page) => (
              <div key={page}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedPrivileges[privilege]?.includes(page) || false}
                    onChange={() => handleCheckboxChange(privilege, page)}
                  />
                  {page}
                </label>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrivilegesSelector;
