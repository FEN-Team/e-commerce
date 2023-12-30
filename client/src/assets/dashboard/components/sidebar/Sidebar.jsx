import LineStyleIcon from "@mui/icons-material/LineStyle";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import StorefrontIcon from "@mui/icons-material/Storefront";
import DynamicFeedIcon from "@mui/icons-material/DynamicFeed";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";

import { Link } from "react-router-dom";

import "./Sidebar.css";

const clickedSidebar=(event)=>{

  document.querySelectorAll('.sidebarListItem').forEach(element=>{
    element.className="sidebarListItem";
  })
  event.target.className="sidebarListItem active";
}

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <div className="sidebarMenu">
          <h3 className="sidebarTitle"></h3>
          <ul className="sidebarList">
            <Link to="/admin-panel/" className="link" onClick={clickedSidebar}>
              <li className="sidebarListItem active">
                <LineStyleIcon className="sidebarIcon" />
                Home
              </li>
            </Link>
          </ul>
        </div>

        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Users</h3>
          <ul className="sidebarList">
            <Link to="/admin-panel/users" className="link" onClick={clickedSidebar}>
              <li className="sidebarListItem">
                <PermIdentityIcon className="sidebarIcon" />
                Users
              </li>
            </Link>
            <Link to="/admin-panel/Comments" className="link" onClick={clickedSidebar}>
              <li className="sidebarListItem">
                <PermIdentityIcon className="sidebarIcon" />
                Reviews & Ratings
              </li>
            </Link>
            <Link to="/admin-panel/products" className="link" onClick={clickedSidebar}>
              <li className="sidebarListItem">
                <StorefrontIcon className="sidebarIcon" />
                Products
              </li>
            </Link>
          </ul>
        </div>

        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Tickets & Comments</h3>
          <ul className="sidebarList">
            <Link to="/admin-panel/comments" className="link" onClick={clickedSidebar}>
              <li className="sidebarListItem">
                <DynamicFeedIcon className="sidebarIcon" />
                Tickets
              </li>
            </Link>
           

            <Link to="/admin-panel/comments" className="link" onClick={clickedSidebar}>
              <li className="sidebarListItem">
                <ChatBubbleOutlineIcon className="sidebarIcon" />
                Commnets
              </li>
            </Link>

          </ul>
        </div>

        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Orders</h3>
          <ul className="sidebarList">
            <Link to="/admin-panel/Orders" className="link">
              <li className="sidebarListItem">
                <WorkOutlineIcon className="sidebarIcon" />
                Admin Orders
              </li>
            </Link>
          </ul>
        </div>
      </div>
    </div>
  );
}
