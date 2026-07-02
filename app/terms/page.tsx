import Link from "next/link";

export const metadata = {
  title: "Terms of Service | 뉴MB.chat",
  description: "Terms of Service for 뉴MB.chat."
};

export default function TermsPage() {
  return (
    <main className="legal-page">
      <section className="legal-card">
        <Link href="/" className="back-link">
          ← Back to 뉴MB.chat
        </Link>

        <h1>Terms of Service</h1>

        <p>
          By using 뉴MB.chat, you agree to these Terms of Service.
        </p>

        <h2>Entertainment Only</h2>

        <p>
          뉴MB.chat is provided for entertainment and parody purposes only. The
          responses are not professional advice, official statements, factual
          reporting, or endorsements.
        </p>

        <h2>Unofficial Parody Service</h2>

        <p>
          뉴MB.chat is not affiliated with, endorsed by, operated by, or
          authorized by any real person, sports organization, federation, club,
          media company, or public figure.
        </p>

        <h2>User Conduct</h2>

        <p>
          You agree not to abuse, disrupt, overload, reverse engineer, scrape, or
          misuse the service. You also agree not to use the service to generate
          illegal, harmful, harassing, defamatory, or privacy-invasive content.
        </p>

        <h2>Generated Content</h2>

        <p>
          Generated responses may be inaccurate, fictional, satirical, or
          incomplete. You are responsible for how you use, share, or interpret
          generated content.
        </p>

        <h2>Service Changes</h2>

        <p>
          We may modify, suspend, limit, or discontinue the service at any time
          without prior notice.
        </p>

        <h2>Limitation of Liability</h2>

        <p>
          To the fullest extent permitted by law, 뉴MB.chat is provided “as is”
          without warranties of any kind. We are not responsible for damages
          arising from your use of the service.
        </p>
      </section>
    </main>
  );
}
