import React from "react";
import { IonIcon } from '@ionic/react';
import {chevronBack} from 'ionicons/icons';
import { Style } from "@capacitor/status-bar";
import style from './BackButton.module.css';
import { useHistory } from 'react-router-dom';


const BackButton: React.FC = () => {

    const history = useHistory();

    const goBack = () => {
      history.goBack();
    };

    return(
        <div className={style.but}>
            <div onClick={goBack} className={style.chev}>
                <IonIcon icon={chevronBack}/>
            </div>
        </div>
    )
}

export default BackButton;