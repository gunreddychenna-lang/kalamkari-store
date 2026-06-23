"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  useEffect,
  useState,
  type CSSProperties,
  type MouseEventHandler,
  type WheelEventHandler,
} from "react";

const URL =
  "https://script.google.com/macros/s/AKfycbzG61D7qrtAgiU5OFpb5882mlvWNgHANmUyklX1bQi1GrdFF6IwrGknciIkYGWQrLvahA/exec";

type Product = {
  Code?: string;
  Fabric?: string;
  Price?: number | string;
  Qty?: number | string;
  ["image link"]?: string;
  ["image id"]?: string;
  [key: string]: string | number | undefined;
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

function getImageSources(product: Product, size = 2000) {
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
    `https://drive.google.com/thumbnail?id=${safeId}&sz=w${size}`,
    `https://drive.google.com/uc?export=view&id=${safeId}`,
    `https://lh3.googleusercontent.com/d/${safeId}=w${size}`,
    `https://drive.usercontent.google.com/download?id=${safeId}&export=view`,
    imageLink,
    `/api/image?id=${safeId}&size=${size}`,
  ].filter(Boolean) as string[];
}

function getShareImage(product: Product) {
  const id = getDriveId(product);

  if (id) {
    return `https://drive.google.com/file/d/${id}/view`;
  }

  return getValue(product, ["image link", "gimage link", "Drive Link"]);
}

function getPriceNumber(price: Product["Price"]) {
  const cleaned = String(price || "").replace(/[^\d.]/g, "");
  const value = Number(cleaned);

  return Number.isFinite(value) ? value : 0;
}

function formatPrice(price: number) {
  return price.toLocaleString("en-IN");
}

