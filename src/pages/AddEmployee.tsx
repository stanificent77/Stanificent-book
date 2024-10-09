import { IonPage, IonContent, IonButton, IonInput } from "@ionic/react";
import React, {useState} from "react";
import { IonIcon } from '@ionic/react';
import { personSharp, lockClosedSharp, addCircleSharp, settingsOutline, copySharp, cartSharp, todaySharp, calendarClearSharp, informationCircleOutline, backspace, arrowBack } from 'ionicons/icons';
import Header from "../components/Header";
import style from './style/AddEmployee.module.css'
import { addIcons } from "ionicons";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import MaskedInput from 'react-text-mask';
import useUserInfo from "../hooks/useUserInfo";
import useOfflineSync  from '../hooks/useOfflineSync';
import BackButton from "../components/BackButton";

const AddEmployee: React.FC = () => {

    const { userName, employeeTag } = useUserInfo();
    const { saveDataOffline } = useOfflineSync();


    const [username, setUsername] = useState('');
    const [employmentDate, setEmploymentDate] = useState('');
    const [position, setPosition] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [role, setRole] = useState("user");
    const endpoint = 'http://localhost/pos-endpoint/addemployee.php';

    const employeeData = {
        username: username,
        email: email,
        employment_date: employmentDate,
        position: position,
        role: role,
        phoneNumber: phoneNumber,
        password: password,
        confirm_password: confirmPassword
    }


    const clearFormFields = () => {
        setUsername('');
        setEmploymentDate('');
        setPosition('');
        setPassword('');
        setConfirmPassword('');
        setEmail('');
        setPhoneNumber('');
        setRole('user');
    };




      const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    
        if (navigator.onLine) {
          // If online, submit the data to the server
          try {
            const response = await fetch(endpoint, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(employeeData),
            });
    
            const data = await response.json();
            alert(data.message); // Notify the user about the registration status
          } catch (error) {
            console.error("Error:", error);
            alert("An error occurred during registration.");
          }
        } else {
          // Use the sync function when offline
          saveDataOffline(employeeData, endpoint);
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
                        <div className={style.new}>New Employee</div>
                        <div className={style.createnew}>Create new employee</div>
                    </div>
                    <div>
                        <IonButton className={style.employeebut} routerLink="/employeelist"> <IonIcon icon={arrowBack} /> Employees List</IonButton>
                    </div>
                </div>

                <div className={style.field}>
                    <form onSubmit={handleSubmit}>
                        <div className={style.cont}>
                            <div style={{display:"flex", alignItems:"center", borderBottom:"1px solid grey", paddingBlock:".5rem"}}>
                                <IonIcon icon={informationCircleOutline}/>
                                Employee Information
                            </div>

                            <div className={style.line}>
                                <div className={style.inputs}>
                                    <div className={style.head}>
                                        Username
                                    </div>
                                    <div>
                                        <input type="text" value={username} onChange={e => setUsername(e.target.value)} required />
                                    </div>
                                </div>
                                <div className={style.inputs}>
                                    <div className={style.head}>
                                        Position
                                    </div>
                                    <div>
                                        <input type="text" value={position} onChange={e => setPosition(e.target.value)} required/>
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
                                        Role
                                    </div>
                                    <div className={style.select}>
                                        <select value={role} onChange={e => setRole(e.target.value)} required>
                                            <option>User</option>
                                            <option>Admin</option>
                                        </select>
                                    </div>
                                </div>
                                <div className={style.inputs}>
                                    <div className={style.head}>
                                        Phone
                                    </div>
                                    <div>
                                        <input type="text" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} required/>
                                    </div>
                                </div>
                                <div className={style.inputs}>
                                    <div className={style.head}>
                                        Employment Date
                                    </div>
                                    <div>
                                        <input
                                            placeholder="DD/MM/YYYY" type="date" value={employmentDate} 
                                        onChange={e => setEmploymentDate(e.target.value)} required/>
                                    </div>
                                </div>
                            </div>
                            <div className={style.line}>
                                <div className={style.inputs}>
                                    <div className={style.head}>
                                        Password
                                    </div>
                                    <div>
                                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required/>
                                    </div>
                                </div>
                                <div className={style.inputs}>
                                    <div className={style.head}>
                                        Confirm Password
                                    </div>
                                    <div>
                                        <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required/>
                                    </div>
                                </div>
                                <div className={style.inputs}>
                                    <IonButton className={style.button} type="submit"> <IonIcon icon={addCircleSharp} /> Add Employee</IonButton>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

            </IonContent>
        </IonPage>
    )
}

export default AddEmployee;