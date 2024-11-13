import React, { useEffect, useState } from 'react';
import {
  IonPage, IonContent, IonSearchbar, IonList, IonItem,
  IonLabel, IonSkeletonText, IonModal, IonButton, IonGrid, IonRow, IonCol, IonIcon, IonCard,
  IonFab, IonFabButton, IonPopover, IonToast
} from '@ionic/react';
import { closeCircle, add , documentAttachOutline} from 'ionicons/icons';
import BackButton from '../components/BackButton';
import useUserInfo from "../hooks/useUserInfo";
import * as XLSX from 'xlsx';
import { hasPrivilege } from '../utils/HasPrivilege';

const PartnerList: React.FC = () => {
  const { userName, employeeTag } = useUserInfo();

  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = sessionStorage.getItem("session_token");
  const [toast, setToast] = useState<boolean>(false);
  const [toastText, setToastText] = useState("");

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await fetch('http://localhost/pos-endpoint/getpartner.php', {
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


  const exportToExcel = () => {
    setToast(true);
    setToastText("Downloading your file in excel format.")

    const worksheet = XLSX.utils.json_to_sheet(suppliers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Partners');
    XLSX.writeFile(workbook, 'Partners_List.xlsx');
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
                <IonLabel>No Partner found</IonLabel>
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
      </IonContent>

      { canExportToExcel && (<IonFab vertical="bottom" horizontal="end" slot="fixed">
        <IonFabButton color="primary" onClick={exportToExcel}>
          <IonIcon icon={documentAttachOutline} />
        </IonFabButton>
      </IonFab>)}

      <IonToast
        isOpen={toast}
        message={toastText}
        onDidDismiss={() => setToast(false)}
        duration={5000}>
        </IonToast>
    </IonPage>
  );
};

export default PartnerList;
