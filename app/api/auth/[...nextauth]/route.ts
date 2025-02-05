import { handlers } from '@/auth';
export const { GET, POST } = handlers;
console.log('NEXTAUTH_SECRET from env:', process.env.NEXTAUTH_SECRET);
