import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { setAccessToken, setUser, setIsAuthenticated } from '@/redux/slices/authSlice'
import api from '@/lib/axios'
import { ROUTES } from '@/constatnts/routes'

const LoginForm = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({ email: '', password: '' })
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleChange = (e) => {
        setError(null)
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const response = await api.post('/auth/login', formData)
            const { accessToken, data } = response.data

            dispatch(setAccessToken(accessToken))
            dispatch(setUser(data.user))
            dispatch(setIsAuthenticated(true))

            navigate(ROUTES.PUBLIC.HOME)
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col justify-center px-8 md:px-16 py-16">
            <h1 className="text-3xl font-bold text-slate-800 mb-1">Welcome Back</h1>
            <p className="text-slate-500 mb-8">Sign in to your account to continue</p>

            {/* Error */}
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Email Address
                    </label>
                    <div className="relative">
                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            required
                            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                    </div>
                </div>

                {/* Password */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Password
                    </label>
                    <div className="relative">
                        <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                            className="w-full pl-10 pr-10 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>

                {/* Remember me + Forgot password */}
                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="w-4 h-4 accent-amber-500"
                        />
                        Remember me
                    </label>
                    <Link
                        to={ROUTES.PUBLIC.FORGOT_PASSWORD}
                        className="text-sm text-amber-500 hover:underline"
                    >
                        Forgot password?
                    </Link>
                </div>

                {/* Sign In button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {loading ? 'Signing in...' : 'Sign In'}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-slate-200" />
                    <span className="text-sm text-slate-400">Or continue with</span>
                    <div className="flex-1 h-px bg-slate-200" />
                </div>

                {/* Social buttons */}
                <div className="grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        className="flex items-center justify-center gap-2 border border-slate-200 rounded-lg py-3 text-sm font-medium hover:bg-slate-50 transition"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Google
                    </button>
                    <button
                        type="button"
                        className="flex items-center justify-center gap-2 border border-slate-200 rounded-lg py-3 text-sm font-medium hover:bg-slate-50 transition"
                    >
                        <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        Facebook
                    </button>
                </div>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
                Don't have an account?{' '}
                <Link to={ROUTES.PUBLIC.REGISTER} className="text-amber-500 font-medium hover:underline">
                    Sign up
                </Link>
            </p>
        </div>
    )
}

export default LoginForm
