import React, { useEffect, useState } from 'react';
import {
  IonPage, IonContent, IonSearchbar, IonList, IonItem,
  IonLabel, IonSkeletonText, IonModal, IonButton, IonGrid, IonRow, IonCol, IonIcon, IonCard, IonFab, IonFabButton, IonFabList
} from '@ionic/react';
import { closeCircle, download, documentText, fileTrayFull } from 'ionicons/icons';
import BackButton from '../components/BackButton';
import useUserInfo from "../hooks/useUserInfo";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { hasPrivilege } from '../utils/HasPrivilege';

const SupplierList: React.FC = () => {
  const { userName, employeeTag } = useUserInfo();

  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = sessionStorage.getItem("session_token");

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await fetch('http://localhost/pos-endpoint/getSupplier.php', {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        if (Array.isArray(data)) setSuppliers(data);
        else console.error('Unexpected data format:', data);
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, [token]);

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.personalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.phoneNumber.includes(searchTerm)
  );

  const openModal = (supplier: any) => {
    setSelectedSupplier(supplier);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedSupplier(null);
    setIsModalOpen(false);
  };

  // Export suppliers to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredSuppliers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Suppliers');
    XLSX.writeFile(workbook, 'suppliers.xlsx');
  };

  // Export suppliers to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['Name', 'Company', 'Phone', 'Email', 'Address']],
      body: filteredSuppliers.map(supplier => [
        supplier.personalName,
        supplier.companyName,
        supplier.phoneNumber,
        supplier.email,
        supplier.address
      ]),
    });
    doc.save('suppliers.pdf');
  };

  const canExportToPDF = hasPrivilege('EXPORT', 'Contractor list', employeeTag);
  const canExportToExcel = hasPrivilege('EXPORT', 'Contractor list', employeeTag);

  return (
    <IonPage>
      <BackButton />
      <IonContent className="ion-padding">
        <IonSearchbar
          placeholder="Search by name, phone, or company name"
          value={searchTerm}
          onIonInput={(e: any) => setSearchTerm(e.target.value)}
        />

        {loading ? (
          <IonList>
            {[...Array(5)].map((_, index) => (
              <IonItem key={index}>
                <IonLabel>
                  <h2><IonSkeletonText animated style={{ width: '50%' }} /></h2>
                  <p><IonSkeletonText animated style={{ width: '70%' }} /></p>
                  <p><IonSkeletonText animated style={{ width: '30%' }} /></p>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        ) : (
          <IonList>
            {filteredSuppliers.length > 0 ? (
              filteredSuppliers.map((supplier, index) => (
                <IonItem key={index} button onClick={() => openModal(supplier)}>
                  <IonLabel>
                    <h2 style={{ fontWeight: 'bolder' }}>{supplier.personalName}</h2>
                    <p>Company: {supplier.companyName}</p>
                    <p>Phone: {supplier.phoneNumber}</p>
                  </IonLabel>
                </IonItem>
              ))
            ) : (
              <IonItem>
                <IonLabel>No suppliers found</IonLabel>
              </IonItem>
            )}
          </IonList>
        )}

        {/* Modal for showing supplier details */}
        <IonModal isOpen={isModalOpen} onDidDismiss={closeModal}>
          <IonCard>
            <IonButton fill="clear" onClick={closeModal} className="close-btn" style={{ float: 'right' }}>
              <IonIcon icon={closeCircle} />
            </IonButton>
            {selectedSupplier && (
              <IonGrid>
                <IonRow>
                  <IonCol>
                    <h2 style={{ fontWeight: 'bolder' }}>{selectedSupplier.personalName}</h2>
                    <p><strong>Company Name:</strong> {selectedSupplier.companyName}</p>
                    <p><strong>Email:</strong> {selectedSupplier.email}</p>
                    <p><strong>Phone:</strong> {selectedSupplier.phoneNumber}</p>
                    <p><strong>Other Number:</strong> {selectedSupplier.otherNumber}</p>
                    <p><strong>Address:</strong> {selectedSupplier.address}</p>
                    <p><strong>Product:</strong> {selectedSupplier.product}</p>
                  </IonCol>
                </IonRow>
              </IonGrid>
            )}
            <IonButton onClick={closeModal}>Close</IonButton>
          </IonCard>
        </IonModal>

        {/* FAB for export options */}
        { canExportToExcel && (<IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton color="primary">
            <IonIcon icon={download} />
          </IonFabButton>
          <IonFabList side="top">
            <IonFabButton onClick={exportToExcel}>
              <IonIcon icon={fileTrayFull} /> {/* Icon for Excel */}
            </IonFabButton>
            <IonFabButton onClick={exportToPDF}>
              <IonIcon icon={documentText} /> {/* Icon for PDF */}
            </IonFabButton>
          </IonFabList>
        </IonFab>)}
      </IonContent>
    </IonPage>
  );
};

export default SupplierList;
