// src/config/privileges.ts
export const initialPrivileges = {
    Dashboard: ['VIEW', 'ADD'],
    Tracker: ['VIEW', 'EDIT'],
    Customer: ['VIEW', 'ADD'],
    CustomerList: ['VIEW'],
    EmployeeList: ['VIEW', 'ADD', 'EDIT', 'DELETE'],
    SupplierList: ['VIEW', 'ADD', 'EDIT'],
    PartnerList: ['VIEW'],
    ContractorList: ['VIEW', 'ADD'],
    ExcelImport: ['IMPORT'],
    Import: ['EXPORT'],
    Partner: ['VIEW', 'ADD'],
    Contractor: ['VIEW', 'ADD'],
    AddEmployee: ['ADD'],
    AddSupplier: ['ADD'],
    // Add more pages as needed
  };
  