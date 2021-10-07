import React from 'react'
import { IonCard, IonCardHeader, IonCardContent, IonButton, IonLabel } from '@ionic/react'

import './download.css'

interface props {
    url: string,
}
const LoginPerm: React.FC<props> = props => {

    const loginClickHandler = () => {
        window.location.href = "/page/Login"
    }

    return (
        <IonCard>
            <IonCardHeader className="card-header">
                <IonLabel>
                    <h2>Restricted File</h2>
                </IonLabel>
            </IonCardHeader>
            <IonCardContent className="card-content">
                <p>
                    This file needs permission to access. You must login to check for permissions.
                </p>
                <IonButton onClick={loginClickHandler}>Login</IonButton>
            </IonCardContent>
        </IonCard>
    )
}

export default LoginPerm