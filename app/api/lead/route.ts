export async function GET() {
  const res =
    await fetch(
      "https://script.google.com/macros/s/AKfycbyuYiI5ReuqydCKT-rkGGkeizGVAi_iO4bqmetJUARpqIeVFaKD7oesqqFkXgqs4CA8tA/exec",
      {
        cache:
          "no-store",
      }
    );

  const text =
    await res.text();

  return new Response(
    text,
    {
      headers: {
        "Content-Type":
          "application/json",
      },
    }
  );
}