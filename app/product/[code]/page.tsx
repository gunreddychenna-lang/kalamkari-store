"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const URL =
  "https://script.google.com/macros/s/AKfycbzG61D7qrtAgiU5OFpb5882mlvWNgHANmUyklX1bQi1GrdFF6IwrGknciIkYGWQrLvahA/exec";

type Product = {
  Code: string;
  Fabric?: string;
  Price?: number | string;
  ["image link"]?: string;
  ["image id"]?: string;
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

function getImage(product: Product) {
  const id = getDriveId(product);

  if (id) {
    return `https://drive.google.com/thumbnail?id=${id}&sz=w2000`;
  }

  return product["image link"]?.trim() || "";
}

function getPriceNumber(price: Product["Price"]) {
  const cleaned = String(price || "").replace(/[^\d.]/g, "");
  const value = Number(cleaned);

  return Number.isFinite(value) ? value : 0;
}

export default function ProductPage() {
  const params = useParams();
  const code = String(params.code || "");

  const [product, setProduct] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState(1);

  const phoneNumber = "919063374020";
  const upiId = "9951821516-3@axl";

  useEffect(() => {
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
      <div className="max-w-7xl mx-auto p-6">
        Loading product...
      </div>
    );
  }

  const sareeCode = product.Code;
  const price = getPriceNumber(product.Price);
  const img = getImage(product);

  const whatsapp = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    `Hi, I am interested in this saree.

Saree Code: ${sareeCode}

Image:
${img}`
  )}`;

  const upi =
    `upi://pay?pa=${encodeURIComponent(upiId)}` +
    `&pn=${encodeURIComponent("Kailash Kalamkari")}` +
    `&am=${encodeURIComponent(String(price))}` +
    `&cu=INR` +
    `&tn=${encodeURIComponent(`Payment for saree ${sareeCode}`)}`;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <img
            src={img}
            alt={product.Fabric || "Kalamkari saree"}
            onClick={() => setOpen(true)}
            className="w-full rounded-xl cursor-zoom-in"
          />
        </div>

        <div>
          <h1 className="text-xl font-bold mb-6">
            Saree Details
          </h1>

          <p className="mt-5">
            <b>Fabric:</b> {product.Fabric}
          </p>

          <p className="mt-5">
            <b>Price:</b> ₹{product.Price}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-600 text-white px-8 py-4 rounded-xl text-center"
            >
              Connect on WhatsApp
            </a>

            <a
              href={upi}
              className="inline-block bg-[#6b2f10] text-white px-8 py-4 rounded-xl text-center font-semibold"
            >
              Pay with UPI
            </a>
          </div>
        </div>
      </div>

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

          <img
            src={img}
            alt={product.Fabric || "Kalamkari saree"}
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