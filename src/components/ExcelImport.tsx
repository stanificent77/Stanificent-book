import { IonToast } from '@ionic/react';
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import style from './ExcelImport.module.css';

const ImportExcel = () => {
  const [fileData, setFileData] = useState<any>(null);
  const [fileName, setFileName] = useState<string>('');
  const [tableName, setTableName] = useState<string>(''); // Added state for table name
  const [toast, setToast] = useState<boolean>(false);
  const [toastText, setToastText] = useState<string>('');
  const [toastColor, setToastColor] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = new Uint8Array((e.target as FileReader).result as ArrayBuffer); // Added type assertion here
        const workbook = XLSX.read(data, { type: 'array' });

        // Assuming the Excel file has only one sheet
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Convert sheet to JSON and set state
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: true });
        setFileData(jsonData);

        // Send table structure and data to backend
        createTableAndInsertData(jsonData);
      };

      reader.readAsArrayBuffer(file);
    }
  };

  const handleButtonClick = () => {
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    fileInput?.click();
  };

  const createTableAndInsertData = async (data: any) => {
    if (data.length === 0) return;

    // Ensure that a table name is provided
    if (!tableName) {
        setToastColor("warning");
        setToast(true);
        setToastText("Please input a table name!.")
      return;
    }

    // Extract column names and types from data (Assume first row is the column names)
    const columns = data[0];
    const columnDefinitions = columns.map((col: string) => {
      return `${col} VARCHAR(255)`; // Assume all columns are VARCHAR for simplicity
    });

    // Create the SQL to create the table dynamically
    const sanitizedTableName = tableName.replace(/\W/g, ''); // Remove any non-alphanumeric characters for safety
    const createTableQuery = `CREATE TABLE ${sanitizedTableName} (${columnDefinitions.join(', ')})`;

    try {
      const response = await fetch('http://localhost/pos-endpoint/excelimport.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          createTableQuery,
          tableName: sanitizedTableName,
          data,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setToastColor("success")
        setToast(true);
        setToastText("Table created successfully.")
      } else {
        console.error('Error creating table:', result.error);
      }
    } catch (error) {
      console.error('Error sending table creation request:', error);
    }
  };

  const excel = '/excelimg.png';

  return (
    <div className={style.page}>
      <div style={{width: "20%"}}>
        <img src={excel} alt='excel'/>
      </div>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileChange}
        id="file-upload"
        style={{ display: 'none' }}
      />
      <input
        type="text"
        placeholder="Enter table name"
        value={tableName}
        onChange={(e) => setTableName(e.target.value)} // Capture user input for table name}
        className={style.tableName}
      />
      <div>
      <button onClick={handleButtonClick} className={style.button}>
        Import Excel
      </button>
      </div>
      <IonToast
        isOpen={toast}
        message={toastText}
        onDidDismiss={() => setToast(false)}
        duration={5000}
        color={toastColor}
        />
    </div>
  );
};

export default ImportExcel;
