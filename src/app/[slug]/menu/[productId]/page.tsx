import { notFound } from "next/navigation";

import { db } from "@/lib/prisma";

import ProductDetails from "./components/product-details";
import ProductHeader from "./components/product-header";

interface PageParams {
  slug: string;
  productId: string;
}

const ProductPage = async ({ params }: { params: PageParams }) => {
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
