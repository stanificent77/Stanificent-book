import React, { useEffect, useState } from 'react';
import { IonPage, IonContent, IonButton, IonList, IonItem, IonLabel } from '@ionic/react';
import Header from '../components/Header';
import useUserInfo from "../hooks/useUserInfo";

const Dash: React.FC = () => {
    const { userName, userRole, phoneNumber, employeeTag, hireDate } = useUserInfo();
    const [tables, setTables] = useState<string[]>([]);  // State to store table names
    const [tableData, setTableData] = useState<any[]>([]);  // State to store fetched data from a table
    const [selectedTable, setSelectedTable] = useState<string | null>(null); // State to track selected table
    const dbname = "pos";

    useEffect(() => {
        // Fetch the table names from the backend
        const fetchTables = async () => {
            try {
                const response = await fetch('http://localhost/pos-endpoint/getDatabaseTable.php'); // Backend URL
                const data = await response.json();
                if (data.success) {
                    const tableNames = data.tables.map((table: { [key: string]: string }) => table[`Tables_in_${dbname}`]);
                    setTables(tableNames);
                } else {
                    console.error('Error fetching tables:', data.error);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchTables();
    }, []);

    // Function to fetch data for a specific table
    const fetchTableData = async (tableName: string) => {
        try {
            const response = await fetch(`http://localhost/pos-endpoint/getDatabaseTable.php?tableName=${tableName}`);
            const data = await response.json();
            if (data.success) {
                setTableData(data.data);
                setSelectedTable(tableName);  // Set the selected table name
            } else {
                console.error('Error fetching table data:', data.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <IonPage>
            <IonContent>
                <Header />
                <h1>Welcome, {userName}</h1>
                <p>Your role: {userRole}</p>
                <p>Phone Number: {phoneNumber}</p>
                <p>Employee Tag: {employeeTag}</p>
                <p>Hire Date: {hireDate}</p>

                <div>
                    <h3>Imported Databases:</h3>
                    {tables.length > 0 ? (
                        tables.map((table, index) => (
                            <IonButton key={index} onClick={() => fetchTableData(table)}>
                                {table}
                            </IonButton>
                        ))
                    ) : (
                        <p>No imported data available.</p>
                    )}
                </div>

                {/* Displaying the table data when a button is clicked */}
                {selectedTable && (
                    <div>
                        <h2>Data from {selectedTable}:</h2>
                        <IonList>
                            {tableData.length > 0 ? (
                                tableData.map((row, index) => (
                                    <IonItem key={index}>
                                        {Object.keys(row).map((key, idx) => (
                                            <IonLabel key={idx}>
                                                <strong>{key}: </strong>{row[key]}
                                            </IonLabel>
                                        ))}
                                    </IonItem>
                                ))
                            ) : (
                                <p>No data available for this table.</p>
                            )}
                        </IonList>
                    </div>
                )}
            </IonContent>
        </IonPage>
    );
};

export default Dash;
