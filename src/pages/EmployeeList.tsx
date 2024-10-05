import React from 'react';
import {IonPage} from '@ionic/react';
import Header from '../components/Header';
import useUserInfo from "./hooks/useUserInfo";

const EmployeeList: React.FC = () => {

    const { userName, employeeTag } = useUserInfo();

    return(
        <IonPage>
            <Header/>
        </IonPage>
    )
}

export default EmployeeList;