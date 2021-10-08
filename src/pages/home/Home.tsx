import React, { useEffect } from "react";
import { IonButton } from "@ionic/react";

// import assets
import "./home.css";

// import auth functions
import { isLoggedIn } from "../../components/login/TokenProvider";

const Home: React.FC = () => {
  // check if the a user is logged in, if not redirect them
  // to login page
  useEffect(() => {
    if (!isLoggedIn()) {
      window.location.replace("/");
    }
  }, []);

  // redirect to /category page
  const viewFilesClickHandler = () => {
    window.location.href = "/category";
  };

  // redirect to /upload page
  const uploadFilesClickHandler = () => {
    window.location.href = "/upload";
  };

  return (
    <div>
      <div className="container">
        <p>
          This page is supposed to be a welcome page. The layout will be updated
          at a later time. For not this will only be used redirect/stopgap to
          the other, more import base features.
        </p>
        <IonButton onClick={viewFilesClickHandler}>View Files</IonButton>
        <IonButton onClick={uploadFilesClickHandler}>Upload Files</IonButton>
      </div>
    </div>
  );
};

export default Home;
