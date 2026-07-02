"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";
import { createLocalReply } from "@/lib/local-replies";

type ChatMessage = {
  id: string;
  role: "user" | "bot";
  content: string;
};

const placeholders = [
  "감독님, 연애도 전술입니까?",
  "오늘도 Fight입니까?",
  "퇴사해도 될까요?",
  "인생도 압박 축구입니까?",
  "감독님, 오늘 경기 왜 졌나요?",
  "VAR 같은 하루였습니다.",
  "폼이 안 돌아옵니다.",
  "책임은 누가 집니까?"
];

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: makeId(),
      role: "bot",
      content: "Reset\n\n오늘 경기는 아직 끝나지 않았습니다.\n다음 플레이 준비하세요.\n폼은 돌아옵니다."
    }
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [loadingDots, setLoadingDots] = useState(".");

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const placeholder = useMemo(() => {
    return placeholders[Math.floor(Math.random() * placeholders.length)];
  }, []);

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

    const reply = createLocalReply(question);

    setMessages((current) => [
      ...current,
      {
        id: makeId(),
        role: "bot",
        content: reply
      }
    ]);

    setIsThinking(false);
  }

  return (
    <section className="chat-app" aria-label="뉴MB chat">
      <header className="chat-header">
        <div>
          <h1>뉴MB.chat</h1>
          <p>오늘도 질문 있습니까?</p>
        </div>
      </header>

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
          placeholder={placeholder}
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

        <button type="submit" disabled={isThinking || input.trim().length === 0}>
          {isThinking ? "감독님께 전달 중..." : "뉴MB에게 질문하기"}
        </button>
      </form>
    </section>
  );
}
