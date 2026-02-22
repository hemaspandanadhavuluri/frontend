import React, { useState, useEffect } from "react";
import "./Counsellor_Stylling/CounsellorApp.css";
import Leads from "./LeadDetails_Counsellor";
import Home_Counsellor from "./Home_Counsellor";
import Messages from "./MyNotes_Counsellor";
import CounsellorLogin from "./CounsellorLogin";
import CounsellorProfile from "./CounsellorProfile";


const CounsellorApp = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [currentUser, setCurrentUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('counsellorUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setCurrentUser(user);
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem('counsellorUser', JSON.stringify(user));
  };

  const handleLogout = () => {
    localStorage.removeItem('counsellorUser');
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <CounsellorLogin onLoginSuccess={handleLoginSuccess} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Home_Counsellor />;
      case "leads":
        return <Leads />;
      case "messages":
        return <Messages />;
    //   case "settings":
    //     return <Settings />;
      default:
        return <Home_Counsellor />;
    }
  };

  const switchToLeads = () => setActiveTab("leads");

  return (
    <div className="counsellor-app">
      <header className="app-header">
        <div className="brand" style={{display: 'flex',flexDirection: 'row',alignItems: 'center',gap: '10px'}}>
        <img src="/logo2.png" alt="Logo" className="topbar-logo" style={{borderRadius: '10%'}}/>
        <div className="topbar-title">Just Tap <span style={{color: '#ee8926'}}>Capital</span></div>
        </div>

        <nav className="nav-tabs">
          <button className={activeTab === "dashboard" ? "active" : ""} onClick={() => setActiveTab("dashboard")}>Dashboard</button>
          <button className={activeTab === "leads" ? "active" : ""} onClick={() => setActiveTab("leads")}>Leads</button>
        <button className={activeTab === "messages" ? "active" : ""} onClick={() => setActiveTab("messages")}>Messages</button>
          {/* <button onClick={() => setActiveTab("settings")}>Settings</button>  */}
        </nav>

        <div className="user-info">
          <span 
            onClick={() => setShowProfile(true)} 
            style={{cursor: 'pointer', fontWeight: 'bold'}}
            title="Click to view profile"
          >
            Welcome, {currentUser?.fullName || 'Counsellor'}
          </span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <main className="app-content">
        {activeTab === "dashboard" && <Home_Counsellor switchToLeads={switchToLeads} currentUser={currentUser} />}
        {activeTab === "leads" && <Leads currentUser={currentUser} />}
        {activeTab === "messages" && <Messages currentUser={currentUser} />}
      </main>

      {showProfile && (
        <CounsellorProfile 
          currentUser={currentUser} 
          onClose={() => setShowProfile(false)} 
        />
      )}
    </div>
  );
};

export default CounsellorApp;
