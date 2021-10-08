import React, { useState, useEffect } from "react";
import { IonAlert } from "@ionic/react";

import "./view.css";
import CategoryHome from "../../components/view/CategoryHome";

import { isLoggedIn } from "../../components/login/TokenProvider";

/**
 * This will call api/fileretrivalapi/listall to get a list of all the files which belong
 * to the current logged in user
 */
const View: React.FC = () => {
  const [error, setError] = useState<string>();

  // redirect user to login page if user is not logged in
  useEffect(() => {
    if (isLoggedIn() === false) {
      window.location.replace("/");
    }
  }, []);
  //Div covering category doesn't include the whole thing
  return (
    <React.Fragment>
      <IonAlert
        isOpen={!!error}
        message={error}
        buttons={[
          {
            text: "Okay",
            handler: () => {
              setError("");
            },
          },
        ]}
      />
      {/* Category Tab doesn't cover the full scree */}
      <CategoryHome />
    </React.Fragment>
  );
};

export default View;
