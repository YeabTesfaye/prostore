import ProductForm from '@/components/shared/admin/product-form';
import DeleteDialog from '@/components/shared/delete-dialog';
import { deleteProduct, getProductById } from '@/lib/actions/product.actions';
import { notFound } from 'next/navigation';

const UpdateProductPage = async (props: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await props.params;

  const product = await getProductById(id);

  if (!product) return notFound();

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <h1 className="h2-bold">Update Product</h1>
      <ProductForm type="Update" product={product} productId={product.id} />
    </div>
  );
};

export default UpdateProductPage;
