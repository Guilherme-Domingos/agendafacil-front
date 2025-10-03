'use client';

import type React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import Image from 'next/image';
import { Loader2, X } from 'lucide-react';
import { signUp, signIn } from '@/lib/auth-client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Schema de validação com Zod
const signUpSchema = z
  .object({
    firstName: z
      .string()
      .min(2, 'O primeiro nome deve ter pelo menos 2 caracteres'),
    lastName: z.string().min(2, 'O sobrenome deve ter pelo menos 2 caracteres'),
    email: z.string().email('Email inválido'),
    password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres'),
    passwordConfirmation: z.string(),
    image: z.instanceof(FileList).optional(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'As senhas não coincidem',
    path: ['passwordConfirmation'],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUp() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const imageFiles = watch('image');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: SignUpFormData) => {
    setLoading(true);

    try {
      const imageFile = data.image?.[0];
      const imageBase64 = imageFile
        ? await convertImageToBase64(imageFile)
        : '';

      await signUp.email({
        email: data.email,
        password: data.password,
        name: `${data.firstName} ${data.lastName}`,
        image: imageBase64,
        callbackURL: '/criar-organizacao',
        fetchOptions: {
          onResponse: () => {
            setLoading(false);
          },
          onRequest: () => {
            setLoading(true);
          },
          onError: (ctx) => {
            toast.error(ctx.error.message);
          },
          onSuccess: async () => {
            router.push('/criar-organizacao');
          },
        },
      });
    } catch (error) {
      toast.error('Erro ao criar conta');
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    try {
      await signIn.social({
        provider: 'google',
        callbackURL: 'http://localhost:3000/criar-organizacao',
      });
    } catch (error) {
      toast.error('Erro ao fazer login com Google');
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-background px-4 py-8'>
      <div className='w-full max-w-md space-y-8'>
        {/* Logo */}
        <div className='flex flex-col items-center space-y-4'>
          <Logo />
          <h1 className='text-2xl md:text-3xl font-bold text-foreground text-center'>
            Avalialrriga
          </h1>
        </div>

        {/* Sign Up Form */}
        <div className='bg-card rounded-lg shadow-sm border border-border p-6 md:p-8 space-y-6'>
          <div className='space-y-2 text-center'>
            <h2 className='text-xl md:text-2xl font-semibold text-foreground'>
              Criar Conta
            </h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            {/* Name Inputs */}
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='first-name' className='sr-only'>
                  Primeiro Nome
                </Label>
                <Input
                  id='first-name'
                  type='text'
                  placeholder='Primeiro nome'
                  {...register('firstName')}
                  className='h-12 text-base'
                />
                {errors.firstName && (
                  <p className='text-sm text-red-500'>
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='last-name' className='sr-only'>
                  Sobrenome
                </Label>
                <Input
                  id='last-name'
                  type='text'
                  placeholder='Sobrenome'
                  {...register('lastName')}
                  className='h-12 text-base'
                />
                {errors.lastName && (
                  <p className='text-sm text-red-500'>
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

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
                autoComplete='new-password'
              />
              {errors.password && (
                <p className='text-sm text-red-500'>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className='space-y-2'>
              <Label htmlFor='password_confirmation' className='sr-only'>
                Confirmar Senha
              </Label>
              <Input
                id='password_confirmation'
                type='password'
                placeholder='Confirmar senha'
                {...register('passwordConfirmation')}
                className='h-12 text-base'
                autoComplete='new-password'
              />
              {errors.passwordConfirmation && (
                <p className='text-sm text-red-500'>
                  {errors.passwordConfirmation.message}
                </p>
              )}
            </div>

            {/* Profile Image Input */}
            <div className='space-y-2'>
              <Label htmlFor='image' className='text-sm font-medium'>
                Foto de Perfil (opcional)
              </Label>
              <div className='flex items-center gap-4'>
                {imagePreview && (
                  <div className='relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0'>
                    <Image
                      src={imagePreview}
                      alt='Profile preview'
                      fill
                      className='object-cover'
                    />
                  </div>
                )}
                <div className='flex items-center gap-2 flex-1'>
                  <Input
                    id='image'
                    type='file'
                    accept='image/*'
                    {...register('image')}
                    onChange={handleImageChange}
                    className='h-12 text-base'
                  />
                  {imagePreview && (
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      className='flex-shrink-0'
                      onClick={() => {
                        setImagePreview(null);
                      }}>
                      <X className='h-4 w-4' />
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Sign Up Button */}
            <Button
              type='submit'
              disabled={loading}
              className='w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground'>
              {loading ? (
                <Loader2 className='w-5 h-5 animate-spin' />
              ) : (
                'CRIAR CONTA'
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

          {/* Google Sign Up Button */}
          <Button
            type='button'
            variant='outline'
            onClick={handleGoogleSignUp}
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
            Criar conta com o Google
          </Button>
        </div>

        {/* Sign In Link */}
        <div className='text-center'>
          <p className='text-sm text-muted-foreground'>
            Já possui conta?{' '}
            <Link
              href='/login'
              className='text-primary hover:text-primary/80 font-medium transition-colors'>
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

async function convertImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}