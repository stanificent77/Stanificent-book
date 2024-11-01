import { IonPage, IonContent, IonButton, IonIcon, IonMenuButton, IonToast } from "@ionic/react";
import React, { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';
import { todaySharp, calendarClearSharp, cartSharp } from 'ionicons/icons';
import style from "./style/Dashboard.module.css";
import useUserInfo from "../hooks/useUserInfo";
import { useSession } from '../hooks/useSession';
import SideNav from "../components/SideNav";
import useTokenValidation from '../hooks/useTokenValidation'; 
import Logout from "../components/Logout";

const Dashboard: React.FC = () => {
  const navigate = useHistory();
const {checkSession} = useSession();
  if(navigator.onLine){
  useEffect(() => {
    checkSession(); // Check the session when the component mounts
  }, [checkSession]);
  }

  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [toast, setToast] = useState(false);
  const [toastText, setToastText] = useState("")

  const token = localStorage.getItem('token') || '';
  const [errors, setErrors] = useState<string[]>([]);

if(navigator.onLine){
  useTokenValidation(token, setErrors);
}else{
  console.log("Offline!. Token can't be validate while online")
}



  const handleMenuOpen = () => {
    setMenuIsOpen(true);
  };

  const handleMenuClose = () => {
    setMenuIsOpen(false);
  };

  // This function handles navigation when the user clicks on a menu item
  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const { userName, employeeTag } = useUserInfo();
  const userRole = JSON.parse(sessionStorage.getItem("userRole") || '""');
  return (
    <IonPage id="dashboard-content">
      <SideNav 
        contentId="dashboard-content" 
        onMenuOpen={handleMenuOpen} 
        onMenuClose={handleMenuClose} 
        onNavigate={handleNavigation}  // Pass the onNavigate function here
      />
      <IonContent className={style.content} onClick={handleMenuClose}>
        <div className={style.header}>
          <div className={style.head}>
            <IonMenuButton />
          </div>
          <div className={style.employeeTag}>
            <div>
              Employee Tag ID: {employeeTag}
            </div>
          </div>
        </div>
        <div className={style.firstBlock}>
          <div className={style.firstContent}>
            <div>
              <span className={style.userName}>{userName},</span>
              <span className={style.write}> here's what's happening with your sales overview.</span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", width: "90%", margin: "auto", justifyContent: "space-around", marginTop: "1rem" }}>
          <div className={style.sale}>
            <div className={style.icon}>
              <IonIcon icon={todaySharp} />
            </div>
            <div>
              <div className={style.fig}>N0.00</div>
              <p>Today sales</p>
            </div>
          </div>
          <div className={style.sale}>
            <div className={style.icon}>
              <IonIcon icon={calendarClearSharp} />
            </div>
            <div>
              <div className={style.fig}>N0.00</div>
              <p>30days sales</p>
            </div>
          </div>
          <div className={style.sale}>
            <div className={style.icon}>
              <IonIcon icon={cartSharp} />
            </div>
            <div>
              <div className={style.fig}>N0.00</div>
              <p>Total sales</p>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "2rem" }}>
          <div className={style.contentBut}>
            <IonButton className={style.but} routerLink="/tracker">Tracker database</IonButton>
            <IonButton className={style.but} routerLink="/customer">Customer database</IonButton>
           {userRole === "admin" ? ( <IonButton className={style.but} routerLink="/addemployee">Add employees</IonButton>) : "" }
          </div>
          <div className={style.contentBut}>
            <IonButton className={style.but} routerLink="/trackerlist">Tracker List</IonButton>
            <IonButton className={style.but} routerLink="/customerlist">Customer List</IonButton>
           {userRole === "admin" ? (<IonButton className={style.but} routerLink="/employeelist">Employees List</IonButton>) : '' }
          </div>
          <div>
            <Logout />
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;
