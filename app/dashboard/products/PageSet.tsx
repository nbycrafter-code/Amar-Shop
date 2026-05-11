"use client";
import React, { useState } from "react";
import {
  Product,
  Category,
  Brand,
  Size,
  Color,
  initialProducts,
  initialCategories,
  initialBrands,
  initialSizes,
  initialColors,
} from "../data/initialData";
import AddList from "./components/AddForm";
import TableList from "./components/TableList";
import EditModal from "./components/EditModal";
import { useApp } from "../context/AppContext";

interface ProductsViewProps {
  onAddProduct: (newProduct: Omit<Product, "id" | "sales">) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateProduct: (id: string, updatedFields: Partial<Product>) => void;
}

export const PageSet: React.FC<ProductsViewProps> = ({ productsResponse, categoriesResponse, brandsResponse, sizesResponse, colorsResponse }) => {
  const { isBn } = useApp();
  const [products, setProducts] = useState<Product[]>(productsResponse);
  const [categories, setCategories] = useState<Category[]>(categoriesResponse);
  const [brands, setBrands] = useState<Brand[]>(brandsResponse);
  const [sizes, setSizes] = useState<Size[]>(sizesResponse);
  const [colors, setColors] = useState<Color[]>(colorsResponse);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const onUpdateProduct = (id: string, updatedFields: Partial<Product>) => {
    setProducts(
      products.map((p) => (p.id === id ? { ...p, ...updatedFields } : p)),
    );
  };

  return (
    <div className="space-y-8">
      <AddList
        categories={categories}
        brands={brands}
        sizes={sizes}
        colors={colors}
        products={products}
        setProducts={setProducts}
      />
      <TableList
        products={products}
        setProducts={setProducts}
        onUpdateProduct={onUpdateProduct}
        onEditProduct={setEditingProduct}
      />
      {editingProduct && (
        <EditModal
          product={editingProduct}
          categories={categories}
          brands={brands}
          sizes={sizes}
          colors={colors}
          onUpdate={onUpdateProduct}
          onClose={() => setEditingProduct(null)}
        />
      )}
    </div>
  );
};
