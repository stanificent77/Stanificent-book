import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonContent,
  IonSearchbar,
  IonList,
  IonItem,
  IonLabel,
  IonSkeletonText,
  IonModal,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonCard,
  IonLoading,
} from '@ionic/react';
import { closeCircle } from 'ionicons/icons';
import BackButton from '../components/BackButton';
import style from '../pages/style/EmployeeList.module.css';
import isAdmin from '../hooks/useUserRole';
import useUserRole from '../hooks/useUserRole';


interface Employee {
  employee_tag: string;
  username: string;
  email: string;
  phoneNumber: string;
}

interface ApiResponse {
  status: string;
  data: Employee[];
  message?: string;
}

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ username: '', email: '', phoneNumber: '', password: '' });
  const [loader, setLoader] = useState(false);
  const userRole = sessionStorage.getItem("userRole");

  const token = sessionStorage.getItem('session_token');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('https://stanificentglobal.com/api/getEmployees.php', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const data: ApiResponse = await response.json();
          if (data.status === 'success' && Array.isArray(data.data)) {
            setEmployees(data.data);
          } else {
            console.error('API Error:', data.message || 'Unknown error');
          }
        } else {
          const errorText = await response.text();
          console.error('Expected JSON but received:', errorText);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [token]);


  const openModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setEditForm({
      username: employee.username,
      email: employee.email,
      phoneNumber: employee.phoneNumber,
      password: '',
    });
    setIsModalOpen(true);
  };

  const viewInfo = () => {
    if(!isAdmin){

    }else{

    }
  }

  const closeModal = () => {
    setSelectedEmployee(null);
    setIsModalOpen(false);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const saveChanges = async () => {
    setLoader(true);
    if (!selectedEmployee) return;

    const updatedEmployee = {
        employees_tag: selectedEmployee.employee_tag, // Fix typo here if it was 'employees_tag'
        username: editForm.username,
        email: editForm.email,
        phoneNumber: editForm.phoneNumber,
        password: editForm.password || '',
    };

    try {
        const response = await fetch('https://stanificentglobal.com/api/updateEmployee.php', {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedEmployee),
        });

        console.log("Updated successful");
        closeModal();
    } catch (error) {
        console.error('Error saving employee changes:', error);
    } finally {
        setLoader(false);
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
          onIonInput={(e: CustomEvent) => setSearchTerm(e.detail.value!)}
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
            {employees.length > 0 ? (
              employees.map((employee) => (
                <IonItem key={employee.employee_tag} button onClick={()=> {openModal(employee)}}>
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
                    <div>
                      <label className={style.lab}>Username:</label>
                      <input
                        className={style.input}
                        name="username"
                        value={editForm.username}
                        onChange={handleEditChange}
                        placeholder="Username"
                      />
                    </div>
                    <div>
                      <label className={style.lab}>Email:</label>
                      <input
                        className={style.input}
                        name="email"
                        value={editForm.email}
                        onChange={handleEditChange}
                        placeholder="Email"
                      />
                    </div>
                    <div>
                      <label className={style.lab}>Phone Number:</label>
                      <input
                        className={style.input}
                        name="phoneNumber"
                        value={editForm.phoneNumber}
                        onChange={handleEditChange}
                        placeholder="Phone Number"
                      />
                    </div>
                    <div>
                      <label className={style.lab}>Password:</label>
                      <input
                        className={style.input}
                        name="password"
                        type="password"
                        value={editForm.password}
                        onChange={handleEditChange}
                        placeholder="Leave blank to keep current password"
                      />
                    </div>
                  </IonCol>
                </IonRow>
              </IonGrid>
            )}
            <IonButton expand="full" onClick={saveChanges}>
              Save Changes
            </IonButton>
          </IonCard>
        </IonModal>

        <IonLoading isOpen={loader} message={'Please wait...'} />
      </IonContent>
    </IonPage>
  );
};

export default EmployeeList;
