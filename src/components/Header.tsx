import { IonPage, IonHeader, IonIcon, IonToolbar, IonButton, IonContent, IonTab } from "@ionic/react";
import React, {useEffect, useState} from "react";
import style from './Header.module.css';
import { personSharp, lockClosedSharp, settingsOutline, menuOutline } from 'ionicons/icons';
import useUserInfo from "../hooks/useUserInfo";

const Header: React.FC = () => {

      
    const { userName, employeeTag, userRole } = useUserInfo(); 


    const logo = 'StanLogo.png';
    return(
            <IonHeader>
                    <div className={style.headCont}>
                        <div className={style.title}>
                            <div className={style.logo}>
                                <img src={logo}></img>
                            </div>
                            <div className={style.tag} style={{fontFamily:"cursive"}}>
                                POS SYSTEM
                            </div>
                        </div> 
                        <div className={style.stat}>
                            <div className={style.name}>{userName}</div>
                            <div className={style.role}>{userRole}</div>
                        </div>
                    </div>
            </IonHeader>
    )
}

export default Header;