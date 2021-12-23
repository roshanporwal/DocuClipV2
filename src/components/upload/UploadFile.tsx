import React from "react";
import { IonRow, IonCol, IonButton, IonAlert, IonModal } from "@ionic/react";

// import axios and api routes
import axios from "axios";
import apiRoutes from "../Routes";
import UploadIcon from "./file-upload.png"
// import auth functions
import { getToken } from "../login/TokenProvider";
import MD5 from "crypto-js/md5";
import {
  FilesystemDirectory,
  FilesystemEncoding,
  Plugins,
} from "@capacitor/core"
import { now } from "moment";
import { Server } from "http";
import GoBack from "../goBack";

type props = {
  parentSetState: any;
};
type states = {
  isModalOpen:boolean;
  size:any;
  file: any;
  file_content:any,
  filename: string;
  ext :any;
};

class UploadFile extends React.Component<props, states> {
  constructor(props: props) {
    super(props);

    this.state = {
      isModalOpen:false,
      size:null,
      file: null,
      file_content:null,
      filename: "Select a file...",
      ext:null,
    };
  }

  // call this function when upload is clicked
  uploadClickHandler = () => {
    // show the loading icon from parent state
    this.props.parentSetState("isLoading", true);

    // if no file is selected, cancel loading icon and show error
    if (!this.state.file) {
      this.props.parentSetState("isLoading", false);
      this.props.parentSetState("error", "Please select a file to upload");
      return;
    }

    // pack the data, that is the current user's ID and the file being uploaded
    // and make and api post call
    const data = new FormData();
    data.append("file", this.state.file);
    data.append("userId", getToken().userId);
    axios
      .post(apiRoutes.upload, data)
      .then((response) => {
        if (response.data.status === "success") {
          // set the uploaded flag to true to show the view to add metadata to the file
          // and then set response data to parent component
          this.props.parentSetState("responseData", response.data);
          this.props.parentSetState("isUploaded", true);
        } else {
          this.props.parentSetState("error", response.data.error);
        }
        console.log(this.state) 
        this.props.parentSetState("isLoading", false);
      })
      .catch((error) => {
        this.props.parentSetState("error", error);
      });
  };

  // call this function when upload is clicked
  /* 6 Oct 2021 - Naseem Khan
    To those , whoever ponder over this code in the future
    It took me 3 days to finally make this work after doing reloads and refreshing the emulators (each reload took me 1/2 hr)
    Please skip this one dont change it.
  */

  uploadLocalClickHandler = () => {
    // show the loading icon from parent state
    this.props.parentSetState("isLoading", true);

    // if no file is selected, cancel loading icon and show error
    if (!this.state.file) {
      this.props.parentSetState("isLoading", false);
      this.props.parentSetState("error", "Please select a file to upload");
      return;
    }

    let random_filename = MD5(this.state.filename + now()).toString();
    var return_json = {};
    //Upload file locally generate the same response as to be generated in Server Upload to save meta data
    const { Filesystem } = Plugins
    const uniqueFilename = random_filename.substr(0, 8) + "_" + this.state.filename
    let contentType: string
            // create directory
            Filesystem.mkdir({
              path: "docuclip",
              directory: FilesystemDirectory.Documents,
            })
             .catch(() => {console.log("something")}) // do nothing if directory exists error is thrown
              .then(() => { 
                      //  data: file_content.data,
                      //let file_content = btoa(this.state.file_content)
                      let file_content = this.state.file_content;
                      Filesystem.writeFile({
                        path: "docuclip/" + uniqueFilename,
                        data: file_content,
                        directory: FilesystemDirectory.Documents,
                      })
                        .then((response) => {
                          console.log(response)
                          return_json = {
                            status       : "success",
                            fileName     : this.state.filename,
                            is_local     : "true",
                            randFileName : random_filename,
                            fileSize     : this.state.size,
                            ext          : this.state.ext,
                          };
                          console.log(return_json)
                          
                          if(return_json["status"] == "success"){
                            this.props.parentSetState("responseData", return_json);
                            this.props.parentSetState("isUploaded", true);
                          } 
                          else {
                            this.props.parentSetState("error","Something is not right");
                          }
                        
                        })
                        .catch((error) => {
                          console.log("File write error: ", error)
                          this.props.parentSetState("error","File write error:"+error )
                        })
                   })
        this.props.parentSetState("isLoading", false);
      
  };



  // when the file upload input has selected a file, then this function updates the
  // file path on the state
  uploadChangeHandler = (event: any) => {
    var file_event = event.target.files[0];
    let reader = new FileReader()
    reader.onload = () => {
        this.setState({
          size: file_event.size,
          file: file_event,
          file_content: reader.result,
          filename: file_event.name,
          ext: file_event.name.split('.').pop(),
        });
        console.log("file content ",this.state.file_content)
    }
    reader.readAsDataURL(event.target.files[0])
    //reader.readAsArrayBuffer(event.target.files[0])
    //reader.readAsBinaryString(event.target.files[0])    

  };

  render() {
    return (
      <>
      <IonAlert
          isOpen={this.state["isModalOpen"]}
          message={'Choose Your Saving Format'}
          buttons={[
            {
              text: "Save Local",
              handler: () => {
                this.uploadLocalClickHandler()
              },
            },
            {
              text:'Push to Server',
              handler:() =>{
                this.uploadClickHandler()
              }
            }
          ]}
        />
      <GoBack />
      
      <div className="vertically-center">
        <div className="text-center">
          <img src={UploadIcon} height="84" width="84" />
        </div>
        <IonRow>
          <IonCol>
            <div>
              <label className="custom-file-label" htmlFor="upload-input">
                {this.state.filename}
              </label>
              <input
                type="file"
                name="file"
                id="upload-input"
                className="custom-file-input"
                onChange={this.uploadChangeHandler}
              />
            </div>
          </IonCol>
        </IonRow>

        <IonRow>
          <IonCol className="text-center">
            <button onClick={() =>{
              if (!this.state.file) {
                this.props.parentSetState("isLoading", false);
                this.props.parentSetState("error", "Please select a file to upload");
                return;
              }
                this.setState({isModalOpen:true})
              }} className="upload-button">
                Upload
              </button>
          </IonCol>
        </IonRow>
      </div>
      </>
    );
  }
}

export default UploadFile;
