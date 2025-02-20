import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Notifications from '../notifications/Notifications';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img className="h-8 w-auto" src="/logo.png" alt="Logo" />
            </Link>
            {user && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/donations"
                  className="inline-flex items-center px-1 pt-1 text-gray-900"
                >
                  Donations
                </Link>
                <Link
                  to="/volunteer/tasks"
                  className="inline-flex items-center px-1 pt-1 text-gray-900"
                >
                  Tasks
                </Link>
                <Link
                  to="/emergency"
                  className="inline-flex items-center px-1 pt-1 text-gray-900"
                >
                  Emergency
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center">
            {user ? (
              <>
                <Notifications />
                <button
                  onClick={logout}
                  className="ml-4 px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 