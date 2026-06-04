import { getProductBySlug } from "@/queries/products";
import { getCategories } from "@/queries/categories";
import { getBrands } from "@/queries/brands";
import { getSizes } from "@/queries/sizes";
import { getColors } from "@/queries/colors";
import EditForm from "./components/EditForm";
import SeoForm from "../../../components/SeoForm";
import { getSeoByProductId } from "@/queries/seos";

const ProductEditPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    const productResponse = await getProductBySlug(slug);
    const categoriesResponse = await getCategories();
    const brandsResponse = await getBrands();
    const sizesResponse = await getSizes();
    const colorsResponse = await getColors();

    const productSeo = await getSeoByProductId(productResponse._id);


    return (
        <div className="space-y-8">
            <EditForm
                product={productResponse}
                categories={categoriesResponse}
                brands={brandsResponse}
                sizes={sizesResponse}
                colors={colorsResponse}
            />
            <SeoForm
                productId={productResponse._id}
                productName={productResponse.name}
                productNameBn={productResponse.nameBn}
                pageType="product"
                existingSeo={productSeo}
                isEdit={!!productSeo}
            />
        </div>
    );
};

export default ProductEditPage;