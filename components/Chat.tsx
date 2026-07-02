"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";
import MemeActions from "./MemeActions";

type ChatMessage = {
  id: string;
  role: "user" | "bot";
  content: string;
};

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: makeId(),
      role: "bot",
      content:
        "Reset\n\n오늘 경기 졌다고\n시즌이 끝난 건 아닙니다.\n폼은 돌아옵니다."
    }
  ]);

  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [loadingDots, setLoadingDots] = useState(".");
  const [latestPair, setLatestPair] = useState<{
    question: string;
    answer: string;
  } | null>(null);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isThinking) return;

    const interval = window.setInterval(() => {
      setLoadingDots((current) => {
        if (current === ".") return "..";
        if (current === "..") return "...";
        return ".";
      });
    }, 450);

    return () => window.clearInterval(interval);
  }, [isThinking]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isThinking, loadingDots]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const question = input.trim();
    if (!question || isThinking) return;

    setMessages((current) => [
      ...current,
      {
        id: makeId(),
        role: "user",
        content: question
      }
    ]);

    setInput("");
    setIsThinking(true);

    await new Promise((resolve) => window.setTimeout(resolve, 2000));

    let reply =
      "Reset\n\n지금은 연결이 흔들립니다.\n그래도 경기는 계속됩니다.\n다음 플레이 준비하세요.";

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ question })
      });

      const data = (await response.json()) as {
        answer?: string;
      };

      if (data.answer) {
        reply = data.answer;
      }
    } catch {
      reply = "Recover\n\n잠깐 끊겼습니다.\n하지만 아직 후반전 남았습니다.";
    }

    setMessages((current) => [
      ...current,
      {
        id: makeId(),
        role: "bot",
        content: reply
      }
    ]);

    setLatestPair({
      question,
      answer: reply
    });

    setIsThinking(false);
  }

  return (
    <section className="hero-chat" aria-label="뉴MB chat">
      <div className="hero-top">
        <p className="eyebrow">Unofficial parody AI</p>
        <h1>뉴MB.chat</h1>
      </div>

      <div className="phone-frame">
        <div className="phone-topbar">
          <div>
            <p className="phone-title">뉴MB</p>
            <p className="phone-status">경기 후 인터뷰 대기 중</p>
          </div>
          <div className="phone-mark">MB</div>
        </div>

        <div className="chat-window">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              role={message.role}
              content={message.content}
            />
          ))}

          {isThinking ? (
            <MessageBubble
              role="loading"
              content={`감독님께 전달 중${loadingDots}`}
            />
          ) : null}

          <div ref={chatEndRef} />
        </div>

        <form className="chat-form" onSubmit={handleSubmit}>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="질문을 입력하세요"
            rows={1}
            maxLength={120}
            disabled={isThinking}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }
            }}
          />

          <button
            type="submit"
            disabled={isThinking || input.trim().length === 0}
          >
            {isThinking ? "감독님께 전달 중..." : "뉴MB에게 질문하기"}
          </button>
        </form>
      </div>

      {latestPair ? (
        <MemeActions
          question={latestPair.question}
          answer={latestPair.answer}
        />
      ) : null}
    </section>
  );
}
