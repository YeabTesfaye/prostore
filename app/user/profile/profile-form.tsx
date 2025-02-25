'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { updateProfile } from '@/lib/actions/user.actions';
import { updateProfileSchema } from '@/lib/validator';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const ProfileForm = () => {
  const { data: session, update } = useSession();

  const router = useRouter();

  async function onSubmit(values: z.infer<typeof updateProfileSchema>) {
    const res = await updateProfile(values);

    if (!res.success)
      return toast({
        variant: 'destructive',
        description: res.message,
      });

    const newSession = {
      ...session,
      user: {
        ...session?.user,
        name: values.name,
        email: values.email,
      },
    };

    await update(newSession);
    toast({
      description: res.message,
    });

    // Refresh the page to reflext the updated session state
    router.refresh();
  }

  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: session?.user?.name ?? '',
      email: session?.user?.email ?? '',
    },
  });

  const { toast } = useToast();

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    // disabled
                    placeholder="Email"
                    {...field}
                    className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none 
             dark:bg-gray-800 dark:text-white dark:border-gray-600"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    placeholder="Enter your name"
                    {...field}
                    className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none 
             dark:bg-gray-800 dark:text-white dark:border-gray-600"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
          className="button col-span-2 w-full"
        >
          {form.formState.isSubmitting ? 'Submitting...' : 'Update Profile'}
        </Button>
      </form>
    </Form>
  );
};
export default ProfileForm;
