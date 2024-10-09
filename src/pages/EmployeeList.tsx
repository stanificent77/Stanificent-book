import React, { useEffect, useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonList, IonItem,
  IonLabel, IonSkeletonText, IonModal, IonButton, IonGrid, IonRow, IonCol, IonIcon, IonCard
} from '@ionic/react';
import { closeCircle } from 'ionicons/icons';
import Header from '../components/Header';
import useUserInfo from "../hooks/useUserInfo";
import BackButton from '../components/BackButton';

const EmployeeList: React.FC = () => {

    const { userName, employeeTag } = useUserInfo();

  const [employees, setEmployees] = useState<any[]>([]); // Specify the type as an array of any
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true); // State to manage the loading status
  const [selectedEmployees, setSelectedEmployees] = useState<any>(null); // For storing the clicked tracker
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('http://localhost/pos-endpoint/getEmployees.php');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // Check if the response is an array
        if (Array.isArray(data)) {
          setEmployees(data);
        } else {
          console.error('Unexpected data format:', data);
        }
      } catch (error) {
        console.error('Error fetching trackers:', error);
      } finally {
        setLoading(false); // Stop loading once data is fetched
      }
    };

    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter(employees =>
    employees.employee_tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employees.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employees.email.includes(searchTerm) ||
    employees.phoneNumber.includes(searchTerm)
  );

  const openModal = (employees: any) => {
    setSelectedEmployees(employees);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedEmployees(null);
    setIsModalOpen(false);
  };

  return (
    <IonPage>
      <BackButton/>
      <IonContent className="ion-padding">
        <div>
            Employees List
        </div>
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
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((employees, index) => (
                <IonItem key={index} button onClick={() => openModal(employees)}>
                  <IonLabel>
                    <h2 style={{ fontWeight: 'bolder' }}>
                      {employees.username}
                    </h2>
                    <p>Employee Tag: {employees.employee_tag}</p>
                    <p>Phone: {employees.phoneNumber}</p>
                    <p>Email: {employees.email}</p>
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
            {selectedEmployees && (
              <IonGrid>
                <IonRow>
                  <IonCol>
                    <h2 style={{ fontWeight: 'bolder' }}>
                      {selectedEmployees.username} 
                    </h2>
                    <p><strong>Employee Tag:</strong> {selectedEmployees.employee_tag}</p>
                    <p><strong>Email:</strong> {selectedEmployees.email}</p>
                    <p><strong>Phone:</strong> {selectedEmployees.phoneNumber}</p>
                    <p><strong>Role:</strong> {selectedEmployees.role}</p>
                    <p><strong>Position:</strong> {selectedEmployees.position}</p>
                    <p><strong>Employment Date:</strong> {selectedEmployees.hire_date}</p>
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

export default EmployeeList;