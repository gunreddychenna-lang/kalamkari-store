import Catalogue from "./Catalogue";

const URL =
"https://script.google.com/macros/s/AKfycbzG61D7qrtAgiU5OFpb5882mlvWNgHANmUyklX1bQi1GrdFF6IwrGknciIkYGWQrLvahA/exec";

async function getProducts() {
  try {

    const res =
      await fetch(
        URL,
        {
          cache:
            "no-store",
        }
      );

    const data =
      await res.json();

    if (
      !Array.isArray(
        data
      )
    ) {
      return [];
    }

    return data.filter(
      (
        p
      ) =>
        p?.Code &&
        p?.Code
          .trim()
          .length > 0
    );

  } catch {

    return [];
  }
}

export default async function Home() {

  const products =
    await getProducts();

  return (
    <main className="min-h-screen bg-[#faf5ef]">

      <section className="text-center pt-10">

        <h1
          className="
          text-7xl
          font-black
          text-[#6b2f10]
        "
        >
          KAILASH
        </h1>

        <h2
          className="
          text-4xl
          text-[#8a4f24]
        "
        >
          KALAMKARI SAREES
        </h2>

        <p
          className="
          mt-4
          text-lg
        "
        >
          Handcrafted Pen Kalamkari Sarees Collection
        </p>

      </section>

      <Catalogue
        products={
          products
        }
      />

    </main>
  );
}