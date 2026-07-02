export type NewMbReply = {
  keyword: string;
  lines: string[];
};

const replies: NewMbReply[] = [
  {
    keyword: "Reset",
    lines: [
      "오늘 경기는 아직 끝나지 않았습니다.",
      "다음 플레이 준비하세요.",
      "폼은 돌아옵니다."
    ]
  },
  {
    keyword: "Forward",
    lines: [
      "뒤를 보는 시간에",
      "앞으로 한 발 더 가는 겁니다.",
      "그게 경기입니다."
    ]
  },
  {
    keyword: "Pressure",
    lines: [
      "압박은 피하는 게 아닙니다.",
      "견디고, 버티고, 다시 뛰는 겁니다."
    ]
  },
  {
    keyword: "Review",
    lines: [
      "판정은 이미 지나갔습니다.",
      "화내도 스코어는 안 바뀝니다.",
      "다음 장면 보세요."
    ]
  },
  {
    keyword: "Recover",
    lines: [
      "한 번 넘어졌다고",
      "시즌이 끝난 건 아닙니다.",
      "다시 준비하세요."
    ]
  },
  {
    keyword: "Responsibility",
    lines: [
      "책임은 제가 집니다.",
      "하지만 뛰는 건 모두가 같이 뛰어야 합니다.",
      "이게 팀입니다."
    ]
  },
  {
    keyword: "Balance",
    lines: [
      "공격만 보면 수비가 비고",
      "수비만 보면 골이 안 납니다.",
      "균형이 전술입니다."
    ]
  },
  {
    keyword: "Focus",
    lines: [
      "댓글은 경기장에 없습니다.",
      "공은 지금 앞에 있습니다.",
      "집중하세요."
    ]
  }
];

export function createLocalReply(question: string): string {
  const normalized = question.toLowerCase();

  if (normalized.includes("fight") || question.includes("싸워")) {
    return [
      "Fight",
      "",
      "싸우라는 건 흥분하라는 뜻이 아닙니다.",
      "순간마다 밀리지 말라는 겁니다.",
      "퇴장은 국룰이 아닙니다."
    ].join("\n");
  }

  if (
    question.includes("책임") ||
    question.includes("남탓") ||
    question.includes("핑계")
  ) {
    return [
      "Responsibility",
      "",
      "책임은 제가 집니다.",
      "다만 경기장은 모두가 같이 뛰는 곳입니다.",
      "말보다 다음 플레이입니다."
    ].join("\n");
  }

  if (question.includes("VAR") || question.includes("판정")) {
    return [
      "Review",
      "",
      "판정은 이미 지나갔습니다.",
      "화내도 화면은 다시 안 돌아옵니다.",
      "다음 장면 준비하세요."
    ].join("\n");
  }

  if (question.includes("연애") || question.includes("헤어")) {
    return [
      "Recover",
      "",
      "오늘 경기는 졌을 수 있습니다.",
      "하지만 리그는 아직 끝나지 않았습니다.",
      "다음 만남 준비하세요."
    ].join("\n");
  }

  if (question.includes("퇴사") || question.includes("회사")) {
    return [
      "Decision",
      "",
      "감정으로 라인 올리면 역습 맞습니다.",
      "전술부터 다시 짜세요.",
      "그리고 사표는 신중하게."
    ].join("\n");
  }

  const picked = replies[Math.floor(Math.random() * replies.length)];

  return [picked.keyword, "", ...picked.lines].join("\n");
}
