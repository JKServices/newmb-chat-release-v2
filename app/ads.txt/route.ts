export async function GET() {
  const publisherId = process.env.GOOGLE_ADSENSE_PUBLISHER_ID;

  const body = publisherId
    ? `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0`
    : "# Add GOOGLE_ADSENSE_PUBLISHER_ID in Vercel after AdSense approval.";

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8"
    }
  });
}
