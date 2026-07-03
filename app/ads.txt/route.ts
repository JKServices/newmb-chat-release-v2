export const runtime = "edge";

function normalizePublisherId(value: string | undefined) {
  if (!value) return "";

  const trimmed = value.trim();

  if (trimmed.startsWith("ca-pub-")) {
    return trimmed.replace("ca-pub-", "pub-");
  }

  return trimmed;
}

export function GET() {
  const publisherId = normalizePublisherId(
    process.env.GOOGLE_ADSENSE_PUBLISHER_ID
  );

  const body = publisherId
    ? `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`
    : "# Google AdSense publisher ID is not configured yet.\n";

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600"
    }
  });
}
