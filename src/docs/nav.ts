export type DocSection = {
  heading: string
  body: string[]
}

export type DocTrack = 'Core' | 'Engineering' | 'Operations' | 'Business'

export type DocStatus = 'Draft' | 'In Progress' | 'Pilot Ready' | 'Published'

export type DocEntry = {
  title: string
  summary: string
  track: DocTrack
  status: DocStatus
  audience: string[]
  confidentiality: 'Public' | 'Internal'
  lastUpdated: string
  source: string
  sections: DocSection[]
}

type DocsContent = Record<string, DocEntry>

type DocsCatalog = {
  nav: Array<{ slug: string; title: string }>
  content: DocsContent
}

export const docsOrder = [
  'executive-summary',
  'constitution',
  'state-machine',
  'formal-verification',
  'architecture',
  'api',
  'pilot-plan',
  'enterprise-guide',
  'security',
  'roadmap',
  'personas',
  'pricing',
  'market-opportunity',
  'competitive-landscape',
  'financial-projections',
  'pitch-deck',
] as const

const enContent: DocsContent = {
  'executive-summary': {
    title: 'ClearanceGate Executive Summary',
    summary: 'Why authorization becomes the control surface as decision generation gets cheaper and faster.',
    track: 'Core',
    status: 'Published',
    audience: ['Leadership', 'Investors', 'Partners'],
    confidentiality: 'Public',
    lastUpdated: '2026-01-15',
    source: 'https://www.notion.so/2e9adcdd14e180298f82e9a463523b28',
    sections: [
      {
        heading: 'Strategic Problem',
        body: [
          'High-risk execution is increasingly automated while authorization remains fragmented and implicit.',
          'After incidents, organizations still struggle to explain why execution was allowed and who held responsibility.',
        ],
      },
      {
        heading: 'Product Position',
        body: [
          'ClearanceGate is a formal authorization boundary between decision proposal and execution.',
          'Each request resolves to exactly one outcome: PROCEED, BLOCK, REQUIRE_ACK, or DEGRADE.',
        ],
      },
      {
        heading: 'System Guarantees',
        body: [
          'Fail-closed behavior under uncertainty or internal failure.',
          'Auditability and responsibility binding are enforced as system-level invariants.',
        ],
      },
      {
        heading: 'Non-Claims',
        body: [
          'ClearanceGate does not guarantee decision correctness, model quality, or business outcome optimality.',
          'It guarantees execution defensibility under explicit constraints.',
        ],
      },
    ],
  },
  constitution: {
    title: 'ClearanceGate System Constitution',
    summary: 'Constitutional guarantees, boundaries, and role responsibilities for the authorization layer.',
    track: 'Core',
    status: 'Published',
    audience: ['Leadership', 'Internal Team', 'Partners'],
    confidentiality: 'Public',
    lastUpdated: '2026-01-15',
    source: 'https://www.notion.so/2e9adcdd14e18056b947e344e71b8a90',
    sections: [
      {
        heading: 'Purpose and Boundary',
        body: [
          'The system decides whether execution is authorized under explicit constraints.',
          'It does not replace expert domain judgment or decide what action should be taken.',
        ],
      },
      {
        heading: 'Constitutional Guarantees',
        body: [
          'Deterministic authorization outcome for each valid input.',
          'Mutual exclusivity of outcomes and fail-closed behavior under uncertainty.',
          'Auditability as a non-negotiable system invariant.',
        ],
      },
      {
        heading: 'Responsibility Model',
        body: [
          'Execution may proceed only when accountability and constraints are explicitly satisfied.',
          'External systems remain accountable for input quality and execution behavior.',
        ],
      },
      {
        heading: 'Verification Scope',
        body: [
          'Kernel semantics are designed for formal analysis and structural verification.',
          'The target is authorization correctness, not prediction accuracy.',
        ],
      },
    ],
  },
  'state-machine': {
    title: 'Clearance State Machine and Invariants',
    summary: 'Formal state definitions and outcome mapping rules for deterministic authorization.',
    track: 'Core',
    status: 'Published',
    audience: ['Developers', 'Internal Team', 'Leadership'],
    confidentiality: 'Public',
    lastUpdated: '2026-01-15',
    source: 'https://www.notion.so/2e9adcdd14e18030886de03b32d9ac8f',
    sections: [
      {
        heading: 'State Set',
        body: [
          'INIT, INFO_INSUFFICIENT, RISK_FLAGGED, AWAITING_ACK, AUTHORIZED, BLOCKED, DEGRADED.',
          'Each decision instance exists in exactly one state at any point in time.',
        ],
      },
      {
        heading: 'Outcome Mapping',
        body: [
          'AUTHORIZED maps to PROCEED and AWAITING_ACK maps to REQUIRE_ACK.',
          'INFO_INSUFFICIENT, RISK_FLAGGED, and BLOCKED map to BLOCK; DEGRADED maps to DEGRADE.',
        ],
      },
      {
        heading: 'Invariant Set',
        body: [
          'Mutual exclusivity and outcome totality are always preserved.',
          'Acknowledgment cannot bypass non-overridable constraints.',
        ],
      },
      {
        heading: 'Operational Consequence',
        body: [
          'No ambiguous output path is permitted.',
          'No hidden route exists from uncertain state to PROCEED.',
        ],
      },
    ],
  },
  'formal-verification': {
    title: 'Formal Verification Scope',
    summary: 'What is formally verified in the kernel and what remains outside verification claims.',
    track: 'Core',
    status: 'In Progress',
    audience: ['Developers', 'Partners', 'Leadership'],
    confidentiality: 'Public',
    lastUpdated: '2026-01-15',
    source: 'https://www.notion.so/2e9adcdd14e180c2b12ff418128abc10',
    sections: [
      {
        heading: 'Verification Target',
        body: [
          'States, transitions, invariant preservation, and outcome mapping in the authorization kernel.',
          'Verification is specification-level and structural, not domain predictive.',
        ],
      },
      {
        heading: 'In Scope',
        body: [
          'Mutual exclusivity, totality of outcomes, fail-closed behavior, and auditability reachability.',
          'Constraint semantics and acknowledgment boundary correctness.',
        ],
      },
      {
        heading: 'Out of Scope',
        body: [
          'Decision quality, risk scoring quality, model performance, and physical world outcomes.',
          'Any claim that depends on external system behavior is excluded.',
        ],
      },
    ],
  },
  architecture: {
    title: 'ClearanceGate Technical Architecture',
    summary: 'Component design and deployment topology for execution-boundary authorization.',
    track: 'Engineering',
    status: 'Published',
    audience: ['Developers', 'Internal Team', 'Partners'],
    confidentiality: 'Public',
    lastUpdated: '2026-01-15',
    source: 'https://www.notion.so/2e9adcdd14e180c594d3f5a43bd48aee',
    sections: [
      {
        heading: 'Core Components',
        body: [
          'Policy and constraint engine, state machine engine, authorization kernel, evidence generator.',
          'Kernel semantics remain deterministic and profile-independent.',
        ],
      },
      {
        heading: 'Integration Boundary',
        body: [
          'The system is placed directly before execution, not after incident detection.',
          'The API surface is authorization-centric and evidence-centric.',
        ],
      },
      {
        heading: 'Deployment Modes',
        body: [
          'Inline gate for hard control, shadow mode for comparative validation.',
          'Async pre-authorization supports legacy execution chains without bypassing audit requirements.',
        ],
      },
      {
        heading: 'Architecture Guardrail',
        body: [
          'Blocking mode must not permit any unaudited bypass path.',
          'Evidence persistence is a prerequisite for non-blocking outcomes.',
        ],
      },
    ],
  },
  api: {
    title: 'ClearanceGate API Documentation',
    summary: 'Public API semantics for authorization, acknowledgment, and audit retrieval.',
    track: 'Engineering',
    status: 'Published',
    audience: ['Developers', 'Partners'],
    confidentiality: 'Public',
    lastUpdated: '2026-01-15',
    source: 'https://www.notion.so/2e9adcdd14e180dea077d90588b2d607',
    sections: [
      {
        heading: 'Endpoint Surface',
        body: [
          'POST /authorize and POST /acknowledge for decision control.',
          'GET /audit/{decision_id} for reconstructable evidence retrieval.',
        ],
      },
      {
        heading: 'Required Inputs',
        body: [
          'request_id, decision_id, profile, action, context, responsibility, and source metadata are mandatory.',
          'request_id uniqueness guarantees idempotency and replay safety.',
        ],
      },
      {
        heading: 'Operational Semantics',
        body: [
          'Identical inputs under identical rule version produce identical authorization outcomes.',
          'Internal errors must remain fail-closed and cannot authorize execution.',
        ],
      },
      {
        heading: 'Evidence Contract',
        body: [
          'Non-blocking outcomes require evidence references.',
          'Audit records are structured for post-incident reconstruction and compliance review.',
        ],
      },
    ],
  },
  'pilot-plan': {
    title: 'ClearanceGate POC Pilot Plan',
    summary: 'Six-week pilot framework to validate structural safety in real execution workflows.',
    track: 'Operations',
    status: 'Pilot Ready',
    audience: ['Leadership', 'Partners', 'Customers'],
    confidentiality: 'Public',
    lastUpdated: '2026-01-15',
    source: 'https://www.notion.so/2e9adcdd14e18093b488e0fb325e5506',
    sections: [
      {
        heading: 'Pilot Objective',
        body: [
          'Validate explicit authorization, accountability binding, and evidence reconstructability in a live workflow.',
          'Primary success metric is structural safety, not throughput or scale.',
        ],
      },
      {
        heading: 'Scope Envelope',
        body: [
          'One decision type, one execution boundary, one policy profile.',
          'Workflow replacement, optimization, and broad process transformation are intentionally out of scope.',
        ],
      },
      {
        heading: 'Execution Phases',
        body: [
          'Week 1-2 alignment and profile setup; Week 3-4 integration and dry runs; Week 5-6 live or shadow execution.',
          'Pass criteria include no bypass path, no ambiguous outcomes, and complete evidence for all non-blocking decisions.',
        ],
      },
    ],
  },
  'enterprise-guide': {
    title: 'ClearanceGate Enterprise Implementation Guide',
    summary: 'Enterprise integration approach, rollout sequence, and operating model for production adoption.',
    track: 'Operations',
    status: 'Published',
    audience: ['Internal Team', 'Customers', 'Partners'],
    confidentiality: 'Public',
    lastUpdated: '2026-01-15',
    source: 'https://www.notion.so/2e9adcdd14e1806fa868c35fb740f1ae',
    sections: [
      {
        heading: 'Deployment Philosophy',
        body: [
          'Treat ClearanceGate as a governance boundary before irreversible execution.',
          'When authorization integrity is uncertain, safety has priority over availability.',
        ],
      },
      {
        heading: 'Integration Checklist',
        body: [
          'Identify every execution entry point and route all paths through the authorization gate.',
          'Validate fail-closed behavior in shadow mode before enabling hard blocking mode.',
        ],
      },
      {
        heading: 'Operational Practices',
        body: [
          'Monitor outcome distribution, DEGRADED rates, and information sufficiency patterns.',
          'Kernel semantic changes require explicit review and re-verification before release.',
        ],
      },
    ],
  },
  security: {
    title: 'ClearanceGate Security Compliance Report',
    summary: 'Security posture, fail-closed control expectations, and evidence integrity responsibilities.',
    track: 'Operations',
    status: 'Published',
    audience: ['Leadership', 'Customers', 'Partners'],
    confidentiality: 'Public',
    lastUpdated: '2026-01-15',
    source: 'https://www.notion.so/2e9adcdd14e180a4bdf7d8dec1de7215',
    sections: [
      {
        heading: 'Security Model',
        body: [
          'Governance-first architecture with explicit trust boundaries and no implicit allow path.',
          'Threat model includes unauthorized execution, bypass risk, responsibility ambiguity, and audit tampering.',
        ],
      },
      {
        heading: 'Fail-Closed Enforcement',
        body: [
          'Missing required data, invalid inputs, or internal errors must resolve to safe outcomes only.',
          'DEGRADED state must prohibit PROCEED and require explicit recovery procedure.',
        ],
      },
      {
        heading: 'Evidence Integrity',
        body: [
          'Audit records are append-only and authorization-critical.',
          'Failure to persist evidence prevents authorization.',
        ],
      },
    ],
  },
  roadmap: {
    title: 'ClearanceGate Product Roadmap',
    summary: 'Phased product evolution focused on correctness, embedding, and governance depth.',
    track: 'Business',
    status: 'In Progress',
    audience: ['Leadership', 'Investors', 'Partners'],
    confidentiality: 'Public',
    lastUpdated: '2026-01-15',
    source: 'https://www.notion.so/2e9adcdd14e180f2ae87e1b2425f2360',
    sections: [
      {
        heading: 'Roadmap Principles',
        body: [
          'Correctness before coverage, embedding before scaling, invariants before intelligence.',
          'Trust and defensibility outrank short-term feature velocity.',
        ],
      },
      {
        heading: 'Phased Evolution',
        body: [
          'Phase 0 authorization core, Phase 1 evidence foundation, Phase 2 executable MVP.',
          'Later phases extend profile coverage, governance tooling, and enterprise readiness.',
        ],
      },
      {
        heading: 'Deliberate Non-Goals',
        body: [
          'No recommendation engine, no risk prediction platform, no workflow replacement suite.',
          'Product scope remains anchored to authorization infrastructure.',
        ],
      },
    ],
  },
  personas: {
    title: 'ClearanceGate User Personas and Accountability',
    summary: 'Role model for decision owners, acknowledging authority, operators, and auditors.',
    track: 'Business',
    status: 'Published',
    audience: ['Leadership', 'Customers', 'Internal Team'],
    confidentiality: 'Public',
    lastUpdated: '2026-01-15',
    source: 'https://www.notion.so/2e9adcdd14e180c79c5bcdc4fdb5ce8b',
    sections: [
      {
        heading: 'Decision Owner',
        body: [
          'Accountable for execution outcomes and for post-incident rationale defensibility.',
          'Requires deterministic boundaries and explicit responsibility mapping.',
        ],
      },
      {
        heading: 'Acknowledging Authority',
        body: [
          'Provides explicit responsibility acceptance when policy mandates acknowledgment.',
          'Needs tightly scoped responsibility and non-overridable constraint transparency.',
        ],
      },
      {
        heading: 'Operator and Auditor',
        body: [
          'Operators require unambiguous machine-readable outcomes.',
          'Auditors require reconstructable timelines and evidence completeness.',
        ],
      },
    ],
  },
  pricing: {
    title: 'ClearanceGate Pricing Logic',
    summary: 'Infrastructure-style pricing model anchored to risk exposure and accountability value.',
    track: 'Business',
    status: 'Published',
    audience: ['Leadership', 'Investors', 'Sales'],
    confidentiality: 'Public',
    lastUpdated: '2026-01-15',
    source: 'https://www.notion.so/2e9adcdd14e1801f9ab8eea88b39ed2d',
    sections: [
      {
        heading: 'Pricing Principle',
        body: [
          'ClearanceGate is priced as risk infrastructure rather than usage software.',
          'License unit is authorization domain, not API calls, model usage, or seat count.',
        ],
      },
      {
        heading: 'Commercial Dynamics',
        body: [
          'Paid pilots convert to embedded annual enterprise licenses.',
          'Optional compliance and audit enablement services accelerate adoption.',
        ],
      },
      {
        heading: 'Guardrails',
        body: [
          'No pricing incentive may discourage safe BLOCK outcomes.',
          'Pricing discipline protects long-term trust and infrastructure positioning.',
        ],
      },
    ],
  },
  'market-opportunity': {
    title: 'ClearanceGate Market Opportunity Analysis',
    summary: 'Cross-industry market framing for authorization infrastructure in AI-accelerated execution systems.',
    track: 'Business',
    status: 'Draft',
    audience: ['Investors', 'Leadership', 'Partners'],
    confidentiality: 'Public',
    lastUpdated: '2026-01-15',
    source: 'https://www.notion.so/2e9adcdd14e180a0a0b8c743c64870b7',
    sections: [
      {
        heading: 'Structural Demand',
        body: [
          'Automation has scaled decision generation and execution speed faster than authorization controls.',
          'The persistent exposure is not decision quality alone, but inability to prove why execution was allowed.',
        ],
      },
      {
        heading: 'Timing Drivers',
        body: [
          'Execution latency has dropped from hours to milliseconds across finance, IT operations, and industrial systems.',
          'Regulatory and internal accountability pressure keeps rising, making explicit authorization unavoidable.',
        ],
      },
      {
        heading: 'Target Segments',
        body: [
          'Initial adoption is strongest where irreversible execution and audit pressure already exist.',
          'Entry segments include quant finance, enterprise IT operations, industrial automation, and regulated workflows.',
        ],
      },
      {
        heading: 'Expansion Logic',
        body: [
          'Land one execution surface, embed into governance, then expand to adjacent decision surfaces.',
          'Growth scales with criticality of actions and number of governed execution points.',
        ],
      },
    ],
  },
  'competitive-landscape': {
    title: 'ClearanceGate Competitive Landscape',
    summary: 'Positioning analysis across risk analytics, workflow tools, governance frameworks, and logging platforms.',
    track: 'Business',
    status: 'Draft',
    audience: ['Investors', 'Leadership', 'Partners'],
    confidentiality: 'Public',
    lastUpdated: '2026-01-15',
    source: 'https://www.notion.so/2e9adcdd14e1809dac36f01a68a07e81',
    sections: [
      {
        heading: 'Execution Stack Position',
        body: [
          'Most vendors operate before execution (analytics, workflows) or after execution (logging, observability).',
          'ClearanceGate is positioned at the authorization layer directly before execution.',
        ],
      },
      {
        heading: 'Why Existing Categories Are Not Substitutes',
        body: [
          'Risk tools assess what might happen; they do not decide whether execution may proceed.',
          'Workflow tools route approvals but do not enforce formal authorization invariants and fail-closed semantics.',
        ],
      },
      {
        heading: 'Strategic Defensibility',
        body: [
          'Once embedded in execution and governance documentation, removal materially increases operational risk.',
          'This creates infrastructure-level switching costs and long-term retention dynamics.',
        ],
      },
    ],
  },
  'financial-projections': {
    title: 'ClearanceGate Financial Projections',
    summary: 'Milestone-driven financial model focused on runway discipline and trust-first infrastructure scaling.',
    track: 'Business',
    status: 'Draft',
    audience: ['Investors', 'Leadership'],
    confidentiality: 'Public',
    lastUpdated: '2026-01-15',
    source: 'https://www.notion.so/2e9adcdd14e180aaa2e1f1cbb70afd33',
    sections: [
      {
        heading: 'Financial Philosophy',
        body: [
          'Runway over growth, validation over scale, correctness over speed, and embedding over acquisition.',
          'Model intentionally avoids burn-heavy growth assumptions.',
        ],
      },
      {
        heading: 'Revenue Architecture',
        body: [
          'Enterprise authorization license, paid pilot engagements, and optional compliance enablement services.',
          'Pricing anchors to incident and accountability risk exposure, not usage volume.',
        ],
      },
      {
        heading: 'Phased Economics',
        body: [
          'Phase 1 validates core with minimal burn; Phase 2 converts pilots; Phase 3 targets repeatable enterprise contracts.',
          'Burn scales only after embedded usage and renewal signals are proven.',
        ],
      },
      {
        heading: 'Investor Relevance',
        body: [
          'Infrastructure retention profile with low churn once authorization becomes operationally sticky.',
          'Not dependent on AI model race dynamics for core value creation.',
        ],
      },
    ],
  },
  'pitch-deck': {
    title: 'ClearanceGate Pitch Deck',
    summary: 'Investor-facing storyline: problem framing, solution wedge, market category, traction, and funding ask.',
    track: 'Business',
    status: 'Pilot Ready',
    audience: ['Investors', 'Leadership', 'Partners'],
    confidentiality: 'Public',
    lastUpdated: '2026-01-15',
    source: 'https://www.notion.so/2e9adcdd14e180c3a980cab6673187fd',
    sections: [
      {
        heading: 'Narrative Core',
        body: [
          'Decisions are accelerating through AI and automation; authorization is not scaling at the same pace.',
          'ClearanceGate positions authorization as a first-class infrastructure layer before execution.',
        ],
      },
      {
        heading: 'Differentiation Signal',
        body: [
          'Competes on authorization semantics and invariants rather than model intelligence or analytics breadth.',
          'Guarantees defensibility and accountability by construction.',
        ],
      },
      {
        heading: 'Go-To-Market Thesis',
        body: [
          'Start with pilot-ready high-accountability environments, then convert into annual enterprise contracts.',
          'Focus on execution surfaces where blocked actions are as important as allowed actions.',
        ],
      },
      {
        heading: 'Funding Use',
        body: [
          'Pre-seed capital is allocated to core development, pilot execution, and compliance readiness.',
          'Milestones prioritize embedded pilots and repeatable authorization profile adoption.',
        ],
      },
    ],
  },
}

