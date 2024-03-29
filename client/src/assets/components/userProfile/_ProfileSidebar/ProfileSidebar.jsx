import style from './ProfileSidebar.module.scss'
import { useContext } from "react"
import AuthContext from '../../Context/AuthContext'
import { PiHandWavingFill } from "react-icons/pi";
import { Link } from "react-router-dom"
import { FaBoxesStacked } from "react-icons/fa6";
import { AiOutlineComment } from "react-icons/ai";
import { MdOutlineSaveAlt } from "react-icons/md";

import { TbLogout } from "react-icons/tb";
import { TiTicket } from "react-icons/ti";
import { FaEdit } from "react-icons/fa";
import { TbHelpHexagon } from "react-icons/tb";
import { showMessage } from '../../../functions';

function ProfileSidebar() {

  const logout = () => {
    showMessage({
      title: "Logout",
      text: "Are you Sure?",
      icon: "warning",
      buttons: ["No", "Yes"]
    }).then(select => {
      if (select) {
        authContext.logout({ accessToken: authContext.accessToken, refreshToken: authContext.refreshToken })
      }
    })
  }

  const authContext = useContext(AuthContext)

  return (
    <>
      <aside className={style.sidebar}>
        <div className={style.sidebar_header}>
          <p className={style.message}>
            Hi
            <strong className={style.username}>{authContext.userInfo?.username}</strong>
            <PiHandWavingFill style={{ fontSize: 40, margin: 10 }} />
          </p>
        </div>
        <div className={style.sidebar_list}>
          <Link to={"/user/profile/edit"}> <FaEdit /> edit profile </Link>
          <Link to={"/"}> <FaBoxesStacked /> my orders </Link>
          <Link to={"/user/profile/comments"}> <AiOutlineComment /> my comments </Link>
          <Link to={"/user/profile/favorites"}> <MdOutlineSaveAlt />my favorites </Link>
          <Link to={"/user/profile/ticket"}> <TiTicket /> tickets </Link>
          <Link to={"/user/profile/help"}> <TbHelpHexagon /> help </Link>
          <Link to={""} onClick={logout}> <TbLogout /> logout </Link>
        </div>
      </aside>
    </>
  )
}

export default ProfileSidebar