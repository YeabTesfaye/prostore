import ProductList from '@/components/shared/product/product-list';
import SampleData from '@/db/sample-data';
export const metadata = {
  title: 'Home',
};
const HomePage = () => {
  return (
    <div className="space-y-8">
      <h2 className="h2-bold">Latest Products</h2>
      <ProductList title="New Arrivals " data={SampleData.products} limit={4} />
    </div>
  );
};

export default HomePage;
