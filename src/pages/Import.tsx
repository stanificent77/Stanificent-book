import { IonContent, IonHeader, IonPage } from "@ionic/react";
import React from "react";
import ImportExcel from "../components/ExcelImport";
import BackButton from "../components/BackButton";

const Import: React.FC = () => {

    return(
        <IonPage>
            <IonHeader style={{display: "flex"}}>
                <BackButton></BackButton>
            </IonHeader>
            <IonContent>
                <div style={{textAlign:"center"}}>
                    Import database table
                </div>
                <div>
                    <ImportExcel/>
                </div>
            </IonContent>
            
        </IonPage>
    )
}

export default Import;