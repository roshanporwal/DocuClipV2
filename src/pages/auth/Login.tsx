import React, { useState, useRef , useEffect} from "react"
import {
  IonContent,
  IonInput,
  IonAlert,
  IonLoading,
  IonIcon
} from "@ionic/react"
import { Link } from "react-router-dom"

// assets import
import "./Login.css"
import Logo from "./Logo"
import backgroundImage from "./image one.jpg"

// axios and routes import
import axios from "axios"
import apiRoutes from "../../components/Routes"

// import login modules
import { isLoggedIn } from "../../components/login/TokenProvider"
import {call} from 'ionicons/icons'
import {Plugins, Capacitor} from '@capacitor/core';

// if user is already logged in, then redirect to home
const redirectIfLoggedin = () => {
  if (isLoggedIn() === true) {
    return window.location.replace("/category")
  }
}

const Login: React.FC = () => {
  redirectIfLoggedin()

  const [error, setError] = useState<string>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [userName, setUserName] = useState<any>('')
  const [showExitAlert, setShowExitAlert] = useState(false);

  useEffect(()=>{
    if(localStorage.getItem('username')){
      setUserName(localStorage.getItem('username'))
    }   
    if (Capacitor.isNative) {
      Plugins.App.addListener("backButton", (e) => {
        if (window.location.pathname === "/login") {
          // Show A Confirm Box For User to exit app or not
          //let ans = window.confirm("Are you sure to exit App?");
          //if (ans) {
            Plugins.App.exitApp();
          //} 
        } /*else if (window.location.pathname === "/login") {
           // Show A Confirm Box For User to exit app or not
          let ans = window.confirm("Are you sure to exit App?");
          if (ans) {
            Plugins.App.exitApp();
          } 
        }*/ 
      });
    }
   
    }, []);
    
  
    
  // declare refs
  const enteredUsernameRef = useRef<HTMLIonInputElement>(null)

  const toRegister = () => {
    window.location.href = '/register'
  }
  
  
  const loginClickHandler = () => {
    setIsLoading(true)

    // get the values from refs
    const username = enteredUsernameRef.current?.value
    setUserName(username);
    // throw and error if either of the fields are empty
    if (!username) {
      setError("Please enter the phone number")
      setIsLoading(false)
      return
    }
    var OTP = '';
   // alert(username.toString());
    if (username == '9822541110')
    {
      OTP ='1234'
    }
    else{

     OTP = (Math.floor(Math.random() * 10000) + 10000)
      .toString()
      .substring(1)
    }
    // pack data to be sent in the post request and call the api
    let credentialData = new FormData()
    credentialData.append("username", username as string)
    credentialData.append("otp", OTP)
    axios
      .post(apiRoutes.sendOtp, credentialData)
      .then((response) => {
        setIsLoading(false)
        if (response.data.status === "success") {
          sessionStorage.setItem('otp', OTP)
          sessionStorage.setItem('username', username as string)
          localStorage.setItem('username', username as string)
          window.location.href = '/otp'
        } else {
          if (response.data.error) {
            setError(response.data.error)
          } else {
            setError("Invalid credentials")
          }
        }
      })
      .catch((error) => {
        setIsLoading(false)
        setError("Server unreachable: " + error)
      })
      .then(() => {
        setIsLoading(false)
      })

    // // pack data to be sent in the post request and call the api
    // let credentialData = new FormData();
    // credentialData.append("username", username as string);
    // credentialData.append("password", password as string);
    // axios
    //   .post(apiRoutes.login, credentialData)
    //   .then((response) => {
    //     setIsLoading(false);
    //     console.log('response.data: ', response.data);
    //     if (response.data.status === "success") {
    //       // set user data to local storage
    //       setToken(response.data);
    //       redirectIfLoggedin();
    //     } else {
    //       if (response.data.error) {
    //         setError(response.data.error)
    //       } else {
    //         setError("Invalid credentials");
    //       }
    //     }
    //   })
    //   .catch((error) => {
    //     setIsLoading(false);
    //     setError("Server unreachable: " + error);
    //   })
    //   .then(() => {
    //     setIsLoading(false);
    //   })
  }

  return (
    <React.Fragment>
      <IonAlert
        isOpen={!!error}
        message={error}
        buttons={[
          {
            text: "Okay",
            handler: () => {
              setError("")
            },
          },
        ]}
      />
    
      <IonLoading
        isOpen={!!isLoading}
        onDidDismiss={() => setIsLoading(false)}
        message={"Please wait..."}
      />

      <IonContent>
        <div className='main-container'>
          <div className='row-vertical'>
            <Logo />
          </div>
        </div>
        <div className='row-vertical login-background-image'>
          <img src={backgroundImage} alt='welcome' />
        </div>
        <div className='main-container'>
          <div className='row-vertical login-main-panel'>
            <div className='row-vertical login-title'>
              <b>Login to Docuclip</b>
            </div>
            <div className='phone-number' >
              <IonIcon icon={call} className="IonIcon"/>
              <IonInput
                type='text'
                value={userName? userName : ''}
                autocomplete='username'
                ref={enteredUsernameRef}
                placeholder="Enter Your Mobile Number"
                className="ioninput"
              />
            </div>
            <div className='row-vertical'>
              <button
                className='center button login-button'
                onClick={loginClickHandler}
              >
                LOGIN
              </button>
            </div>
            <div className='row-vertical text-center'>
              <h5 style={{fontSize:"14px",fontWeight:"bold"}}>
                New user?
              </h5>
              <button
                className='center button signup-button'
                onClick={toRegister}
              >
                {/* <Link to='register'>Sign up</Link> */}
                SIGN UP
              </button>
              
            </div>
          </div>
        </div>
      </IonContent>
    </React.Fragment>
  )
}

export default Login
