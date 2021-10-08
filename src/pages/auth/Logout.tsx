import React, { useEffect } from 'react'
import { IonContent, IonRow, IonCol } from '@ionic/react';
import { destroyToken } from '../../components/login/TokenProvider';
import './Login.css';

const Logout: React.FC = () => {

    useEffect(() => {
        destroyToken()
        window.location.replace("/")
    }, [])

    return (
        <IonContent>
            <IonRow>
                <IonCol className="ion-text-center">
                    <h1>Logging you out...</h1>
                </IonCol>
            </IonRow>
        </IonContent>
    );
};

export default Logout;