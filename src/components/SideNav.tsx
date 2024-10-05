import React from 'react';
import { IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel } from '@ionic/react';
import { useHistory } from 'react-router-dom';

const SideNav: React.FC = () => {
  const history = useHistory();

  const handleNavigation = (path: string) => {
    history.push(path);
  };

  return (
    <IonMenu side="start" contentId="main-content">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Sidenav</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem button onClick={() => handleNavigation('/dashboard')}>
            <IonLabel>Dashboard</IonLabel>
          </IonItem>
          <IonItem button onClick={() => handleNavigation('/profile')}>
            <IonLabel>Profile</IonLabel>
          </IonItem>
          <IonItem button onClick={() => handleNavigation('/settings')}>
            <IonLabel>Settings</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default SideNav;
