import { IonIcon } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import React from 'react';

const GoBack: React.FC = () => {

    return (
        <div onClick = {()=>window.history.back()}>
                <IonIcon icon={arrowBack} style={{color: "black",fontSize: "28px",padding: "5 20px 20px 0"}} />
            </div>
    );
}

export default GoBack;