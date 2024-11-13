import { IonHeader, IonMenuButton } from "@ionic/react";
import React, { useState } from "react";
import style from './Header.module.css';
import useUserInfo from "../hooks/useUserInfo";
import SideNav from "./SideNav";
import {  useHistory } from "react-router-dom";

const Header: React.FC = () => {
  const { userName, employeeTag, userRole } = useUserInfo(); 
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const history =  useHistory(); // Hook for navigating

  const handleMenuOpen = () => {
    setMenuIsOpen(true);
  };

  const handleMenuClose = () => {
    setMenuIsOpen(false);
  };

  const handleNavigation = (path: string) => {
    history.push(path); // Handle navigation
  };

  return (
    <IonHeader>
      <SideNav 
        contentId="dashboard-content" 
        onMenuOpen={handleMenuOpen} 
        onMenuClose={handleMenuClose} 
        onNavigate={handleNavigation}  // Passing onNavigate function here
      />
      <div className={style.headCont}>
        <div className={style.title}>
          <IonMenuButton />
        </div> 
        <div className={style.stat}>
          <div className={style.name}>{userName}</div>
          <div className={style.role}>{userRole}</div>
        </div>
      </div>
    </IonHeader>
  );
};

export default Header;
