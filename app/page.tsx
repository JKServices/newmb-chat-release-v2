export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">Release v1.0</p>
        <h1>뉴MB.chat</h1>
        <p className="subtitle">오늘도 질문 있습니까?</p>

        <div className="chat-preview">
          <div className="message-row user">
            <div className="bubble user-bubble">감독님, 오늘 경기 왜 졌나요?</div>
          </div>

          <div className="message-row bot">
            <div className="profile" aria-hidden="true">뉴</div>
            <div>
              <div className="sender">뉴MB</div>
              <div className="bubble bot-bubble">
                Reset
                <br />
                오늘 경기는 아직 끝나지 않았습니다.
                <br />
                다음 플레이 준비하세요.
              </div>
            </div>
          </div>
        </div>

        <button className="primary-button">뉴MB에게 질문하기</button>
      </section>

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
