import React, { useState, useEffect } from 'react';
import AssignerPanel from './AssignerPanel';
import ConnectAssigner from './Connect_assigner';
import AssignerProfile from './AssignerProfile';

const AssignerApp = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState('home');
    const [currentUser, setCurrentUser] = useState(null);
    const [showProfile, setShowProfile] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('employeeUser');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setCurrentUser(user);
        }
    }, []);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'home':
                return <AssignerPanel onLogout={onLogout} />;
            case 'connect':
                return <ConnectAssigner />;
            default:
                return <AssignerPanel onLogout={onLogout} />;
        }
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#360d4c' }}>
            {/* Header */}
            <header style={{ backgroundColor: '#512967' }} className="shadow-md">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <h1 className="text-2xl font-bold text-white">Assigner Panel</h1>
                        <nav className="flex space-x-4">
                            <button
                                onClick={() => setActiveTab('home')}
                                className={`px-4 py-2 rounded-md ${activeTab === 'home' ? 'text-white' : 'text-white'}`}
                                style={{ backgroundColor: activeTab === 'home' ? '#bd6a4c' : 'rgba(255,255,255,0.2)' }}
                            >
                                Home
                            </button>
                            <button
                                onClick={() => setActiveTab('connect')}
                                className={`px-4 py-2 rounded-md ${activeTab === 'connect' ? 'text-white' : 'text-white'}`}
                                style={{ backgroundColor: activeTab === 'connect' ? '#bd6a4c' : 'rgba(255,255,255,0.2)' }}
                            >
                                Connect
                            </button>
                        </nav>
                    </div>
<div>
                        <span 
                            onClick={() => setShowProfile(true)} 
                            style={{cursor: 'pointer', fontWeight: 'bold', marginRight: '16px', color: 'white'}}
                            title="Click to view profile"
                        >
                            Welcome, {currentUser?.fullName || 'Assigner'}
                        </span>
                        <button onClick={onLogout} className="px-4 py-2 text-white rounded-md hover" style={{ backgroundColor: '#bd6a4c' }}>
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {renderTabContent()}
            </main>

            {showProfile && (
                <AssignerProfile 
                    currentUser={currentUser} 
                    onClose={() => setShowProfile(false)} 
                />
            )}
        </div>
    );
};

export default AssignerApp;
