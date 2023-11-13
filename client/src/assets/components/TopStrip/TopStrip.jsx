import { Link } from "react-router-dom"
import "./TopStrip.scss"
import { useContext } from "react"
import AuthContext from "../Context/AuthContext"

function TopStrip() {

  const authContext = useContext(AuthContext)

  return (
    <>
      <div className="top-strip">
        <div className="left-text">Welcome to our online shop!</div>
        <div className="brand-box">
          <img src="../../../../public/general_images/logo.png" alt="logo" />
          <strong className='brand-name'>Soft Land</strong>
        </div>
        <div className="account-box">
          {authContext.isLoggedIn === true ?
            authContext.userInfo?.username :
            (<span><Link className="login-btn" to={"/login"}>Login</Link> | <Link to={"/sign-up"} className="sign-up">sign up</Link></span>)
          }
        </div>
      </div>
    </>
  )
}

export default TopStrip