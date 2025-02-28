import { getUserByUserId } from '@/data/user';
import { notFound } from 'next/navigation';
import UpdateUserForm from './update-user-form';

const UpdateUserPage = async (props: { params: Promise<{ id: string }> }) => {
  const { id } = await props.params;
  const user = await getUserByUserId(id);

  if (!user) notFound();

  return (
    <div className="space-y-8 max-w-lg mx-auto">
      <h1 className="h2-bold">Update User</h1>
      <UpdateUserForm user={user} />
    </div>
  );
};

export default UpdateUserPage;
