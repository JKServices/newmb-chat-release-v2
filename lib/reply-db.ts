type ReplyScenario = {
  id: string;
  keywords: string[];
  replies: string[];
};

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function hashText(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }

  return Math.abs(hash);
}

function includesAny(question: string, keywords: string[]) {
  return keywords.some((keyword) => question.includes(keyword.toLowerCase()));
}

function pickReply(question: string, replies: string[]) {
  const index = hashText(question) % replies.length;
  return replies[index];
}

const scenarios: ReplyScenario[] = [
  {
    id: "quit-resign",
    keywords: [
      "퇴사",
      "사퇴",
      "그만둘",
      "그만둘까",
      "포기",
      "물러",
      "辞",
      "resign",
      "quit"
    ],
    replies: [
      [
        "책임지고 물러나겠습니다.",
        "",
        "다만 주머니에 손은",
        "아직 뺄 타이밍이 아닙니다."
      ].join("\n"),
      [
        "사퇴는 무겁게 받아들이겠습니다.",
        "",
        "하지만 계약 기간도",
        "가볍게 볼 순 없습니다."
      ].join("\n"),
      [
        "물러날 각오는 되어 있습니다.",
        "",
        "다만 지금은",
        "전술적으로 버티는 시간입니다."
      ].join("\n")
    ]
  },
  {
    id: "responsibility",
    keywords: [
      "책임",
      "누구 탓",
      "누구탓",
      "내 탓",
      "제 탓",
      "잘못",
      "왜 이렇게",
      "망한 이유",
      "핑계",
      "blame",
      "fault"
    ],
    replies: [
      [
        "잔디도 쉽지 않았고",
        "온도도 생각보다 높았습니다.",
        "",
        "하지만 책임은",
        "제 책임입니다."
      ].join("\n"),
      [
        "일정이 빡빡했고",
        "선수 컨디션도 완벽하진 않았습니다.",
        "",
        "그래도 책임은",
        "제가 지겠습니다."
      ].join("\n"),
      [
        "고도와 습도는",
        "분명 변수였습니다.",
        "",
        "하지만 변명하지 않겠습니다.",
        "책임은 제 책임입니다."
      ].join("\n"),
      [
        "분위기도 쉽지 않았고",
        "판정도 아쉬웠습니다.",
        "",
        "하지만 마지막 책임은",
        "제가 가져가겠습니다."
      ].join("\n")
    ]
  },
  {
    id: "sacrifice",
    keywords: [
      "희생",
      "봉사",
      "헌신",
      "한국축구",
      "나라",
      "국가",
      "큰 뜻",
      "나를 버",
      "연봉",
      "계약",
      "salary",
      "contract"
    ],
    replies: [
      [
        "저를 버렸습니다.",
        "오직 한국축구만 생각하겠습니다.",
        "",
        "다만 계약 조건은",
        "존중되어야 합니다."
      ].join("\n"),
      [
        "개인은 없습니다.",
        "오직 팀만 있습니다.",
        "",
        "물론 연봉은",
        "개인 계좌로 들어옵니다."
      ].join("\n"),
      [
        "저는 내려놓았습니다.",
        "오직 축구만 보겠습니다.",
        "",
        "다만 옵션 조항은",
        "끝까지 보겠습니다."
      ].join("\n")
    ]
  },
  {
    id: "failure-recovery",
    keywords: [
      "힘들",
      "우울",
      "망했",
      "실패",
      "졌",
      "졌어",
      "폼",
      "멘탈",
      "지쳤",
      "번아웃",
      "피곤",
      "슬퍼",
      "embarrass",
      "burnout",
      "tired",
      "sad"
    ],
    replies: [
      [
        "Reset",
        "",
        "오늘 경기 졌다고",
        "시즌이 끝난 건 아닙니다.",
        "폼은 돌아옵니다."
      ].join("\n"),
      [
        "무너진 건 아닙니다.",
        "잠깐 라인이 내려간 겁니다.",
        "",
        "후반전은",
        "아직 남아 있습니다."
      ].join("\n"),
      [
        "오늘은 밀렸습니다.",
        "그렇다고 리그가 끝난 건 아닙니다.",
        "",
        "다음 플레이부터",
        "다시 보겠습니다."
      ].join("\n")
    ]
  },
  {
    id: "process-result",
    keywords: [
      "과정",
      "결과",
      "졌지만",
      "괜찮지",
      "실패인가",
      "의미",
      "worth",
      "result",
      "process"
    ],
    replies: [
      [
        "결과는 아쉽습니다.",
        "하지만 과정은 있었습니다.",
        "",
        "문제는 그 과정이",
        "아직 도착하지 않았다는 겁니다."
      ].join("\n"),
      [
        "스코어는 졌습니다.",
        "하지만 방향은 봤습니다.",
        "",
        "방향만 보고 가기엔",
        "순위표가 조금 차갑습니다."
      ].join("\n"),
      [
        "내용은 나쁘지 않았습니다.",
        "결과가 따라오지 않았을 뿐입니다.",
        "",
        "축구에서는 그걸",
        "졌다고 부릅니다."
      ].join("\n")
    ]
  },
  {
    id: "long-term",
    keywords: [
      "언제",
      "기다리",
      "오래",
      "나아질",
      "괜찮아질",
      "고쳐질",
      "회복",
      "장기",
      "프로젝트",
      "how long",
      "when"
    ],
    replies: [
      [
        "하루아침에 바뀌지 않습니다.",
        "이건 긴 프로젝트입니다.",
        "",
        "언제 끝나냐고 물으시면",
        "계약서를 보시면 됩니다."
      ].join("\n"),
      [
        "시간이 필요합니다.",
        "팀은 하루 만에 만들어지지 않습니다.",
        "",
        "물론 기다리는 건",
        "팬들의 몫입니다."
      ].join("\n"),
      [
        "지금은 리빌딩입니다.",
        "조금 더 봐야 합니다.",
        "",
        "얼마나 더냐고 물으시면",
        "그건 다음 인터뷰에서 말하겠습니다."
      ].join("\n")
    ]
  },
  {
    id: "criticism",
    keywords: [
      "욕",
      "비판",
      "댓글",
      "사람들이",
      "다들",
      "이해 못",
      "억울",
      "오해",
      "팬",
      "critic",
      "comments"
    ],
    replies: [
      [
        "팬들의 마음은 이해합니다.",
        "하지만 밖에서는 안 보입니다.",
        "",
        "현장에는",
        "다른 공기가 있습니다."
      ].join("\n"),
      [
        "비판은 받아들이겠습니다.",
        "다만 현장의 디테일은",
        "밖에서 다 보이지 않습니다.",
        "",
        "저도 가끔 안 보입니다."
      ].join("\n"),
      [
        "댓글은 빠릅니다.",
        "하지만 축구는 90분입니다.",
        "",
        "저는 조금 더",
        "천천히 틀리겠습니다."
      ].join("\n")
    ]
  },
  {
    id: "data-excuse",
    keywords: [
      "데이터",
      "숫자",
      "기록",
      "평가",
      "성적",
      "비교",
      "객관",
      "점수",
      "스탯",
      "performance",
      "stats",
      "number"
    ],
    replies: [
      [
        "데이터는 나쁘지 않았습니다.",
        "점유율도 나쁘지 않았습니다.",
        "",
        "다만 축구에는",
        "골이라는 변수가 있습니다."
      ].join("\n"),
      [
        "수치는 괜찮았습니다.",
        "흐름도 나쁘지 않았습니다.",
        "",
        "문제는 결과지가",
        "수치를 안 읽는다는 겁니다."
      ].join("\n"),
      [
        "기록만 보면",
        "희망이 있습니다.",
        "",
        "순위표만 보면",
        "잠시 눈을 감게 됩니다."
      ].join("\n")
    ]
  },
  {
    id: "others-blame",
    keywords: [
      "친구",
      "동료",
      "팀원",
      "상사",
      "부하",
      "가족",
      "아내",
      "남편",
      "여친",
      "남친",
      "파트너",
      "그 사람",
      "걔",
      "누가",
      "coworker",
      "friend",
      "partner",
      "team"
    ],
    replies: [
      [
        "누구도 탓하고 싶지 않습니다.",
        "다들 최선을 다했습니다.",
        "",
        "물론 선택은",
        "그들이 했습니다."
      ].join("\n"),
      [
        "선수 보호가 먼저입니다.",
        "이름을 말하진 않겠습니다.",
        "",
        "다만 그 장면은",
        "모두가 봤습니다."
      ].join("\n"),
      [
        "팀 전체의 문제입니다.",
        "개인을 탓하지 않겠습니다.",
        "",
        "하지만 패스는",
        "분명 그쪽에서 나갔습니다."
      ].join("\n")
    ]
  },
  {
    id: "decision-advice",
    keywords: [
      "할까요",
      "해도 될까요",
      "사야",
      "살까요",
      "보낼까요",
      "말할까요",
      "고백",
      "연락",
      "문자",
      "카톡",
      "데이트",
      "결혼",
      "이직",
      "투자",
      "should i",
      "buy",
      "text"
    ],
    replies: [
      [
        "감정으로 라인 올리면",
        "역습 맞습니다.",
        "",
        "전술부터",
        "다시 보세요."
      ].join("\n"),
      [
        "지금 바로 들어가면",
        "오프사이드일 수 있습니다.",
        "",
        "한 박자 늦추고",
        "공간을 보세요."
      ].join("\n"),
      [
        "선택은 해야 합니다.",
        "하지만 전술 없이 선택하면",
        "그건 돌파가 아니라 충돌입니다.",
        "",
        "먼저 플랜을 보세요."
      ].join("\n")
    ]
  },
  {
    id: "love",
    keywords: [
      "연애",
      "사랑",
      "헤어",
      "이별",
      "썸",
      "고백",
      "짝사랑",
      "데이트",
      "여자친구",
      "남자친구",
      "love",
      "dating",
      "breakup"
    ],
    replies: [
      [
        "연애는 전술입니다.",
        "압박만 한다고",
        "공을 뺏는 건 아닙니다.",
        "",
        "간격을 보세요."
      ].join("\n"),
      [
        "마음이 앞서면",
        "라인이 무너집니다.",
        "",
        "고백도",
        "빌드업이 필요합니다."
      ].join("\n"),
      [
        "오늘 경기는 졌을 수 있습니다.",
        "하지만 리그는 아직 남았습니다.",
        "",
        "다음 만남 준비하세요."
      ].join("\n")
    ]
  }
];

export function findReplyInDb(question: string) {
  const normalized = normalize(question);

  for (const scenario of scenarios) {
    if (includesAny(normalized, scenario.keywords)) {
      return {
        answer: pickReply(normalized, scenario.replies),
        scenario: scenario.id
      };
    }
  }

  return null;
}
