import { useAuth } from "../context/useAuth"; 

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="text-xl font-bold">MonApp</div>
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <div className="flex items-center space-x-2">
              <img
                src={user.avatar || "/default-avatar.png"}
                alt="Avatar"
                className="w-8 h-8 rounded-full"
              />
              <span>{user.name}</span>
            </div>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <a
            href="/login"
            className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded"
          >
            Login
          </a>
        )}
      </div>
    </nav>
  );
}