const jaTitles: Record<string, string> = {
  'executive-summary': 'ClearanceGate エグゼクティブサマリー',
  constitution: 'ClearanceGate システム憲章',
  'state-machine': '認可ステートマシンと不変条件',
  'formal-verification': '形式検証の対象範囲',
  architecture: '技術アーキテクチャ',
  api: 'API ドキュメント',
  'pilot-plan': 'POC パイロット計画',
  'enterprise-guide': 'エンタープライズ導入ガイド',
  security: 'セキュリティ / コンプライアンス報告',
  roadmap: 'プロダクトロードマップ',
  personas: 'ユーザーペルソナと責任モデル',
  pricing: '価格ロジック',
  'market-opportunity': '市場機会分析',
  'competitive-landscape': '競争環境分析',
  'financial-projections': '財務予測',
  'pitch-deck': 'ピッチデッキ',
}

const jaSummaries: Record<string, string> = {
  'executive-summary': '意思決定生成が高速化する時代に、なぜ認可が新しい制御面になるのかを要約します。',
  constitution: '認可レイヤーの中核保証、境界、責任分担を定義した文書です。',
  'state-machine': '決定的な認可を支える状態定義と結果マッピングのルールを整理します。',
  'formal-verification': '何を形式的に検証し、何を検証対象外とするかを明示します。',
  architecture: '実行境界に配置される認可システムの構成要素と配置方針を説明します。',
  api: '認可、確認応答、監査取得のための公開 API の意味論をまとめます。',
  'pilot-plan': '6 週間の実証で構造安全性を確認するためのパイロット枠組みです。',
  'enterprise-guide': '本番導入に向けた統合順序、運用モデル、導入手順を示します。',
  security: 'fail-closed と証跡保全を中心に据えたセキュリティ姿勢を整理します。',
  roadmap: '正しさを優先しながら段階的に拡張するロードマップです。',
  personas: '意思決定責任者、承認者、運用者、監査者の役割を整理します。',
  pricing: '利用量ではなく責任とリスク露出に基づく価格設計を説明します。',
  'market-opportunity': 'AI 加速時代の実行システムにおける認可インフラ需要を分析します。',
  'competitive-landscape': '既存カテゴリと何が代替にならず、どこにポジションを取るかを示します。',
  'financial-projections': 'マイルストーン起点で作る財務計画と資本効率の考え方を示します。',
  'pitch-deck': '問題設定から市場、差別化、資金使途までを投資家向けに整理します。',
}

const localizeToJa = (content: DocsContent): DocsContent =>
  Object.fromEntries(
    Object.entries(content).map(([slug, doc]) => [
      slug,
      {
        ...doc,
        title: jaTitles[slug] || doc.title,
        summary: jaSummaries[slug] || doc.summary,
      },
    ]),
  )

const toNav = (content: DocsContent) =>
  docsOrder
    .filter((slug) => Boolean(content[slug]))
    .map((slug) => ({
      slug,
      title: content[slug].title,
    }))

const jaContent = localizeToJa(enContent)

const docsCatalog: Record<string, DocsCatalog> = {
  en: {
    nav: toNav(enContent),
    content: enContent,
  },
  ja: {
    nav: toNav(jaContent),
    content: jaContent,
  },
}

export const docsNav = docsCatalog.en.nav
export const docsContent = docsCatalog.en.content

export const getDocsForLocale = (locale: string): DocsCatalog => docsCatalog[locale] || docsCatalog.en
