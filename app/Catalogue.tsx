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
      {/* Fabric Category Buttons */}
<div className="grid grid-cols-2 gap-3 sm:flex sm:gap-4 sm:justify-center sm:flex-wrap mb-12">
  {collections.map((c, index) => {
    const priceRange = getFabricPriceRange(safeProducts, c);
    const isActive = selected === c;

    const colors = [
      {
        bg: "linear-gradient(135deg, #f5d58a, #e8c068)",
        border: "#d4a84b",
        shadow: "rgba(212,168,75,0.4)",
      },
      {
        bg: "linear-gradient(135deg, #f5c9a6, #e8b088)",
        border: "#d4a07a",
        shadow: "rgba(212,160,122,0.4)",
      },
      {
        bg: "linear-gradient(135deg, #f5a6d5, #e888c0)",
        border: "#d47aa8",
        shadow: "rgba(212,122,168,0.4)",
      },
      {
        bg: "linear-gradient(135deg, #a6d5f5, #88c0e8)",
        border: "#7aa8d4",
        shadow: "rgba(122,168,212,0.4)",
      },
    ];

    const color = colors[index % colors.length];

    return (
      <button
        key={c}
        onClick={() => setSelected(isActive ? "All" : c)}
        style={{
          background: isActive
            ? color.bg
            : "linear-gradient(135deg, #fffaf1, #f5e6d3)",
          border: isActive
            ? `3px solid ${color.border}`
            : "2px solid #d4a84b",
          borderRadius: "18px",
          boxShadow: isActive
            ? `0 8px 24px ${color.shadow}`
            : "0 4px 12px rgba(212,168,75,0.2)",
        }}
        className="px-5 py-3 text-center transition-all duration-300 min-h-[80px]"
      >
        <span className="block text-xs sm:text-sm font-black uppercase">
          {c}
        </span>

        {priceRange && (
          <span className="block text-[11px] sm:text-xs font-bold mt-2">
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
