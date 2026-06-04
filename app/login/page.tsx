import { redirect } from 'next/navigation';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <p className="text-on-surface-variant font-body-md text-center">
          `.env.local`에 NEXT_PUBLIC_SUPABASE_URL과
          NEXT_PUBLIC_SUPABASE_ANON_KEY를 설정해 주세요.
        </p>
      </div>
    );
  }

  return <LoginForm />;
}
