import React from "react";
import {
  IonCol,
  IonInput,
  IonItem,
  IonLabel,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonCheckbox,
  IonButton,
} from "@ionic/react";

// import axios and api routes
import axios from "axios";
import apiRoutes from "../Routes";

// import components
import AdditionalFields from "../upload/AdditionalFields";

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

    this.setState({
      filename: this.props.responseData.fileName,
    });

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

    // FIXME: remove this special case
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

  saveClickHandler = () => {
    // throw error if the filename is empty
    if (!this.state.filename) {
      this.props.parentSetState("error", "Filename cannot be empty");
    }

    // pack add the data input by user, including data from AdditionalFields to upload to the server
    const dataForm = new FormData();
    dataForm.append("userId", getToken().userId);
    dataForm.append("filename", this.state.filename);
    dataForm.append(
      "randFileName",
      this.props.responseData.randFileName as string
    );
    dataForm.append("size", this.props.responseData.fileSize as string);
    dataForm.append("ext", this.props.responseData.ext as string);
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
      (this.state.additionalFieldsData?.eventOn || 'null') as string
    );
    dataForm.append(
      "eventEnd",
      (this.state.additionalFieldsData?.eventEnd || 'null') as string
    );

    axios
      .post(apiRoutes.saveData, dataForm, {})
      .then((response) => {
        if (response.data.status === "success") {
          //TODO: Create a confirm page redirect for better user experience
          // setCurrentView(
          //     <ConfirmTick />
          // )
          window.location.replace("file/" + this.props.responseData.randFileName);
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

        <IonRow>
          <IonCol>
            <IonItem>
              <IonLabel>Keep file private?</IonLabel>
              <IonCheckbox
                checked={this.state.isPrivate}
                onIonChange={(e) => {
                  this.setState((prevState) => {
                    return { isPrivate: !prevState.isPrivate };
                  });
                }}
              ></IonCheckbox>
            </IonItem>
          </IonCol>
        </IonRow>

        <IonRow>
          <IonCol>
            <IonItem>
              <IonLabel position="floating">Emails</IonLabel>
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
          <IonCol>
            <IonButton expand="block" onClick={this.saveClickHandler}>
              Save Data
            </IonButton>
          </IonCol>
        </IonRow>
      </div>
    );
  }
}

export default SaveFileData;
