import React, { useEffect, useState } from "react";
import { IonAlert, IonApp, IonContent } from "@ionic/react";
import { useParams } from "react-router";

// import auth functions
import { getToken, isLoggedIn } from "../login/TokenProvider";

// import components
import Success from "./Success"; // show if all perms are OK
import LoginPerm from "./LoginPerm"; // show if file is private and user not logged in
import NoPerm from "./NoPerm"; // show if user has no access to the file
import MenuTemplate from "../../pages/Toolbar"; // to render the menu bar if user is logged in

// import stylesheet
import "./download.css";

// import axios and api routes
import axios from "axios";
import apiRoutes from "../Routes";

const Download: React.FC = () => {
  const [error, setError] = useState<string>();
  const [isInvalidFile, setIsInvalidFile] = useState<boolean>(false);
  // show one of the view based on permissions
  const [outputView, setOutputView] = useState<any>(null);

  // use useParams to get publicName from url
  const { publicName } = useParams<{ publicName: string }>();

  // run this code only once
  useEffect(() => {
    // make an api call to get all the information regard the file
    const formData = new FormData();
    formData.append("publicName", publicName);
    formData.append("requestType", "download");

    // if user is not logged in, set false. If user is logged in, set true
    // and send additional user info along with it
    if (isLoggedIn() === false) {
      formData.append("isLoggedIn", "false");
    } else {
      formData.append("isLoggedIn", "true");
      formData.append("userId", getToken().userId);
      formData.append("userName", getToken().userName);
    }

    axios.post(apiRoutes.fileInfo, formData).then((response) => {
      // permissions are checked in the backend, if everything is OK from the backend,
      // show the download link
      if (response.data.status === "success") {
        setOutputView(
          <MenuTemplate
            name="Download"
            component={
              <Success
                fileName={response.data.file.filename}
                filePath={response.data.file.filePath}
                fileSize={response.data.file.metadata.size}
                fileExt={response.data.file.metadata.ext}
                setError={setError}
                owner={response.data.file.owner}
                publicName={response.data.file.publicName}
              />
            }
          />
        );
      } else if (response.data.status === "fail") {
        // if permissions requirements are not met, or need to login
        // to verify the permissions, this this code
        if (response.data.reason === "LOGIN_FOR_PERM") {
          // file is private and user needs to login to see if the user
          // has access this the file they want to download
          setOutputView(
            <>
              <LoginPerm url={window.location.href} />
            </>
          );
        } else if (response.data.reason === "NO_PERM") {
          // is file is private and user is logged in, but they do not have
          // the permissions to view the file, the show error view
          setOutputView(
            <NoPerm />
          );
        }
      } else if (response.data.status === "exception") {
        // this code is to handle exceptions/errors from backend
        // at least the ones PHP can catch
        console.log(response.data.error);
      } else {
        console.log(response.data.error);
        if (response.data.error === 'Invalid file') setIsInvalidFile(true)
      }
    })
    .catch(error => {
      setError(error);
    });
  }, [publicName]);

  return (
    <IonApp>
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

      <IonAlert
        isOpen={isInvalidFile}
        message={"File not found"}
        buttons={[
          {
            text: "Okay",
            handler: () => {
              window.location.href = "/category";
            },
          },
        ]}
      />

      <IonContent>{outputView === null ? null : outputView}</IonContent>
    </IonApp>
  );
};

export default Download;
