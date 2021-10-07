import React from "react";
import { IonLoading, IonAlert } from "@ionic/react";

// import axios and api routes
import axios from "axios";
import apiRoutes from "../../components/Routes";

// import stylesheet
import "./singleFile.css";

// import components
import MenuTemplate from "../Toolbar";
import FileView from "../../components/singleFile/FileView";

// import auth functions
import { isLoggedIn } from "../../components/login/TokenProvider";

type props = {
  match: any;
};
type states = {
  publicName: string;
  isLoading: boolean;

  file: any;
  metadata: any;

  viewComponent: JSX.Element | null;
  isInvalidFile: boolean;
  isFileDisabled: boolean
  error: string;
};

class SingleFile extends React.Component<props, states> {
  constructor(props: props) {
    super(props);

    this.state = {
      publicName: props.match.params.publicName,
      isLoading: true,

      file: null,
      metadata: null,

      viewComponent: null,

      isInvalidFile: false,
      isFileDisabled: false,
      error: "",
    };
  }

  componentDidMount() {
    // redirect user to homepage if not logged in
    if (!isLoggedIn()) {
      window.location.replace("/");
    }

    // pack publicName to retrieve all the data about the file
    const formGetFileInfo = new FormData();
    formGetFileInfo.append("publicName", this.state.publicName);
    formGetFileInfo.append("whereFor", 'forQrScan');
    axios
      .post(apiRoutes.fileInfo, formGetFileInfo)
      .then((response) => {
        if (response.data.status === "success") {
          if (response.data.isFileDisabled === 'true') {
            this.setState({ isFileDisabled: true, isLoading: false });
          } else {
            // save the received data in a state
            this.setState({
              file: response.data.file,
              metadata: response.data.file.metadata,
            });
          }
        } else {
          console.log(response.data.error);
          this.setState({ isInvalidFile: true, isLoading: false });
        }
      })
      .then(() => {
        if (this.state.isInvalidFile || this.state.isFileDisabled) {
          this.setState({
            isLoading: false,
          });
          return;
        }

        // send request to get modular field info and display then on screen
        // using FileView component
        const formGetAdditionalInfo = new FormData();
        formGetAdditionalInfo.append(
          "additionalFields",
          JSON.stringify(this.state.metadata)
        );
        axios
          .post(apiRoutes.fieldInfo, formGetAdditionalInfo)
          .then((response) => {
            if (response.data.status === "success") {
              this.setState({
                viewComponent: (
                  <FileView
                    file={this.state.file}
                    metadata={this.state.metadata}
                    additionalInfo={
                      response.data.data === "no-fields"
                        ? null
                        : response.data.data
                    }
                    subCategory={response.data.subCategory}
                    finishLoading={this.finishLoading}
                  />
                ),
              });
            } else {
              this.setState({
                isLoading: false,
              });
            }
          })
          .catch((error) => {
            this.setState({
              error: error,
            });
          });
      });
  }

  // When all functions related to getting file info is finished,
  // remove ion-loading
  finishLoading = () => {
    this.setState({
      isLoading: false,
    });
  };

  render() {
    return (
      <React.Fragment>
        <IonLoading
          isOpen={!!this.state.isLoading}
          onDidDismiss={() => this.setState({ isLoading: false })}
          message={"Please wait..."}
        />

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

        <IonAlert
          isOpen={this.state.isInvalidFile}
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

        <IonAlert
          isOpen={this.state.isFileDisabled}
          message={"You are not allowed to open this file"}
          buttons={[
            {
              text: "Okay",
              handler: () => {
                window.location.replace('/');
              },
            },
          ]}
        />

        {!this.state.viewComponent ? null : (
          <MenuTemplate name="File" component={this.state.viewComponent} />
        )}
      </React.Fragment>
    );
  }
}

export default SingleFile;
