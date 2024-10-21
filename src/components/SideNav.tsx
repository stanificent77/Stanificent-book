import React from 'react';
import { IonMenu, IonContent, IonHeader, IonItem } from '@ionic/react';
import menu from './SideNav.module.css';

interface MenuProps {
  contentId: string;
  onNavigate: (path: string) => void; // Add onNavigate for navigation
  onMenuOpen?: () => void; // Optional prop for menu open
  onMenuClose?: () => void; // Optional prop for menu close
}

const SideNav: React.FC<MenuProps> = ({ contentId, onNavigate, onMenuOpen, onMenuClose }) => {
  return (
    <IonMenu 
      contentId={contentId}
      onIonDidOpen={onMenuOpen} // Use onMenuOpen when menu opens
      onIonDidClose={onMenuClose} // Use onMenuClose when menu closes
    >
      <IonHeader>
        {/* Your custom header content */}
      </IonHeader>
      <IonContent className={menu.menulist} style={{ height: "100vh", paddingTop: "2rem" }}>
        <div className={menu.menuItem}>
          <IonItem button onClick={() => onNavigate('/customer')}>
            Add Customer
          </IonItem>
        </div>
        <div className={menu.menuItem}>
          <IonItem button onClick={() => onNavigate('/add-tracker')}>
            Add Tracker
          </IonItem>
        </div>
        <div className={menu.menuItem}>
          <IonItem button onClick={() => onNavigate('/customers-list')}>
            Customers List
          </IonItem>
        </div>
        <div className={menu.menuItem}>
          <IonItem button onClick={() => onNavigate('/trackers-list')}>
            Trackers List
          </IonItem>
        </div>

        {/* Conditional Rendering for Admin Role */}
        <div className={menu.subhead}>ADMIN</div>
        <div className={menu.menuItem}>
          <IonItem button onClick={() => onNavigate('/addemployee')}>
            Add Employee
          </IonItem>
        </div>
        <div className={menu.menuItem}>
          <IonItem button onClick={() => onNavigate('/employeelist')}>
            Employees List
          </IonItem>
        </div>
      </IonContent>
    </IonMenu>
  );
};

export default SideNav;
