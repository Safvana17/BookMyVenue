import ForgotPasswordForm from '@/presentation/components/auth/ForgotPasswordForm'
import { ROLES } from "@/constants/role";
export default function ForgotPassword() {
    return <ForgotPasswordForm  role={ROLES.USER}/>
}
