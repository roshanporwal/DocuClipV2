import { IonAlert, IonLoading } from "@ionic/react"
import axios from "axios"
import React from "react"
import { Link } from "react-router-dom"
import apiRoutes from "../../components/Routes"

import "./profile.css"

type details = {
  userId: string
  userEmail: string
  userName: string
}

type props = { details: details }
type states = {
  lastModified: string
  error: string
  isLoading: boolean
}

export default class Security extends React.Component<props, states> {
  constructor(props: props) {
    super(props)

    this.state = {
      lastModified: "--",
      error: '',
      isLoading: true
    }
  }

  componentDidMount() {
    const data = new FormData()
    data.append('userId', this.props.details.userId)
    axios.post(apiRoutes.getUserInfo, data)
      .then((response) => {
        if (response.data.status === 'success') {
          this.setState({ lastModified: response.data.lastModified })
        } else if (response.data.status === 'success') {
          if (response.data.error === "MULTIPLE_ROWS_ERROR")
            this.setState({ error: 'There are more than one users with the same info. Contact Admin' })
          else {
            this.setState({ error: 'Unknown Error' })
          }
        }
      })
      .catch((error) => {
        console.log('error: ', error);
        this.setState({ error: 'There was a problem retrieving the data' })
      })
      .then(() => {
        this.setState({ isLoading: false })
      })
  }

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
                this.setState({ error: '' })
              },
            },
          ]}
        />

        <IonLoading
          isOpen={this.state.isLoading}
          onDidDismiss={() => this.setState({ isLoading: false })}
          message={"Please wait..."}
        />


        <div style={{ borderBottom: "1px solid #ccc" }}>
          <h5 className='profile-title'>Security</h5>
          <div className='singleFile-card-item'>
            <span>Password</span>
            <p>••••••••••••••••••</p>
          </div>

          <div className='singleFile-card-item'>
            <span>Last Updated</span>
            <p>{this.state.lastModified}</p>
          </div>

          <div className='singleFile-card-item'>
            <span>Change Password</span>
            <p>
              <Link to='profile/change-password'>Change Password</Link>
            </p>
          </div>
        </div>
      </React.Fragment>
    )
  }
}
