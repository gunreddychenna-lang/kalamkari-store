import Catalogue from "./Catalogue";

const URL =
  "https://script.google.com/macros/s/AKfycbzG61D7qrtAgiU5OFpb5882mlvWNgHANmUyklX1bQi1GrdFF6IwrGknciIkYGWQrLvahA/exec";

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
      const code = String(p?.Code || p?.aCode || "").trim();
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
      <section className="temple-header text-center pt-12 pb-10 px-4">
        <div className="temple-name-frame inline-block">
          <h1 className="traditional-title text-7xl font-black leading-none">
            KAILASH
          </h1>

          <h2 className="traditional-subtitle text-4xl tracking-wide">
            KALAMKARI SAREES
          </h2>
        </div>

        <p className="mt-5 text-lg text-[#3b2417] font-semibold">
          Srikalahasthi Pen Kalamkari Sarees Collection
        </p>
      </section>

      <div className="temple-divider mb-10" />

      <Catalogue products={products} />

      <footer className="mt-20 bg-[#4b1609] text-[#fff4df] border-t-4 border-[#b98a35]">
        <div className="max-w-7xl mx-auto px-6 py-10 text-center">
          <h3 className="text-3xl font-bold mb-2">
            Kailash Kalamkari Sarees
          </h3>

          <p className="mb-2 text-[#f8dca7]">
            Srikalahasthi Pen Kalamkari Heritage Collection
          </p>

          <p className="mb-6 text-[#f8dca7]">
            Click an icon below to connect with us
          </p>

          <div className="flex justify-center gap-5 flex-wrap">
            <a
              href="https://www.google.com/maps/place/KAILASH+Kalamkari/data=!4m2!3m1!1s0x0:0x4c1653fa15661c6a?sa=X&ved=1t:2428&ictx=111"
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 rounded-full bg-[#fff4df] text-[#4b1609] flex items-center justify-center text-2xl hover:scale-110 transition"
              title="Google Maps"
            >
              📍
            </a>

            <a
              href="tel:+919063374020"
              className="w-14 h-14 rounded-full bg-[#fff4df] text-[#4b1609] flex items-center justify-center text-2xl hover:scale-110 transition"
              title="Call"
            >
              ☎
            </a>

            <a
              href="https://wa.me/919951821516"
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 rounded-full bg-[#fff4df] text-[#4b1609] flex items-center justify-center text-2xl hover:scale-110 transition"
              title="WhatsApp"
            >
              ✆
            </a>

            <a
              href="https://www.instagram.com/kailash_kalamkari_1984/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 rounded-full bg-[#fff4df] text-[#4b1609] flex items-center justify-center text-2xl hover:scale-110 transition"
              title="Instagram"
            >
              ◎
            </a>

            <a
              href="https://www.facebook.com/people/Kailash-Kalamkari/100069955411990/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 rounded-full bg-[#fff4df] text-[#4b1609] flex items-center justify-center text-2xl font-bold hover:scale-110 transition"
              title="Facebook"
            >
              f
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}