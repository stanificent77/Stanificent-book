import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact, IonSplitPane } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import Login from './pages/Login';

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

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import Register from './pages/Register';
import Tracker from './pages/Tracker';
import Dashboard from './pages/Dashboard';
import SideNav from './components/SideNav';
import Dash from './pages/Dash';
import AddEmployee from './pages/AddEmployee';
import Customer from './pages/Customer';
import CustomerList from './pages/CustomerList';
import TrackerList from './pages/TrackerLIst';
import EmployeeList from './pages/EmployeeList';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/home">
          <Home />
        </Route>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/register">
          <Register />
        </Route>
        <Route exact path="/tracker">
          <Tracker />
        </Route>
        <Route exact path="/dashboard">
          <Dashboard />
        </Route>
        <Route exact path="/nav">
          <SideNav />
        </Route>
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>
        <Route exact path='/addemployee'>
          <AddEmployee/>
        </Route>
        <Route exact path='/customer'>
          <Customer/>
        </Route>
        <Route exact path='/trackerlist'>
          <TrackerList/>
        </Route>
        <Route exact path='/employeelist'>
          <EmployeeList/>
        </Route>
        <Route exact path='/customerlist'>
          <CustomerList/>
        </Route>
        <Route exact path='/dash'>
          <Dash/>
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
