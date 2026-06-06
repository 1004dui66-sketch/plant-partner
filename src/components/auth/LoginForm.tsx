'use client';

import { useActionState, useState } from 'react';
import { MaterialIcon } from '@/components/ui/MaterialIcon';
import { APP_NAME } from '@/config/navigation';
import {
  signIn,
  signInWithGoogle,
  signUp,
  type AuthResult,
} from '@/lib/actions/auth';

const BACKGROUND =
  'https://lh3.googleusercontent.com/aida/ADBb0ugYIr7g0-oKrK-k17JvxWfBfQZOOkrxTbEP3lPFM7VhN9JnRG2YSU2oRolzKUNh1yCMqgK45K7yoI3rS71rvxnz6BbMhKiVM6f6spI7KIw9rLkIbd1YvFGMkl5C3aL053_Xuwll-Drd9i80YcvUsYCpLgP-ahNIoRFYcskdA8E6In5-p-gYcFuBhg5vo7jZRc4Cwy-Lf9MRsIJR9jPRtrv7RwBOq4GikHERP4_59-_xgJvnj-RdchZSBI1Y';

const initialState: AuthResult = {};

const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z" fill="currentColor" />
  </svg>
);

export const LoginForm = () => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loginState, loginAction, loginPending] = useActionState(
    signIn,
    initialState,
  );
  const [signupState, signupAction, signupPending] = useActionState(
    signUp,
    initialState,
  );

  const error = loginState.error ?? signupState.error;
  const pending = loginPending || signupPending;

  return (
    <div className="bg-background text-on-background min-h-screen flex items-center justify-center relative overflow-hidden font-body-md">
      <div
        className="absolute inset-0 z-0 blur-sm scale-105 bg-cover bg-center"
        style={{ backgroundImage: `url('${BACKGROUND}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-surface/80 z-0" />

      <main className="relative z-10 w-full max-w-md px-margin-mobile md:px-0">
        <div className="glass-panel rounded-xl p-8 md:p-[32px] flex flex-col items-center">
          <div className="mb-stack-lg text-center">
            <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
              {APP_NAME}
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-stack-sm">
              {mode === 'login'
                ? '식물과 함께하는 더 나은 일상'
                : '새 계정을 만들어 시작하세요'}
            </p>
          </div>

          <form
            action={mode === 'login' ? loginAction : signupAction}
            className="w-full space-y-stack-md"
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MaterialIcon name="mail" className="text-outline" />
              </div>
              <input
                autoComplete="email"
                className="glass-input block w-full pl-12 pr-4 py-3 rounded-DEFAULT font-body-md text-body-md text-on-surface placeholder:text-outline focus:ring-0"
                name="email"
                placeholder="이메일 주소"
                required
                type="email"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MaterialIcon name="lock" className="text-outline" />
              </div>
              <input
                autoComplete={
                  mode === 'login' ? 'current-password' : 'new-password'
                }
                className="glass-input block w-full pl-12 pr-28 py-3 rounded-DEFAULT font-body-md text-body-md text-on-surface placeholder:text-outline focus:ring-0"
                name="password"
                placeholder="비밀번호"
                required
                type="password"
                minLength={6}
              />
              {mode === 'login' ? (
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                  <button
                    type="button"
                    className="font-label-md text-label-md text-primary hover:text-primary-container transition-colors"
                  >
                    비밀번호 찾기
                  </button>
                </div>
              ) : null}
            </div>

            {error ? (
              <p className="text-error text-sm font-body-md">{error}</p>
            ) : null}

            <button
              type="submit"
              disabled={pending}
              className="w-full bg-primary hover:bg-primary-container disabled:opacity-60 text-on-primary font-label-md text-label-md py-4 rounded-DEFAULT transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
            >
              {pending
                ? '처리 중...'
                : mode === 'login'
                  ? '로그인'
                  : '회원가입'}
            </button>
          </form>

          <div className="w-full flex items-center my-stack-md">
            <div className="flex-grow border-t border-outline-variant/50" />
            <span className="mx-4 font-label-md text-label-md text-outline whitespace-nowrap">
              또는 다른 계정으로 시작하기
            </span>
            <div className="flex-grow border-t border-outline-variant/50" />
          </div>

          <div className="w-full grid grid-cols-2 gap-4 mb-stack-md">
            <form action={signInWithGoogle}>
              <button
                type="submit"
                className="w-full glass-button-secondary flex items-center justify-center py-3 rounded-DEFAULT text-on-surface font-label-md text-label-md"
              >
                <GoogleIcon />
                구글
              </button>
            </form>
            <button
              type="button"
              disabled
              title="준비 중"
              className="glass-button-secondary flex items-center justify-center py-3 rounded-DEFAULT text-on-surface font-label-md text-label-md opacity-60 cursor-not-allowed"
            >
              <FacebookIcon />
              페이스북
            </button>
          </div>

          <div className="text-center">
            <span className="font-body-md text-body-md text-on-surface-variant">
              {mode === 'login' ? '계정이 없으신가요?' : '이미 계정이 있으신가요?'}
            </span>
            <button
              type="button"
              onClick={() =>
                setMode((current) => (current === 'login' ? 'signup' : 'login'))
              }
              className="font-label-md text-label-md text-primary hover:text-primary-container ml-1 hover:underline transition-all"
            >
              {mode === 'login' ? '회원가입' : '로그인'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
