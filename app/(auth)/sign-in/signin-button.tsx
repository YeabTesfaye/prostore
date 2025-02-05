import { Button } from '@/components/ui/button';
import { useFormStatus } from 'react-dom';

const SignInButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button disabled={pending} className="w-full" variant="default">
      {pending ? 'Signing In...' : 'Sign In with credentials'}
    </Button>
  );
};

export default SignInButton;
