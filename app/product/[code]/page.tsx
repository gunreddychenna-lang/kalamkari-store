"use client";

import { useState } from "react";

function drive(url: string) {
  const id = url.match(/\/d\/([^/]+)/)?.[1];

  return id
    ? `https://drive.google.com/thumbnail?id=${id}&sz=w2000`
    : url;
}

export default function ProductPage() {
  const sareeCode = "KS001";
  const price = 8500;

  const phoneNumber = "919063374020";

  // Replace this with your real UPI ID if different.
  const upiId = "9063374020@upi";

  const img = drive(
    "https://drive.google.com/file/d/1E0PaG7biF2Rwy5Sn4sW0DZjFAPdEajGo/view"
  );

  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState(1);

  const whatsapp = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    `Hi, I am interested in this saree.

Saree Code: ${sareeCode}

Image:
${img}`
  )}`;

  const upi =
    `upi://pay?pa=${encodeURIComponent(upiId)}` +
    `&pn=${encodeURIComponent("Kailash Kalamkari")}` +
    `&am=${price}` +
    `&cu=INR` +
    `&tn=${encodeURIComponent(`Payment for saree ${sareeCode}`)}`;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <img
            src={img}
            alt="Kalamkari saree"
            onClick={() => setOpen(true)}
            className="
              w-full
              rounded-xl
              cursor-zoom-in
            "
          />
        </div>

        <div>
          <h1 className="text-xl font-bold mb-6">
            Saree Details
          </h1>

          <p className="mt-5">
            <b>Fabric:</b> Banglore Silk
          </p>

          <p className="mt-5">
            <b>Price:</b> ₹{price}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-block
                bg-green-600
                text-white
                px-8
                py-4
                rounded-xl
                text-center
              "
            >
              Connect on WhatsApp
            </a>

            <a
              href={upi}
              className="
                inline-block
                bg-[#6b2f10]
                text-white
                px-8
                py-4
                rounded-xl
                text-center
                font-semibold
              "
            >
              Pay with UPI
            </a>
          </div>
        </div>
      </div>

      {open && (
        <div
          className="
            fixed
            inset-0
            bg-black/95
            flex
            items-center
            justify-center
            z-50
          "
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
            className="
              absolute
              top-6
              right-6
              w-14
              h-14
              rounded-full
              bg-white
              text-black
              text-3xl
              font-bold
              z-50
              shadow-lg
            "
          >
            ×
          </button>

          <img
            src={img}
            alt="Kalamkari saree"
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => {
              if (e.deltaY < 0) {
                setZoom((v) => Math.min(v + 0.3, 4));
              } else {
                setZoom((v) => Math.max(v - 0.3, 1));
              }
            }}
            style={{
              transform: `scale(${zoom})`,
            }}
            className="
              max-w-full
              max-h-screen
              transition
            "
          />
        </div>
      )}
    </div>
  );
}