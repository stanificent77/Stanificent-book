import React, {useState} from "react";
import { IonPage, IonContent, IonIcon, IonButton, } from "@ionic/react";
import { personSharp, lockClosedSharp, addCircleSharp, settingsOutline, copySharp, cartSharp, todaySharp, calendarClearSharp, informationCircleOutline, backspace, arrowBack } from 'ionicons/icons';
import style from './style/AddEmployee.module.css';
import Header from "../components/Header";
import useUserInfo from "../hooks/useUserInfo";
import useOfflineSync  from '../hooks/useOfflineSync';
import BackButton from "../components/BackButton";


const Customer: React.FC = () => {

    const { saveDataOffline } = useOfflineSync();

    const { userName, employeeTag } = useUserInfo();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [address, setAddress] = useState('');
    const [customerCategory, setCustomerCategory] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otherInformation, setOtherInformation] = useState('');

    const customerData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        companyName: companyName,
        address: address,
        customerCategory: customerCategory,
        phoneNumber: phoneNumber,
        otherInformation: otherInformation
    }

    const clearFormFields = () => {
        setFirstName('');
        setLastName('');
        setEmail('');
        setCompanyName('');
        setAddress('');
        setCustomerCategory('');
        setPhoneNumber('');
        setOtherInformation('');
    }

    const endpoint = 'http://localhost/pos-endpoint/addcustomer.php';

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    

        if(navigator.onLine){
            const response = await fetch(endpoint, { // Update with your actual path
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Indicates JSON format
                },
                body: JSON.stringify(customerData),
            });
        
            try {
                const data = await response.json();
                alert(data.message);
                clearFormFields();
                // Notify the user about the registration status
            } catch (error) {
                console.error("Error:", error);
                alert("An error occurred during registration.");
                clearFormFields();

            }
        }else{
            saveDataOffline(customerData, endpoint);
            alert(
              "You are offline. Employee data saved locally and will sync when online."
            );
            clearFormFields();
        }
    };


    return(
        <IonPage>
            <BackButton/>
        <IonContent className={style.container}>
            <div className={style.topic}>
                <div className={style.employee}>
                    <div className={style.new}>New Customer</div>
                    <div className={style.createnew}>Create new customer</div>
                </div>
                <div>
                    <IonButton className={style.employeebut} routerLink="/customerlist"> <IonIcon icon={arrowBack} /> Customer List</IonButton>
                </div>
            </div>

            <div className={style.field}>
                <form onSubmit={handleSubmit}>
                    <div className={style.cont}>
                        <div style={{display:"flex", alignItems:"center", borderBottom:"1px solid grey", paddingBlock:".5rem"}}>
                            <IonIcon icon={informationCircleOutline}/>
                            Customer Information
                        </div>

                        <div className={style.line}>
                            <div className={style.inputs}>
                                <div className={style.head}>
                                    First Name
                                </div>
                                <div>
                                    <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required />
                                </div>
                            </div>
                            <div className={style.inputs}>
                                <div className={style.head}>
                                    Last Name
                                </div>
                                <div>
                                    <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} required/>
                                </div>
                            </div>
                            <div className={style.inputs}>
                                <div className={style.head}>
                                    Email
                                </div>
                                <div>
                                    <input type="text" value={email} onChange={e => setEmail(e.target.value)} required/>
                                </div>
                            </div>
                        </div>

                        <div className={style.line}>
                            <div className={style.inputs}>
                                <div className={style.head}>
                                    Company Name
                                </div>
                                <div>
                                    <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} required/>
                                </div>
                            </div>
                            <div className={style.inputs}>
                                <div className={style.head}>
                                    Phone Number
                                </div>
                                <div>
                                    <input type="text" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} required/>
                                </div>
                            </div>
                            <div className={style.inputs}>
                                <div className={style.head}>
                                    Address
                                </div>
                                <input type="text" value={address} onChange={e => setAddress(e.target.value)} required/>
                            </div>
                        </div>
                        <div className={style.line}>
                            <div className={style.inputs}>
                                <div className={style.head}>
                                    Customer Category
                                </div>
                                <div>
                                    <input type="text" value={customerCategory} onChange={e => setCustomerCategory(e.target.value)} required/>
                                </div>
                            </div>
                            <div className={style.inputs}>
                                <div className={style.head}>
                                    Other Information
                                </div>
                                <div>
                                    <input type="text" value={otherInformation} onChange={e => setOtherInformation(e.target.value)} required/>
                                </div>
                            </div>
                            <div className={style.inputs}>
                                <IonButton className={style.button} type="submit"> <IonIcon icon={addCircleSharp} /> Add Customer</IonButton>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

        </IonContent>
    </IonPage>
    )
}

export default Customer;