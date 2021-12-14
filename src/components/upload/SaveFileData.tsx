import React from "react";
import {
  IonCol,
  IonInput,
  IonItem,
  IonLabel,
  IonRow,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";

// import axios and api routes
import axios from "axios";
import apiRoutes from "../Routes";

// import components
import AdditionalFields from "./AdditionalFields";

// import auth functions
import { getToken } from "../login/TokenProvider";

type props = {
  responseData: any;
  parentSetState: any;
};
type state = {
  filename: string;
  selectedCategory: string | null;
  categoryList: any;
  additionalFields: any;

  tags: string;
  additionalFieldsData: any;
  emails: string;
  eventOn: string | null;
  isPrivate: boolean;
};

class SaveFileData extends React.Component<props, state> {
  constructor(props: props) {
    super(props);

    // metadata of the file to be saved on the server
    this.state = {
      filename: "",
      selectedCategory: null,
      categoryList: null,
      additionalFields: null,
      additionalFieldsData: null,
      tags: "",
      emails: "",
      eventOn: null,
      isPrivate: false,
    };
  }

  componentDidMount() {
    // show loading icon while file data is begin retrieved
    this.props.parentSetState("isLoading", true);

    if (this.props.responseData.fileName === "") {
      this.setState({
        filename: this.makeId(7),
      });
    } else {
      this.setState({
        filename: this.props.responseData.fileName,
      });
    }

    // make api call to retrieve all the categories the file can be saved as
    axios.post(apiRoutes.getCategories).then((response) => {
      // get all latest categories from additionalFields
      const categories: any = [];
      for (const property in response.data.additionalFields) {
        if (
          Object.prototype.hasOwnProperty.call(
            response.data.additionalFields,
            property
          )
        ) {
          categories.push(response.data.additionalFields[property].title);
        }
      }

      // set the categories and additionalFields as an entire object to this component's state
      this.setState({ categoryList: categories });
      this.setState({ additionalFields: response.data.additionalFields });
    });

    // hide loading icon
    this.props.parentSetState("isLoading", false);
  }

  /*
        Ion components hand value update differently to vanilla ReactJS
        This piece of code updates the state on each input change
    */
  onChangeHandler = (event: any) => {
    const name = event.target.name;
    const value = event.target.value;

    if (name === "ion-dt-0") {
      this.setState({ eventOn: value } as any);
      return;
    }
    this.setState({ [name]: value } as any);
  };

  customSelectChangeHandler = (event: any) => {
    // setting state back to null forces a re-render and hence updates
    // the view, without it the code doesn't work :shrug_emoji:
    this.setState({ selectedCategory: null });
    this.setState({ selectedCategory: event.target.value });
  };

  // sent to child component AdditionalField to update this component's states
  parentSetState = (name: string, value: any) => {
    this.setState({ [name]: value } as any);
  };

  makeId = (length: number) => {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  saveClickHandler = () => {
    // throw error if the filename is empty
    console.log(this.state)
    //return ; */
    if (!this.state.filename) {
      // this.setState({ filename: this.makeId(7) })
      this.props.parentSetState("error", "Filename cannot be empty")
      return
    }
    if (!this.state.selectedCategory || !this.state.additionalFieldsData) {
      // this.setState({ filename: this.makeId(7) })
      this.props.parentSetState("error", "Fields cannot be empty")
      return
    }


    // pack add the data input by user, including data from AdditionalFields to upload to the server

    let today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //As January is 0.
    var yyyy = today.getFullYear();
    let date_now = yyyy+"/"+mm+'/'+dd; 
    const dataForm = new FormData();
    dataForm.append("userId", getToken().userId);
    dataForm.append("userName", getToken().userName);
    dataForm.append("filename", this.state.filename);
    dataForm.append(
      "randFileName",
      this.props.responseData.randFileName as string
    );
    dataForm.append("size", this.props.responseData.fileSize as string);
    dataForm.append("ext", this.props.responseData.ext as string);
    /* Set is Local true to be changed*/
    dataForm.append("is_local", this.props.responseData.is_local as string);
    /* ---------- */
    dataForm.append(
      "category",
      this.state.selectedCategory === null ? "" : this.state.selectedCategory
    );
    dataForm.append("tags", this.state.tags as string);
    dataForm.append("emails", this.state.emails as string);
    dataForm.append("isPrivate", this.state.isPrivate ? "1" : "0");
    dataForm.append(
      "additionalFields",
      JSON.stringify(this.state.additionalFieldsData)
    );
    dataForm.append(
      "eventOn",
      (this.state.additionalFieldsData?.eventOn || date_now) as string
    );
    dataForm.append(
      "eventEnd",
      (this.state.additionalFieldsData?.eventEnd || date_now) as string
    );

    axios
      .post(apiRoutes.saveData, dataForm, {})
      .then((response) => {
        if (response.data.status === "success") {
          window.location.replace("upload_success");
        } else if (response.data.status === "error") {
          this.props.parentSetState("error", response.data.error);
        } else {
          this.props.parentSetState("error", "An unknown error occurred: " + response.data);
        }
      })
      .catch((error) => {
        this.props.parentSetState("error", error);
      });
  };

  render() {
    return (
      <div className="save-file-container">
        <IonRow>
          <IonCol>
            <IonItem>
              <IonLabel position="floating">Filename</IonLabel>
              <IonInput
                type="text"
                name="filename"
                value={this.state.filename}
                onIonChange={this.onChangeHandler}
              ></IonInput>
            </IonItem>
          </IonCol>
        </IonRow>

        <IonRow>
          <IonCol>
            <IonItem>
              <IonLabel position="floating">Category</IonLabel>
              {this.state.categoryList === null ? null : (
                <IonSelect
                  placeholder="Select One"
                  onIonChange={this.customSelectChangeHandler}
                >
                  {this.state.categoryList.map(
                    (value: string, index: number) => (
                      <IonSelectOption value={value} key={index}>
                        {value}
                      </IonSelectOption>
                    )
                  )}
                </IonSelect>
              )}
            </IonItem>
          </IonCol>
        </IonRow>

        {this.state.selectedCategory === null ? null : (
          <IonRow>
            <IonCol>
              {/* Show additional fields based on the category selected above */}
              <AdditionalFields
                selectedCategory={this.state.selectedCategory}
                additionalFields={this.state.additionalFields}
                parentSetState={this.parentSetState}
              />
            </IonCol>
          </IonRow>
        )}

        <IonRow>
          <IonCol>
            <IonItem>
              <IonLabel position="floating">Tags</IonLabel>
              <IonInput
                type="text"
                name="tags"
                value={this.state.tags}
                onIonChange={this.onChangeHandler}
              ></IonInput>
            </IonItem>
            <IonLabel className="muted" style={{ marginLeft: "15px" }}>
              Separate tags by comma (,)
            </IonLabel>
          </IonCol>
        </IonRow>

        <IonRow style={{ display: "none" }}>
          <IonCol>
            <IonItem>
              <IonLabel position="floating">Phone Numbers</IonLabel>
              <IonInput
                type="text"
                name="emails"
                value={this.state.emails}
                onIonChange={this.onChangeHandler}
              ></IonInput>
            </IonItem>
            <IonLabel className="muted" style={{ marginLeft: "15px" }}>
              Separate tags by comma (,)
            </IonLabel>
          </IonCol>
        </IonRow>

        <IonRow>
          <IonCol >
            <div className="text-center">
              <button onClick={this.saveClickHandler} className="upload-button">
              Save Data
              </button>
            </div>
          </IonCol>
        </IonRow>
      </div>
    );
  }
}

export default SaveFileData;
