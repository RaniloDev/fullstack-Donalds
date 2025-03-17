import { db } from "@/lib/prisma";
import ProductHeader from "./components/product-header";
import ProductDetails from "./components/product-details";
import { notFound } from "next/navigation";

interface PageParams {
  slug: string;
  productId: string;
}

interface ProductPageProps {
  params: PageParams;
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const { productId } = params;

  const product = await db.product.findUnique({
    where: { id: productId },
    include: {
      restaurant: {
        select: {
          name: true,
          avatarImageUrl: true,
        },
      },
    },
  });

  if (!product) {
    return notFound();
  }

  return (
    <div className="flex h-full flex-col">
      <ProductHeader product={product} />
      <ProductDetails product={product} />
    </div>
  );
};

export default ProductPage;
