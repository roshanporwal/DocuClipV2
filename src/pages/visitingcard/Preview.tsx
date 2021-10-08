import React from "react"

import { IonIcon } from "@ionic/react"
import { shareSocialOutline, shareSocialSharp } from "ionicons/icons"

import template from "./visiting_card_template.jpg"
import "./visitingcard.css"
import { Plugins } from "@capacitor/core"

type props = {
  businessName: string
  cardName: string
  phoneNumber: string
  emailId: string
  website: string
  updateCounter: number
}
class Preview extends React.Component<props> {
  componentDidUpdate() {
    const canvas: any = document.getElementById("canvas")
    const image: any = document.getElementById("templateImage")

    const context = canvas!.getContext("2d")

    image.onload = () => {
      context.drawImage(image, 0, 0)
      context.font = "50px Arial"
      context.fillText(this.props.cardName, 455, 75)
      context.fillStyle = "#ffffff"
      context.fillText(this.props.businessName, 50, 550)
      context.fillStyle = "#000"

      context.font = "36px Arial"
      context.fillText(this.props.emailId, 455, 175)
      context.fillText(this.props.phoneNumber, 455, 275)
      context.fillText(this.props.website, 455, 375)
    }
  }

  // code reference - https://stackoverflow.com/questions/57345539/navigator-canshare-in-typescript-permissions-denied
  shareClickHandler = async () => {
    const canvas: any = document.getElementById("canvas")

    // get the base64 data from canvas and convert it into a 'file'
    const dataURL: string = canvas!.toDataURL()
    const cleanData = dataURL.substr(dataURL.indexOf(",") + 1)

    Plugins.FileSharer.share({
      filename: "img.jpg",
      base64Data: cleanData,
      contentType: "image/jpg",
    })
      .then(() => {
        // do sth
      })
      .catch((error: any) => {
        console.error("File sharing failed", error.message)
      })
  }

  render() {
    return (
      <div key={this.props.updateCounter}>
        <div style={{ display: "flex" }}>
          <h5 style={{ color: "var(--primary-color)" }}>Preview</h5>
          <div className='share-button'>
            <IonIcon
              ios={shareSocialOutline}
              md={shareSocialSharp}
              onClick={this.shareClickHandler}
              className='share-button-btn'
            />
          </div>
        </div>
        <canvas id='canvas' width={1050} height={600}></canvas>
        <img
          src={template}
          alt='visiting card'
          id='templateImage'
          style={{ display: "none" }}
        />
      </div>
    )
  }
}

export default Preview
