import { IonContent, IonPage, IonIcon, IonToggle, IonCard } from "@ionic/react";
import React, { useState } from "react";
import { personSharp, lockClosedSharp } from 'ionicons/icons';
import style from "./style/Login.module.css";
import { useHistory } from 'react-router-dom';

const Login: React.FC = () => {
    const history = useHistory(); // Use useHistory hook
    const [loginId, setLoginId] = useState("");
    const [password, setPassword] = useState("");
    const [keepLoggedIn, setKeepLoggedIn] = useState(false);

    const apiUrl = "https://stanificentglobal.com/api/login.php";

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();

        const loginData = {
            login_id: loginId,
            password: password
        };

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(loginData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Network response was not ok");
            }

            const data = await response.json();
            if (data.success) {
                const userInfo = {
                    username: data.user.username,
                    employee_tag: data.user.tag,
                    phoneNumber: data.user.phoneNumber,
                    role: data.user.role,
                    hire_date: data.user.hire_date
                };

                  if (keepLoggedIn) {
                    localStorage.setItem("userInfo", JSON.stringify(userInfo));
                  } else {
                    localStorage.setItem("userInfo", JSON.stringify(userInfo));
                  }
                history.push("/dashboard"); // Redirect to the dashboard
            } else {
                alert(data.error || "Login failed");
            }
        } catch (error) {
            console.error("Error during login:", error);
            alert("An error occurred. Please try again: ");
        }
    };

    


    const pics = 'web.png';

    return(
        <IonPage>
            <IonContent>
                <div  className={style.content}>
                    <div className={style.container}>
                        <h1 style={{fontWeight: "bolder", color:"black", fontSize:"2rem"}}>POS SOFTWARE</h1>
                        <p>STANIFICENT GLOBAL TECHNOLOGIES LTD</p>
                        <IonCard className={style.card}>
                            <div className={style.formField}>
                                <h1 style={{fontWeight: "bolder", color:"black", fontSize:"1.6rem"}}>LOGIN</h1>
                                <form onSubmit={handleLogin}>
                                    <div className={style.input}>
                                       <div className={style.icon}>
                                        <IonIcon icon={personSharp}/>
                                       </div>
                                        <input value={loginId} onChange={(e) => setLoginId(e.target.value)} className={style.field} type="text" placeholder="Username"></input>
                                    </div>
                                    <div className={style.input}>
                                       <div className={style.icon}>
                                       <IonIcon icon={lockClosedSharp}/>
                                       </div>
                                        <input className={style.field} value={password} onChange={(e) => setPassword(e.target.value)} type="Password" placeholder="Password"></input>
                                    </div>
                                    <div className={style.keep}>
                                        <p>Keep me logged in</p>
                                        <IonToggle
                                            checked={keepLoggedIn}
                                            onIonChange={(e) => setKeepLoggedIn(e.detail.checked)}
                                        />
                                    </div>
                                    <div>
                                        <button style={{width: "100%", marginTop: "2.5rem", background:"#443d81", padding:"12px", borderRadius:"5px", color:"white"}}>LOGIN</button>
                                    </div>
                                </form>
                            </div>
                        </IonCard>
                        <p style={{textAlign:"center",margin:"auto", marginBottom:"rem", color:"grey", fontSize:"13px"}}>&copy; 2024 Stanificent Global Technologies LTD. All rights reserved.</p>
                    </div>
                    <div className={style.photo}>
                        <img src={pics}></img>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    )
}


export default Login;