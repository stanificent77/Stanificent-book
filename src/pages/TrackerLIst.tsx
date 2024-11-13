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

const TrackerList: React.FC = () => {
  const { userName, employeeTag } = useUserInfo();

  const [trackers, setTrackers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedTracker, setSelectedTracker] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = sessionStorage.getItem("session_token");

  const canExportToPDF = hasPrivilege('EXPORT', 'Contractor list', employeeTag);
  const canExportToExcel = hasPrivilege('EXPORT', 'Contractor list', employeeTag);

  useEffect(() => {
    const fetchTrackers = async () => {
      try {
        const response = await fetch('http://localhost/pos-endpoint/getTracker.php', {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (!response.ok) {
          console.error('Failed to fetch trackers, status code:', response.status);
          return;
        }

        const data = await response.json();
 // Debugging the API response

        if (Array.isArray(data) && data.length > 0) {
          setTrackers(data);
        } else {
          console.error('No trackers found or invalid data format:', data);
          setTrackers([]);
        }
      } catch (error) {
        console.error('Error fetching trackers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrackers();
  }, [token]);

  // Filter trackers based on the search term
  const filteredTrackers = trackers.filter(tracker =>
    (tracker.FirstName && tracker.FirstName.toLowerCase().trim().includes(searchTerm.toLowerCase().trim())) ||
    (tracker.PhoneNumber && tracker.PhoneNumber.toLowerCase().trim().includes(searchTerm.toLowerCase().trim()))
  );

  const openModal = (tracker: any) => {
    setSelectedTracker(tracker);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedTracker(null);
    setIsModalOpen(false);
  };

  // Export trackers to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredTrackers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Trackers');
    XLSX.writeFile(workbook, 'trackers.xlsx');
  };

  // Export trackers to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['First name', 'Last name', 'Device number', 'Occupation', 'Email', 'Address', 'Chassis number', 'Engine number', 
              'Vehicle plate', 'Vehicle name', 'Vehicle color', 'Subscription', 'Installer name', 'Installation date', 'Installation location',
              'Installer number', 'IMEI', 'Amount', 'Referral name', 'Referral number', 'Category', 'Description', 'Other information', 'Date added' ]],
      body: filteredTrackers.map(tracker => [
        tracker.FirstName,
        tracker.LastName,
        tracker.DeviceNumber,
        tracker.Occupation,
        tracker.Email,
        tracker.Address,
        tracker.chassisNumber,
        tracker.EngineNumber,
        tracker.VehiclePlate,
        tracker.VehicleName,
        tracker.VehicleColor,
        tracker.Subscription,
        tracker.InstallerName,
        tracker.InstallationDate,
        tracker.InstallationLocation,
        tracker.InstallerNumber,
        tracker.IMEI,
        tracker.Amount,
        tracker.RefferalName,
        tracker.RefferalNumber,
        tracker.Category,
        tracker.Description,
        tracker.OtherInformation,
        tracker.DateEntered
      ]),
    });
    doc.save('trackers.pdf');
  };

  return (
    <IonPage>
      <BackButton />
      <IonContent className="ion-padding">
        <IonSearchbar
          placeholder="Search by tracker ID or name"
          value={searchTerm}
          onIonInput={(e: any) => setSearchTerm(e.target.value || '')} // Ensure searchTerm is always a string
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
            {filteredTrackers.length > 0 ? (
              filteredTrackers.map((tracker, index) => (
                <IonItem key={index} button onClick={() => openModal(tracker)}>
                  <IonLabel>
                    <h2 style={{ fontWeight: 'bolder' }}>{tracker.FirstName}</h2>
                  </IonLabel>
                </IonItem>
              ))
            ) : (
              <IonItem>
                <IonLabel>No trackers found</IonLabel>
              </IonItem>
            )}
          </IonList>
        )}

        {/* Modal for showing tracker details */}
        <IonModal isOpen={isModalOpen} onDidDismiss={closeModal}>
          <IonCard>
            <IonButton fill="clear" onClick={closeModal} className="close-btn" style={{ float: 'right' }}>
              <IonIcon icon={closeCircle} />
            </IonButton>
            {selectedTracker && (
              <IonGrid>
                <IonRow>
                  <IonCol>
                    <h2 style={{ fontWeight: 'bolder' }}>{selectedTracker.FirstName} {selectedTracker.LastName}</h2>
                    { selectedTracker.DeviceNumber ? <p><strong>Device number:</strong> {selectedTracker.DeviceNumber}</p> : "" }
                    { selectedTracker.Occupation ? <p><strong>Occupation:</strong> {selectedTracker.Occupation}</p> : "" }
                    { selectedTracker.Email ? <p><strong>Email:</strong> {selectedTracker.Email}</p> : ""}
                    { selectedTracker.ChassisNumber ? <p><strong>Chassis number:</strong> {selectedTracker.chassisNumber}</p> : "" }
                    { selectedTracker.EngineNumber ? <p><strong>Engine number:</strong> {selectedTracker.EngineNumber}</p> : "" }
                    { selectedTracker.VehiclePlate ? <p><strong>Vehicle Plate:</strong> {selectedTracker.VehiclePlate}</p> : "" }
                    { selectedTracker.VehicleName ? <p><strong>Vehicle name:</strong> {selectedTracker.VehicleName}</p> : ""}
                    { selectedTracker.VehicleColor ? <p><strong>Vehicle color:</strong> {selectedTracker.VehicleColor}</p> : ""}
                    { selectedTracker.Subscription ? <p><strong>Subscription:</strong> {selectedTracker.Subscription}</p> : ""}
                    { selectedTracker.InstallerName ? <p><strong>Installer name:</strong> {selectedTracker.InstallerName}</p> : ""}
                    { selectedTracker.InstallerNumber ? <p><strong>Installer number:</strong> {selectedTracker.InstallerNumber}</p> : ""}
                    { selectedTracker.InstallationLocation ? <p><strong>Installation location:</strong> {selectedTracker.InstallationLocation}</p> : ""}
                    { selectedTracker.InstallationDate ? <p><strong>Installation Date:</strong> {selectedTracker.InstallationDate}</p> :  ""}
                    { selectedTracker.IMEI ? <p><strong>IMEI:</strong> {selectedTracker.IMEI}</p> : ""}
                    { selectedTracker.Amount ? <p><strong>Amount:</strong> {selectedTracker.Amount}</p> : ""}
                    { selectedTracker.RefferalName ? <p><strong>Referral name:</strong> {selectedTracker.RefferalName}</p> : ""}
                    { selectedTracker.RefferalNumber ? <p><strong>Referral number:</strong> {selectedTracker.RefferalNumber}</p> : ""}
                    { selectedTracker.Cateory ? <p><strong>Category:</strong> {selectedTracker.Category}</p> : ""}
                    { selectedTracker.Description ? <p><strong>Description:</strong> {selectedTracker.Description}</p> : ""}
                    { selectedTracker.OtherInformation ? <p><strong>Other information:</strong> {selectedTracker.OtherInformation}</p> : ""}
                    { selectedTracker.DateEntered ? <p><strong>Date added:</strong> {selectedTracker.DateEntered}</p> : ""}
                  </IonCol>
                </IonRow>
              </IonGrid>
            )}
            <IonButton onClick={closeModal}>Close</IonButton>
          </IonCard>
        </IonModal>

        {/* FAB for export options */}
       { canExportToExcel && ( <IonFab vertical="bottom" horizontal="end" slot="fixed">
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
        </IonFab> )}
      </IonContent>
    </IonPage>
  );
};

export default TrackerList;
[ ]