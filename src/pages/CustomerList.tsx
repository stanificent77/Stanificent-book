import React, { useEffect, useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonList, IonItem, IonLabel, IonSkeletonText, IonToast, IonFab, IonFabButton, IonFabList, IonIcon, IonModal, IonButton } from '@ionic/react';
import { saveAs } from 'file-saver';
import { todaySharp, calendarClearSharp, cartSharp, download, fileTrayFull, documentText } from 'ionicons/icons';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import Header from '../components/Header';
import style from './style/CustomerList.module.css';
import useUserInfo from "../hooks/useUserInfo";
import BackButton from '../components/BackButton';
import { hasPrivilege } from '../utils/HasPrivilege'; // Import the hasPrivilege utility function

const CustomerList: React.FC = () => {
  const { userName, employeeTag, userRole } = useUserInfo(); // Assuming userRole is part of user info
  const token = sessionStorage.getItem('session_token') || '';

  const [customers, setCustomers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(false);
  const [toastText, setToastText] = useState(""); // State to manage the loading status
  const [modalOpen, setModalOpen] = useState(false); // State to manage modal visibility
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null); // State to hold the selected customer details

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch('http://localhost/pos-endpoint/getCustomers.php', {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // Check if the response is an array
        if (Array.isArray(data)) {
          setCustomers(data);
        } else {
          console.error('Unexpected data format:', data);
        }
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setLoading(false); // Once the data is fetched or an error occurs, stop loading
      }
    };

    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(customer =>
    customer.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone_number.includes(searchTerm) ||
    customer.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Customer List", 10, 10);
    filteredCustomers.forEach((customer, index) => {
      doc.text(`${customer.first_name} ${customer.last_name} - ${customer.email}`, 10, 20 + index * 10);
    });
    doc.save('customers.pdf');
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredCustomers);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Customers');
    XLSX.writeFile(wb, 'customers.xlsx');
  };

  const canExportToPDF = hasPrivilege('EXPORT', 'Customer list', employeeTag);
  const canExportToExcel = hasPrivilege('EXPORT', 'Customer list', employeeTag);

  const openCustomerModal = (customer: any) => {
    setSelectedCustomer(customer); // Set the selected customer
    setModalOpen(true); // Open the modal
  };

  return (
    <IonPage>
      <BackButton />
      <IonContent className="ion-padding">
        <div>
          CUSTOMER LIST
        </div>

        <IonSearchbar
          placeholder="Search by name, phone, company, or email"
          value={searchTerm}
          onIonInput={(e: any) => setSearchTerm(e.target.value)}
        />
        {loading ? (
          // Show skeletons while data is loading
          <IonList>
            {[...Array(5)].map((_, index) => (
              <IonItem key={index}>
                <IonLabel>
                  <h2>
                    <IonSkeletonText animated={true} className={style.skeleName} />
                  </h2>
                  <p>
                    <IonSkeletonText animated={true} className={style.skeleNum} />
                  </p>
                  <p>
                    <IonSkeletonText animated={true} className={style.skeleNum} />
                  </p>
                  <p>
                    <IonSkeletonText animated={true} className={style.skeleNum} />
                  </p>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        ) : (
          <IonList>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer, index) => (
                <IonItem key={index} button onClick={() => openCustomerModal(customer)}>
                  <IonLabel>
                    <h2 style={{ fontWeight: 'bolder' }}>
                      {customer.first_name} {customer.last_name}
                    </h2>
                    <p>Email: {customer.email}</p>
                    <p>Phone: {customer.phone_number}</p>
                    <p>Company: {customer.company_name}</p>
                  </IonLabel>
                </IonItem>
              ))
            ) : (
              <IonItem>
                <IonLabel>No customers found</IonLabel>
              </IonItem>
            )}
          </IonList>
        )}

        <div>
          <IonToast
            isOpen={toast}
            message={toastText}
            onDidDismiss={() => setToast(false)}
            duration={5000}
          />
        </div>

        {/* Floating Action Buttons */}
        { canExportToExcel && (<IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton color="primary">
            <IonIcon icon={download} />
          </IonFabButton>
          <IonFabList side="top">
            {/* Render export buttons only if user has 'admin' role */}
            {canExportToExcel && (
              <>
                <IonFabButton onClick={exportToExcel}>
                  <IonIcon icon={fileTrayFull} /> {/* Icon for Excel */}
                </IonFabButton>
                <IonFabButton onClick={exportToPDF}>
                  <IonIcon icon={documentText} /> {/* Icon for PDF */}
                </IonFabButton>
              </>
            )}
          </IonFabList>
        </IonFab>)}

        {/* Modal for displaying customer details */}
        <IonModal isOpen={modalOpen} onDidDismiss={() => setModalOpen(false)}>
          {selectedCustomer && (
            <div className="ion-padding">
              <h2>{selectedCustomer.first_name} {selectedCustomer.last_name}</h2>
              {selectedCustomer.email && <p><strong>Email:</strong> {selectedCustomer.email} : ""</p>}
              <p><strong>Phone:</strong> {selectedCustomer.phone_number}</p>
              <p><strong>Company:</strong> {selectedCustomer.company_name}</p>
              <p><strong>Address:</strong> {selectedCustomer.address}</p>
              <p><strong>Customer Category:</strong> {selectedCustomer.customer_category}</p>
              <p><strong>Other information:</strong> {selectedCustomer.other_information}</p>
              {/* Add more details as needed */}
              <IonButton onClick={() => setModalOpen(false)} color="primary">Close</IonButton>
            </div>
          )}
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default CustomerList;
