import React from 'react'
import QrReader from 'react-qr-reader'

// import auth functions
import { isLoggedIn } from "../../components/login/TokenProvider";

import { IonAlert } from '@ionic/react';
import { Plugins } from "@capacitor/core";
import Axios from 'axios';
import apiRoutes from '../../components/Routes';
const { Camera } = Plugins;


type props = {}
type states = {
  error: string,
  delay: number,
  style: object,
}

class QrScanner extends React.Component<props, states> {
  constructor(props: props) {
    super(props)

    this.state = {
      error: '',
      delay: 100,
      style: { marginTop: "2rem"}
    }

    // redirect user to homepage if the user is not logged in
    if (!isLoggedIn()) {
      window.location.replace("/");
    }

    // Camera.requestPermissions!()

    this.handleScan = this.handleScan.bind(this)
    this.handleError = this.handleError.bind(this)
  }   

  handleScan(data: any){
    // if data is not null, then execute the code
    if (data) {
      // dev
      //var regex = /(http|https)(:\/\/)(localhost:3000)(\/download\/)/
      console.log(data)
      // production
      var regex = /(http|https)(:\/\/)(docuclip.app\/ci4-dms-updated\/public\/download\/)/
      //var regex = /(http|https)(:\/\/)(localhost\/docuclip.app\/ci4-dms-updated\/public\/download\/)/
      var result = regex.test(data)
      console.log(result)
      if (result === true) {
        data = data.replace(regex, "")
        const formData = new FormData()
        formData.append('publicName', data)
        Axios.post(apiRoutes.statistics.scan, formData).catch((e) => console.log('could not count', e))
        window.location.href = `/file/${data}`;
      } else {
        this.setState({ style: {border: '10px solid green'} })
      }
    } else {
      this.setState({ style: {border: '10px solid red'} })
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

        <div style={this.state.style} >
          <QrReader
            delay={300}
            onError={this.handleError}
            onScan={this.handleScan}
            style={{ width: '100%', height: '36.5vh',}}
            showViewFinder={true}
          />
        </div>
      </React.Fragment>
    )
  }
}

export default QrScanner;