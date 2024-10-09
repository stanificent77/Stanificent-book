import React, { useEffect, useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonList, IonItem,
  IonLabel, IonSkeletonText, IonModal, IonButton, IonGrid, IonRow, IonCol, IonIcon, IonCard
} from '@ionic/react';
import { closeCircle, chevronBack } from 'ionicons/icons';
import Header from '../components/Header';
import useUserInfo from "../hooks/useUserInfo";
import BackButton from '../components/BackButton';

const TrackerList: React.FC = () => {

    const { userName, employeeTag } = useUserInfo();

  const [trackers, setTrackers] = useState<any[]>([]); // Specify the type as an array of any
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true); // State to manage the loading status
  const [selectedTracker, setSelectedTracker] = useState<any>(null); // For storing the clicked tracker
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

  useEffect(() => {
    const fetchTrackers = async () => {
      try {
        const response = await fetch('https://stanificentglobal.com/api/getTracker.php');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // Check if the response is an array
        if (Array.isArray(data)) {
          setTrackers(data);
        } else {
          console.error('Unexpected data format:', data);
        }
      } catch (error) {
        console.error('Error fetching trackers:', error);
      } finally {
        setLoading(false); // Stop loading once data is fetched
      }
    };

    fetchTrackers();
  }, []);

  const filteredTrackers = trackers.filter(tracker =>
    tracker.FirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tracker.LastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tracker.DeviceNumber.includes(searchTerm) ||
    tracker.PhoneNumber.includes(searchTerm) ||
    tracker.VehiclePlate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (tracker: any) => {
    setSelectedTracker(tracker);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedTracker(null);
    setIsModalOpen(false);
  };

  return (
    <IonPage>
      <BackButton/>
      <IonContent className="ion-padding">
        <IonSearchbar
          placeholder="Search by name, phone, device number, or plate"
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
                    <IonSkeletonText animated={true} style={{ width: '50%' }} />
                  </h2>
                  <p>
                    <IonSkeletonText animated={true} style={{ width: '70%' }} />
                  </p>
                  <p>
                    <IonSkeletonText animated={true} style={{ width: '30%' }} />
                  </p>
                  <p>
                    <IonSkeletonText animated={true} style={{ width: '40%' }} />
                  </p>
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
                    <h2 style={{ fontWeight: 'bolder' }}>
                      {tracker.FirstName} {tracker.LastName}
                    </h2>
                    <p>Device Number: {tracker.DeviceNumber}</p>
                    <p>Phone: {tracker.PhoneNumber}</p>
                    <p>Vehicle Plate: {tracker.VehiclePlate}</p>
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
                    <h2 style={{ fontWeight: 'bolder' }}>
                      {selectedTracker.FirstName} {selectedTracker.LastName}
                    </h2>
                    <p><strong>Device Number:</strong> {selectedTracker.DeviceNumber}</p>
                    <p><strong>Email:</strong> {selectedTracker.Email}</p>
                    <p><strong>Phone 1:</strong> {selectedTracker.PhoneNumber}</p>
                    <p><strong>Category:</strong> {selectedTracker.Category}</p>
                    <p><strong>Description:</strong> {selectedTracker.Description}</p>
                    <p><strong>Other Information:</strong> {selectedTracker.OtherInformation}</p>
                    <p><strong>Occupation:</strong> {selectedTracker.Occupation}</p>
                    <p><strong>Address:</strong> {selectedTracker.Address}</p>
                    <p><strong>Vehicle Name:</strong> {selectedTracker.VehicleName}</p>
                    <p><strong>Vehicle Color:</strong> {selectedTracker.VehicleColor}</p>
                    <p><strong>Vehicle Plate:</strong> {selectedTracker.VehiclePlate}</p>
                    <p><strong>Engine Number:</strong> {selectedTracker.EngineNumber}</p>
                    <p><strong>Chassis Number:</strong> {selectedTracker.ChassisNumber}</p>
                    <p><strong>Installer Name:</strong> {selectedTracker.InstallerName}</p>
                    <p><strong>Installer Number:</strong> {selectedTracker.InstallerNumber}</p>
                    <p><strong>IMEI:</strong> {selectedTracker.IMEI}</p>
                    <p><strong>Amount:</strong> {selectedTracker.Amount}</p>
                    <p><strong>Subscription:</strong> {selectedTracker.Subscription}</p>
                    <p><strong>Installation Date:</strong> {selectedTracker.InstallationDate}</p>
                  </IonCol>
                </IonRow>
              </IonGrid>
            )}
            <IonButton onClick={closeModal}>Close</IonButton>
          </IonCard>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default TrackerList;