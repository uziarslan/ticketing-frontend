import React, { useState, useContext } from "react";
import Sidebar from "./Sidebar";
import TopBanner from "./TopBanner";
import Solved from "./Solved";
import "../assets/css/styles.min.css";
import Ticket from "./Tickets";
import { AuthContext } from "../Context/AuthContext";

const AdminPortal = () => {
  const [content, setContent] = useState("request");
  const { admin } = useContext(AuthContext);

  return (
    <div className="homepage">
      <Sidebar setContent={setContent} selectedTab={content} />
      <div className="main-content">
        <TopBanner title="Admin Portal" user={admin} />
        <div className="content">
          {content === "request" && <Ticket />}
          {content === "history" && <Solved user="user" />}
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;
