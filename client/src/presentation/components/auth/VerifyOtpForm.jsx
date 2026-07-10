import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import api from '@/lib/axios'
import { API_ROUTES } from '@/constatnts/apiRoutes'
import { ROUTES } from '@/constatnts/routes'

const VerifyOtpForm = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const email = location.state?.email || ''

    const [otpCode, setOtpCode] = useState('')
    const [loading, setLoading] = useState(false)
    const [resendLoading, setResendLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            await api.post(API_ROUTES.AUTH.VERIFY_OTP, { email, otpCode })
            navigate(ROUTES.PUBLIC.LOGIN)
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleResend = async () => {
        setResendLoading(true)
        setError(null)
        setSuccess(null)

        try {
            await api.post(API_ROUTES.AUTH.RESEND_OTP, { email })
            setSuccess('New OTP sent to your email.')
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend OTP.')
        } finally {
            setResendLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md">

                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail size={28} className="text-amber-500" />
                </div>

                <h1 className="text-2xl font-bold text-slate-800 text-center mb-1">Verify Your Email</h1>
                <p className="text-slate-500 text-sm text-center mb-6">
                    We sent a 6-digit OTP to <strong>{email}</strong>
                </p>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>
                )}
                {success && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">{success}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">OTP Code</label>
                        <input
                            type="text"
                            value={otpCode}
                            onChange={(e) => { setError(null); setOtpCode(e.target.value) }}
                            placeholder="Enter 6-digit OTP"
                            maxLength={6}
                            required
                            className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm text-center tracking-widest text-lg font-bold focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                    </div>

                    <button type="submit" disabled={loading}
                        className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition disabled:opacity-60">
                        {loading ? 'Verifying...' : 'Verify OTP'}
                    </button>
                </form>

                <div className="mt-4 text-center text-sm text-slate-500">
                    Didn't receive it?{' '}
                    <button onClick={handleResend} disabled={resendLoading} className="text-amber-500 font-medium hover:underline disabled:opacity-60">
                        {resendLoading ? 'Sending...' : 'Resend OTP'}
                    </button>
                </div>

                <div className="mt-3 text-center">
                    <Link to={ROUTES.PUBLIC.LOGIN} className="text-sm text-slate-400 hover:underline">
                        Back to Sign In
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default VerifyOtpForm
