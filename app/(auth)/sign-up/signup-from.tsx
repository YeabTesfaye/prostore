'use client';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useActionState, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signUp } from '@/lib/actions/user.actions';
import { signUpDefaultValues } from '@/lib/constants';
import SignUpButton from './signup-button';

const SignUpForm = () => {
  const [data, action] = useActionState(signUp, {
    message: '',
    success: false,
  });

 

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  // State for password visibility
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
  const toggleConfirmPasswordVisibility = () =>
    setConfirmPasswordVisible(!confirmPasswordVisible);

  return (
    <form action={action}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-6">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            required
            type="text"
            defaultValue={signUpDefaultValues.name}
            autoComplete="name"
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            required
            type="email"
            defaultValue={signUpDefaultValues.email}
            autoComplete="email"
          />
        </div>

        {/* Password Input */}
        <div className="relative">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              required
              type={passwordVisible ? 'text' : 'password'}
              defaultValue={signUpDefaultValues.password}
              autoComplete="current-password"
            />
            <Button
              type="button"
              variant="ghost"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={togglePasswordVisibility}
            >
              {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
            </Button>
          </div>
        </div>

        {/* Confirm Password Input */}
        <div className="relative">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              required
              type={confirmPasswordVisible ? 'text' : 'password'}
              defaultValue={signUpDefaultValues.confirmPassword}
              autoComplete="current-password"
            />
            <Button
              type="button"
              variant="ghost"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={toggleConfirmPasswordVisibility}
            >
              {confirmPasswordVisible ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </Button>
          </div>
        </div>

        <div>
          <SignUpButton />
        </div>

        {!data.success && (
          <div className="text-center text-destructive">{data.message}</div>
        )}

        <div className="text-sm text-center text-muted-foreground">
          Already have an account?{' '}
          <Link
            target="_self"
            className="link"
            href={`/sign-in?callbackUrl=${callbackUrl}`}
          >
            Sign In
          </Link>
        </div>
      </div>
    </form>
  );
};

export default SignUpForm;
