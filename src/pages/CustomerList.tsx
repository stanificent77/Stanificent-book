import React, { useEffect, useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonList, IonItem, IonLabel, IonSkeletonText, IonToast } from '@ionic/react';
import Header from '../components/Header';
import style from './style/CustomerList.module.css';
import useUserInfo from "../hooks/useUserInfo";
import BackButton from '../components/BackButton';

const CustomerList: React.FC = () => {


    const { userName, employeeTag } = useUserInfo();


  const [customers, setCustomers] = useState<any[]>([]); // Specify the type as an array of any
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(false);
  const [toastText, setToastText] = useState(""); // State to manage the loading status

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch('https://stanificentglobal.com/api/getCustomers.php');
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

  return (
    <IonPage>
      <BackButton/>
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
                    <IonSkeletonText animated={true}  className={style.skeleName} />
                  </h2>
                  <p>
                    <IonSkeletonText animated={true} className={style.skeleNum} />
                  </p>
                  <p>
                    <IonSkeletonText animated={true} className={style.skeleNum}/>
                  </p>
                  <p>
                    <IonSkeletonText animated={true} className={style.skeleNum}/>
                  </p>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        ) : (
          <IonList>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer, index) => (
                <IonItem key={index}>
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
                    duration={5000}>
                        
                    </IonToast>
                </div>
      </IonContent>
    </IonPage>
  );
};

export default CustomerList;
