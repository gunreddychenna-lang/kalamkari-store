import Catalogue from "./Catalogue";
import {
  FaWhatsapp,
  FaInstagram,
  FaFacebookF,
  FaMapMarkerAlt,
} from "react-icons/fa";

const URL =
  "https://script.google.com/macros/s/AKfycbxGqk4NZAfZV_5bfVUQT_KLbTEIS33q_bVLxSBYSZYzALph7IL6n3XAy1gobhkEhE-YRw/exec";

async function getProducts() {
  try {
    const res = await fetch(URL, {
      cache: "no-store",
    });

    const data = await res.json();

    if (!Array.isArray(data)) {
      return [];
    }

    return data.filter((p) => {
      const code = String(p?.Code || "").trim();
      return code.length > 0;
    });
  } catch {
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="min-h-screen">
      {/* Top Bar */}
      <div className="bg-[#6b230f] text-white py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-center">
          <a href="tel:+919951821516">
            📞 +91 99518 21516
          </a>
        </div>
      </div>

      {/* Header */}
      <section className="temple-header text-center pt-8 pb-10 px-4">
        <div className="temple-name-frame inline-block">
          <h1 className="traditional-title text-3xl sm:text-5xl lg:text-6xl font-black whitespace-nowrap">
            Kailash Kalamkari Sarees
          </h1>
        </div>

        {/* Social Buttons */}
        <div className="flex justify-center gap-4 flex-wrap mt-4">
          <a
            href="https://wa.me/919951821516"
            target="_blank"
            className="traditional-button p-3 rounded-full text-xl"
          >
            <FaWhatsapp />
          </a>

          <a
            href="https://www.google.com/maps/place/KAILASH+Kalamkari"
            target="_blank"
            className="traditional-button p-3 rounded-full text-xl"
          >
            <FaMapMarkerAlt />
          </a>

          <a
            href="https://www.instagram.com/kailash_kalamkari_1984/"
            target="_blank"
            className="traditional-button p-3 rounded-full text-xl"
          >
            <FaInstagram />
          </a>

          <a
            href="https://www.facebook.com/people/Kailash-Kalamkari/100069955411990/"
            target="_blank"
            className="traditional-button p-3 rounded-full text-xl"
          >
            <FaFacebookF />
          </a>
        </div>
      </section>

      <div className="temple-divider mb-4" />

      <div id="catalogue">
        <Catalogue products={products} />
      </div>
    </main>
  );
}
