export type ReplyDbResult = {
  answer: string;
  scenario: string;
};

type ReplyScenario = {
  id: string;
  keywords: string[];
  replies: string[];
};

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function hashText(value: string) {
  let hash = 0;

  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }

  return hash;
}

const scenarios: ReplyScenario[] = [
  {
    id: "quit-resign",
    keywords: [
      "그만둘",
      "그만 둬",
      "그만둬",
      "퇴사",
      "사퇴",
      "포기",
      "때려칠",
      "관둘",
      "quit",
      "resign",
      "give up"
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
        "다만 결정은",
        "조금 더 지켜보겠습니다."
      ].join("\n"),
      [
        "물러나는 것도",
        "하나의 전술입니다.",
        "",
        "문제는 아직",
        "전술 회의가 안 끝났다는 겁니다."
      ].join("\n")
    ]
  },
  {
    id: "responsibility",
    keywords: [
      "책임",
      "누구 잘못",
      "내 잘못",
      "잘못했",
      "망했",
      "왜 이렇게",
      "사고",
      "문제",
      "fault",
      "responsible",
      "blame"
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
        "일정도 빡빡했고",
        "분위기도 쉽지 않았습니다.",
        "",
        "그래도 책임은",
        "제가 지겠습니다."
      ].join("\n"),
      [
        "여러 요인이 있었습니다.",
        "시차도 있었고",
        "공기도 달랐습니다.",
        "",
        "하지만 마지막 책임은",
        "제게 있습니다."
      ].join("\n")
    ]
  },
  {
    id: "sacrifice",
    keywords: [
      "희생",
      "봉사",
      "헌신",
      "국가",
      "나라",
      "한국축구",
      "축구",
      "큰 뜻",
      "충성",
      "sacrifice",
      "serve",
      "loyalty"
    ],
    replies: [
      [
        "저를 버렸습니다.",
        "오직 축구만 생각하겠습니다.",
        "",
        "다만 계약 조건은",
        "존중되어야 합니다."
      ].join("\n"),
      [
        "봉사의 마음으로 왔습니다.",
        "",
        "계약서는",
        "그 마음을 숫자로 정리한 겁니다."
      ].join("\n"),
      [
        "개인의 욕심은 없습니다.",
        "큰 그림만 보고 있습니다.",
        "",
        "물론 세부 조건도",
        "큰 그림 안에 있습니다."
      ].join("\n")
    ]
  },
  {
    id: "failure-recovery",
    keywords: [
      "힘들",
      "우울",
      "실패",
      "망함",
      "망했",
      "슬퍼",
      "번아웃",
      "지쳤",
      "기운",
      "멘탈",
      "fail",
      "sad",
      "burnout",
      "tired"
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
        "잠시 라인이 내려간 겁니다.",
        "",
        "다시 올리면 됩니다."
      ].join("\n"),
      [
        "오늘은 졌습니다.",
        "",
        "하지만 축구는",
        "다음 경기를 핑계로",
        "다시 시작할 수 있습니다."
      ].join("\n")
    ]
  },
  {
    id: "process-result",
    keywords: [
      "결과",
      "과정",
      "졌",
      "졌는데",
      "성과",
      "평가",
      "잘한",
      "못한",
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
        "스코어만 보면 실패입니다.",
        "",
        "하지만 스코어를 빼고 보면",
        "볼 수 있는 장면도 있었습니다."
      ].join("\n"),
      [
        "결과가 전부는 아닙니다.",
        "",
        "다만 결과가 없으면",
        "설명이 길어집니다."
      ].join("\n")
    ]
  },
  {
    id: "long-term",
    keywords: [
      "언제",
      "기다려",
      "얼마나",
      "오래",
      "나아질",
      "고쳐",
      "개선",
      "프로젝트",
      "장기",
      "wait",
      "fix",
      "improve",
      "how long"
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
        "지금은 결과보다",
        "방향을 봐야 합니다.",
        "",
        "방향이 맞는지는",
        "조금 더 시간이 필요합니다."
      ].join("\n"),
      [
        "개선은 진행 중입니다.",
        "",
        "다만 진행 중이라는 말은",
        "아직 안 됐다는 뜻이기도 합니다."
      ].join("\n")
    ]
  },
  {
    id: "airport-america",
    keywords: [
      "미국",
      "출국",
      "공항",
      "도망",
      "떠날",
      "떠나",
      "해외",
      "잠수",
      "회피",
      "피하고",
      "비행기",
      "탑승",
      "america",
      "airport",
      "flight",
      "leave"
    ],
    replies: [
      [
        "말씀드릴 부분은 있습니다.",
        "",
        "다만 지금은",
        "출국장이 먼저 열렸습니다."
      ].join("\n"),
      [
        "피하는 건 아닙니다.",
        "일정이 먼저 잡혀 있었습니다.",
        "",
        "질문보다",
        "탑승 시간이 빠릅니다."
      ].join("\n"),
      [
        "언젠가는 이야기하겠습니다.",
        "",
        "오늘은 일단",
        "미국 쪽으로 빌드업하겠습니다."
      ].join("\n")
    ]
  },
  {
    id: "good-scenes-existed",
    keywords: [
      "졌",
      "패배",
      "망했",
      "실패",
      "결과",
      "성과",
      "못했",
      "탈락",
      "졌는데",
      "lose",
      "lost",
      "fail",
      "failed",
      "result"
    ],
    replies: [
      [
        "결과는 아쉽습니다.",
        "하지만 전반에",
        "좋은 장면은 있었습니다.",
        "",
        "문제는 후반에도",
        "경기가 있었다는 겁니다."
      ].join("\n"),
      [
        "스코어만 보면 실패입니다.",
        "",
        "하지만 스코어를 빼고 보면",
        "볼 수 있는 장면도 있었습니다."
      ].join("\n"),
      [
        "결과는 국민들께",
        "죄송하게 생각합니다.",
        "",
        "다만 과정 전체를",
        "숫자로만 보면 안 됩니다."
      ].join("\n")
    ]
  },
  {
    id: "individual-mistake-no-blame",
    keywords: [
      "실수",
      "누구 잘못",
      "쟤 때문",
      "걔 때문",
      "팀원",
      "동료",
      "친구가",
      "상대가",
      "개인",
      "mistake",
      "fault",
      "blame",
      "coworker",
      "teammate"
    ],
    replies: [
      [
        "개인을 탓하고 싶진 않습니다.",
        "",
        "다만 그 장면은",
        "개인이 선택했고",
        "개인이 실행했습니다."
      ].join("\n"),
      [
        "실수는 누구나 할 수 있습니다.",
        "",
        "문제는 그 실수가",
        "왜 하필 그 사람이었냐는 겁니다."
      ].join("\n"),
      [
        "누구 책임이라고",
        "말하고 싶진 않습니다.",
        "",
        "다만 화면에는",
        "한 명만 잡혔습니다."
      ].join("\n")
    ]
  },
  {
    id: "question-timing-avoidance",
    keywords: [
      "왜 그랬",
      "왜 했",
      "해명",
      "설명",
      "답해",
      "대답",
      "청문회",
      "언제 돌아",
      "언제 와",
      "직접 말",
      "why",
      "explain",
      "answer",
      "hearing",
      "return"
    ],
    replies: [
      [
        "그 질문은",
        "지금 답하는 게 맞는지 모르겠습니다.",
        "",
        "일정이라는 것도 있고",
        "공기라는 것도 있습니다."
      ].join("\n"),
      [
        "말씀드릴 부분은 있습니다.",
        "",
        "다만 지금은",
        "질문보다 동선이 먼저입니다."
      ].join("\n"),
      [
        "답을 피하는 건 아닙니다.",
        "",
        "답이 아직",
        "도착하지 않았을 뿐입니다."
      ].join("\n")
    ]
  },
  {
    id: "someday-explanation",
    keywords: [
      "언젠가",
      "나중에",
      "진실",
      "밝혀",
      "말할 때",
      "언제 말",
      "오해",
      "억울",
      "할 말",
      "someday",
      "truth",
      "later",
      "misunderstood"
    ],
    replies: [
      [
        "할 이야기는 있습니다.",
        "",
        "다만 모든 이야기는",
        "언젠가 나오게 되어 있습니다."
      ].join("\n"),
      [
        "지금 말하면",
        "또 다른 해석이 나옵니다.",
        "",
        "그래서 해석은",
        "미래에 맡기겠습니다."
      ].join("\n"),
      [
        "언젠가는",
        "이야기가 잘 나올 겁니다.",
        "",
        "오늘은",
        "여기까지만 하겠습니다."
      ].join("\n")
    ]
  },
  {
    id: "no-internal-conflict-repeat",
    keywords: [
      "내분",
      "불화",
      "갈등",
      "싸움",
      "분위기",
      "소문",
      "팀 분위기",
      "사이 안좋",
      "사이 안 좋",
      "conflict",
      "drama",
      "rumor",
      "fight"
    ],
    replies: [
      [
        "내분은 없었습니다.",
        "전체적인 내분도 없었습니다.",
        "",
        "부분적인 전체 내분도",
        "없었다고 봅니다."
      ].join("\n"),
      [
        "분위기는 문제없었습니다.",
        "",
        "다만 모두가",
        "같은 방향을 본 건 아닙니다."
      ].join("\n"),
      [
        "불화는 없었습니다.",
        "",
        "각자 다른 방식으로",
        "침묵했을 뿐입니다."
      ].join("\n")
    ]
  },
  {
    id: "criticism-line-shift",
    keywords: [
      "비판",
      "욕",
      "댓글",
      "악플",
      "나가",
      "싫어",
      "여론",
      "팬",
      "선 넘",
      "criticism",
      "hate",
      "comments",
      "fans"
    ],
    replies: [
      [
        "비판은 받아들입니다.",
        "책임도 느끼고 있습니다.",
        "",
        "다만 비판에도",
        "라인은 있어야 합니다."
      ].join("\n"),
      [
        "팬들의 마음은 이해합니다.",
        "",
        "하지만 표현이 거칠면",
        "전술도 흔들립니다."
      ].join("\n"),
      [
        "제가 부족했습니다.",
        "",
        "그런데 부족함을 말하는 방식도",
        "조금 부족했습니다."
      ].join("\n")
    ]
  },
  {
    id: "no-qa-press-conference",
    keywords: [
      "사과",
      "입장문",
      "기자회견",
      "질문 받기 싫",
      "말하기 싫",
      "끝내",
      "빠져나가",
      "회의 끝",
      "apology",
      "statement",
      "press",
      "no question"
    ],
    replies: [
      [
        "입장문으로 대신하겠습니다.",
        "",
        "질문은 받지 않겠습니다.",
        "오늘 회견은 여기까지입니다."
      ].join("\n"),
      [
        "짧게 말씀드리겠습니다.",
        "",
        "책임은 느끼고 있습니다.",
        "이상입니다."
      ].join("\n"),
      [
        "사과의 마음은 있습니다.",
        "",
        "다만 질의응답은",
        "전술적으로 생략하겠습니다."
      ].join("\n")
    ]
  },
  {
    id: "already-said-everything",
    keywords: [
      "이미 말",
      "말했",
      "또 설명",
      "또 물어",
      "왜 설명 안",
      "왜 대답 안",
      "답변 회피",
      "해명 안",
      "same question",
      "again",
      "already said",
      "repeat"
    ],
    replies: [
      [
        "말을 아낀 건 아닙니다.",
        "",
        "제가 할 이야기는",
        "이미 전에 다 했습니다.",
        "",
        "못 들으셨다면",
        "그건 전달의 문제입니다."
      ].join("\n"),
      [
        "답변을 피한 게 아닙니다.",
        "",
        "답변은 이미 있었고",
        "질문이 다시 온 겁니다."
      ].join("\n"),
      [
        "그 부분은",
        "전에 다 말씀드렸습니다.",
        "",
        "다시 말하면",
        "또 다른 해석이 나옵니다."
      ].join("\n")
    ]
  },
  {
    id: "what-are-people-curious-about",
    keywords: [
      "궁금",
      "사람들이 알고",
      "국민",
      "대중",
      "설명해야",
      "공개 사과",
      "입장 밝혀",
      "알 권리",
      "curious",
      "public",
      "explain to everyone"
    ],
    replies: [
      [
        "궁금하실 수는 있습니다.",
        "",
        "다만 제가 보기엔",
        "궁금할 내용은",
        "이미 경기장에 다 나왔습니다."
      ].join("\n"),
      [
        "국민들께서",
        "궁금하실 수도 있습니다.",
        "",
        "하지만 결과가",
        "가장 큰 설명입니다."
      ].join("\n"),
      [
        "무엇이 궁금하신지는 압니다.",
        "",
        "다만 그 궁금함까지",
        "제가 전술로 준비하진 못했습니다."
      ].join("\n")
    ]
  },
  {
    id: "pre-agreed-no-question",
    keywords: [
      "질문 안 받",
      "질의응답",
      "회의 안",
      "미팅 피",
      "사전에",
      "협의",
      "합의",
      "절차",
      "기자회견",
      "q&a",
      "no q&a",
      "agreed",
      "procedure"
    ],
    replies: [
      [
        "질문을 피한 건 아닙니다.",
        "",
        "그 부분은",
        "사전에 다 협의가 됐습니다.",
        "",
        "그래서 질문 없이",
        "진행된 겁니다."
      ].join("\n"),
      [
        "질의응답이 없었던 건",
        "회피가 아닙니다.",
        "",
        "절차적으로",
        "답변이 생략된 겁니다."
      ].join("\n"),
      [
        "말씀드릴 건 드렸고",
        "질문은 받지 않았습니다.",
        "",
        "이 두 가지는",
        "충돌하지 않습니다."
      ].join("\n")
    ]
  },
  {
    id: "many-different-views",
    keywords: [
      "잘못된 선택",
      "틀렸",
      "판단 미스",
      "전술",
      "선택",
      "기용",
      "변화",
      "시각",
      "관점",
      "의견",
      "decision",
      "choice",
      "tactics",
      "perspective",
      "view"
    ],
    replies: [
      [
        "그건 여러 가지 시각입니다.",
        "",
        "어떤 시각은 앞에서 보고",
        "어떤 시각은 뒤에서 봅니다.",
        "",
        "저는 벤치에서 봤습니다."
      ].join("\n"),
      [
        "잘됐다 잘못됐다를",
        "지금 단정하긴 어렵습니다.",
        "",
        "결과가 나온 뒤에는",
        "모든 선택이 쉬워 보입니다."
      ].join("\n"),
      [
        "변화가 적었다는 것도",
        "하나의 시각입니다.",
        "",
        "변화를 안 한 것도",
        "전술적 변화일 수 있습니다."
      ].join("\n")
    ]
  },
  {
    id: "absolutely-not-rumor",
    keywords: [
      "소문",
      "루머",
      "규율",
      "숨긴",
      "무슨 일",
      "문제 있었",
      "몰래",
      "사실이야",
      "그런 거",
      "rumor",
      "hidden",
      "secret",
      "rule",
      "discipline"
    ],
    replies: [
      [
        "그런 건 없습니다.",
        "그런 건 전혀 없습니다.",
        "",
        "전혀라는 말 안에",
        "이미 답이 있습니다."
      ].join("\n"),
      [
        "그런 추측은",
        "사실과 다릅니다.",
        "",
        "사실이 뭐냐고 물으시면",
        "추측이 아니라고 말씀드리겠습니다."
      ].join("\n"),
      [
        "문제는 없었습니다.",
        "",
        "문제가 있었다면",
        "문제가 없었다고 말하기 어렵겠죠."
      ].join("\n")
    ]
  },
  {
    id: "thats-enough",
    keywords: [
      "하나만 더",
      "한 번만 더",
      "계속 물어",
      "청문회",
      "조사",
      "캐물",
      "추궁",
      "답변해",
      "언제 와",
      "귀국",
      "그만",
      "one more",
      "hearing",
      "interrogate",
      "enough"
    ],
    replies: [
      [
        "모르겠습니다.",
        "",
        "귀국 날짜도 모르고",
        "답변 날짜도 모릅니다.",
        "",
        "여기까지만 하세요."
      ].join("\n"),
      [
        "그 질문은",
        "여기서 끝내겠습니다.",
        "",
        "질문도 체력이 필요합니다."
      ].join("\n"),
      [
        "더 말씀드리면",
        "또 다른 질문이 나옵니다.",
        "",
        "그래서 여기까지만 하겠습니다."
      ].join("\n")
    ]
  },
  {
    id: "coaching-staff-collective",
    keywords: [
      "혼자 결정",
      "네 결정",
      "누가 결정",
      "회의",
      "팀 결정",
      "다 같이",
      "책임자",
      "리더",
      "group decision",
      "meeting",
      "team decision",
      "leader"
    ],
    replies: [
      [
        "제 생각만은 아니었습니다.",
        "전체적으로 회의를 했습니다.",
        "",
        "하지만 결과가 나왔으니",
        "책임은 제가 지겠습니다."
      ].join("\n"),
      [
        "혼자 결정한 건 아닙니다.",
        "",
        "다 같이 논의했고",
        "제가 책임지는 구조였습니다.",
        "",
        "그래서 제가 책임집니다."
      ].join("\n"),
      [
        "회의는 충분히 했습니다.",
        "",
        "다만 회의가",
        "결과까지 넣어주진 않습니다."
      ].join("\n")
    ]
  },
  {
    id: "data-excuse",
    keywords: [
      "데이터",
      "숫자",
      "통계",
      "비교",
      "객관적",
      "성능",
      "점수",
      "평가",
      "data",
      "stats",
      "number",
      "score"
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
        "수치상으로는",
        "설명 가능한 부분이 있습니다.",
        "",
        "문제는 사람들이",
        "결과를 먼저 본다는 겁니다."
      ].join("\n"),
      [
        "기록만 보면",
        "충분히 버틸 수 있었습니다.",
        "",
        "다만 기록이",
        "상대보다 늦게 들어왔습니다."
      ].join("\n")
    ]
  },
  {
    id: "decision-advice",
    keywords: [
      "해야 할까",
      "할까",
      "살까",
      "보낼까",
      "고백",
      "이직",
      "문자",
      "연락",
      "결정",
      "조언",
      "advice",
      "should i",
      "buy",
      "text",
      "confess"
    ],
    replies: [
      [
        "감정으로 라인 올리면",
        "역습 맞습니다.",
        "",
        "전술부터 다시 보세요."
      ].join("\n"),
      [
        "지금 바로 움직이는 건",
        "위험할 수 있습니다.",
        "",
        "상대 포메이션을",
        "조금 더 봐야 합니다."
      ].join("\n"),
      [
        "결정은 할 수 있습니다.",
        "",
        "다만 결정하기 전에",
        "교체 카드가 남았는지 보세요."
      ].join("\n")
    ]
  },
  {
    id: "love",
    keywords: [
      "사랑",
      "연애",
      "고백",
      "썸",
      "헤어",
      "이별",
      "좋아해",
      "짝사랑",
      "데이트",
      "love",
      "crush",
      "date",
      "relationship"
    ],
    replies: [
      [
        "사랑도 전술입니다.",
        "",
        "너무 빨리 라인 올리면",
        "마음의 뒷공간이 열립니다."
      ].join("\n"),
      [
        "고백은 타이밍입니다.",
        "",
        "다만 타이밍만 보고 들어가면",
        "VAR이 길어질 수 있습니다."
      ].join("\n"),
      [
        "상대 마음은 존중해야 합니다.",
        "",
        "압박은 하되",
        "파울은 하지 마세요."
      ].join("\n")
    ]
  },
  {
    id: "criticism",
    keywords: [
      "비난",
      "욕먹",
      "평가",
      "사람들",
      "댓글",
      "여론",
      "팬들",
      "억울",
      "hate",
      "criticize",
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
        "",
        "다만 모든 비판이",
        "전술적인 건 아닙니다."
      ].join("\n"),
      [
        "억울함은 없습니다.",
        "",
        "다만 설명하면",
        "또 다른 설명이 필요합니다."
      ].join("\n")
    ]
  },
  {
    id: "others-blame",
    keywords: [
      "팀원",
      "동료",
      "친구",
      "가족",
      "배우자",
      "아내",
      "남편",
      "상사",
      "부하",
      "group",
      "team",
      "coworker",
      "friend"
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
        "팀 전체의 문제입니다.",
        "",
        "다만 특정 장면에서는",
        "특정 사람이 보였습니다."
      ].join("\n"),
      [
        "개인을 탓하지 않겠습니다.",
        "",
        "그렇다고 개인이",
        "없었던 건 아닙니다."
      ].join("\n")
    ]
  },
  {
    id: "default",
    keywords: [],
    replies: [
      [
        "쉽지 않은 질문입니다.",
        "",
        "하지만 축구도 인생도",
        "결국 다음 장면을 봐야 합니다."
      ].join("\n"),
      [
        "지금 단정하긴 어렵습니다.",
        "",
        "흐름을 봐야 하고",
        "공기도 봐야 합니다."
      ].join("\n"),
      [
        "말씀드릴 수 있는 건",
        "분명히 있습니다.",
        "",
        "다만 지금 다 말씀드리면",
        "전술이 노출됩니다."
      ].join("\n")
    ]
  }
];

