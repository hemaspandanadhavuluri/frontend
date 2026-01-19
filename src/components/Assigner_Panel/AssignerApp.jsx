import React, { useState, useEffect } from 'react';
import AssignerPanel from './AssignerPanel';
import ConnectAssigner from './Connect_assigner';

const AssignerApp = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState('home');
    const [currentUser, setCurrentUser] = useState(null);

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
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <h1 className="text-2xl font-bold text-gray-800">Assigner Panel</h1>
                        <nav className="flex space-x-4">
                            <button
                                onClick={() => setActiveTab('home')}
                                className={`px-4 py-2 rounded-md ${activeTab === 'home' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                            >
                                Home
                            </button>
                            <button
                                onClick={() => setActiveTab('connect')}
                                className={`px-4 py-2 rounded-md ${activeTab === 'connect' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                            >
                                Connect
                            </button>
                        </nav>
                    </div>
                    <div>
                        <span className="mr-4">Welcome, {currentUser?.fullName || 'Assigner'}</span>
                        <button onClick={onLogout} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {renderTabContent()}
            </main>
        </div>
    );
};

export default AssignerApp;
