import React from "react"
import LogoImage from './logo.png'

const Logo: React.FC = () => {
  return (
    <div style={{textAlign:'center',marginTop:50}}>
    <img src={LogoImage} alt="Docuclip" width={120} height={60} /> 
    </div>
  )
}

export default Logo