export function findReplyInDb(question: string): ReplyDbResult | null {
  const normalizedQuestion = normalizeText(question);

  if (!normalizedQuestion) return null;

  const matchedScenario = scenarios.find((scenario) => {
    if (scenario.id === "default") return false;

    return scenario.keywords.some((keyword) =>
      normalizedQuestion.includes(normalizeText(keyword))
    );
  });

  if (!matchedScenario) return null;

  const replyIndex = hashText(normalizedQuestion) % matchedScenario.replies.length;

  return {
    answer: matchedScenario.replies[replyIndex],
    scenario: matchedScenario.id
  };
}

export function createReplyFromDb(question: string): ReplyDbResult {
  const matchedReply = findReplyInDb(question);

  if (matchedReply) {
    return matchedReply;
  }

  const defaultScenario = scenarios.find((scenario) => scenario.id === "default");

  if (!defaultScenario) {
    return {
      answer: [
        "쉽지 않은 질문입니다.",
        "",
        "하지만 축구도 인생도",
        "결국 다음 장면을 봐야 합니다."
      ].join("\n"),
      scenario: "fallback"
    };
  }

  const normalizedQuestion = normalizeText(question);
  const replyIndex = hashText(normalizedQuestion) % defaultScenario.replies.length;

  return {
    answer: defaultScenario.replies[replyIndex],
    scenario: defaultScenario.id
  };
}
