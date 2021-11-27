import React from "react";

// import axios and api routes
import axios from "axios";
import apiRoutes from "../../components/Routes";

// import auth functions
import { getToken } from "../../components/login/TokenProvider";
import { Capacitor } from "@capacitor/core";
import { IonAlert, IonLoading } from "@ionic/react";
import SaveFileData from "../../components/upload/SaveFileData";

type props = {};
type states = {
  view: JSX.Element | null;
  error: string;
  isLoading: boolean;
};
class Intent extends React.Component<props, states> {
  constructor(props: props) {
    super(props);

    this.state = {
      view: null,
      error: "",
      isLoading: true,
    };
  }

  // function passed to child components to update this component's state's flag
  parentSetState = (name: string, value: any) => {
    this.setState({ [name]: value } as any);
  };

  componentDidMount() {
    // receives the saved Intent and the associated data with it and deletes from local storage
    // once the data has been captured
    const intent = JSON.parse(localStorage.getItem("FILE") || '[""]');
    localStorage.removeItem("FILE");

    // check to see if local storage is set, if not, redirect user to homepage
    if (JSON.stringify(intent) === '[""]') window.location.replace("/category");

    // converts the content:// or file:// path to https path
    // refer - https://www.joshmorony.com/using-the-capacitor-filesystem-api-to-store-photos/
    const realPath = Capacitor.convertFileSrc(intent.uri);
    const extension = intent.extension;

    // the https path is converted into base64 encoded data stream and then sent to the backend to be saved
    this.convertFileAndSave(realPath, extension);
  }

  // Snippet from - https://stackoverflow.com/questions/36280818/how-to-convert-file-to-base64-in-javascript
  convertFileAndSave = async (url: string, extension: string) => {
    let blob = await fetch(url).then((r) => r.blob());
    let dataUrl = await new Promise((resolve) => {
      let reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });

    const data = new FormData();
    data.append("data", dataUrl as string);
    data.append("extension", extension);
    data.append("userId", getToken().userId);
    axios
      .post(apiRoutes.uploadFromUrl, data)
      .then((response: any) => {
        if (response.data.status === "success") {
          this.setState({
            isLoading: false,
            view: ( 
              <SaveFileData
                responseData={response.data}
                parentSetState={this.parentSetState}
              />
            ),
          });
        } else if (response.data.status === "error") {
          this.setState({
            isLoading: false,
            error: response.data.error,
          });
        } else {
          this.setState({
            error: "unknown error :(",
            isLoading: false,
          });
        }
      })
      .catch((error) => {
        console.log('error: ', error);
        this.setState({
          error: "unknown error :((",
          isLoading: false,
        });
      });
  };

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
                //window.location.replace("/category");
              },
            },
          ]}
        />

        <IonLoading
          isOpen={!!this.state.isLoading}
          onDidDismiss={() => this.setState({ isLoading: false })}
          message={"Please wait..."}
        />

        {this.state.view}
      </React.Fragment>
    );
  }
}

export default Intent;
