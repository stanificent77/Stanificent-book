// pages/AddEmployee.tsx
import React, { useState } from "react";
import { IonPage, IonContent, IonButton, IonInput, IonToast, IonCheckbox, IonLabel } from "@ionic/react";
import { IonIcon } from "@ionic/react";
import { addCircleSharp, arrowBack, informationCircleOutline } from "ionicons/icons";
import style from './style/AddEmployee.module.css';
import BackButton from "../components/BackButton";
import { useSession } from "../hooks/useSession";
import useUserInfo from "../hooks/useUserInfo";
import useOfflineSync from "../hooks/useOfflineSync";
import PrivilegeSelector from "../components/PrivilegeSelector";
import 'react-datepicker/dist/react-datepicker.css';

const AddEmployee: React.FC = () => {
  const { isAuthenticated, loading, checkSession, logout } = useSession();
  const token = sessionStorage.getItem("session_token") || "";
  const [errors, setErrors] = useState<string[]>([]);
  const [toast, setToast] = useState(false);
  const [toastText, setToastText] = useState("");

  const { userName, employeeTag } = useUserInfo();
  const { saveDataOffline } = useOfflineSync();

  // Employee form states
  const [username, setUsername] = useState("");
  const [employmentDate, setEmploymentDate] = useState("");
  const [position, setPosition] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("user");
  const [privileges, setPrivileges] = useState<Record<string, string[]>>({
    VIEW: [],
    ADD: [],
    EDIT: [],
    DELETE: [],
    IMPORT: [],
    EXPORT: [],
    "LIST SECTIONS": [],
    "DATABASE SECTIONS": [],
  });

  const endpoint = "http://localhost/pos-endpoint/addemployee.php";

  // Form submission data
  const employeeData = {
    username: username,
    email: email,
    employment_date: employmentDate,
    position: position,
    role: role,
    phoneNumber: phoneNumber,
    password: password,
    confirm_password: confirmPassword,
    privileges: privileges, // Add privileges to the employee data
  };

  const clearFormFields = () => {
    setUsername("");
    setEmploymentDate("");
    setPosition("");
    setPassword("");
    setConfirmPassword("");
    setEmail("");
    setPhoneNumber("");
    setRole("user");
    setPrivileges({
      VIEW: [],
      ADD: [],
      EDIT: [],
      DELETE: [],
      IMPORT: [],
      EXPORT: [],
      "LIST SECTIONS": [],
      "DATABASE SECTIONS": [],
    });
  };

  const handlePrivilegesChange = (updatedPrivileges: Record<string, string[]>) => {
    setPrivileges(updatedPrivileges);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (navigator.onLine) {
      // Online submission
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(employeeData),
        });

        const data = await response.json();
        setToastText(data.message);
        setToast(true);
        clearFormFields();
      } catch (error) {
        console.error("Error:", error);
        setToastText("An error occurred during registration.");
        setToast(true);
      }
    } else {
      // Offline save
      saveDataOffline(employeeData, endpoint);
      setToastText("You are offline. Employee data saved locally and will sync when online.");
      setToast(true);
      clearFormFields();
    }
  };

  return (
    <IonPage>
      <BackButton />
      <IonContent className={style.container}>
        <div className={style.topic}>
          <div className={style.employee}>
            <div className={style.new}>New Employee</div>
            <div className={style.createnew}>Create new employee</div>
          </div>
          <div>
            <IonButton className={style.employeebut} routerLink="/employeelist">
              <IonIcon icon={arrowBack} /> Employees List
            </IonButton>
          </div>
        </div>

        <div className={style.field}>
          <form onSubmit={handleSubmit}>
            <div className={style.cont}>
              <div style={{ display: "flex", alignItems: "center", borderBottom: "1px solid grey", paddingBlock: ".5rem" }}>
                <IonIcon icon={informationCircleOutline} />
                Employee Information
              </div>

              {/* Employee Information Fields */}
              <div className={style.line}>
                <div className={style.inputs}>
                  <div className={style.head}>Username</div>
                  <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div className={style.inputs}>
                  <div className={style.head}>Position</div>
                  <input type="text" value={position} onChange={(e) => setPosition(e.target.value)} required />
                </div>
                <div className={style.inputs}>
                  <div className={style.head}>Email</div>
                  <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </div>

              <div className={style.line}>
                <div className={style.inputs}>
                  <div className={style.head}>Role</div>
                  <select
                    style={{ width: "85%", height: "30px", textAlign: "center", outline:"none" }}
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                  >
                    <option>User</option>
                    <option>Admin</option>
                  </select>
                </div>
                <div className={style.inputs}>
                  <div className={style.head}>Phone</div>
                  <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
                </div>
                <div className={style.inputs}>
                  <div className={style.head}>Employment Date</div>
                  <input
                    placeholder="DD/MM/YYYY"
                    type="date"
                    value={employmentDate}
                    onChange={(e) => setEmploymentDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className={style.line}>
                <div className={style.inputs}>
                  <div className={style.head}>Password</div>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div className={style.inputs}>
                  <div className={style.head}>Confirm Password</div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Privileges Selector */}
              <PrivilegeSelector selectedPrivileges={privileges} onPrivilegesChange={handlePrivilegesChange} />

              {/* Submit Button */}
              <IonButton type="submit" expand="block" className={style.submit}>
                <IonIcon icon={addCircleSharp} /> Add Employee
              </IonButton>
            </div>
          </form>
        </div>

        {/* Toast */}
        <IonToast isOpen={toast} message={toastText} duration={2000} onDidDismiss={() => setToast(false)} />
      </IonContent>
    </IonPage>
  );
};

export default AddEmployee;
