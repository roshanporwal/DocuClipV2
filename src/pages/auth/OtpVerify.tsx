import React from "react"
import { IonContent, IonAlert, IonLoading, IonButton,IonIcon , IonRouterLink } from "@ionic/react"

// import assets
import "./Login.css"
import Logo from "./Logo"
import backgroundImage from "./OTP image.jpg"
import {arrowBack} from 'ionicons/icons'

// axios and routes import
import axios from "axios"
import apiRoutes from "../../components/Routes"

// import login modules
import { isLoggedIn, setToken } from "../../components/login/TokenProvider"
import OtpInput from "react-otp-input"
import { CountdownCircleTimer } from "react-countdown-circle-timer"

type Props = {}
type States = {
  error: string
  isLoading: boolean

  username: string
  correctOtp: string
  otp: string
  isIncorrectOtp: boolean
  isButtonDisabled: boolean
}

class OtpVerify extends React.Component<Props, States> {
  constructor(props: Props) {
    super(props)

    // if user is already logged in, then redirect to home
    if (isLoggedIn() === true) {
      window.location.replace("/category")
    }

    this.state = {
      error: "",
      isLoading: false,

      username: sessionStorage.getItem("username")!,
      correctOtp: sessionStorage.getItem("otp")!,
      otp: "",
      isIncorrectOtp: false,
      isButtonDisabled: false,
    }

    this.submitClickHandler = this.submitClickHandler.bind(this)
    this.resendButtonClick = this.resendButtonClick.bind(this)
  }

  submitClickHandler() {}

  resendButtonClick() {
    let credentialData = new FormData()
    credentialData.append("username", this.state.username)
    credentialData.append("otp", this.state.correctOtp)
    axios
      .post(apiRoutes.sendOtp, credentialData)
      .then((response) => {
        if (response.data.status === "success") {
          this.setState({ isButtonDisabled: true })
        } else {
          if (response.data.error) {
            this.setState({ error: response.data.error })
          }
          console.log("Unable to resend OTP error: ", response.data)
        }
      })
      .catch((error) => {
        console.log("Send OTP fatal error: ", error)

        this.setState({ error: "Server unreachable" })
      })
  }

  handleChange = (otp: string) => {
    this.setState({ otp: otp })

    if (otp.length === 4) {
      if (this.state.correctOtp === otp) {
        let credentialData = new FormData()
        credentialData.append("username", this.state.username)
        axios.post(apiRoutes.loginOtp, credentialData).then((response) => {
          if (response.data.status === "success") {
            // set user data to local storage
            setToken(response.data)
            window.location.replace("/category")
          } else {
            if (response.data.error) {
              this.setState({ error: response.data.error })
            }
            console.log("Unable to login error: ", response.data)
          }
        }) 
      } else {
        this.setState({ isIncorrectOtp: true })
      }
    } else {
      this.setState({ isIncorrectOtp: false })
    }
  }

  /* renderTime = ({ remainingTime }: any) => {
    if (remainingTime === 0) {
      return (
        <IonButton
          onClick={this.resendButtonClick}
          disabled={this.state.isButtonDisabled}
        >
          Resend OTP
        </IonButton>
      )
    } 

    return (
      <div className='timer'>
        <div className='text'>Resend OTP in</div>
        <div className='value'>{remainingTime}</div>
        <div className='text'>seconds</div>
      </div>
    )
  }*/

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
                this.setState({ error: "" })
              },
            },
          ]}
        />

        {/* FIXME: remove this monstrosity */}
       {/* <small>OTP sent to phone {this.state.correctOtp}. Note this will not be visible in the final build</small>*/ }  

        <IonLoading
          isOpen={this.state.isLoading}
          onDidDismiss={() => this.setState({ isLoading: false })}
          message={"Please wait..."}
        />

        <IonContent>
          <div className='main-container'>
            <div className="backIcon">
              <IonRouterLink routerLink="/login">              
               <IonIcon icon={arrowBack} size="large" />  
              </IonRouterLink>
            </div>
            <div className='row-vertical'>
              <Logo />
            </div>
          </div>

          <div className='row-vertical otp-background-image '>
            <img src={backgroundImage} alt='welcome'  />
          </div>

          <div className='main-container'>
            <div className='row-vertical login-main-panel'>
              <div className='row-vertical login-title'>
                We have sent an OTP to your registered mobile number.
              </div>

              <div style={{ marginTop: "20px" }} className="center">
                <OtpInput
                  inputStyle='otp-input-style'
                  value={this.state.otp}
                  onChange={this.handleChange}
                  numInputs={4}
                  isInputNum={true}
                  separator={<span>-</span>}
                  hasErrored={this.state.isIncorrectOtp}
                  errorStyle='otp-input-error'
                />
              </div>
              <div style={{ marginBottom: "10px" }} />

              <div className='resend-otp'>
                <p
                  style={{fontSize:"15px"}}
                  onClick={this.resendButtonClick}
                  /* disabled={this.state.isButtonDisabled} */
                >
                  Resend OTP
                </p>
                {/* <p>Did not recieve OTP?</p>
                <CountdownCircleTimer isPlaying duration={30} colors='#004777'>
                  {this.renderTime}
                </CountdownCircleTimer> */}
              </div>
            </div>
            
          </div>
        </IonContent>
      </React.Fragment>
    )
  }
}

export default OtpVerify
