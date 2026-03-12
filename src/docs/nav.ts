const docsCatalog = {
  en: {
    nav: [
      { slug: 'executive-summary', title: 'Executive Summary' },
      { slug: 'constitution', title: 'System Constitution' },
      { slug: 'state-machine', title: 'State Machine & Invariants' },
      { slug: 'formal-verification', title: 'Formal Verification Scope' },
      { slug: 'architecture', title: 'Technical Architecture' },
      { slug: 'api', title: 'API Documentation' },
      { slug: 'pilot-plan', title: 'POC Pilot Plan' },
      { slug: 'enterprise-guide', title: 'Enterprise Implementation Guide' },
      { slug: 'security', title: 'Security Compliance Report' },
      { slug: 'roadmap', title: 'Product Roadmap' },
      { slug: 'personas', title: 'User Personas' },
      { slug: 'pricing', title: 'Pricing Logic' },
    ],
    content: {
      'executive-summary': {
        title: 'ClearanceGate Executive Summary',
        sections: [
          {
            heading: 'Problem',
            body: [
              'Critical actions are increasingly automated, but authorization is still implicit in many organizations.',
              'When incidents happen, responsibility and rationale are reconstructed after the fact instead of enforced before execution.',
            ],
          },
          {
            heading: 'Solution',
            body: [
              'ClearanceGate inserts a deterministic authorization boundary between decision proposal and execution.',
              'Every request produces exactly one outcome: PROCEED, BLOCK, REQUIRE_ACK, or DEGRADE.',
            ],
          },
          {
            heading: 'What Changes Operationally',
            body: [
              'Execution cannot proceed without explicit clearance under declared constraints.',
              'Responsibility attribution and audit evidence become by-construction properties rather than optional process artifacts.',
            ],
          },
        ],
      },
      constitution: {
        title: 'ClearanceGate System Constitution',
        sections: [
          {
            heading: 'Purpose',
            body: [
              'ClearanceGate is a formal authorization system that decides whether execution is authorized under explicit constraints.',
              'It does not decide what action should be taken and does not replace expert decision-makers.',
            ],
          },
          {
            heading: 'Constitutional Guarantees',
            body: [
              'Deterministic authorization outcome for each valid input.',
              'Mutual exclusivity of outcomes and fail-closed behavior under uncertainty.',
              'Auditability as a system invariant with reconstructable records.',
            ],
          },
          {
            heading: 'Boundary',
            body: [
              'ClearanceGate guarantees structural correctness, not outcome correctness.',
              'External systems remain responsible for input quality, execution behavior, and domain decisions.',
            ],
          },
        ],
      },
      'state-machine': {
        title: 'Clearance State Machine & Invariants',
        sections: [
          {
            heading: 'States',
            body: [
              'INIT, INFO_INSUFFICIENT, RISK_FLAGGED, AWAITING_ACK, AUTHORIZED, BLOCKED, DEGRADED.',
              'Each decision instance exists in exactly one state at any moment.',
            ],
          },
          {
            heading: 'Outcome Mapping',
            body: [
              'AUTHORIZED -> PROCEED, AWAITING_ACK -> REQUIRE_ACK.',
              'INFO_INSUFFICIENT/RISK_FLAGGED/BLOCKED -> BLOCK, DEGRADED -> DEGRADE.',
            ],
          },
          {
            heading: 'Invariants',
            body: [
              'Mutual exclusivity and outcome totality.',
              'Fail-closed authorization under uncertainty.',
              'Acknowledgment cannot override non-overridable constraints.',
            ],
          },
        ],
      },
      'formal-verification': {
        title: 'Formal Verification Scope',
        sections: [
          {
            heading: 'Verification Target',
            body: [
              'The clearance authorization kernel: states, transitions, outcome mapping, invariants.',
              'Verification is structural and specification-level.',
            ],
          },
          {
            heading: 'In Scope',
            body: [
              'Mutual exclusivity, outcome totality, fail-closed behavior, auditability reachability.',
              'Constraint semantics and acknowledgment boundary enforcement.',
            ],
          },
          {
            heading: 'Out Of Scope',
            body: [
              'Decision correctness, risk estimation quality, model performance, physical-world outcomes.',
            ],
          },
        ],
      },
      architecture: {
        title: 'Technical Architecture',
        sections: [
          {
            heading: 'Core Components',
            body: [
              'Policy and constraint engine, state machine engine, authorization kernel, evidence generator.',
              'Kernel remains deterministic and profile-independent.',
            ],
          },
          {
            heading: 'Integration Boundary',
            body: [
              'ClearanceGate is placed immediately before execution.',
              'It exposes authorization APIs and evidence retrieval, not execution APIs.',
            ],
          },
          {
            heading: 'Deployment Topologies',
            body: [
              'Inline gate for production control, shadow mode for evaluation, async pre-authorization for legacy execution systems.',
              'No unaudited bypass path should exist in blocking mode.',
            ],
          },
        ],
      },
      api: {
        title: 'API Documentation',
        sections: [
          {
            heading: 'Endpoints',
            body: [
              'POST /authorize, POST /acknowledge, GET /audit/{decision_id}.',
              'Responses always include a deterministic authorization outcome and evidence reference.',
            ],
          },
          {
            heading: 'Request Semantics',
            body: [
              'Each request requires request_id, decision_id, profile, action, context, responsibility, and source metadata.',
              'request_id must be unique to ensure idempotency and replay safety.',
            ],
          },
          {
            heading: 'Operational Semantics',
            body: [
              'Identical inputs under the same rule version produce the same authorization outcome.',
              'Internal errors never authorize execution and remain fail-closed.',
            ],
          },
        ],
      },
      'pilot-plan': {
        title: 'ClearanceGate POC Pilot Plan',
        sections: [
          {
            heading: 'Pilot Objective',
            body: [
              'Validate trust properties in a real workflow: explicit authorization, responsibility binding, and reconstructable evidence.',
              'Pilot success focuses on structural safety, not business scale or throughput KPIs.',
            ],
          },
          {
            heading: 'Scope',
            body: [
              'One decision type, one execution boundary, one profile.',
              'No optimization, no execution orchestration, and no broad workflow replacement in pilot scope.',
            ],
          },
          {
            heading: 'Phases',
            body: [
              'Week 1-2: alignment and profile setup. Week 3-4: integration and dry runs. Week 5-6: live or shadow execution with evidence review.',
              'Pass condition includes no bypass, no ambiguous outcomes, and complete evidence for all non-blocked decisions.',
            ],
          },
        ],
      },
      'enterprise-guide': {
        title: 'Enterprise Implementation Guide',
        sections: [
          {
            heading: 'Deployment Philosophy',
            body: [
              'ClearanceGate is a governance boundary placed before irreversible execution.',
              'Safety takes priority over availability when authorization integrity is uncertain.',
            ],
          },
          {
            heading: 'Integration Checklist',
            body: [
              'Identify all execution entry points, route all paths through ClearanceGate, define roles, and verify fail-closed behavior.',
              'Shadow mode evidence should be reviewed before enabling hard blocking mode.',
            ],
          },
          {
            heading: 'Operations',
            body: [
              'Monitor outcome distribution, degraded events, and missing information patterns.',
              'Any kernel-level semantic change requires explicit review and re-verification.',
            ],
          },
        ],
      },
      security: {
        title: 'Security Compliance Report',
        sections: [
          {
            heading: 'Security Model',
            body: [
              'Governance-first security with explicit trust boundaries and no implicit allow behavior.',
              'Threats include unauthorized execution, bypass risk, ambiguous responsibility, and audit tampering.',
            ],
          },
          {
            heading: 'Fail-Closed & Degraded Behavior',
            body: [
              'Missing required data, invalid inputs, or internal errors resolve to safe outcomes only.',
              'DEGRADED state prohibits PROCEED and requires explicit recovery handling.',
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
        title: 'Product Roadmap',
        sections: [
          {
            heading: 'Roadmap Principles',
            body: [
              'Correctness before coverage, embedding before scaling, invariants before intelligence.',
              'Trust and defensibility are prioritized over feature velocity.',
            ],
          },
          {
            heading: 'Phased Evolution',
            body: [
              'Phase 0: authorization core. Phase 1: evidence foundation. Phase 2: executable MVP.',
              'Phase 3+: first profile pilot, governance tooling, then enterprise readiness.',
            ],
          },
          {
            heading: 'Deliberate Non-Goals',
            body: [
              'Not a recommendation engine, not a risk prediction platform, not a workflow replacement suite.',
            ],
          },
        ],
      },
      personas: {
        title: 'User Personas & Accountability',
        sections: [
          {
            heading: 'Decision Owner',
            body: [
              'Accountable for whether execution proceeds and for explaining authorization rationale after incidents.',
              'Values deterministic outcomes, explicit boundaries, and defensible accountability.',
            ],
          },
          {
            heading: 'Acknowledging Authority',
            body: [
              'Provides explicit acceptance for risk-elevated decisions when policy requires acknowledgment.',
              'Needs precise scope, bounded responsibility, and clear constraints that cannot be overridden.',
            ],
          },
          {
            heading: 'Operator & Auditor',
            body: [
              'Operators need unambiguous machine-readable outcomes; auditors need reconstructable timelines with evidence.',
              'Both benefit from reduced ambiguity and stronger post-incident review quality.',
            ],
          },
        ],
      },
      pricing: {
        title: 'Pricing Logic',
        sections: [
          {
            heading: 'Pricing Principle',
            body: [
              'ClearanceGate is priced as risk infrastructure, not usage software.',
              'License unit is authorization domain rather than calls, seats, or model usage.',
            ],
          },
          {
            heading: 'Commercial Dynamics',
            body: [
              'Paid pilots transition to embedded annual enterprise licenses.',
              'Optional compliance and audit enablement services support adoption.',
            ],
          },
          {
            heading: 'Guardrails',
            body: [
              'No incentives that discourage safe blocking behavior.',
              'Pricing discipline protects trust and long-term infrastructure positioning.',
            ],
          },
        ],
      },
    },
  },
  ja: {
    nav: [
      { slug: 'executive-summary', title: 'エグゼクティブサマリー' },
      { slug: 'constitution', title: 'システム憲章' },
      { slug: 'state-machine', title: '状態機械と不変条件' },
      { slug: 'formal-verification', title: '形式検証の範囲' },
      { slug: 'architecture', title: '技術アーキテクチャ' },
      { slug: 'api', title: 'API 仕様' },
      { slug: 'pilot-plan', title: 'POC パイロット計画' },
      { slug: 'enterprise-guide', title: 'エンタープライズ実装ガイド' },
      { slug: 'security', title: 'セキュリティ / コンプライアンス' },
      { slug: 'roadmap', title: 'プロダクトロードマップ' },
      { slug: 'personas', title: 'ユーザーペルソナ' },
      { slug: 'pricing', title: '価格ロジック' },
    ],
    content: {
      'executive-summary': {
        title: 'ClearanceGate エグゼクティブサマリー',
        sections: [
          {
            heading: '課題',
            body: [
              '重要な実行は自動化が進む一方で、承認は依然として暗黙運用に依存しています。',
              'インシデント後に責任や根拠を後追い再構成する体制では、防御可能性が低下します。',
            ],
          },
          {
            heading: '解決策',
            body: [
              'ClearanceGate は意思決定提案と実行の間に、決定論的な認可境界を挿入します。',
              '全リクエストは PROCEED / BLOCK / REQUIRE_ACK / DEGRADE のいずれか一つだけを返します。',
            ],
          },
          {
            heading: '運用上の変化',
            body: [
              '宣言済み制約の下で明示的クリアランスがない限り実行できません。',
              '責任帰属と監査証跡は任意の成果物ではなく、構造的なシステム特性になります。',
            ],
          },
        ],
      },
      constitution: {
        title: 'ClearanceGate システム憲章',
        sections: [
          {
            heading: '目的',
            body: [
              'ClearanceGate は明示的制約に基づいて実行可否を判定する、形式的な認可システムです。',
              '何を実行すべきかは決めず、専門家による意思決定を置き換えません。',
            ],
          },
          {
            heading: '中核保証',
            body: [
              '有効入力に対して決定論的な認可結果を返すこと。',
              '結果の相互排他性と、不確実時の fail-closed 動作。',
              '再構成可能な監査証跡を不変条件として保持。',
            ],
          },
          {
            heading: '責務境界',
            body: [
              '保証対象は構造的正当性であり、ドメイン結果の正しさではありません。',
              '入力品質、実行挙動、業務判断は外部システムが責任を持ちます。',
            ],
          },
        ],
      },
      'state-machine': {
        title: 'クリアランス状態機械と不変条件',
        sections: [
          {
            heading: '状態',
            body: [
              'INIT, INFO_INSUFFICIENT, RISK_FLAGGED, AWAITING_ACK, AUTHORIZED, BLOCKED, DEGRADED。',
              '各判断インスタンスは常に一つの状態にのみ存在します。',
            ],
          },
          {
            heading: '結果マッピング',
            body: [
              'AUTHORIZED -> PROCEED, AWAITING_ACK -> REQUIRE_ACK。',
              'INFO_INSUFFICIENT / RISK_FLAGGED / BLOCKED -> BLOCK, DEGRADED -> DEGRADE。',
            ],
          },
          {
            heading: '不変条件',
            body: [
              '相互排他性と結果全域性。',
              '不確実時の fail-closed 認可。',
              '非上書き制約は ACK で回避できないこと。',
            ],
          },
        ],
      },
      'formal-verification': {
        title: '形式検証の範囲',
        sections: [
          {
            heading: '検証対象',
            body: [
              '認可カーネルの状態、遷移、結果マッピング、不変条件。',
              '検証は構造レベル・仕様レベルで行います。',
            ],
          },
          {
            heading: '対象内',
            body: [
              '相互排他性、結果全域性、fail-closed、監査到達可能性。',
              '制約意味論と ACK 境界の強制。',
            ],
          },
          {
            heading: '対象外',
            body: ['意思決定の正しさ、リスク推定精度、モデル性能、現実世界の結果。'],
          },
        ],
      },
      architecture: {
        title: '技術アーキテクチャ',
        sections: [
          {
            heading: 'コア構成要素',
            body: [
              'ポリシー/制約エンジン、状態機械エンジン、認可カーネル、証跡生成器。',
              'カーネルは決定論的かつプロファイル非依存で維持されます。',
            ],
          },
          {
            heading: '統合境界',
            body: [
              'ClearanceGate は実行直前の境界に配置します。',
              '提供するのは認可 API と証跡参照であり、実行 API ではありません。',
            ],
          },
          {
            heading: '配置トポロジ',
            body: [
              '本番は Inline Gate、検証は Shadow Mode、レガシー連携は Async Pre-Authorization。',
              '強制モードでの無監査バイパスは禁止です。',
            ],
          },
        ],
      },
      api: {
        title: 'API 仕様',
        sections: [
          {
            heading: 'エンドポイント',
            body: [
              'POST /authorize, POST /acknowledge, GET /audit/{decision_id}。',
              'レスポンスには決定論的な認可結果と証跡参照を常に含みます。',
            ],
          },
          {
            heading: 'リクエスト意味論',
            body: [
              'request_id, decision_id, profile, action, context, responsibility, metadata を必須化。',
              'request_id の一意性により冪等性とリプレイ安全性を担保します。',
            ],
          },
          {
            heading: '運用意味論',
            body: [
              '同一ルール版で同一入力なら同一結果を返します。',
              '内部エラー時に PROCEED は返さず fail-closed を維持します。',
            ],
          },
        ],
      },
      'pilot-plan': {
        title: 'ClearanceGate POC パイロット計画',
        sections: [
          {
            heading: '目的',
            body: [
              '実ワークフローで明示認可、責任拘束、証跡再構成可能性を検証します。',
              '評価対象は売上や規模ではなく、構造的安全性です。',
            ],
          },
          {
            heading: 'スコープ',
            body: [
              '判断タイプ 1 つ、実行境界 1 つ、プロファイル 1 つに限定。',
              '最適化、実行オーケストレーション、業務ワークフロー置換は範囲外。',
            ],
          },
          {
            heading: 'フェーズ',
            body: [
              'Week 1-2: 合意と設定。Week 3-4: 連携とドライラン。Week 5-6: 実運用/シャドー実行。',
              'バイパスなし、曖昧な結果なし、非ブロック判断の完全証跡を合格条件とします。',
            ],
          },
        ],
      },
      'enterprise-guide': {
        title: 'エンタープライズ実装ガイド',
        sections: [
          {
            heading: '配置思想',
            body: [
              'ClearanceGate は不可逆実行の直前に置くガバナンス境界です。',
              '認可整合性が不確実な場合は可用性より安全性を優先します。',
            ],
          },
          {
            heading: '導入チェックリスト',
            body: [
              '実行入口の特定、全経路の経由強制、役割定義、fail-closed 検証を実施。',
              '強制モード前に Shadow Mode の証跡をレビューします。',
            ],
          },
          {
            heading: '運用',
            body: [
              '結果分布、DEGRADED 発生、情報不足パターンを監視します。',
              'カーネル意味論に関わる変更は明示レビューと再検証が必要です。',
            ],
          },
        ],
      },
      security: {
        title: 'セキュリティ / コンプライアンス報告',
        sections: [
          {
            heading: 'セキュリティモデル',
            body: [
              '明示的な信頼境界と暗黙許可禁止を前提とする governance-first 設計。',
              '脅威は未承認実行、バイパス、責任曖昧化、監査改ざんを想定します。',
            ],
          },
          {
            heading: 'Fail-Closed と DEGRADED',
            body: [
              '必須情報欠落、入力不正、内部エラーは安全側結果に収束します。',
              'DEGRADED 状態では PROCEED を禁止し、明示復旧を要求します。',
            ],
          },
          {
            heading: '証跡整合性',
            body: [
              '監査記録は追記専用で認可クリティカルです。',
              '証跡永続化に失敗した場合は認可しません。',
            ],
          },
        ],
      },
      roadmap: {
        title: 'プロダクトロードマップ',
        sections: [
          {
            heading: '原則',
            body: [
              'Coverage より Correctness、Scale より Embedding、Intelligence より Invariants。',
              '短期機能より長期的な信頼性と防御可能性を優先します。',
            ],
          },
          {
            heading: '段階的進化',
            body: [
              'Phase 0: 認可コア、Phase 1: 証跡基盤、Phase 2: 実行可能 MVP。',
              'Phase 3 以降は業界プロファイル、ガバナンス機能、Enterprise Ready へ拡張。',
            ],
          },
          {
            heading: '非目標',
            body: [
              '推奨エンジン、リスク予測基盤、ワークフロー全面置換スイートにはしません。',
            ],
          },
        ],
      },
      personas: {
        title: 'ユーザーペルソナと責任境界',
        sections: [
          {
            heading: 'Decision Owner',
            body: [
              '実行可否に最終責任を持ち、事後レビューで認可根拠を説明します。',
              '決定論、責任明確化、防御可能性を重視します。',
            ],
          },
          {
            heading: 'Acknowledging Authority',
            body: [
              'REQUIRE_ACK 時に境界付きで責任受諾を明示します。',
              '何を承認し何を承認しないかが明確であることを必要とします。',
            ],
          },
          {
            heading: 'Operator と Auditor',
            body: [
              'Operator は曖昧さのない機械可読結果を必要とし、Auditor は再構成可能な時系列証跡を必要とします。',
              '両者とも運用の透明性と事後説明品質を高められます。',
            ],
          },
        ],
      },
      pricing: {
        title: '価格ロジック',
        sections: [
          {
            heading: '価格原則',
            body: [
              'ClearanceGate は利用量課金ではなく、リスク基盤として価格設計します。',
              'ライセンス単位は API 回数や席数ではなく Authorization Domain です。',
            ],
          },
          {
            heading: '商流',
            body: [
              '有償パイロットから埋め込み型の年契約へ移行します。',
              '監査・コンプライアンス支援はオプションとして提供します。',
            ],
          },
          {
            heading: 'ガードレール',
            body: [
              '安全な BLOCK を阻害する価格インセンティブは設けません。',
              '価格規律で信頼と長期インフラ価値を守ります。',
            ],
          },
        ],
      },
    },
  },
}

export const docsNav = docsCatalog.en.nav
export const docsContent = docsCatalog.en.content

export const getDocsForLocale = (locale) => docsCatalog[locale] || docsCatalog.en

