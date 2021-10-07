import React from "react"

import { getToken, isLoggedIn } from "../../components/login/TokenProvider"

import "./visitingcard.css"
import Preview from "./Preview"
import Inputs from "./Inputs"

type props = {}
type states = {
  businessName: string
  cardName: string
  phoneNumber: string
  emailId: string
  website: string
  updateCounter: number
}
class VisitingCard extends React.Component<props, states> {
  constructor(props: props) {
    super(props)

    // check to see if the user is logged in
    if (!isLoggedIn()) {
      window.location.replace("/")
    }

    this.state = {
      businessName: "",
      cardName: "",
      phoneNumber: getToken().userName,
      emailId: getToken().userEmail,
      website: "",
      updateCounter: 0,
    }
  }

  onChangeHandler = (event: any) => {
    const name = event.target.name
    const value = event.target.value

    this.setState({ [name]: value } as any)

    this.setState((prevState: states) => {
      return { updateCounter: prevState.updateCounter + 1 }
    })
  }

  render() {
    return (
      <div className='card-creator-container'>
        <Preview
          businessName={this.state.businessName}
          cardName={this.state.cardName}
          phoneNumber={this.state.phoneNumber}
          emailId={this.state.emailId}
          website={this.state.website}
          updateCounter={this.state.updateCounter}
        />

        <Inputs
          state={this.state}
          onChangeHandler={this.onChangeHandler}
        />
      </div>
    )
  }
}

export default VisitingCard
