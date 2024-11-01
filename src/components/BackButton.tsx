import React from "react";
import { IonIcon } from "@ionic/react";
import { chevronBack } from 'ionicons/icons';
import style from './BackButton.module.css';
import { useHistory } from 'react-router-dom';

const BackButton: React.FC = () => {
    const history = useHistory(); // Get the history object

    const goBack = () => {
        // Check if history is defined and has goBack method
        if (history && typeof history.goBack === "function") {
            history.goBack();
        } else {
           history.push('/dashboard');
        }
    };

    return (
        <div className={style.but}>
            <div onClick={goBack} className={style.chev}>
                <IonIcon icon={chevronBack} />
            </div>
        </div>
    );
};

export default BackButton;
