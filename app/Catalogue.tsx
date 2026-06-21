"use client";

import Link from "next/link";
import { useState } from "react";

type Product = {
  Code?: string;
  Fabric?: string;
  Collection?: string;
  Price?: number | string;
  Qty?: number | string;
  ["image link"]?: string;
  ["image id"]?: string;
  [key: string]: string | number | undefined;
};

type Props = {
  products: Product[];
};

function getValue(product: Product, keys: string[]) {
  for (const key of keys) {
    const value = product[key];

    if (value !== undefined && value !== null && String(value).trim()) {
      return String(value).trim();
    }
  }

  return "";
}

function getProductCode(product: Product) {
  return getValue(product, ["Code", "aCode", "code"]);
}

function getProductFabric(product: Product) {
  return getValue(product, ["Fabric", "bFabric", "fabric"]) || "Others";
}

function getProductPrice(product: Product) {
  return getValue(product, ["Price", "ePrice", "price"]);
}

function getProductQty(product: Product) {
  return Number(getValue(product, ["Qty", "fQty", "qty"]) || 0);
}

function getDriveId(product: Product) {
  const rawId = getValue(product, [
    "image id",
    "jimage id",
    "File ID",
    "file id",
    "Image ID",
  ]);

  const rawLink = getValue(product, [
    "image link",
    "gimage link",
    "Drive Link",
    "Thumbnail Link",
    "thumbnail link",
  ]);

  if (rawId && !rawId.includes("http")) {
    return rawId;
  }

  const source = rawId.includes("http") ? rawId : rawLink;

  return (
    source.match(/\/file\/d\/([^/]+)/)?.[1] ||
    source.match(/\/d\/([^/]+)/)?.[1] ||
    source.match(/[?&]id=([^&]+)/)?.[1] ||
    ""
  );
}

function getImageSources(product: Product) {
  const id = getDriveId(product);

  const imageLink = getValue(product, [
    "image link",
    "gimage link",
    "Drive Link",
    "Thumbnail Link",
    "thumbnail link",
  ]);

  if (!id) {
    return imageLink ? [imageLink] : [];
  }

  return [
    `https://drive.google.com/thumbnail?id=${id}&sz=w1200`,
    `https://drive.usercontent.google.com/download?id=${id}&export=view`,
    `https://drive.google.com/uc?export=view&id=${id}`,
  ];
}

function getPriceNumber(price: string | number | undefined) {
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
    .filter((p) => getProductFabric(p) === fabric)
    .map((p) => getPriceNumber(getProductPrice(p)))
    .filter((price): price is number => price !== null);

  if (prices.length === 0) {
    return "";
  }

  const min = Math.min(...prices);
  const max = Math.max(...prices);

  if (min === max) {
    return `₹${formatPrice(min)}`;
  }

  return `₹${formatPrice(min)} to ₹${formatPrice(max)}`;
}

function ProductImage({ product }: { product: Product }) {
  const sources = getImageSources(product);
  const [index, setIndex] = useState(0);

  const fallback =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='800'%3E%3Crect width='100%25' height='100%25' fill='%23f3e8dc'/%3E%3C/svg%3E";

  return (
    <img
      src={sources[index] || fallback}
      alt={getProductFabric(product)}
      style={{
        width: "100%",
        height: "clamp(260px, 45vw, 400px)",
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
  const [search, setSearch] = useState("");

  const collections = [
    "All",
    ...Array.from(new Set(safeProducts.map((p) => getProductFabric(p)))),
  ];

  const filtered = safeProducts.filter((p) => {
    const fabric = getProductFabric(p);
    const code = getProductCode(p);
    const price = getProductPrice(p);

    const matchesCategory =
      selected === "All" || fabric === selected;

    const matchesSearch = `${fabric} ${code} ${price}`
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="max-w-md mx-auto mb-8">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search fabric, code, price..."
          className="
            w-full
            px-5
            py-3
            rounded-full
            border
            border-[#b98a35]
            bg-[#fffaf1]
            text-[#2b170d]
            outline-none
            shadow-sm
          "
        />
      </div>

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
                px-7
                py-3
                rounded-full
                min-w-[145px]
                shadow-md
              "
            >
              <span className="block text-base font-bold leading-tight">
                {c}
              </span>

              {priceRange && (
                <span className="block text-sm font-extrabold opacity-100 mt-1 leading-tight">
                  {priceRange}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

        {filtered.map((product, index) => {
          const code = getProductCode(product);
          const fabric = getProductFabric(product);
          const price = getProductPrice(product);
          const qty = getProductQty(product);
          const isSoldOut = qty <= 0;

          const card = (
            <div
              className={`
                traditional-card
                ${isSoldOut ? "cursor-not-allowed opacity-70" : "cursor-pointer"}
              `}
            >
              <div className="relative">
                <ProductImage product={product} />

                <div
                  className={`
                    absolute
                    top-3
                    left-3
                    px-3
                    py-1
                    rounded-full
                    text-xs
                    font-bold
                    ${
                      isSoldOut
                        ? "bg-red-700 text-white"
                        : "bg-green-700 text-white"
                    }
                  `}
                >
                  {isSoldOut ? "Sold Out" : "Available"}
                </div>
              </div>

              <div className="mt-4 text-center">
                <div className="text-xl sm:text-2xl font-bold text-[#2b170d]">
                  {fabric}
                </div>

                <div className="traditional-price text-3xl sm:text-4xl leading-tight mt-1">
                  ₹{price}
                </div>
              </div>
            </div>
          );

          if (isSoldOut) {
            return <div key={`${code}-${index}`}>{card}</div>;
          }

          return (
            <Link
              key={`${code}-${index}`}
              href={`/product/${code}`}
            >
              {card}
            </Link>
          );
        })}
      </div>
    </div>
  );
}