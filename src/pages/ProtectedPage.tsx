import { IonContent, IonPage } from "@ionic/react";
import React, { useEffect, useState } from "react";

const ProtectedPage: React.FC = () => {
    const [data, setData] = useState<string | null>(null);
    const apiUrl = "http://localhost/pos-endpoint/protectedApi.php";

    useEffect(() => {
        const fetchProtectedData = async () => {
            const token = localStorage.getItem("session_token");
            try {
                const response = await fetch(apiUrl, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": token || "", // Include the token here
                    },
                });

                const result = await response.json();
                if (result.success) {
                    setData(result.data);
                } else {
                    console.error(result.error);
                }
            } catch (error) {
                console.error("Error fetching protected data:", error);
            }
        };

        fetchProtectedData();
    }, [apiUrl]);

    return (
        <IonPage>
            <IonContent>
                <div>
                    <h1>Protected Data</h1>
                    {data ? <p>{data}</p> : <p>Loading...</p>}
                </div>
            </IonContent>
        </IonPage>
    );
};

export default ProtectedPage;
