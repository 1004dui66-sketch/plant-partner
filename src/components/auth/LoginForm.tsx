'use client';

import { useActionState, useState } from 'react';
import { MaterialIcon } from '@/components/ui/MaterialIcon';
import {
  signIn,
  signInWithGoogle,
  signUp,
  type AuthResult,
} from '@/lib/actions/auth';

const BACKGROUND =
  'https://lh3.googleusercontent.com/aida/ADBb0ugYIr7g0-oKrK-k17JvxWfBfQZOOkrxTbEP3lPFM7VhN9JnRG2YSU2oRolzKUNh1yCMqgK45K7yoI3rS71rvxnz6BbMhKiVM6f6spI7KIw9rLkIbd1YvFGMkl5C3aL053_Xuwll-Drd9i80YcvUsYCpLgP-ahNIoRFYcskdA8E6In5-p-gYcFuBhg5vo7jZRc4Cwy-Lf9MRsIJR9jPRtrv7RwBOq4GikHERP4_59-_xgJvnj-RdchZSBI1Y';

const initialState: AuthResult = {};

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
        className="absolute inset-0 z-0 blur-sm scale-105"
        style={{
          backgroundImage: `url('${BACKGROUND}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-surface/80 z-0" />

      <main className="relative z-10 w-full max-w-md px-margin-mobile md:px-0">
        <div className="glass-panel rounded-xl p-8 flex flex-col items-center">
          <div className="mb-stack-lg text-center">
            <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
              Plant Buddy
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
                className="glass-input block w-full pl-12 pr-4 py-3 rounded-DEFAULT font-body-md text-body-md text-on-surface placeholder:text-outline"
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
                className="glass-input block w-full pl-12 pr-4 py-3 rounded-DEFAULT font-body-md text-body-md text-on-surface placeholder:text-outline"
                name="password"
                placeholder="비밀번호"
                required
                type="password"
                minLength={6}
              />
            </div>

            {error ? (
              <p className="text-error text-sm font-body-md">{error}</p>
            ) : null}

            <button
              type="submit"
              disabled={pending}
              className="w-full bg-primary hover:bg-primary-container disabled:opacity-60 text-on-primary font-label-md text-label-md py-4 rounded-DEFAULT transition-all duration-200 shadow-sm hover:shadow-md"
            >
              {pending
                ? '처리 중...'
                : mode === 'login'
                  ? '로그인'
                  : '회원가입'}
            </button>
          </form>

          <div className="w-full flex items-center gap-4 my-stack-md">
            <div className="flex-1 h-px bg-outline-variant/50" />
            <span className="font-label-md text-label-md text-outline">또는</span>
            <div className="flex-1 h-px bg-outline-variant/50" />
          </div>

          <form action={signInWithGoogle} className="w-full">
            <button
              type="submit"
              className="w-full glass-button-secondary text-on-surface font-label-md text-label-md py-4 rounded-DEFAULT flex items-center justify-center gap-3"
            >
              <MaterialIcon name="account_circle" />
              Google로 계속하기
            </button>
          </form>

          <div className="text-center mt-stack-md">
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
