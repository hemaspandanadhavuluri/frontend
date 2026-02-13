import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Sidebar = ({ onLogout, currentUser, activePage, tasksCount }) => {
    const navigate = useNavigate();

    const handleNameClick = () => {
        navigate('/profile');
    };

    return (
        <aside className="sidebar-fo">
            <div className="sidebar-logo-section-fo">
                <img src="/logo2.png" alt="Logo" style={{ height: '80px', borderRadius: '15px' }} />
                <span style={{ fontSize: '35px', fontWeight: 'bold',  color: "white" ,alignSelf:'baseline',marginTop:'14px'}}>Just Tap <span style={{ color: "#ee8926" }}>CAPITAL</span></span>
            </div>
            <div style={{border: '1.3px solid #fff', borderRadius: '5px',width:'100%'}}></div>

            <div className="sidebar-nav-fo">
                <a href="/" className={`sidebar-link-fo ${activePage === 'home' ? 'active' : ''}`}>Home</a>
                <div className="badge-wrapper-fo">
                    <a href="/tasks" className={`sidebar-link-fo ${activePage === 'tasks' ? 'active' : ''}`}>My Tasks</a>
                    {tasksCount > 0 && <span className="badge-fo">{tasksCount}</span>}
                </div>
            </div>

            <div className="sidebar-user-section-fo">
                <div className="user-info-row-fo">
                    <div className="user-avatar-fo">FO</div>
                    <span style={{color:'#ee8926',fontWeight:'bold', cursor: 'pointer'}} onClick={handleNameClick}>{currentUser?.fullName}</span>
                </div>
                <div style={{border: '1.3px solid #fff', borderRadius: '5px',width:'100%'}}></div>

                <button className="btn-fo" style={{ color: '#ee8926', background: 'transparent' }} onClick={onLogout}>Logout</button>
            </div>
        </aside>
    );
};

export default Sidebar;