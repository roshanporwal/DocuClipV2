import React from "react"

import "./visitingcard.css"
import { IonInput, IonItem, IonLabel } from "@ionic/react"

type states = {
  businessName: string
  cardName: string
  phoneNumber: string
  emailId: string
  website: string
}
type props = {
  state: states
  onChangeHandler: any
}

class Inputs extends React.Component<props> {

  render() {
    return (
      <div>
        <IonItem>
          <IonLabel position='floating'>Business Name</IonLabel>
          <IonInput
            type='text'
            name='businessName'
            value={this.props.state.businessName}
            onIonChange={this.props.onChangeHandler}
          ></IonInput>
        </IonItem>

        <IonItem>
          <IonLabel position='floating'>Card Holder Name</IonLabel>
          <IonInput
            type='text'
            name='cardName'
            value={this.props.state.cardName}
            onIonChange={this.props.onChangeHandler}
          ></IonInput>
        </IonItem>

        <IonItem>
          <IonLabel position='floating'>Phone Number</IonLabel>
          <IonInput
            type='text'
            name='phoneNumber'
            value={this.props.state.phoneNumber}
            onIonChange={this.props.onChangeHandler}
          ></IonInput>
        </IonItem>

        <IonItem>
          <IonLabel position='floating'>Email</IonLabel>
          <IonInput
            type='text'
            name='emailId'
            value={this.props.state.emailId}
            onIonChange={this.props.onChangeHandler}
          ></IonInput>
        </IonItem>

        <IonItem>
          <IonLabel position='floating'>Website</IonLabel>
          <IonInput
            type='text'
            name='website'
            value={this.props.state.website}
            onIonChange={this.props.onChangeHandler}
          ></IonInput>
        </IonItem>
      </div>
    )
  }
}

export default Inputs
