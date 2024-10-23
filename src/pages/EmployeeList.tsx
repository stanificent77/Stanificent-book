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
import axios from 'axios';
import style from '../pages/style/EmployeeList.module.css';

// Define the type for Employee
interface Employee {
  employee_tag: string;
  username: string;
  email: string;
  phoneNumber: string;
}

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ username: '', email: '', phoneNumber: '', password: '' });
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get<Employee[]>('https://stanificentglobal.com/api/getEmployees.php');
        setEmployees(response.data);
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

  const closeModal = () => {
    setSelectedEmployee(null);
    setIsModalOpen(false);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const saveChanges = async () => {
    if (!selectedEmployee) return;

    const updatedEmployee = {
      employees_tag: selectedEmployee.employee_tag,
      username: editForm.username,
      email: editForm.email,
      phoneNumber: editForm.phoneNumber,
      password: editForm.password || '',
    };

    try {
      const response = await axios.put('https://stanificentglobal.com/api/updateEmployee.php', updatedEmployee);
      const updatedData = response.data;
      console.log('Employee updated:', updatedData);

      const updatedList = employees.map(employee =>
        employee.employee_tag === selectedEmployee.employee_tag ? { ...employee, ...editForm } : employee
      );
      setEmployees(updatedList);
      closeModal();
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
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((employee) => (
                <IonItem key={employee.employee_tag} button onClick={() => openModal(employee)}>
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
        <IonModal style={{border:"0px solid black"}} isOpen={isModalOpen} onDidDismiss={closeModal}>
          <IonCard>
            <IonButton fill="clear" onClick={closeModal} className="close-btn" style={{ float: 'right' }}>
              <IonIcon icon={closeCircle} />
            </IonButton>
            {selectedEmployee && (
              <IonGrid>
                <IonRow style={{"--border":"0px solid black"}}>
                  <IonCol style={{border:"0px solid black"}}>
                    <h2>Edit Employee</h2>
                    <div>
                      <div>
                        <label className={style.lab}>Username:</label>
                      </div>
                      <div>
                        <input
className={style.input}
                          name="username"
                          value={editForm.username}
                          onChange={handleEditChange}
                          placeholder="Username"
                        />
                      </div>
                    </div>
                    <div>
                      <div>
                        <label className={style.lab}>Email:</label>
                      </div>
                      <div>
                        <input
className={style.input}
                          name="email"
                          value={editForm.email}
                          onChange={handleEditChange}
                          placeholder="Email"
                        />
                      </div>
                    </div>
                    <div>
                      <div>
                        <label className={style.lab}>Phone Number:</label>
                      </div>
                      <div>
                        <input
className={style.input}
                          name="phoneNumber"
                          value={editForm.phoneNumber}
                          onChange={handleEditChange}
                          placeholder="Phone Number"
                        />
                      </div>
                    </div>
                    <div>
                      <div>
                        <label className={style.lab}>Password:</label>
                      </div>
                      <div>
                        <input
className={style.input}
                          name="password"
                          type="password"
                          value={editForm.password}
                          onChange={handleEditChange} // Use standard onChange
                          placeholder="Leave blank to keep current password"
                        />
                      </div>
                    </div>
                  </IonCol>
                </IonRow>
              </IonGrid>
            )}
            <IonButton id='load' onClick={saveChanges}>Save Changes</IonButton>
            <div>
              <IonLoading className="loading" trigger="load" message="Updating..." spinner="crescent" duration={4000}/>
            </div>
          </IonCard>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default EmployeeList;
