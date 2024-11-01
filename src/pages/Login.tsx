import { IonContent, IonPage, IonIcon, IonToggle, IonCard, IonLoading, IonToast } from "@ionic/react"
import React, { useState } from "react";
import { personSharp, lockClosedSharp } from 'ionicons/icons';
import style from "./style/Login.module.css";
import { useHistory } from 'react-router-dom';
import { useSession } from '../hooks/useSession';

interface UserCredentials {
    login_id: string;
    password: string;
}

interface UserInfo {
    username: string;
    employee_tag: string;
    phoneNumber: string;
    role: string;
    hire_date: string;
    position: string;
}

const Login: React.FC = () => {
    const navigate = useHistory();
    const { isAuthenticated, loading, logout } = useSession();
    const [loginId, setLoginId] = useState("");
    const [password, setPassword] = useState("");
    const [keepLoggedIn, setKeepLoggedIn] = useState(false);
    const [toast, setToast] = useState(false);
    const [toastText, setToastText] = useState("");
    const [load, setLoad] = useState<boolean>(false);
    const apiUrl = "https://stanificentglobal.com/api/login.php";

    const hashPassword = async (password: string) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hash = await window.crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hash));
        return hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
    };

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();

        const loginData = {
            login_id: loginId,
            password: password
        };

        if (navigator.onLine) {
            try {
                const response = await fetch(apiUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(loginData),
                    credentials: "include"
                });

                const data = await response.json();
                if (data.success) {
                    const userInfo: UserInfo = {
                        username: data.user.username,
                        employee_tag: data.user.tag,
                        phoneNumber: data.user.phoneNumber,
                        role: data.user.role,
                        hire_date: data.user.hire_date,
                        position: data.user.position
                    };

                    sessionStorage.setItem("session_token", data.session_token);
                    sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
                    sessionStorage.setItem("userRole", JSON.stringify(userInfo.role));

                    if (keepLoggedIn) {
                        const storedUsers = localStorage.getItem("user_credentials");
                        const users: UserCredentials[] = storedUsers ? JSON.parse(storedUsers) : [];

                        const existingUserIndex = users.findIndex(u => u.login_id === loginId);
                        if (existingUserIndex !== -1) {
                            const hashedPassword = await hashPassword(password);
                            users[existingUserIndex].password = hashedPassword;
                        } else {
                            const hashedPassword = await hashPassword(password);
                            users.push({ login_id: loginId, password: hashedPassword });
                        }

                        localStorage.setItem("user_credentials", JSON.stringify(users));
                        localStorage.setItem(`user_info_${loginId}`, JSON.stringify(userInfo));
                    }

                    setToastText("Login successful");
                    setToast(true);
                    navigate.push("/dashboard");
                } else {
                    setToastText(data.error || "Login failed");
                    setToast(true);
                }
            } catch (error) {
                handleLoginWithStoredCredentials(loginId);
            }
        } else {
            handleLoginWithStoredCredentials(loginId);
        }
    };

    const handleLoginWithStoredCredentials = async (loginId: string) => {
        const storedCredentials = localStorage.getItem("user_credentials");
        const users: UserCredentials[] = storedCredentials ? JSON.parse(storedCredentials) : [];

        const user = users.find(u => u.login_id === loginId);
        const savedInfo = localStorage.getItem(`user_info_${loginId}`);

        if (user) {
            const hashedPassword = await hashPassword(password);
            if (hashedPassword === user.password) {
                sessionStorage.setItem("session_token", "offline");

                if (savedInfo) {
                    sessionStorage.setItem("userInfo", savedInfo);
                }
                
                setToastText("Login successful (offline)");
                setToast(true);
                navigate("/dashboard");
                setLoad(false);
            } else {
                setToastText("Incorrect password. Please try again.");
                setLoad(false)
                setToast(true);
            }
        } else {
            setToastText("User not found. Please register.");
            setLoad(false);
            setToast(true);
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        handleLogin(event);
    };

    const pics = 'web.png';

    return (
        <IonPage>
            <IonContent>
                <div className={style.content}>
                    <div className={style.container}>
                        <h1 style={{ fontWeight: "bolder", color: "black", fontSize: "2rem" }}>POS SOFTWARE</h1>
                        <p>STANIFICENT GLOBAL TECHNOLOGIES LTD</p>
                        <IonCard className={style.card}>
                            <div className={style.formField}>
                                <h1 style={{ fontWeight: "bolder", color: "black", fontSize: "1.6rem" }}>LOGIN</h1>
                                <form onSubmit={handleSubmit}>
                                    <div className={style.input}>
                                        <div className={style.icon}>
                                            <IonIcon icon={personSharp} />
                                        </div>
                                        <input
                                            value={loginId}
                                            onChange={(e) => setLoginId(e.target.value)}
                                            className={style.field}
                                            type="text"
                                            placeholder="Username"
                                        />
                                    </div>
                                    <div className={style.input}>
                                        <div className={style.icon}>
                                            <IonIcon icon={lockClosedSharp} />
                                        </div>
                                        <input
                                            className={style.field}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            type="password"
                                            placeholder="Password"
                                        />
                                    </div>
                                    <div className={style.keep}>
                                        <p>Keep me logged in</p>
                                        <IonToggle
                                            checked={keepLoggedIn}
                                            onIonChange={(e) => setKeepLoggedIn(e.detail.checked)}
                                        />
                                    </div>
                                    <div>
                                        <button
                                            style={{ width: "100%", marginTop: "2.5rem", background: "#443d81", padding: "12px", borderRadius: "5px", color: "white" }}
                                            id="loadered"
                                        >
                                            Login
                                        </button>
                                    </div>
                                    <div>
                                        <IonLoading className="loading" isOpen={load} trigger="loadered" message="Logging in" duration={5000} />
                                    </div>
                                </form>
                            </div>
                        </IonCard>
                        <p style={{ textAlign: "center", margin: "auto", marginBottom: "rem", color: "grey", fontSize: "13px" }}>
                            &copy; 2024 Stanificent Global Technologies LTD. All rights reserved.
                        </p>
                    </div>
                    <div className={style.photo}>
                        <img src={pics} alt="Logo" />
                    </div>
                </div>
                <IonToast
                    isOpen={toast}
                    message={toastText}
                    onDidDismiss={() => setToast(false)}
                    duration={5000}
                />
            </IonContent>
        </IonPage>
    );
}

export default Login;
