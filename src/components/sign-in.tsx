'use client';

import type React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { signIn } from '../lib/auth-client';
import Link from 'next/link';
import { Logo } from './logo'; 
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Schema de validação com Zod
const signInSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres'),
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    await signIn.email(
      {
        email: data.email,
        password: data.password,
        callbackURL: '/dashboard',
      },
      {
        onRequest: (ctx) => {
          setLoading(true);
        },
        onResponse: (ctx) => {
          setLoading(false);
        },
        onSuccess: () => {
          router.push('/dashboard');
        },
      }
    );
  };

  const handleGoogleLogin = async () => {
    await signIn.social(
      {
        provider: 'google',
        callbackURL: 'http://localhost:3000/dashboard',
      },
      {
        onRequest: (ctx) => {
          setLoading(true);
        },
        onResponse: (ctx) => {
          setLoading(false);
        },
      }
    );
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-background px-4 py-8'>
      <div className='w-full max-w-md space-y-8'>
        {/* Logo */}
        <div className='flex flex-col items-center space-y-4'>
          <Logo />
          <h1 className='text-2xl md:text-3xl font-bold text-foreground text-center'>
            Agenda Ai
          </h1>
        </div>

        {/* Login Form */}
        <div className='bg-card rounded-lg shadow-sm border border-border p-6 md:p-8 space-y-6'>
          <div className='space-y-2 text-center'>
            <h2 className='text-xl md:text-2xl font-semibold text-foreground'>
              Login
            </h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            {/* Email Input */}
            <div className='space-y-2'>
              <Label htmlFor='email' className='sr-only'>
                Email
              </Label>
              <Input
                id='email'
                type='email'
                placeholder='usuario@email.com'
                {...register('email')}
                className='h-12 text-base'
              />
              {errors.email && (
                <p className='text-sm text-red-500'>{errors.email.message}</p>
              )}
            </div>

            {/* Password Input */}
            <div className='space-y-2'>
              <Label htmlFor='password' className='sr-only'>
                Senha
              </Label>
              <Input
                id='password'
                type='password'
                placeholder='••••••••'
                {...register('password')}
                className='h-12 text-base'
              />
              {errors.password && (
                <p className='text-sm text-red-500'>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className='flex justify-end'>
              <Link
                href='/esqueceu-senha'
                className='text-sm text-primary hover:text-primary/80 transition-colors'>
                esqueceu a senha?
              </Link>
            </div>

            {/* Login Button */}
            <Button
              type='submit'
              disabled={loading}
              className='w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground'>
              {loading ? (
                <Loader2 className='w-5 h-5 animate-spin' />
              ) : (
                'ENTRAR'
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-border'></div>
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='px-4 bg-card text-muted-foreground'>ou</span>
            </div>
          </div>

          {/* Google Login Button */}
          <Button
            type='button'
            variant='outline'
            onClick={handleGoogleLogin}
            disabled={loading}
            className='w-full h-12 text-base font-medium border-border hover:bg-secondary bg-transparent'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='20'
              height='20'
              viewBox='0 0 256 262'
              className='mr-2'>
              <path
                fill='#4285F4'
                d='M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027'
              />
              <path
                fill='#34A853'
                d='M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1'
              />
              <path
                fill='#FBBC05'
                d='M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z'
              />
              <path
                fill='#EB4335'
                d='M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251'
              />
            </svg>
            Entrar com o Google
          </Button>
        </div>

        {/* Sign Up Link */}
        <div className='text-center'>
          <p className='text-sm text-muted-foreground'>
            Não possui conta?{' '}
            <Link
              href='/criar-conta'
              className='text-primary hover:text-primary/80 font-medium transition-colors'>
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}