function ProductImage({
  product,
  className,
  onClick,
  onWheel,
  style,
}: {
  product: Product;
  className?: string;
  onClick?: MouseEventHandler<HTMLImageElement>;
  onWheel?: WheelEventHandler<HTMLImageElement>;
  style?: CSSProperties;
}) {
  const sources = getImageSources(product);
  const [index, setIndex] = useState(0);

  const fallback =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='900' height='1200'%3E%3Crect width='100%25' height='100%25' fill='%23f3e8dc'/%3E%3C/svg%3E";

  return (
    <img
      src={sources[index] || fallback}
      alt={getValue(product, ["Fabric", "bFabric", "fabric"]) || "Kalamkari saree"}
      loading="eager"
      decoding="async"
      referrerPolicy="no-referrer"
      onClick={onClick}
      onWheel={onWheel}
      style={style}
      className={className}
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

export default function ProductPage() {
  const params = useParams();
  const code = String(params.code || "");

  const [product, setProduct] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState(1);

  const phoneNumber = "919063374020";

  useEffect(() => {
    const cached = sessionStorage.getItem("kalamkari_products");
    if (cached) {
      try {
        const list = JSON.parse(cached);
        if (Array.isArray(list)) {
          const found = list.find(
            (p) => String(p?.Code || "").trim() === code
          );
          if (found) {
            setProduct(found);
            return;
          }
        }
      } catch (e) {
        console.error("Failed to parse cached products:", e);
      }
    }

    async function loadProduct() {
      const res = await fetch(URL);
      const data = await res.json();

      if (!Array.isArray(data)) {
        return;
      }

      const found = data.find(
        (p) => String(p?.Code || "").trim() === code
      );

      setProduct(found || null);
    }

    loadProduct();
  }, [code]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto p-6 text-center text-[#7a2d12] font-semibold">
        Loading product details...
      </div>
    );
  }

  const sareeCode = String(product.Code || code);
  const shareImg = getShareImage(product);

  const qtyStr = getValue(product, ["Qty", "fQty", "qty"]);
  const qty = qtyStr === "" ? 1 : Number(qtyStr);
  const isSoldOut = qty <= 0;

  const originalPrice = getPriceNumber(product.Price);
  const discountedPrice = Math.round(originalPrice * 0.8);

  const whatsapp = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    `Hi, I am interested in this saree.\n\nSaree Code: ${sareeCode}\n\nImage:\n${shareImg}`
  )}`;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
      {/* Back Button Link */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-[#7a2d12] hover:text-[#6b230f] font-bold mb-5 text-sm sm:text-base transition"
      >
        ← Back to Catalogue
      </Link>

      <div className="grid md:grid-cols-2 gap-6 md:gap-10">
        {/* Product Image Section */}
        <div className="relative">
          <ProductImage
            product={product}
            onClick={() => setOpen(true)}
            className="w-full rounded-2xl cursor-zoom-in shadow-md border border-[#b98a35]/40"
          />
        </div>

        {/* Product Details Section */}
        <div className="flex flex-col justify-center">
          {/* Header Badges */}
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <span className="bg-[#fffaf1] border border-[#b98a35] text-[#7a2d12] px-3 py-1 rounded-full text-xs font-bold shadow-sm">
              Code: {sareeCode}
            </span>
            {isSoldOut ? (
              <span className="bg-red-100 border border-red-300 text-red-800 px-3 py-1 rounded-full text-xs font-bold">
                Sold Out
              </span>
            ) : (
              <span className="bg-green-100 border border-green-300 text-green-800 px-3 py-1 rounded-full text-xs font-bold">
                In Stock
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-black text-[#2b170d] mb-4 leading-tight">
            {product.Fabric} Saree
          </h1>

          {/* Pricing Box */}
          {originalPrice > 0 ? (
            <div className="bg-[#fffaf1] border border-[#f5d58a] rounded-2xl p-4 mb-6 shadow-sm">
              <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">
                Special Offer Price
              </div>
              <div className="flex items-baseline gap-2.5 flex-wrap">
                <span className="text-3xl sm:text-4xl font-black text-[#6b230f]">
                  ₹{formatPrice(discountedPrice)}
                </span>
                <span className="text-base sm:text-lg text-gray-400 line-through font-medium">
                  ₹{formatPrice(originalPrice)}
                </span>
                <span className="bg-green-700 text-white text-xs px-2.5 py-1 rounded-full font-bold">
                  20% OFF
                </span>
              </div>
              <div className="text-xs text-[#8a4f24] mt-2 font-semibold">
                ✨ Save ₹{formatPrice(originalPrice - discountedPrice)} on this purchase
              </div>
            </div>
          ) : (
            <div className="bg-[#fffaf1] border border-[#f5d58a] rounded-2xl p-4 mb-6 shadow-sm">
              <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">
                Price
              </div>
              <span className="text-3xl sm:text-4xl font-black text-[#6b230f]">
                ₹{product.Price}
              </span>
            </div>
          )}

          {/* Trust Highlights Section */}
          <div className="border border-dashed border-[#b98a35]/60 bg-[#fffaf1]/50 rounded-2xl p-4 mb-6">
            <h3 className="text-xs font-bold text-[#7a2d12] uppercase tracking-wider mb-3">
              Product Highlights
            </h3>
            <ul className="space-y-2.5 text-sm text-[#2b170d]">
              <li className="flex items-start gap-2.5">
                <span className="text-base shrink-0">🎨</span>
                <span>
                  <b>100% Hand-Painted Kalamkari:</b> Traditional pen artwork crafted by Srikalahasthi weavers.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-base shrink-0">🧵</span>
                <span>
                  <b>Authentic Fabric:</b> Lightweight, pure traditional threads with premium finish.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-base shrink-0">🚚</span>
                <span>
                  <b>Express Delivery:</b> Packed carefully and shipped safely directly to your doorstep.
                </span>
              </li>
            </ul>
          </div>

          {/* WhatsApp CTA Button */}
          <div className="mt-2 mb-6">
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="relative overflow-hidden flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#4b1609] to-[#2d1109] text-[#fff4df] font-bold text-lg px-8 py-4 rounded-xl text-center shadow-md border border-[#c99a44] hover:from-[#5c1e0e] hover:to-[#3e170c] active:scale-98 transition duration-150 w-full"
            >
              {/* Peacock Watermark Inside Button */}
              <svg
                viewBox="0 0 100 100"
                className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 text-[#c99a44] opacity-25 pointer-events-none"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M 30,70 C 22,67 15,60 15,47 C 15,35 25,30 27,20 C 29,14 25,10 26.5,5 C 27,3 29.5,2.5 30.5,4 C 31.5,6 30,9 31,12.5 C 32,17.5 37.5,22.5 40,30 C 42.5,37.5 40,47.5 36,57.5 C 34,62.5 30,70 30,70 Z" />
                <path d="M 37.5,32.5 C 47.5,27.5 62.5,25 75,35 C 85,43 87.5,55 82.5,65 C 77.5,75 62.5,82.5 47.5,77.5 C 40,75 36,67.5 36,67.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                <circle cx="25" cy="11" r="1" />
              </svg>

              <span className="text-2xl leading-none">💬</span> Chat on WhatsApp
            </a>
            <p className="text-xs text-center text-gray-500 mt-2 font-medium">
              Click to verify availability and order directly.
            </p>
          </div>
        </div>
      </div>

      {/* Lightbox / Zoom Modal */}
      {open && (
        <div
          className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 overflow-hidden"
          onClick={() => {
            setOpen(false);
            setZoom(1);
          }}
        >
          <button
            onClick={() => {
              setOpen(false);
              setZoom(1);
            }}
            className="absolute top-6 right-6 w-14 h-14 rounded-full bg-white text-black text-3xl font-bold z-50 shadow-lg"
          >
            ×
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white text-black px-4 py-2 rounded-full text-sm font-bold z-50">
            Zoom: {zoom.toFixed(1)}x
          </div>

          <ProductImage
            product={product}
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => {
              e.preventDefault();

              if (e.deltaY < 0) {
                setZoom((v) => Math.min(v + 0.5, 8));
              } else {
                setZoom((v) => Math.max(v - 0.5, 1));
              }
            }}
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "center center",
            }}
            className="max-w-full max-h-screen transition cursor-zoom-in"
          />
        </div>
      )}
    </div>
  );
}
