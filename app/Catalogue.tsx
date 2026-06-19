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

export default function Catalogue({
  products,
}: Props) {
  const safeProducts = Array.isArray(products)
    ? products
    : [];

  const [selected, setSelected] =
    useState("All");

  const collections = [
    "All",
    ...Array.from(
      new Set(
        safeProducts.map(
          (p) => p.Fabric || "Others"
        )
      )
    ),
  ];

  const filtered =
    selected === "All"
      ? safeProducts
      : safeProducts.filter(
          (p) =>
            p.Fabric === selected
        );

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div
        className="
          flex
          gap-4
          justify-center
          flex-wrap
          mb-12
        "
      >
        {collections.map((c) => (
          <button
            key={c}
            onClick={() =>
              setSelected(c)
            }
            className="
              px-6
              py-3
              rounded-full
              bg-[#6b2f10]
              text-white
            "
          >
            {c}
          </button>
        ))}
      </div>

      <div
        className="
          grid
          grid-cols-2
          md:grid-cols-3
          gap-10
        "
      >
        {filtered.map((product) => (
          <Link
            key={product.Code}
            href={`/product/${product.Code}`}
          >
            <div
  className="
    rounded-xl
    overflow-hidden
    cursor-pointer
  "
>
              <p style={{fontSize:"10px"}}>
  {product["image link"]}
</p>
<img
  src={`https://drive.google.com/thumbnail?id=${product["image id"]}&sz=w2000`}
  alt={product.Code}
  style={{
    width: "100%",
    height: "400px",
    objectFit: "cover",
    borderRadius: "12px",
  }}
/>
<p style={{ color: "red", fontSize: "20px" }}>
  {product.Code}
</p>
              <div
                className="
                  mt-4
                  text-center
                "
              >
                <div
                  className="
                    text-2xl
                    font-bold
                  "
                >
                  {product.Fabric}
                </div>

                <div
                  className="
                    text-3xl
                    text-[#6b2f10]
                    font-bold
                  "
                >
                  ₹{product.Price}
                </div>

                <div
                  className="
                    text-sm
                    text-gray-500
                    mt-2
                  "
                >
                  {product.Code}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}