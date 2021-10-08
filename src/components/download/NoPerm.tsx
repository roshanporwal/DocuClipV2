import React, { useEffect, useState } from "react";
import { IonCard, IonCardHeader, IonCardContent, IonLabel } from "@ionic/react";

import { isLoggedIn } from '../login/TokenProvider';

import "./download.css";
import MenuTemplate from "../../pages/Toolbar";

const NoPerm = () => {
  const information = (
    <IonCard>
      <IonCardHeader className="card-header">
        <IonLabel>
          <h2>Restricted File</h2>
        </IonLabel>
      </IonCardHeader>
      <IonCardContent className="card-content">
        <p>
          You do not have the permissions to access this file. Please ask the
          file author to grant to access to download the file.
        </p>
      </IonCardContent>
    </IonCard>
  )
  const [ view, setView ] = useState(<div />)

  useEffect(() => {
    if (isLoggedIn()) {
      setView(
        <MenuTemplate name="Download" component={information} />
      )
    } else {
      setView(information)
    }
    // disabling error because adding the dependency breaks the code
    // eslint-disable-next-line
  }, []);

  return (
    view
  );
};

export default NoPerm;
