import React from 'react'
// import QrReader from 'react-qr-reader'
import { BarcodeScanner } from '@ionic-native/barcode-scanner'

// import auth functions
import { isLoggedIn } from "../../components/login/TokenProvider";

import { IonAlert } from '@ionic/react';
import { Plugins, PermissionType, CameraResultType } from "@capacitor/core";
import Axios from 'axios';
import apiRoutes from '../../components/Routes';
const { Camera, Permissions  } = Plugins;


type props = {}
type states = {
  error: string,
  delay: number,
  style: object,
  hasCameraPermission: string | null
  src: any
}

class QrScanner extends React.Component<props, states> {
  constructor(props: props) {
    super(props)

    this.state = {
      error: '',
      delay: 100,
      style: { border: '0px' },
      hasCameraPermission: null,
      src: ""
    }

    // redirect user to homepage if the user is not logged in
    if (!isLoggedIn()) {
      window.location.replace("/");
    }

    // Camera.requestPermissions!()

    this.handleScan = this.handleScan.bind(this)
    this.handleError = this.handleError.bind(this)
    this.takePicture = this.takePicture.bind(this)
  }

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri
    });
    // image.webPath will contain a path that can be set as an image src.
    // You can access the original file using image.path, which can be
    // passed to the Filesystem API to read the raw data of the image,
    // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
    var imageUrl = image.webPath;
    // Can be set to the src of an image now
    this.setState({ src: imageUrl })
  }

  async componentDidMount() {
    // test code - https://capacitorjs.com/docs/apis/permissions
    const hasPermission = await Permissions.query({ name: PermissionType.Camera });
    console.log('hasPermission: ', hasPermission);
    this.setState({ hasCameraPermission: hasPermission.state })
    this.openScanner();
  }

  handleScan(data: any){
    // if data is not null, then execute the code
    if (data) {
      // dev
      //var regex = /(http|https)(:\/\/)(localhost:3000)(\/download\/)/

      // production
      var regex = /(http|https)(:\/\/)(li1031-136.members.linode.com\/public_html\/ci4-dms-updated\/public\/download\/)/
      var result = regex.test(data)
      if (result === true) {
        data = data.replace(regex, "")
        const formData = new FormData()
        formData.append('publicName', data)
        Axios.post(apiRoutes.statistics.scan, formData).catch((e) => console.log('could not count', e))
        window.location.href = `/file/${data}`;
      } else {
        this.setState({ style: {border: '5px solid #ff7373'} })
      }
    } else {
      this.setState({ style: {border: '0px'} })
    }
  }

  handleError(err: any){
    if (err === "Error") {
      this.setState({
        error: "You device doesn't have a camera or has an inaccessible camera",
      })

      window.location.replace("/category")
    }
  }

  openScanner = async () => {
    try {
      const data = await BarcodeScanner.scan();
      console.log(`Barcode data: ${data.text}`);
      this.handleScan(data.text);
    } catch (error) {
      console.log(error);
      this.handleError('Error');
    }
  }

  render() {
    return (
      <React.Fragment>
        <IonAlert
          isOpen={!!this.state.error}
          message={this.state.error}
          buttons={[{
            text: 'Okay',
            handler: () => {this.setState({error: ''})}
          }]}
        />

        {window.location.href}
        {this.state.hasCameraPermission === null ? "Waiting for response" : <p>{this.state.hasCameraPermission}</p>}
        <img src={this.state.src} alt="of some sort" />

        <div style={this.state.style}>
          {/* <QrReader
            delay={300}
            onError={this.handleError}
            onScan={this.handleScan}
            style={{ width: '100%', height: '100vh' }}
            showViewFinder={true}
          /> */}
        </div>
      </React.Fragment>
    )
  }
}

export default QrScanner;