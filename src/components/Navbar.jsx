import { Link, useNavigate } from "react-router-dom";
import UserProfile from "./UserProfile";
import { FaBars } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogoClick = () => {
    if (!token || !user) {
      navigate('/');
    } else {
      switch(user.userRole) {
        case 'Coordinator':
          navigate('/coordinator');
          break;
        case 'Mentor':
          navigate('/mentor');
          break;
        case 'Intern':
          navigate('/intern');
          break;
        default:
          navigate('/');
      }
      
    }
  };

  const getAppName = () => {
    if (!token || !user) {
      return "COMPANY LOGO";
    }
    switch(user.userRole) {
      case 'Coordinator':
        return "COMPANY LOGO";
      case 'Mentor':
        return "COMPANY LOGO";
      case 'Intern':
        return "COMPANY LOGO";
      default:
        return "COMPANY LOGO";
    }
  };

  return (
    <nav className="fixed w-full bg-white shadow-md z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Sidebar Toggle Button */}
          {/* <button onClick={toggleSidebar} className="p-2 rounded-md text-gray-600 hover:text-primary hover:bg-gray-100 focus:outline-none">
            <FaBars className="h-6 w-6" />
          </button> */}
          
          <div className="flex-shrink-0 flex items-center ml-4">
            <span 
              onClick={handleLogoClick}
              className="text-primary font-bold text-xl cursor-pointer hover:text-blue-600 transition-colors duration-150"
            >
              {getAppName()}
            </span>
          </div>
          <div className="flex items-center">
            {token && user ? (
              <UserProfile />
            ) : (
              <>
                <Link to="/login" className="m-2 px-5 py-2 bg-primary text-white bg-blue-600 rounded-md hover:bg-primary-blue">
                  Login
                </Link>
                <Link to="/signup" className="m-2 px-5 py-2 bg-primary text-white bg-blue-600 rounded-md hover:bg-primary-blue">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;