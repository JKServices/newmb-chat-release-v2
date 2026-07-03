import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of Use for 뉴MB.chat."
};

export default function TermsPage() {
  return (
    <main className="legal-page">
      <article className="legal-card">
        <a className="back-link" href="/">
          ← Back to 뉴MB.chat
        </a>

        <h1>Terms of Use</h1>

        <p>Last updated: July 2, 2026</p>

        <p>
          By using 뉴MB.chat, you agree to these Terms of Use. If you do not
          agree, please do not use the site.
        </p>

        <h2>Entertainment only</h2>

        <p>
          뉴MB.chat is an unofficial parody AI service for entertainment and meme
          creation. Responses are fictional and should not be treated as advice,
          factual statements, official comments, or real quotes.
        </p>

        <h2>No affiliation</h2>

        <p>
          뉴MB.chat is not affiliated with, endorsed by, sponsored by, or
          officially connected to any real person, football club, federation,
          company, or organization.
        </p>

        <p>
          Any resemblance to public interview styles, football culture, or meme
          formats is used for parody and commentary purposes.
        </p>

        <h2>User responsibility</h2>

        <p>
          You are responsible for the questions you submit and the way you use,
          save, or share generated responses and images.
        </p>

        <p>
          Do not use 뉴MB.chat to create or share content that is unlawful,
          harmful, defamatory, harassing, hateful, threatening, invasive of
          privacy, or otherwise abusive.
        </p>

        <h2>Generated content</h2>

        <p>
          AI-generated and template-generated responses may be inaccurate,
          repetitive, inappropriate, or incomplete. We do not guarantee that any
          generated response will be correct, safe, funny, or suitable for your
          intended use.
        </p>

        <p>
          Generated responses are not professional advice. Do not rely on them
          for medical, legal, financial, safety, or other serious decisions.
        </p>

        <h2>Service availability</h2>

        <p>
          We may change, suspend, limit, or discontinue any part of the service
          at any time. We may also limit usage to prevent abuse, excessive costs,
          spam, or security risks.
        </p>

        <h2>Intellectual property</h2>

        <p>
          The site design, branding, code, text, and other materials are owned by
          the site operator or used with permission, except where otherwise
          indicated.
        </p>

        <p>
          You may share images generated for personal, social, and non-commercial
          use, as long as you do not misrepresent them as official statements or
          real quotes from any real person.
        </p>

        <h2>Advertising and third parties</h2>

        <p>
          The site may include third-party services for hosting, analytics,
          advertising, AI processing, or security. Those services may be governed
          by their own terms and policies.
        </p>

        <h2>Changes to these terms</h2>

        <p>
          We may update these Terms of Use from time to time. Continued use of
          the site after changes means you accept the updated terms.
        </p>

        <h2>Contact</h2>

        <p>
          If you have questions about these Terms, contact: contact@newmb.chat
        </p>
      </article>
    </main>
  );
}
