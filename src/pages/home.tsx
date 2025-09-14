import { useNavigate } from 'react-router-dom';
import { logout } from '@/services/auth-service';
import { showToast } from '@/components/ui/toast-config';

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      logout();
      navigate('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
      showToast.error('Error during logout');
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      <header className="bg-white px-4 py-4 shadow dark:bg-gray-800">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Engage UI</h1>
          <button
            onClick={handleLogout}
            className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:bg-red-700 dark:hover:bg-red-600"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="container mx-auto flex flex-1 flex-col px-4 py-8">
        <div className="mb-8 rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Welcome to Engage UI</h2>
          <p className="text-gray-700 dark:text-gray-300">
            You are now logged in to your account. This is your dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Card {item}</h3>
              <p className="text-gray-700 dark:text-gray-300">
                This is a sample card that demonstrates the UI.
              </p>
            </div>
          ))}
        </div>
      </main>

      <footer className="bg-white px-4 py-6 shadow-inner dark:bg-gray-800">
        <div className="container mx-auto text-center text-sm text-gray-600 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Engage UI. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;
