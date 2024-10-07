import React, { useEffect, useState } from 'react';
import { IonPage, IonContent } from '@ionic/react';
import Header from '../components/Header';
import useUserInfo from "../hooks/useUserInfo";

const Dash: React.FC = () => {

    const { userName, employeeTag, userRole, phoneNumber, hireDate } = useUserInfo();

    return (
        <IonPage>
            <Header />
            <IonContent>
                <h1>Welcome, {userName}</h1>
                <p>Your role: {userRole}</p>
                <p>Phone Number: {phoneNumber}</p>
                <p>Employee Tag: {employeeTag}</p>
                <p>Hire Date: {hireDate}</p>
            </IonContent>
        </IonPage>
    );
};

export default Dash;
