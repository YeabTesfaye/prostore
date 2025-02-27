import DeleteDialog from '@/components/shared/delete-dialog';
import { deleteProduct } from '@/lib/actions/product.actions';

const ProductDetailsPage = async (props: {
  params: Promise<{ id: string }>;
}) => {
  const params = await props.params;
  const { id } = params;

  return <DeleteDialog id={id} action={deleteProduct} />;
};

export default ProductDetailsPage;
