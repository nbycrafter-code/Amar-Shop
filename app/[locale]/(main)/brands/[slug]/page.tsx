// app/brands/[slug]/page.tsx
import { getBrandBySlug } from "@/queries/brands";
import { getProductsByBrandSlug } from "@/queries/products";
import { getCategories } from "@/queries/categories";
import { getSizes } from "@/queries/sizes";
import { getColors } from "@/queries/colors";
import { PageSet } from "./PageSet";

interface BrandPageProps {
  params: {
    slug: string;
  };
}

const SingleBrandPage = async ({ params }: BrandPageProps) => {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const [brand, products, categories, sizes, colors] = await Promise.all([
    getBrandBySlug(slug),
    getProductsByBrandSlug(slug),
    getCategories(),
    getSizes(),
    getColors(),
  ]);

  return (
    <PageSet
      brand={brand}
      products={products}
      categories={categories}
      sizes={sizes}
      colors={colors}
    />
  );
};

export default SingleBrandPage;