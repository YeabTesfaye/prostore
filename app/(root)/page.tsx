import { ProductCarousel } from '@/components/shared/product/product-carousel';
import ProductList from '@/components/shared/product/product-list';
import ViewAllProductsButton from '@/components/view-all-products-button';
import {
  getFeaturedProducts,
  getLatestProducts,
} from '@/lib/actions/product.actions';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home',
};
const HomePage = async () => {
  const latestProducts = await getLatestProducts();
  const featuredProducts = await getFeaturedProducts();
  return (
    <div className="space-y-8">
      {featuredProducts.length > 0 && (
        <ProductCarousel data={featuredProducts} />
      )}

      <h2 className="h2-bold">Latest Products</h2>
      <ProductList title="New Arrivals" data={latestProducts} limit={4} />
      <ViewAllProductsButton />
    </div>
  );
};

export default HomePage;
