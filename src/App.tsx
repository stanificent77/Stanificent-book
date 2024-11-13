import React, { useEffect, useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react"
import { IonReactRouter } from "@ionic/react-router"
import Login from './pages/Login';
import useTokenValidation from './hooks/useTokenValidation';
import {  useHistory } from "react-router-dom";
import { SplashScreen } from '@capacitor/splash-screen';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Ionic Dark Mode */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import Register from './pages/Register';
import ContractorList from './pages/ContractorList';
import Tracker from './pages/Tracker';
import Dashboard from './pages/Dashboard';
import Suppliers from './pages/Suppliers';
import SideNav from './components/SideNav';
import Dash from './pages/Dash';
import AddEmployee from './pages/AddEmployee';
import Customer from './pages/Customer';
import CustomerList from './pages/CustomerList';
import TrackerList from './pages/TrackerList';
import EmployeeList from './pages/EmployeeList';
import CustomSplashScreen from './components/CustomSplashScreen';
import {useSession}   from '../src/hooks/useSession';
import { defineCustomElements } from "@ionic/pwa-elements/dist/loader";
import SupplierList from './pages/SupplierList';
import Partner from './pages/Partner';
import PartnerList from './pages/PartnerList';
import Contractor from './pages/Contractor';
import ExcelImport from './components/ExcelImport';
import Import from './pages/Import';

setupIonicReact();

const App: React.FC = () => {


  useEffect(() => {
    SplashScreen.hide(); // Hide splash screen immediately
  }, []);


  const history =  useHistory();
  const token = localStorage.getItem('token') || '';
  const [errors, setErrors] = useState<string[]>([]);
  
  // Validate the token and manage authentication state
  if(navigator.onLine){
  useTokenValidation(token, setErrors);
  }else{
    console.log("Token cant be validated while offline")
  }
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    // Simulate app initialization, such as loading data or performing setup tasks
    setTimeout(() => {
      setIsAppReady(true);
    }, 5000); // This should match the GIF display duration
  }, []);

  return (
    <IonApp>
      {isAppReady ? (
        <IonReactRouter>
          <IonRouterOutlet id="dashboard-content">
            <Route exact   path="/">
              <Login />
            </Route>
            <Route exact   path="/login">
              <Login />
            </Route>
            <Route exact   path="/register">
              <Register />
            </Route>
            <Route exact   path="/tracker">
              <Tracker />
            </Route>
            <Route exact   path="/dashboard">
              <Dashboard />
            </Route>
            <Route exact   path='/addemployee'>
              <AddEmployee />
            </Route>
            <Route exact   path='/customer'>
              <Customer />
            </Route>
            <Route exact   path='/trackerlist'>
              <TrackerList />
            </Route>
            <Route exact   path='/employeelist'>
              <EmployeeList />
            </Route>
            <Route exact   path='/customerlist'>
              <CustomerList />
            </Route>
            <Route exact   path='/addsuppliers'>
              <Suppliers/>
            </Route>
            <Route exact   path='/supplierlist'>
              <SupplierList/>
            </Route>
            <Route exact   path='/partner'>
              <Partner/>
            </Route>
            <Route exact   path='/partnerlist'>
              <PartnerList/>
            </Route>
            <Route exact   path='/contractor'>
              <Contractor/>
            </Route>
            <Route exact   path='/contractorlist'>
              <ContractorList/>
            </Route>
            <Route exact   path='/excelimport'>
              <ExcelImport/>
            </Route>
            <Route exact   path='/dash'>
              <Dash />
            </Route>
            <Route exact   path='/import'>
              <Import/>
            </Route>
          </IonRouterOutlet>
        </IonReactRouter>
      ) : (
        <CustomSplashScreen />
      )}
    </IonApp>
  );
};

export default App;
