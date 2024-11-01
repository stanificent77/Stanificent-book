import { IonContent, IonPage, IonCard, IonIcon, IonButton, IonApp, IonToast } from "@ionic/react";
import React, { useState } from "react";
import style from './style/Register.module.css';
import { personSharp, lockClosedSharp, briefcaseSharp, calendarClearSharp, callSharp } from 'ionicons/icons';

const Register: React.FC = () => {
    const logo = '../resources/StanLogo.png';
    
    // State for form inputs
    const [username, setUsername] = useState('');
    const [employmentDate, setEmploymentDate] = useState('');
    const [position, setPosition] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [role, setRole] = useState("user");
    const [toast, setToast] = useState(false);
    const [toastText, setToastText] = useState("")
    const token = sessionStorage.getItem("session_token");

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    
        const response = await fetch('https://stanificentglobal.com/api/register.php', { // Update with your actual path
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${token}`,
                'Content-Type': 'application/json', // Indicates JSON format
            },
            body: JSON.stringify({
                username: username,
                employment_date: employmentDate,
                position: position,
                role: role,
                phoneNumber: phoneNumber,
                password: password,
            }),
        });
    
        try {
            const data = await response.json();
            alert(data.message); // Notify the user about the registration status
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred during registration.");
        }
    };
    

    return (
        <IonPage>
            <IonContent>
                <div className={style.content}>
                    <div className={style.writeup}>
                        <div style={{display: "flex", alignContent:"center"}}>
                            <div className={style.logo}>
                                <img src={logo} alt="Logo" />
                            </div>
                            <div>
                                <h1>STANIFICENT GLOBAL TECHNOLOGIES LTD</h1>
                                <p><b>POS AND ACCOUNTING SYSTEM</b></p>
                                <ul>
                                    <li><strong>Sales Management</strong>: Process transactions, apply discounts, and issue receipts.</li><br/>
                                    <li><strong>Inventory Management</strong>: Track stock levels and manage variations.</li><br/>
                                    <li><strong>Payment Processing</strong>: Handle various payment methods securely.</li><br/>
                                    <li><strong>Reporting and Analytics</strong>: Generate sales and inventory reports.</li><br/>
                                    <li><strong>Customer Management</strong>: Store customer profiles and purchase history.</li><br/>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className={style.container}>
                        <IonCard className={style.card}>
                            <div className={style.formField}>
                                <h1 style={{fontWeight: "bolder", color:"black", fontSize:"1.6rem"}}>Register</h1>
                                <form onSubmit={handleSubmit}>
                                    <div className={style.input}>
                                        <div className={style.icon}>
                                             <IonIcon icon={personSharp} />
                                        </div>
                                        <input 
                                            className={style.field} 
                                            type="text" 
                                            placeholder="Username" 
                                            value={username} 
                                            onChange={e => setUsername(e.target.value)} 
                                            required 
                                        />
                                    </div>

                                    <div className={style.input}>
                                        <div className={style.icon}>
                                             <IonIcon icon={callSharp} />
                                        </div>
                                        <input 
                                            className={style.field} 
                                            type="text" 
                                            placeholder="Phone Number" 
                                            value={phoneNumber} 
                                            onChange={e => setPhoneNumber(e.target.value)} 
                                            required 
                                        />
                                    </div>

                                    <div className={style.input}>
                                        <div className={style.icon}>
                                             <IonIcon icon={calendarClearSharp} />
                                        </div>
                                        <input 
                                            className={style.field} 
                                            type="date" 
                                            placeholder="Employment Date" 
                                            value={employmentDate} 
                                            onChange={e => setEmploymentDate(e.target.value)} 
                                            required 
                                        />
                                    </div>

                                    <div className={style.input}>
                                        <div className={style.icon}>
                                             <IonIcon icon={briefcaseSharp} />
                                        </div>
                                        <input 
                                            className={style.field} 
                                            type="text" 
                                            placeholder="Position" 
                                            value={position} 
                                            onChange={e => setPosition(e.target.value)} 
                                            required 
                                        />
                                    </div>

                                    <div className={style.input}>
                                        <div className={style.icon}>
                                             <IonIcon icon={briefcaseSharp} />
                                        </div>
                                        <select 
                                            className={style.field}  
                                            value={role} 
                                            onChange={e => setRole(e.target.value)} 
                                            required 
                                        >
                                            <option>
                                                user
                                            </option>
                                            <option>
                                                admin
                                            </option>
                                        </select>
                                    </div>

                                    <div className={style.input}>
                                        <div className={style.icon}>
                                            <IonIcon icon={lockClosedSharp} />
                                        </div>
                                        <input 
                                            className={style.field} 
                                            type="password" 
                                            placeholder="Password" 
                                            value={password} 
                                            onChange={e => setPassword(e.target.value)} 
                                            required 
                                        />
                                    </div>
                                    <div>
                                        <button style={{width: "100%", marginTop: "2.5rem", background:"#443d81", padding:"10px", border:"none", borderRadius:"5px", color:"white"}} type="submit">Register</button>
                                    </div>
                                    <div>
                                        <a href="/login" style={{ display: 'block', padding: '10px', color: 'black', textDecoration:"none" }}>
                                            Already a staff? <span style={{color:"blue"}}>Login</span> 
                                        </a>
                                    </div>
                                </form>
                            </div>
                        </IonCard>
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
            </IonContent>
            <p style={{margin:"auto", marginBottom:".7rem", color:"grey", fontSize:"13px"}}>&copy; 2024 Stanificent Global Technologies LTD. All rights reserved.</p>
        </IonPage>
    
    );
};


export default Register;