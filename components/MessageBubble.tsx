type MessageBubbleProps = {
  role: "user" | "bot" | "loading";
  content: string;
};

function cleanText(value: string) {
  return value.replace(/\\n/g, "\n");
}

export default function MessageBubble({ role, content }: MessageBubbleProps) {
  const isUser = role === "user";
  const isBot = role === "bot" || role === "loading";
  const cleaned = cleanText(content);

  return (
    <div className={`message-row ${isUser ? "user" : "bot"}`}>
      {isBot ? (
        <div className="profile" aria-hidden="true">
          뉴
        </div>
      ) : null}

      <div className={isBot ? "bot-stack" : undefined}>
        {isBot ? <div className="sender">뉴MB</div> : null}

        <div className={`bubble ${isUser ? "user-bubble" : "bot-bubble"} ${role === "loading" ? "loading-bubble" : ""}`}>
          {cleaned.split("\n").map((line, index) => {
            const isEmpty = line.trim().length === 0;

            return isEmpty ? (
              <br key={`br-${index}`} />
            ) : (
              <span key={`${line}-${index}`}>
                {line}
                {index < cleaned.split("\n").length - 1 ? <br /> : null}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
