'use client';
import Link from 'next/link';
import { useActionState } from 'react';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signInWithCredentials } from '@/lib/actions/user.actions';
import { signInDefaultValues } from '@/lib/constants';
import SignInButton from './signin-button';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

const CredentialsSignInForm = () => {
  const [data, action] = useActionState(signInWithCredentials, {
    message: '',
    success: false,
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  // State for password visibility
  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

  return (
    <form action={action}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-6">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            required
            type="email"
            defaultValue={signInDefaultValues.email}
            autoComplete="email"
          />
        </div>

        {/* Password Input Field with Toggle Button */}
        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              required
              type={passwordVisible ? 'text' : 'password'}
              defaultValue={signInDefaultValues.password}
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

        <div>
          <SignInButton />
        </div>

        {data && !data.success && (
          <div className="text-center text-destructive">{data.message}</div>
        )}

        <div className="text-sm text-center text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link target="_self" className="link" href="/sign-up">
            Sign Up
          </Link>
        </div>
      </div>
    </form>
  );
};

export default CredentialsSignInForm;
