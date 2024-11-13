import React, {useState} from "react";
import { IonPage, IonContent, IonIcon, IonButton, IonToast } from "@ionic/react";
import { personSharp, lockClosedSharp, addCircleSharp, settingsOutline, copySharp, cartSharp, todaySharp, calendarClearSharp, informationCircleOutline, backspace, arrowBack } from 'ionicons/icons';
import style from './style/AddEmployee.module.css';
import Header from "../components/Header";
import useUserInfo from "../hooks/useUserInfo";
import useOfflineSync  from '../hooks/useOfflineSync';
import BackButton from "../components/BackButton";


const Partner: React.FC = () => {

    const { saveDataOffline } = useOfflineSync();

    const { userName, employeeTag } = useUserInfo();

    const [personalName, setPersonalName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [address, setAddress] = useState('');
    const [product, setProduct] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otherNumber, setOtherNumber] = useState('');
    const [toast, setToast] = useState<boolean>(false);
    const [toastText, setToastText] = useState('');
    const token = sessionStorage.getItem('session_token');

    const customerData = {
        personalName: personalName,
        companyName: companyName,
        email: email,
        phoneNumber: phoneNumber,
        address: address,
        product: product,
        otherNumber: otherNumber,
    }

    const clearFormFields = () => {
        setPersonalName('');
        setCompanyName('');
        setEmail('');
        setAddress('');
        setProduct('');
        setPhoneNumber('');
        setOtherNumber('');
    }

    const endpoint = 'http://localhost/pos-endpoint/addpartner.php';

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    

        if(navigator.onLine){
            const response = await fetch(endpoint, { // Update with your actual path
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Indicates JSON format
                },
                body: JSON.stringify(customerData),
            });
        
            try {
                const data = await response.json();
                setToastText(data.message);
                setToast(true)
                clearFormFields();
                // Notify the user about the registration status
            } catch (error) {
                setToastText("An error occurred. Try again");
                setToast(true)
                clearFormFields();

            }
        }else{
            saveDataOffline(customerData, endpoint);
            setToastText("You are offline. supplier data saved locally and will sync when online.");
            setToast(true);
            clearFormFields();
        }
    };


    return(
        <IonPage>
            <BackButton/>
        <IonContent className={style.container}>
            <div className={style.topic}>
                <div className={style.employee}>
                    <div className={style.new}>New Partner</div>
                    <div className={style.createnew}>Add new partner</div>
                </div>
                <div>
                    <IonButton className={style.employeebut} routerLink="/partnerlist"> <IonIcon icon={arrowBack} /> Partner List</IonButton>
                </div>
            </div>

            <div className={style.field}>
                <form onSubmit={handleSubmit}>
                    <div className={style.cont}>
                        <div style={{display:"flex", alignItems:"center", borderBottom:"1px solid grey", paddingBlock:".5rem"}}>
                            <IonIcon icon={informationCircleOutline}/>
                            Partner Information
                        </div>

                        <div className={style.line}>
                            <div className={style.inputs}>
                                <div className={style.head}>
                                    Personal name
                                </div>
                                <div>
                                    <input type="text" value={personalName} onChange={e => setPersonalName(e.target.value)} required />
                                </div>
                            </div>
                            <div className={style.inputs}>
                                <div className={style.head}>
                                    Company name
                                </div>
                                <div>
                                    <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} required/>
                                </div>
                            </div>
                            <div className={style.inputs}>
                                <div className={style.head}>
                                    Phone number
                                </div>
                                <div>
                                    <input type="text" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} required/>
                                </div>
                            </div>
                        </div>

                        <div className={style.line}>
                            <div className={style.inputs}>
                                <div className={style.head}>
                                    Other number
                                </div>
                                <div>
                                    <input type="text" value={otherNumber} onChange={e => setOtherNumber(e.target.value)} required/>
                                </div>
                            </div>
                            <div className={style.inputs}>
                                <div className={style.head}>
                                    Address
                                </div>
                                <div>
                                    <input type="text" value={address} onChange={e => setAddress(e.target.value)} required/>
                                </div>
                            </div>
                            <div className={style.inputs}>
                                <div className={style.head}>
                                    Email
                                </div>
                                <input type="text" value={email} onChange={e => setEmail(e.target.value)} required/>
                            </div>
                        </div>
                        <div className={style.line}>
                            <div className={style.inputs}>
                                <div className={style.head}>
                                    Products / Service offering
                                </div>
                                <div>
                                    <input type="text" value={product} onChange={e => setProduct(e.target.value)} required/>
                                </div>
                            </div>
                            <div className={style.inputs}>
                                <IonButton className={style.button} type="submit"> <IonIcon icon={addCircleSharp} /> Add Partner</IonButton>
                            </div>
                        </div>
                    </div>
                    <div>
                    <IonToast
                    isOpen={toast}
                    message={toastText}
                    onDidDismiss={() => setToast(false)}
                    duration={5000}>
                        
                    </IonToast>
                </div>
                </form>
            </div>

        </IonContent>
    </IonPage>
    )
}

export default Partner;