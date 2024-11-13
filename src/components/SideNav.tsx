import React from 'react';
import { IonMenu, IonContent, IonHeader, IonItem } from '@ionic/react';
import menu from './SideNav.module.css';
import { useHistory } from 'react-router-dom';

interface MenuProps {
  contentId: string;
  onNavigate: (path: string) => void; // Add onNavigate for navigation
  onMenuOpen?: () => void; // Optional prop for menu openhi
  onMenuClose?: () => void; // Optional prop for menu close
  isAdmin?: boolean; // Prop to check if the user is an admin
}

const SideNav: React.FC<MenuProps> = ({ contentId, onNavigate, onMenuOpen, onMenuClose, isAdmin }) => {

const history = useHistory();
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
          <IonItem button onClick={() => history.push('/customer')}>
            Add Customer
          </IonItem>
        </div>
        <div className={menu.menuItem}>
          <IonItem button onClick={() => history.push('/add-tracker')}>
            Add Tracker
          </IonItem>
        </div>
        <div className={menu.menuItem}>
          <IonItem button onClick={() => history.push('/customers-list')}>
            Customers List
          </IonItem>
        </div>
        <div className={menu.menuItem}>
          <IonItem button onClick={() => history.push('/trackers-list')}>
            Trackers List
          </IonItem>
        </div>

        {/* Conditional Rendering for Admin Role */}
        {isAdmin && (
          <>
            <div className={menu.subhead}>ADMIN</div>
            <div className={menu.menuItem}>
              <IonItem button onClick={() => history.push('/addemployee')}>
                Add Employee
              </IonItem>
            </div>
            <div className={menu.menuItem}>
              <IonItem button onClick={() => history.push('/employeelist')}>
                Employees List
              </IonItem>
            </div>
          </>
        )}
      </IonContent>
    </IonMenu>
  );
};

export default SideNav;
