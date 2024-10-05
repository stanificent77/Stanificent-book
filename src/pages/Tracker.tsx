import { IonPage, IonContent, IonIcon, IonButton } from "@ionic/react";
import { personSharp, lockClosedSharp, settingsOutline, informationCircleOutline, arrowBack } from 'ionicons/icons';
import Header from "../components/Header";
import React, { useState } from "react";
import style from './style/Tracker.module.css';
import useUserInfo from "./hooks/useUserInfo";

const Tracker: React.FC = () => {
    const { userName, employeeTag } = useUserInfo();

    const initialFormState = {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        phoneNumber2: '',
        occupation: '',
        address: '',
        vehicleName: '',
        vehicleColor: '',
        vehiclePlate: '',
        engineNumber: '',
        chassisNumber: '',
        installerName: '',
        installerNumber: '',
        installerLocation: '',
        imei: '',
        amount: '',
        subscription: '',
        dateInstalled: '',
        deviceNumber: '',
        category: '',
        description: '',
        otherInformation:'',
        referralName: '',
        referralNumber: ''
    };

    const clearForm = () => {
        setFormData(initialFormState);
    };

    // State to hold form data
    const [formData, setFormData] = useState(initialFormState);

    // Handle form field changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Log form data to check values before submitting
        console.log("Submitting form data:", formData);

        try {
            const response = await fetch("http://localhost/pos-endpoint/track.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                // Inspect response status for further debugging
                console.error(`Error submitting form. Status: ${response.status}`);
                const errorData = await response.text();
                console.error("Response body:", errorData);
            } else {
                const data = await response.json();
                console.log("Form submitted successfully", data);
                // Clear form after successful submission
                clearForm();
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    return(
        <IonPage>
            <Header/>
            <IonContent>
                <div style={{width: "90%", margin:"auto", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                    <div style={{marginTop:"1rem"}}>
                        <div style={{fontSize:"20px", fontWeight:"bold"}}>Tracker Details</div>
                        <div>Enter tracker details below</div>
                    </div>
                    <div>
                        <IonButton className={style.employeebut} routerLink="/trackerlist"> <IonIcon icon={arrowBack} /> Tracker List</IonButton>
                    </div>
                </div>
                <form style={{width:"95%", margin:"auto"}} onSubmit={handleSubmit}>
                    <div style={{margin:"auto", marginTop:"1rem", borderRadius:"5px", border:'1px solid rgba(163, 160, 160, 0.621)', paddingBlock:"15px"}}>
                        <div className={style.cust}>
                            <div style={{borderBottom:"1px solid rgba(163, 160, 160, 0.621)", paddingBottom:"10px", width:"95%", margin:"auto"}}>
                                <div className={style.inputTitle}>
                                    <IonIcon style={{fontSize:"17px", color:"gold"}} icon={informationCircleOutline}/>
                                    Customer Details
                                </div>
                            </div>
                            
                            <div className={style.flex}>
                                <div className={style.inputbox}>
                                    <div style={{fontWeight:"600", marginBottom:"10px"}}>First Name</div>
                                    <input required type="text" name="firstName" onChange={handleChange} value={formData.firstName} style={{height:"40px", width:"100%", outline:"none", padding:"7px", border:"1px solid rgba(163, 160, 160, 0.621)", borderRadius:"3px"}}/>
                                </div>
                                <div className={style.inputbox}>
                                    <div style={{fontWeight:"600", marginBottom:"10px"}}>Last Name</div>
                                    <input required type="text" name="lastName" onChange={handleChange} value={formData.lastName} style={{height:"40px", width:"100%", outline:"none", padding:"7px", border:"1px solid rgba(163, 160, 160, 0.621)", borderRadius:"3px"}}/>
                                </div>
                                <div className={style.inputbox}>
                                    <div style={{fontWeight:"600", marginBottom:"10px"}}>Email Address</div>
                                    <input required type="email" name="email" onChange={handleChange} value={formData.email} style={{height:"40px", width:"100%", outline:"none", padding:"7px", border:"1px solid rgba(163, 160, 160, 0.621)", borderRadius:"3px"}}/>
                                </div>
                            </div>

                            <div className={style.flex}>
                                <div className={style.inputbox}>
                                    <div style={{fontWeight:"600", marginBottom:"10px"}}>Phone Number</div>
                                    <input required type="text" name="phoneNumber" onChange={handleChange} value={formData.phoneNumber} style={{height:"40px", width:"100%", outline:"none", padding:"7px", border:"1px solid rgba(163, 160, 160, 0.621)", borderRadius:"3px"}}/>
                                </div>

                                <div className={style.inputbox}>
                                    <div style={{fontWeight:"600", marginBottom:"10px"}}>Other Phone Number</div>
                                    <input required type="text" name="phoneNumber2" onChange={handleChange} value={formData.phoneNumber2} style={{height:"40px", width:"100%", outline:"none", padding:"7px", border:"1px solid rgba(163, 160, 160, 0.621)", borderRadius:"3px"}}/>
                                </div>

                                <div className={style.inputbox}>
                                    <div style={{fontWeight:"600", marginBottom:"10px"}}>Address</div>
                                    <input required type="text" name="address" onChange={handleChange} value={formData.address} style={{height:"40px", width:"100%", outline:"none", padding:"7px", border:"1px solid rgba(163, 160, 160, 0.621)", borderRadius:"3px"}}/>
                                </div>
                            </div>

                            <div className={style.flex}>

                                <div className={style.inputbox}>
                                    <div style={{fontWeight:"600", marginBottom:"10px"}}>Occupation</div>
                                    <input required type="text" name="occupation" onChange={handleChange} value={formData.occupation} style={{height:"40px", width:"100%", outline:"none", padding:"7px", border:"1px solid rgba(163, 160, 160, 0.621)", borderRadius:"3px"}}/>
                                </div>

                                <div className={style.inputbox}>
                                    
                                    
                                </div>

                                <div className={style.inputbox}>
                                    
                                    
                                </div>
                            </div>
                        </div>


                        <div className={style.cust}>
                        <div style={{borderBottom:"1px solid rgba(163, 160, 160, 0.621)", paddingBottom:"10px", width:"95%", margin:"auto"}}>
                                <div className={style.inputTitle}>
                                    <IonIcon style={{fontSize:"17px", color:"gold"}} icon={informationCircleOutline}/>
                                    Vehicle Details
                                </div>
                            </div>
                            
                            <div className={style.flex}>
                                <div className={style.inputbox}>
                                    <div style={{fontWeight:"600", marginBottom:"10px"}}>Vehicle Name / Model</div>
                                    <input required type="text" name="vehicleName" onChange={handleChange} value={formData.vehicleName} style={{height:"40px", width:"100%", outline:"none", padding:"7px", border:"1px solid rgba(163, 160, 160, 0.621)", borderRadius:"3px"}}/>
                                </div>
                                <div className={style.inputbox}>
                                    <div style={{fontWeight:"600", marginBottom:"10px"}}>Vehicle Color</div>
                                    <input required type="text" name="vehicleColor" onChange={handleChange} value={formData.vehicleColor} style={{height:"40px", width:"100%", outline:"none", padding:"7px", border:"1px solid rgba(163, 160, 160, 0.621)", borderRadius:"3px"}}/>
                                </div>
                                <div className={style.inputbox}>
                                    <div style={{fontWeight:"600", marginBottom:"10px"}}>Vehicle Plate Number</div>
                                    <input required type="text" name="vehiclePlate" onChange={handleChange} value={formData.vehiclePlate} style={{height:"40px", width:"100%", outline:"none", padding:"7px", border:"1px solid rgba(163, 160, 160, 0.621)", borderRadius:"3px"}}/>
                                </div>
                            </div>

                            <div className={style.flex}>
                                <div className={style.inputbox}>
                                    <div style={{fontWeight:"600", marginBottom:"10px"}}>Engine Number</div>
                                    <input required type="text" name="engineNumber" onChange={handleChange} value={formData.engineNumber} style={{height:"40px", width:"100%", outline:"none", padding:"7px", border:"1px solid rgba(163, 160, 160, 0.621)", borderRadius:"3px"}}/>
                                </div>
                                <div className={style.inputbox}>
                                    <div style={{fontWeight:"600", marginBottom:"10px"}}>Chassis Number</div>
                                    <input required type="text" name="chassisNumber" onChange={handleChange} value={formData.chassisNumber} style={{height:"40px", width:"100%", outline:"none", padding:"7px", border:"1px solid rgba(163, 160, 160, 0.621)", borderRadius:"3px"}}/>
                                </div>
                                <div className={style.inputbox}>
                                  
                                </div>
                            </div>
                        </div>

                        <div className={style.cust}>
                        <div style={{borderBottom:"1px solid rgba(163, 160, 160, 0.621)", paddingBottom:"10px", width:"95%", margin:"auto"}}>
                                <div className={style.inputTitle}>
                                    <IonIcon style={{fontSize:"17px", color:"gold"}} icon={informationCircleOutline}/>
                                    Tracker Details
                                </div>
                            </div>
                            
                            <div className={style.flex}>
                                <div className={style.inputbox}>
                                    <div style={{fontWeight:"600", marginBottom:"10px"}}>Installer Name</div>
                                    <input required type="text" name="installerName" onChange={handleChange} value={formData.installerName} style={{height:"40px", width:"100%", outline:"none", padding:"7px", border:"1px solid rgba(163, 160, 160, 0.621)", borderRadius:"3px"}}/>
                                </div>
                                <div className={style.inputbox}>
                                    <div style={{fontWeight:"600", marginBottom:"10px"}}>Installation Location</div>
                                    <input required type="text" name="installerLocation" onChange={handleChange} value={formData.installerLocation} style={{height:"40px", width:"100%", outline:"none", padding:"7px", border:"1px solid rgba(163, 160, 160, 0.621)", borderRadius:"3px"}}/>
                                </div>
                                <div className={style.inputbox}>
                                    <div style={{fontWeight:"600", marginBottom:"10px"}}>Installer Number</div>
                                    <input required type="text" name="installerNumber" onChange={handleChange} style={{height:"40px", width:"100%", outline:"none", padding:"7px", border:"1px solid rgba(163, 160, 160, 0.621)", borderRadius:"3px"}} value={formData.installerNumber}/>
                                </div>
                            </div>

                            <div className={style.flex}>
                                <div className={style.inputbox}>
                                    <div style={{fontWeight:"600", marginBottom:"10px"}}>IMEI Number</div>
                                    <input required type="text" name="imei" onChange={handleChange} value={formData.imei} minLength={15} maxLength={15} style={{height:"40px", width:"100%", outline:"none", padding:"7px", border:"1px solid rgba(163, 160, 160, 0.621)", borderRadius:"3px"}}/>
                                </div>
                                <div className={style.inputbox}>
                                    <div style={{fontWeight:"600", marginBottom:"10px"}}>Amount Paid</div>
                                    <input required type="number" name="amount" onChange={handleChange} value={formData.amount} style={{height:"40px", width:"100%", outline:"none", padding:"7px", border:"1px solid rgba(163, 160, 160, 0.621)", borderRadius:"3px"}}/>
                                </div>
                                <div className={style.inputbox}>
                                    <div style={{fontWeight:"600", marginBottom:"10px"}}>Subscription</div>
                                    <input required type="text" name="subscription" onChange={handleChange} value={formData.subscription} style={{height:"40px", width:"100%", outline:"none", padding:"7px", border:"1px solid rgba(163, 160, 160, 0.621)", borderRadius:"3px"}}/>
                                </div>
                            </div>

                            <div className={style.flex}>
                                <div className={style.inputbox}>
                                    <div style={{fontWeight:"600", marginBottom:"10px"}}>Date of Installation</div>
                                    <input required type="date" name="dateInstalled" onChange={handleChange} value={formData.dateInstalled} style={{height:"40px", width:"100%", outline:"none", padding:"7px", border:"1px solid rgba(163, 160, 160, 0.621)", borderRadius:"3px"}}/>
                                </div>
                                <div className={style.inputbox}>
                                    <div style={{fontWeight:"600", marginBottom:"10px"}}>Category</div>
                                    <input required type="text" name="category" onChange={handleChange} value={formData.category} style={{height:"40px", width:"100%", outline:"none", padding:"7px", border:"1px solid rgba(163, 160, 160, 0.621)", borderRadius:"3px"}}/>
                                </div>
                                <div className={style.inputbox}>
                                    <div style={{fontWeight:"600", marginBottom:"10px"}}>Description</div>
                                    <input required type="text" name="description" onChange={handleChange} value={formData.description} style={{height:"40px", width:"100%", outline:"none", padding:"7px", border:"1px solid rgba(163, 160, 160, 0.621)", borderRadius:"3px"}}/>
                                </div>
                            </div>

                            <div className={style.flex}>
                                <div className={style.inputbox}>
                                    <div style={{fontWeight:"600", marginBottom:"10px"}}>Device Number</div>
                                    <input required type="text" name="deviceNumber" onChange={handleChange} value={formData.deviceNumber} style={{height:"40px", width:"100%", outline:"none", padding:"7px", border:"1px solid rgba(163, 160, 160, 0.621)", borderRadius:"3px"}}/>
                                </div>
                                <div className={style.inputbox}>
                                    <div style={{fontWeight:"600", marginBottom:"10px"}}>Other Information</div>
                                    <input required type="text" name="otherInformation" onChange={handleChange} value={formData.otherInformation} style={{height:"40px", width:"100%", outline:"none", padding:"7px", border:"1px solid rgba(163, 160, 160, 0.621)", borderRadius:"3px"}}/>
                                </div>
                                <div className={style.inputbox}>
                                
                                </div>
                            </div>

                        </div>

                        <div className={style.cust}>
                        <div style={{borderBottom:"1px solid rgba(163, 160, 160, 0.621)", paddingBottom:"10px", width:"95%", margin:"auto"}}>
                                <div className={style.inputTitle}>
                                    <IonIcon style={{fontSize:"17px", color:"gold"}} icon={informationCircleOutline}/>
                                    Referral Details
                                </div>
                            </div>
                            
                            <div className={style.flex}>
                                <div className={style.inputbox}>
                                    <div style={{fontWeight:"600", marginBottom:"10px"}}>Referral Name</div>
                                    <input type="text" name="referralName" onChange={handleChange} value={formData.referralName} style={{height:"40px", width:"100%", outline:"none", padding:"7px", border:"1px solid rgba(163, 160, 160, 0.621)", borderRadius:"3px"}} />
                                </div>
                                <div className={style.inputbox}>
                                    <div style={{fontWeight:"600", marginBottom:"10px"}}>Referral Number</div>
                                    <input type="text" name="referralNumber" onChange={handleChange} value={formData.referralNumber} style={{height:"40px", width:"100%", outline:"none", padding:"7px", border:"1px solid rgba(163, 160, 160, 0.621)", borderRadius:"3px"}}/>
                                </div>
                                <div className={style.inputbox}>
                                    
                                </div>
                            </div>
                        </div>
                    
                    </div>

                    <div className={style.butCont}>
                        <div className={style.butDiv}>
                            <button className={style.cancel} style={{padding:"12px",  width:"100%", borderRadius:"3px", border:"none", color:"white", background:"#443d81"}} type="submit" >Save</button>
                        </div>
                        <div className={style.butDiv}>
                            <button className={style.save} style={{padding:"12px", width:"100%", borderRadius:"3px", border:"none", background:"#443d81a9", color:"white"}} onClick={clearForm} >Clear</button>
                        </div>
                    </div>
                </form>
            </IonContent>
        </IonPage>
    )
}

export default Tracker;