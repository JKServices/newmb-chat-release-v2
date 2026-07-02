import Chat from "@/components/Chat";
import AdSlot from "@/components/AdSlot";

export default function HomePage() {
  return (
    <main className="page-shell">
      <Chat />

      <AdSlot />

      <footer className="footer">
        <p>© 2026 뉴MB.chat</p>
        <nav>
          <a href="/about">About</a>
          <span>·</span>
          <a href="/privacy">Privacy</a>
          <span>·</span>
          <a href="/terms">Terms</a>
        </nav>
        <p>Inspired by public football interviews & football culture • Unofficial parody AI</p>
        <p>v1.0</p>
      </footer>
    </main>
  );
}
