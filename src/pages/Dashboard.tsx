import { IonPage, IonContent, IonButton, IonIcon } from "@ionic/react";
import React, { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';
import { copySharp, cartSharp, todaySharp, calendarClearSharp } from 'ionicons/icons';
import style from "./style/Dashboard.module.css";
import Header from "../components/Header";
import Logout from "../components/Logout";
import useUserInfo from "../hooks/useUserInfo";

const Dashboard: React.FC = () => {
    const { userName, employeeTag } = useUserInfo(); 

  return (
    <IonPage>
      <Header />
      <IonContent className={style.content}>
        <div className={style.firstBlock}>
          <div className={style.firstContent}>
            <div>
              <span className={style.userName}>{userName},</span>
              <span className={style.write}> here's what's happening with your sales overview.</span>
            </div>
            <div className={style.tag}>
              <div>
                <IonIcon style={{ border: "0px solid black", padding: "5px", borderRadius: "4px", background: "#2e6e80" }} icon={copySharp} />
              </div>
              <div>
                <div>Employee ID</div>
                <div>{employeeTag}</div>
              </div>
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
            <IonButton className={style.but} routerLink="/addemployee">Add employees</IonButton>
          </div>
          <div className={style.contentBut}>
            <IonButton className={style.but} routerLink="/trackerlist">Tracker List</IonButton>
            <IonButton className={style.but} routerLink="/customerlist">Customer List</IonButton>
            <IonButton className={style.but} routerLink="/employeelist">Employees List</IonButton>
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
