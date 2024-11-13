import { IonPage, IonContent, IonButton, IonIcon, IonMenuButton } from "@ionic/react";
import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import { todaySharp, calendarClearSharp, cartSharp } from 'ionicons/icons';
import style from "./style/Dashboard.module.css";
import useUserInfo from "../hooks/useUserInfo";
import { useSession } from '../hooks/useSession';
import SideNav from "../components/SideNav";
import useTokenValidation from '../hooks/useTokenValidation'; 
import Logout from "../components/Logout";
import { hasPrivilege } from "../utils/HasPrivilege"; // Assuming this function checks for privileges

const Dashboard: React.FC = () => {
  const history = useHistory();

  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [toast, setToast] = useState(false);
  const [toastText, setToastText] = useState("");

  const token = localStorage.getItem('token') || '';
  const [errors, setErrors] = useState<string[]>([]);

  if (navigator.onLine) {
    useTokenValidation(token, setErrors);
  } else {
    console.log("Offline!. Token can't be validated while offline");
  }

  const handleMenuOpen = () => {
    setMenuIsOpen(true);
  };

  const handleMenuClose = () => {
    setMenuIsOpen(false);
  };

  // This function handles navigation when the user clicks on a menu item
  const handleNavigation = (path: string) => {
    history.push(path);
  };

  const { userName, employeeTag } = useUserInfo();
  const userRole = JSON.parse(sessionStorage.getItem("userRole") || '""');

  // Example function to render buttons based on privileges
  const renderButtonBasedOnPrivilege = (privilege: string, section: string, path: string, label: string) => {
    // Use 'view' privilege to check if the user can view this section
    if (hasPrivilege(userRole, 'view', section)) {
      return <IonButton className={style.but} routerLink={path}>{label}</IonButton>;
    }
    return null;  // Return null if the user doesn't have the privilege
  };

  return (
    <IonPage id="dashboard-content" onClick={handleMenuClose}>
      <SideNav 
        contentId="dashboard-content" 
        onMenuOpen={handleMenuOpen} 
        onMenuClose={handleMenuClose} 
        onNavigate={handleNavigation}  // Pass the history function here
      />
      <IonContent className={style.content}>
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
            {renderButtonBasedOnPrivilege('view', 'Tracker', '/tracker', 'Tracker database')}
            {renderButtonBasedOnPrivilege('view', 'Customer', '/customer', 'Customer database')}
            {renderButtonBasedOnPrivilege('view', 'Employee', '/addemployee', 'Add employees')}
            {renderButtonBasedOnPrivilege('view', 'Supplier', '/addsuppliers', 'Add Supplier')}
            {renderButtonBasedOnPrivilege('view', 'Partner', '/partner', 'Add Partners')}
            {renderButtonBasedOnPrivilege('view', 'Contractor', '/contractor', 'Add Contractors / Freelancers')}
          </div>
          <div className={style.contentBut}>
            {renderButtonBasedOnPrivilege('view', 'Tracker List', '/trackerlist', 'Tracker List')}
            {renderButtonBasedOnPrivilege('view', 'Customer List', '/customerlist', 'Customer List')}
            {renderButtonBasedOnPrivilege('view', 'Employee List', '/employeelist', 'Employees List')}
            {renderButtonBasedOnPrivilege('view', 'Supplier List', '/supplierlist', 'Supplier List')}
            {renderButtonBasedOnPrivilege('view', 'Partner List', '/partnerlist', 'Partner List')}
            {renderButtonBasedOnPrivilege('view', 'Contractor List', '/contractorlist', 'Contractors / Freelancers List')}
          </div>
          <div className={style.contentBut}>
            {renderButtonBasedOnPrivilege('IMPORT', 'Excel Import', '/import', 'Import Database table')}
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
