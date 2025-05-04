'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { registerSchema, RegisterFormValues } from '@/lib/validations/auth.schema';
import { authService } from '@/services/auth.service';
import { CreateUserDto } from '@/types/user.types';

import Input from '../ui/Input';
import Button from '../ui/Button';

interface ApiError {
  message: string;
  status?: number;
}

export default function RegisterForm() {
  const router = useRouter();
  const [authError, setAuthError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: CreateUserDto) => authService.register(data),
    onSuccess: () => {
      router.push('/dashboard');
    },
    onError: (error: ApiError) => {
      setAuthError(error.message || 'Error al registrar usuario. Inténtalo de nuevo.');
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setAuthError(null);
    // Create a new object with only the fields we need
    const registerData: CreateUserDto = {
      name: data.name,
      email: data.email,
      password: data.password,
    };
    registerMutation.mutate(registerData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {authError && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4">
          {authError}
        </div>
      )}
      
      <Input
        label="Nombre"
        type="text"
        {...register('name')}
        error={errors.name?.message}
        placeholder="Tu nombre"
      />
      
      <Input
        label="Email"
        type="email"
        {...register('email')}
        error={errors.email?.message}
        placeholder="tu@email.com"
      />
      
      <Input
        label="Contraseña"
        type="password"
        {...register('password')}
        error={errors.password?.message}
        placeholder="******"
      />
      
      <Input
        label="Confirmar Contraseña"
        type="password"
        {...register('confirmPassword')}
        error={errors.confirmPassword?.message}
        placeholder="******"
      />
      
      <Button 
        type="submit" 
        variant="primary" 
        fullWidth
        disabled={isSubmitting || registerMutation.isPending}
      >
        {(isSubmitting || registerMutation.isPending) ? 'Registrando...' : 'Registrarse'}
      </Button>
      
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          ¿Ya tienes una cuenta?{' '}
          <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
            Iniciar Sesión
          </Link>
        </p>
      </div>
    </form>
  );
} 