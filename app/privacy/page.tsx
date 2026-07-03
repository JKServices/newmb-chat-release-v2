import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for 뉴MB.chat."
};

export default function PrivacyPage() {
  return (
    <main className="legal-page">
      <article className="legal-card">
        <a className="back-link" href="/">
          ← Back to 뉴MB.chat
        </a>

        <h1>Privacy Policy</h1>

        <p>Last updated: July 2, 2026</p>

        <p>
          This Privacy Policy explains how 뉴MB.chat collects, uses, and protects
          information when you use this website.
        </p>

        <h2>Information we collect</h2>

        <p>
          뉴MB.chat does not require you to create an account. We do not ask for
          your name, address, payment information, or login credentials.
        </p>

        <p>
          When you submit a question, the text you enter is processed so the
          site can generate a response. Please do not submit private, sensitive,
          confidential, or personally identifying information.
        </p>

        <p>
          Basic technical information may be processed automatically, such as IP
          address, browser type, device information, request time, and pages
          visited. This information may be used for security, abuse prevention,
          analytics, debugging, and site operation.
        </p>

        <h2>AI processing</h2>

        <p>
          Some questions may be processed using third-party AI services, such as
          OpenAI, to generate responses. Other questions may be answered using
          local templates without contacting an AI provider.
        </p>

        <p>
          Do not enter information that you would not want processed by an
          external service.
        </p>

        <h2>Cookies and analytics</h2>

        <p>
          뉴MB.chat may use cookies or similar technologies for basic site
          functionality, analytics, security, advertising, and performance
          measurement.
        </p>

        <p>
          If analytics or advertising tools are enabled, third-party providers
          may collect or process information according to their own privacy
          policies.
        </p>

        <h2>Advertising</h2>

        <p>
          뉴MB.chat may display advertisements, including ads served by third-party
          advertising partners such as Google AdSense. These partners may use
          cookies or similar technologies to show and measure ads.
        </p>

        <h2>Generated images</h2>

        <p>
          Meme images are generated in your browser from the question and answer
          shown on the page. You are responsible for how you save, share, or use
          generated images.
        </p>

        <h2>Data retention</h2>

        <p>
          We do not provide user accounts or long-term personal profiles. Server
          logs or analytics data may be retained for operational, security, or
          debugging purposes.
        </p>

        <h2>Children</h2>

        <p>
          This site is intended for a general audience and is not directed to
          children under 13. If you believe a child has provided personal
          information, please contact us.
        </p>

        <h2>Contact</h2>

        <p>
          If you have questions about this Privacy Policy, contact:
          contact@newmb.chat
        </p>
      </article>
    </main>
  );
}
