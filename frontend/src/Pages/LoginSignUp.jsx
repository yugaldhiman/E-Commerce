import React from 'react'
import "./Css/login.css" //.\Css\login.css

function LoginSignUp() {
  return (
    <div className="LoginSignUp" >
      <div className="container">
        <h1>Sign Up</h1>
        <div className="feild">
          <input type="text" placeholder='Enter Your Name' />
          <input type="email" placeholder='Enter Your Email' />
          <input type="pass" placeholder='Enter Your Password' />
        </div>
        <button>Continue</button>
        <p className="alredy-login"> Already have an accounnt <span>Login here</span></p>
        <div className="agree">
          <input type="checkbox" name='' id=''/>
          <p>By continuing, i agree to the term of use & privacy policy.</p>

        </div>
      </div>
    </div>
  )
}

export default LoginSignUp