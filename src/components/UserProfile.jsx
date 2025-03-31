import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaUserTie, FaUserGraduate } from 'react-icons/fa';

const UserProfile = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const getRoleIcon = (role) => {
        switch(role) {
            case 'Coordinator':
                return <FaUserTie className="text-black text-xl" />;
            case 'Mentor':
                 return <FaUserTie className="text-blue-500 text-xl" />;
            case 'Intern':
                return <FaUserGraduate className="text-green-500 text-xl" />;
            default:
                return <FaUser className="text-gray-500 text-xl" />;
        }
    };

    if (!user) {
        return null;
    }

    return (
        <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
                <div className="bg-gray-100 p-2 rounded-full">
                    {getRoleIcon(user.userRole)}
                </div>
                <div className="text-sm">
                    <p className="font-bold">
                        {user.fullName || "User"}
                    </p>
                    <p className="text-gray-600">
                        {user.email}
                    </p>
                    <p className="text-blue-500">
                        {user.userRole}
                    </p>
                </div>
            </div>
            <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center gap-2"
            >
                <FaSignOutAlt />
                Logout
            </button>
        </div>
    );
};

export default UserProfile;
