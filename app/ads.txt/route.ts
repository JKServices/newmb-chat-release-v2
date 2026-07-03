export const runtime = "edge";

export function GET() {
  return new Response(
    "google.com, pub-9600422626092487, DIRECT, f08c47fec0942fa0\n",
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=3600"
      }
    }
  );
}
