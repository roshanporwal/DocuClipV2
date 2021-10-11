
import {

  IonInput,
  IonAlert,
  IonRippleEffect,
  IonLoading,
  IonRouterLink,
  IonIcon,
} from "@ionic/react"
import { Link } from "react-router-dom"

// import assets
import "./Login.css"
import Logo from "./Logo"

// axios and routes import
import axios from "axios"
import apiRoutes from "../../components/Routes"

// import login modules
import { isLoggedIn } from "../../components/login/TokenProvider"
import React from 'react';
import { IonContent, IonCheckbox,IonLabel,} from '@ionic/react';
import { arrowBack } from "ionicons/icons"



type Props = {}
type States = {
  error: string
  isLoading: boolean
  loginRedirect: string

  username: string
  fullname: string
  password: string
  passwordRe: string
  passwordScore: number
  passwordReColor: "primary" | "danger"
}

class Register extends React.Component<Props, States> {
  constructor(props: Props) {
    super(props)

    // if user is already logged in, then redirect to home
    if (isLoggedIn() === true) {
      window.location.replace("/category")
    }

    this.state = {
      error: "",
      isLoading: false,
      loginRedirect: "",

      username: "",
      fullname: "",
      password: "admin",
      passwordRe: "admin",
      passwordScore: 0,
      passwordReColor: "primary"
    }

    this.registerClickHandler = this.registerClickHandler.bind(this)
  }

  toLogin(){
    window.location.href = '/login'
  }

  registerClickHandler() {
    this.setState({ isLoading: true })

    // throw error if any of the fields are empty || !this.state.email || !this.state.nickname
    if (!this.state.username || !this.state.fullname /* || !this.state.email || !this.state.nickname */) {
      this.setState({
        error: "All fields are required",
        isLoading: false,
      })

      return
    }

    // throw error if passwords don't match
    if (this.state.password !== this.state.passwordRe) {
      this.setState({
        error: "Passwords do not match",
        isLoading: false,
      })

      return
    }

    // disabling code because not using passwords anymore
    // throw error is password is too weak
    // if (this.state.passwordScore <= 2) {
    //   this.setState({
    //     error: "Password is too weak",
    //     isLoading: false,
    //   })

    //   return
    // }

    // pack the data to be sent with api call and call the api
    let credentialData = new FormData()
    credentialData.append("username", this.state.username)/* 
    credentialData.append("email", this.state.email) */
    credentialData.append("fullname", this.state.fullname)/* 
    credentialData.append("nickname", this.state.nickname) */
    axios
      .post(apiRoutes.register, credentialData)
      .then((response) => {
        if (response.data.status === "success") {
          console.log(response)
          this.setState({ loginRedirect: "User account created successfully!" })
        } else {
          this.setState({ error: response.data.reason })
        } 
      })
      .then(() => {
        this.setState({ isLoading: false })
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
          error: "Server unreachable",
        })
        console.log(error)
      })
      .then(() => {
        this.setState({ isLoading: false })
      })
  }

  /*
    Ion components hand value update differently to vanilla ReactJS
    This piece of code updates the state on each input change
  */
  onChangeHandler = (event: any) => {
    const name = event.target.name
    const value = event.target.value

    // special case to change password color
    if ((name === "passwordRe" && this.state.password !== value) || (name === "password" && this.state.passwordRe !== value)) {
      this.setState({ passwordReColor: "danger" })
    } else {
      this.setState({ passwordReColor: "primary" })
    }

    this.setState({ [name]: value } as any)
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
                this.setState({ error: "" })
              },
            },
          ]}
        />

        <IonLoading
          isOpen={this.state.isLoading}
          onDidDismiss={() => this.setState({ isLoading: false })}
          message={"Please wait..."}
        />

        <IonAlert
          isOpen={!!this.state.loginRedirect}
          message={this.state.loginRedirect}
          buttons={[
            {
              text: "Okay",
              handler: () => {
                this.setState({ loginRedirect: "" })
                window.location.replace("/")
              },
            },
          ]}
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


          <div className='main-container signup-form'>
            <div className='row-vertical login-main-panel'>
              <div className='row-vertical login-title'>
                <b>Create an account</b>
              </div>
              
              <div className='input-sign-up'>
                <IonInput
                  type='text'
                  name='fullname'
                  value={this.state.fullname}
                  onIonChange={this.onChangeHandler}
                  placeholder="Enter Your Full Name"
                  className="ioninput"
                />
              </div>

              <div className='input-sign-up'>
                <IonInput
                  type='text'
                  name='username'
                  value={this.state.username}
                  placeholder="Enter Your Mobile Number"
                  onIonChange={this.onChangeHandler}
                  size={10}
                  className="ioninput"
                />
              </div>

{/*               <div className='input-sign-up'>
                <IonInput
                  type='text'
                  name='email'
                  value={this.state.email}
                  placeholder="Your Mail"
                  className="ioninput"

                  onIonChange={this.onChangeHandler}
                />
              </div>
              <div className='input-sign-up'>
                <IonInput
                  type='text'
                  name='nickname'
                  placeholder="Your NickName"
                  className="ioninput"

                  value={this.state.nickname}
                  onIonChange={this.onChangeHandler}
                />
              </div> */}{/* 
              <small style={{ position: 'relative', top: '-15px', left: '15px', marginBottom: '15px' }}>We will be addressing you by this name</small> */}
              <div className='term-and-conditions text-center'>
                <div>
                  <IonCheckbox color="dark" ></IonCheckbox>
                </div>
                <div>
                <p>
                    <IonLabel>I Agree to</IonLabel>  <a href="https://docuclip.app/ci4-dms-updated/public/terms">Terms & conditions</a>.
                </p>
                </div>
              </div>
              
              
            <div className='row-vertical'>
              
              
              <button
                className='center button signup-button'
                onClick={this.registerClickHandler}
              >
                {/* <Link to='register'>Sign up</Link> */}
                SIGN UP
              </button>
            </div>
            <div className='row-vertical text-center'>
              <h5 style={{fontSize:"14px",fontWeight:"bold"}}>
                Already Registered?
              </h5>
              <button
                className='center button login-button'
                onClick={this.toLogin}
              >
                LOGIN
              </button>
            </div>
            </div>
          </div>
        </IonContent>
      </React.Fragment>
    )
  }
}

export default Register
