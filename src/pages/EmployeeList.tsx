import React, { useEffect, useState } from 'react';
import {
  IonPage, IonContent, IonSearchbar, IonList, IonItem, IonLabel, IonSkeletonText, IonModal,
  IonButton, IonGrid, IonRow, IonCol, IonInput, IonIcon, IonCard
} from '@ionic/react';
import { closeCircle } from 'ionicons/icons';
import BackButton from '../components/BackButton';

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ username: '', email: '', phoneNumber: '', password: '' });

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('http://localhost/pos-endpoint/getEmployees.php');
        const data = await response.json();
        if (Array.isArray(data)) {
          setEmployees(data);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter(employee =>
    employee.employee_tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.includes(searchTerm) ||
    employee.phoneNumber.includes(searchTerm)
  );

  const openModal = (employee: any) => {
    setSelectedEmployee(employee);
    setEditForm({
      username: employee.username,
      email: employee.email,
      phoneNumber: employee.phoneNumber,
      password: '', // Leave password blank initially
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedEmployee(null);
    setIsModalOpen(false);
  };

  const handleEditChange = (e: any) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const saveChanges = async () => {
    if (!selectedEmployee) return;

    const updatedEmployee = {
      employee_tag: selectedEmployee.employee_tag, // Use employee_tag as the unique identifier
      username: editForm.username,
      email: editForm.email,
      phoneNumber: editForm.phoneNumber,
      password: editForm.password || null, // Handle optional password
    };

    try {
      const response = await fetch('http://localhost/pos-endpoint/updateEmployee.php', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEmployee),
      });

      if (response.ok) {
        const updatedData = await response.json();
        console.log('Employee updated:', updatedData);
        // Update the UI after success
        const updatedList = employees.map(employee =>
          employee.employee_tag === selectedEmployee.employee_tag ? { ...employee, ...editForm } : employee
        );
        setEmployees(updatedList);
        closeModal();
      } else {
        throw new Error('Failed to update employee');
      }
    } catch (error) {
      console.error('Error saving employee changes:', error);
    }
  };

  return (
    <IonPage>
      <BackButton />
      <IonContent className="ion-padding">
        <div>Employees List</div>
        <IonSearchbar
          placeholder="Search by name, phone, etc."
          value={searchTerm}
          onIonInput={(e: any) => setSearchTerm(e.target.value)}
        />

        {loading ? (
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
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        ) : (
          <IonList>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((employee, index) => (
                <IonItem key={index} button onClick={() => openModal(employee)}>
                  <IonLabel>
                    <h2 style={{ fontWeight: 'bolder' }}>{employee.username}</h2>
                    <p>Employee Tag: {employee.employee_tag}</p>
                    <p>Phone: {employee.phoneNumber}</p>
                    <p>Email: {employee.email}</p>
                  </IonLabel>
                </IonItem>
              ))
            ) : (
              <IonItem>
                <IonLabel>No employees found</IonLabel>
              </IonItem>
            )}
          </IonList>
        )}

        {/* Modal for editing employee */}
        <IonModal isOpen={isModalOpen} onDidDismiss={closeModal}>
          <IonCard>
            <IonButton fill="clear" onClick={closeModal} className="close-btn" style={{ float: 'right' }}>
              <IonIcon icon={closeCircle} />
            </IonButton>
            {selectedEmployee && (
              <IonGrid>
                <IonRow>
                  <IonCol>
                    <h2>Edit Employee</h2>
                    <IonLabel>Username:</IonLabel>
                    <IonInput
                      name="username"
                      value={editForm.username}
                      onIonChange={handleEditChange}
                      placeholder="Username"
                    />
                    <IonLabel>Email:</IonLabel>
                    <IonInput
                      name="email"
                      value={editForm.email}
                      onIonChange={handleEditChange}
                      placeholder="Email"
                    />
                    <IonLabel>Phone Number:</IonLabel>
                    <IonInput
                      name="phoneNumber"
                      value={editForm.phoneNumber}
                      onIonChange={handleEditChange}
                      placeholder="Phone Number"
                    />
                    <IonLabel>Password:</IonLabel>
                    <IonInput
                      name="password"
                      type="password"
                      value={editForm.password}
                      onIonChange={handleEditChange}
                      placeholder="Leave blank to keep current password"
                    />
                  </IonCol>
                </IonRow>
              </IonGrid>
            )}
            <IonButton onClick={saveChanges}>Save Changes</IonButton>
          </IonCard>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default EmployeeList;
