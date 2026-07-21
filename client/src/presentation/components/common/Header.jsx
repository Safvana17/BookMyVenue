import { Heart, User, LogOut } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from "@/redux/slices/authSlice" 

const Header = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Fetch authentication state from Redux
  const { user, isAuthenticated } = useSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <div>
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="bg-slate-900 text-white w-12 h-12 rounded-xl flex items-center justify-center">
              🏛️
            </div>
            <h1 className="text-2xl font-bold">Book My Venue</h1>
          </div>

          {/* Action Items */}
          <div className="flex items-center gap-4">
            <Heart className="w-5 h-5 cursor-pointer text-gray-600 hover:text-gray-900" />

            {/* CONDITIONAL RENDERING BLOCK */}
            {isAuthenticated && user ? (
              <>
                {/* Logged In: Displays Username & Logout */}
                <span className="text-gray-700 font-medium">
                  Hi, {user.fullName || user.username || user.name || 'User'}
                </span>

                <button 
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl font-medium flex items-center gap-2 transition-colors"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* Logged Out: Sign In removed, showing Register / Get Started */}
                <button 
                  onClick={() => navigate('/register')} // Adjust path if different
                  className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-xl font-medium transition-colors"
                >
                  Get Started
                </button>
              </>
            )}
          </div>

        </div>
      </header>
    </div>
  )
}

export default Header