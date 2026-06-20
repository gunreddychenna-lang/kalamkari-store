"use client";

import Link from "next/link";
import { useState } from "react";

type Product = {
  Code: string;
  Fabric?: string;
  Collection?: string;
  Price?: number | string;
  ["image link"]?: string;
  ["image id"]?: string;
};

type Props = {
  products: Product[];
};

function getDriveId(product: Product) {
  const rawId = product["image id"]?.trim();
  const rawLink = product["image link"]?.trim() || "";

  if (rawId && !rawId.includes("http")) {
    return rawId;
  }

  const source = rawId?.includes("http") ? rawId : rawLink;

  return (
    source.match(/\/file\/d\/([^/]+)/)?.[1] ||
    source.match(/\/d\/([^/]+)/)?.[1] ||
    source.match(/[?&]id=([^&]+)/)?.[1] ||
    ""
  );
}

function getImageSources(product: Product) {
  const id = getDriveId(product);
  const imageLink = product["image link"]?.trim() || "";

  if (!id) {
    return imageLink ? [imageLink] : [];
  }

  return [
    `https://drive.google.com/thumbnail?id=${id}&sz=w2000`,
    `https://drive.usercontent.google.com/download?id=${id}&export=view`,
    `https://drive.google.com/uc?export=view&id=${id}`,
  ];
}

function getPriceNumber(price: Product["Price"]) {
  if (typeof price === "number") {
    return price;
  }

  const cleaned = String(price || "").replace(/[^\d.]/g, "");
  const value = Number(cleaned);

  return Number.isFinite(value) ? value : null;
}

function formatPrice(price: number) {
  return price.toLocaleString("en-IN");
}

function getFabricPriceRange(products: Product[], fabric: string) {
  const prices = products
    .filter((p) => (p.Fabric || "Others") === fabric)
    .map((p) => getPriceNumber(p.Price))
    .filter((price): price is number => price !== null);

  if (prices.length === 0) {
    return "";
  }

  const min = Math.min(...prices);
  const max = Math.max(...prices);

  if (min === max) {
    return `₹${formatPrice(min)}`;
  }

  return `₹${formatPrice(min)}-₹${formatPrice(max)}`;
}

function ProductImage({ product }: { product: Product }) {
  const sources = getImageSources(product);
  const [index, setIndex] = useState(0);

  const fallback =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='800'%3E%3Crect width='100%25' height='100%25' fill='%23f3e8dc'/%3E%3C/svg%3E";

  return (
    <img
      src={sources[index] || fallback}
      alt={product.Fabric || "Kalamkari saree"}
      style={{
        width: "100%",
        height: "400px",
        objectFit: "cover",
        borderRadius: "10px",
        border: "1px solid rgba(185, 138, 53, 0.45)",
        backgroundColor: "#f3e8dc",
      }}
      onError={() => {
        if (index < sources.length - 1) {
          setIndex(index + 1);
        } else {
          setIndex(sources.length);
        }
      }}
    />
  );
}

export default function Catalogue({ products }: Props) {
  const safeProducts = Array.isArray(products) ? products : [];

  const [selected, setSelected] = useState("All");

  const collections = [
    "All",
    ...Array.from(
      new Set(safeProducts.map((p) => p.Fabric || "Others"))
    ),
  ];

  const filtered =
    selected === "All"
      ? safeProducts
      : safeProducts.filter(
          (p) => (p.Fabric || "Others") === selected
        );

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex gap-4 justify-center flex-wrap mb-12">
        {collections.map((c) => {
          const priceRange =
            c === "All"
              ? ""
              : getFabricPriceRange(safeProducts, c);

          return (
            <button
              key={c}
              onClick={() => setSelected(c)}
              className="
                traditional-button
                px-6
                py-2
                rounded-full
                min-w-[120px]
              "
            >
              <span className="block text-sm font-semibold">
                {c}
              </span>

              {priceRange && (
                <span className="block text-xs opacity-90">
                  {priceRange}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
        {filtered.map((product, index) => (
          <Link
            key={`${product.Code}-${index}`}
            href={`/product/${product.Code}`}
          >
            <div className="traditional-card cursor-pointer">
              <ProductImage product={product} />

              <div className="mt-4 text-center">
                <div className="text-2xl font-bold text-[#2b170d]">
                  {product.Fabric}
                </div>

                <div className="traditional-price text-3xl">
                  ₹{product.Price}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}