import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | 뉴MB.chat",
  description: "Privacy Policy for 뉴MB.chat."
};

export default function PrivacyPage() {
  return (
    <main className="legal-page">
      <section className="legal-card">
        <Link href="/" className="back-link">
          ← Back to 뉴MB.chat
        </Link>

        <h1>Privacy Policy</h1>

        <p>
          This Privacy Policy explains how 뉴MB.chat handles information when you
          use the website.
        </p>

        <h2>Information We Process</h2>

        <p>
          When you submit a message, the text may be processed in order to
          generate a response. By default, 뉴MB.chat is designed to avoid
          requiring user accounts, names, or login information.
        </p>

        <h2>No Sale of Personal Information</h2>

        <p>
          We do not sell your personal information.
        </p>

        <h2>Analytics and Advertising</h2>

        <p>
          The website may use analytics or advertising tools to understand usage
          and support the service. These third-party services may process
          technical information such as device type, browser information, general
          location, page views, and interactions according to their own policies.
        </p>

        <h2>AI Processing</h2>

        <p>
          If AI functionality is enabled, submitted prompts may be sent to an AI
          provider to generate a response. Do not submit sensitive personal
          information, confidential information, passwords, financial details, or
          private identifying information.
        </p>

        <h2>Local Storage</h2>

        <p>
          Some features may store small pieces of information in your browser,
          such as recent generated content or preferences. This information stays
          on your device unless a future feature clearly states otherwise.
        </p>

        <h2>Contact</h2>

        <p>
          For privacy-related questions, please contact the site operator through
          the contact method provided on the website.
        </p>
      </section>
    </main>
  );
}
