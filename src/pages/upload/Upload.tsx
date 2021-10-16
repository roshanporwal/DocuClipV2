import React from "react";
import { IonLoading, IonAlert } from "@ionic/react";

// import stylesheet
import "./upload.css";

// import components
import UploadFile from "../../components/upload/UploadFile";
import SaveFileData from "../../components/upload/SaveFileData";

// import auth functions
import { isLoggedIn } from "../../components/login/TokenProvider";

type props = {};
type state = {
  error: string;
  isLoading: boolean;
  isUploaded: boolean;
  responseData: any;
};

class Upload extends React.Component<props, state> {
  constructor(props: props) {
    super(props);

    this.state = {
      error: "",
      isLoading: false,
      isUploaded: false,
      responseData: null,
    };
  }

  // function passed to child components to update this component's state's flag
  parentSetState = (name: string, value: any) => {
    this.setState({ [name]: value } as any);
  };

  componentDidMount() {
    // redirect user to homepage if the user is not logged in
    if (!isLoggedIn()) {
      window.location.replace("/");
    }
  }

  render() {
    return (
      <React.Fragment>
        <IonAlert
          isOpen={!!this.state.error}
          message={this.state.error}
          buttons={[
            {
              text: "Okay",
              handler: () => {
                this.setState({ error: "" });
              },
            },
          ]}
        />

        <IonLoading
          isOpen={!!this.state.isLoading}
          onDidDismiss={() => this.setState({ isLoading: false })}
          message={"Please wait..."}
        />
        
        <div className="upload-content-container">
          <div className="row-vertical">
            <div className="upload-container">
              {!!this.state.isUploaded ? (
                // 2. show this view after the file has been uploaded
                <SaveFileData
                  responseData={this.state.responseData}
                  parentSetState={this.parentSetState}
                />
              ) : (
                // 1. show this view first for the user to upload the file
                <UploadFile parentSetState={this.parentSetState} />
              )}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Upload;
