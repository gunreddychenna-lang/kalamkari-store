"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

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
  const imageLink = getValue(product, [
    "image link",
    "gimage link",
    "Drive Link",
    "Thumbnail Link",
    "thumbnail link",
  ]);

  const id = getDriveId(product);

  if (!id) {
    return imageLink ? [imageLink] : [];
  }

  const safeId = encodeURIComponent(id);

  return [
    `https://drive.google.com/thumbnail?id=${safeId}&sz=w1200`,
    `https://drive.google.com/uc?export=view&id=${safeId}`,
    `https://lh3.googleusercontent.com/d/${safeId}=w1200`,
    `https://drive.usercontent.google.com/download?id=${safeId}&export=view`,
    imageLink,
    `/api/image?id=${safeId}&size=1200`,
  ].filter(Boolean) as string[];
}

function getPriceNumber(price: string | number | undefined) {
  if (typeof price === "number") {
    return price;
  }

  const cleaned = String(price || "").replace(/[^\d.]/g, "");
  const value = Number(cleaned);

  return Number.isFinite(value) ? value : null;
}

// Format number to lakhs/crores/thousands system
function formatPrice(price: number) {
  return price.toLocaleString("en-IN");
}

// Get price ranges for each category
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
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
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
          setIndex((prev) => prev + 1);
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

  const collections = Array.from(new Set(safeProducts.map((p) => getProductFabric(p))));

  useEffect(() => {
    if (typeof window !== "undefined" && safeProducts.length > 0) {
      sessionStorage.setItem("kalamkari_products", JSON.stringify(safeProducts));
    }
  }, [safeProducts]);

  const filtered = safeProducts.filter((p) => {
    const fabric = getProductFabric(p);
    const code = getProductCode(p);
    const price = getProductPrice(p);

    const matchesCategory = selected === "All" || fabric === selected;

    const matchesSearch = `${fabric} ${code} ${price}`
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      {/* Search Bar */}
      <div className="flex justify-center mb-6">
        <div className="w-full max-w-md flex items-center gap-3 px-5 py-3 rounded-full border border-[#b98a35] bg-[#fffaf1] shadow-sm">
          <FaSearch className="text-[#7a2d12] shrink-0" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search fabric, code, price..."
            className="w-full min-w-0 bg-transparent text-[#2b170d] outline-none"
          />

          {search && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setSearch("")}
              className="text-[#7a2d12] shrink-0 cursor-pointer"
            >
              <FaTimes />
            </button>
          )}
        </div>
      </div>

      {/* Fabric Category Buttons */}
      <div className="grid grid-cols-2 gap-3 sm:flex sm:gap-4 sm:justify-center sm:flex-wrap mb-12">
        {collections.map((c) => {
          const priceRange = getFabricPriceRange(safeProducts, c);
          const isActive = selected === c;

          return (
            <button
              key={c}
              onClick={() => setSelected(isActive ? "All" : c)}
              style={{
                background: isActive
                  ? "linear-gradient(to bottom, #88220a, #4a0f02) padding-box, linear-gradient(135deg, #fff4df, #f5d58a, #b98a35, #f5d58a, #fff4df) border-box"
                  : "linear-gradient(to bottom, #250f08, #120603) padding-box, linear-gradient(135deg, #b98a35, #8a4f24, #b98a35) border-box",
                border: "2.5px solid transparent",
                borderRadius: "18px",
                boxShadow: isActive
                  ? "0 8px 24px rgba(136, 34, 10, 0.35), inset 0 0 0 1px rgba(255, 244, 223, 0.15)"
                  : "0 4px 12px rgba(0, 0, 0, 0.25)",
              }}
              className={`
                relative
                overflow-hidden
                px-5
                py-3.5
                transition-all
                duration-300
                text-center
                flex
                flex-col
                justify-center
                items-center
                cursor-pointer
                min-h-[80px]
                hover:translate-y-[-2px]
                ${
                  isActive
                    ? "text-[#ffffff] scale-[0.98] ring-2 ring-[#f5d58a]/40"
                    : "text-[#fff4df]/80 hover:text-white"
                }
              `}
            >
              {/* Gold Peacock Watermark inside button */}
              <svg
                viewBox="0 0 100 100"
                className={`absolute right-1 bottom-1 h-9 w-9 text-[#d8aa55] pointer-events-none transition-opacity duration-300 ${
                  isActive ? "opacity-35" : "opacity-15"
                }`}
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M 30,70 C 22,67 15,60 15,47 C 15,35 25,30 27,20 C 29,14 25,10 26.5,5 C 27,3 29.5,2.5 30.5,4 C 31.5,6 30,9 31,12.5 C 32,17.5 37.5,22.5 40,30 C 42.5,37.5 40,47.5 36,57.5 C 34,62.5 30,70 30,70 Z" />
                <path d="M 37.5,32.5 C 47.5,27.5 62.5,25 75,35 C 85,43 87.5,55 82.5,65 C 77.5,75 62.5,82.5 47.5,77.5 C 40,75 36,67.5 36,67.5" stroke="currentColor" strokeWidth="1" fill="none" />
                <circle cx="25" cy="11" r="1" />
              </svg>

              {/* Fabric Name */}
              <span className="block text-xs sm:text-sm font-black tracking-wider uppercase leading-tight relative z-10 pr-2">
                {c}
              </span>

              {/* Price Range - Stylized & High Visibility */}
              {priceRange && (
                <span
                  className={`block text-[11px] sm:text-xs font-black mt-2 px-2.5 py-0.5 rounded-full border border-dashed relative z-10 shadow-inner ${
                    isActive
                      ? "text-[#ffffff] bg-[#aa2c0e] border-[#fff4df]/40"
                      : "text-[#f5d58a] bg-[#1a0a05] border-[#b98a35]/30"
                  }`}
                >
                  {priceRange}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((product, index) => {
          const code = getProductCode(product);
          const fabric = getProductFabric(product);
          const price = getProductPrice(product);
          const qty = getProductQty(product);
          const isSoldOut = qty <= 0;

          const card = (
            <div
              className={`traditional-card ${
                isSoldOut ? "cursor-not-allowed opacity-70" : "cursor-pointer"
              }`}
            >
              <div className="relative">
                <ProductImage product={product} />

                <div
                  className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold ${
                    isSoldOut
                      ? "bg-red-700 text-white border border-red-800"
                      : "bg-green-700 text-white"
                  }`}
                >
                  {isSoldOut ? "Sold Out" : "20% OFF"}
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
            <Link key={`${code}-${index}`} href={`/product/${code}`}>
              {card}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
