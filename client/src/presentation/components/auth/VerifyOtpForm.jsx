import { useState } from "react";
import { Mail } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { verifyOtp } from "@/redux/slices/authSlice";
import { ROUTES } from "@/constants/routes";

const VerifyOtpForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const email = location.state?.email || "";
  const role = location.state?.role;

  const { loading, error } = useSelector((state) => state.auth);

  const [otpCode, setOtpCode] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(
      verifyOtp({
        role,
        email,
        otpCode,
      })
    );

    if (verifyOtp.fulfilled.match(result)) {
      navigate(ROUTES.PUBLIC.LOGIN,{
        state:{
          role,
          email,
        },
      });
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
            <Mail className="w-8 h-8 text-amber-500" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center text-slate-800">
          Verify Your Email
        </h2>

        <p className="text-center text-slate-500 mt-2 mb-6">
          We sent a 6-digit OTP to <b>{email}</b>
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              OTP Code
            </label>

            <input
              type="text"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.trim())}
              placeholder="Enter 6-digit OTP"

              maxLength={6}
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg text-center text-lg tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate(ROUTES.PUBLIC.LOGIN)}
            className="text-slate-500 hover:text-slate-700"
          >
            Back to Sign In
          </button>
        </div>

      </div>
    </div>
  );
};

export default VerifyOtpForm;