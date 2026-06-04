// app/[locale]/product/[slug]/page.tsx
import ProductDetail from "../../components/product/ProductDetail";
import ProductTabs from "../../components/product/ProductTabs";
import RelatedProducts from "../../components/product/RelatedProducts";
import { getProductBySlug, getProductsByCategory } from "@/queries/products";
import { getProductSeoMetadata } from "@/lib/seo-metadata";
import { Metadata } from "next";
import { Breadcrumb } from "../../components/product/Breadcrumb";
import { JsonLd } from "@/app/components/JsonLd";
import { cookies } from "next/headers";

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const product = await getProductBySlug(slug);
  const cookieStore = await cookies();
  const languageCookie = cookieStore.get('language');
  const language = languageCookie?.value || 'en';

  const seoResult = await getProductSeoMetadata(product._id, product, language);
  const { jsonLd, ...metadata } = seoResult;

  return metadata;
}

const ProductDetailsPage = async ({ params }: { params: Promise<{ slug: string; locale: string }> }) => {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const cookieStore = await cookies();
  const languageCookie = cookieStore.get('language');
  const language = languageCookie?.value || 'en';


  const product = await getProductBySlug(slug);
  const seoResult = await getProductSeoMetadata(product._id, product, language);

  const products = await getProductsByCategory(product.categorySlug);

  return (
    <>
      {seoResult.jsonLd && <JsonLd data={seoResult.jsonLd} />}
      <div className="container mx-auto w-full px-4 py-5 pb-20">
        <div className="flex gap-5">
          <div className="flex-1 min-w-0">
            <Breadcrumb product={product} />
            <div className="bg-white border border-gray-200 rounded p-5">
              <ProductDetail product={product} />
            </div>
            <ProductTabs />
            <RelatedProducts products={products} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailsPage;
