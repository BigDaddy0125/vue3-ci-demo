<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import ArchitectureSection from '../components/ArchitectureSection.vue'
import GuaranteesSection from '../components/GuaranteesSection.vue'
import HeroSection from '../components/HeroSection.vue'
import PricingSection from '../components/PricingSection.vue'
import StateMachine from '../components/StateMachine.vue'
import VerificationSection from '../components/VerificationSection.vue'
import { getDocsForLocale } from '../docs/nav'
import { useLocale } from '../composables/useLocale'
import { useReveal } from '../composables/useReveal'
import { useSeo } from '../composables/useSeo'
import authorizationFlow from '../assets/authorization-flow.svg'
import auditEvidence from '../assets/audit-evidence.svg'
import verificationScope from '../assets/verification-scope.svg'
import usecaseFinance from '../assets/usecase-finance.svg'
import usecaseItops from '../assets/usecase-itops.svg'
import usecaseIndustrial from '../assets/usecase-industrial.svg'

useReveal('.reveal')

const { locale, setLocale } = useLocale()

const localizedDocs = computed(() => getDocsForLocale(locale.value))
const docsNav = computed(() => localizedDocs.value.nav)

const seoCopy = computed(() => {
  if (locale.value === 'ja') {
    return {
      title: '決定論的な認可インフラ',
      description:
        'ClearanceGate は実行前に決定論的認可を強制し、fail-closed、明示責任、監査可能性を構造的に提供します。',
    }
  }

  return {
    title: 'Deterministic Authorization Infrastructure',
    description:
      'ClearanceGate enforces deterministic authorization before execution with fail-closed behavior, explicit responsibility, and auditability by construction.',
  }
})

useSeo({
  title: computed(() => seoCopy.value.title),
  description: computed(() => seoCopy.value.description),
  path: '/',
  type: 'website',
})

const scrollProgress = ref(0)

const updateScrollProgress = () => {
  const doc = document.documentElement
  const max = doc.scrollHeight - doc.clientHeight
  if (max <= 0) {
    scrollProgress.value = 0
    return
  }
  scrollProgress.value = Math.min(1, Math.max(0, doc.scrollTop / max))
}

onMounted(() => {
  updateScrollProgress()
  window.addEventListener('scroll', updateScrollProgress, { passive: true })
  window.addEventListener('resize', updateScrollProgress)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateScrollProgress)
  window.removeEventListener('resize', updateScrollProgress)
})

const scrollToSection = (id) => {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const copy = computed(() => {
  if (locale.value === 'ja') {
    return {
      nav: {
        value: '価値',
        how: '仕組み',
        profiles: '適用領域',
        pilot: 'パイロット',
        faq: 'FAQ',
        docs: 'ドキュメント',
      },
      value: {
        eyebrow: 'Value',
        title: '暗黙権限から明示認可へ',
        points: [
          '各リクエストに対する決定論的認可結果',
          '情報不足や障害時でも fail-closed を維持',
          '実行前に責任を明示的に拘束',
          '改ざん困難で再構成可能な監査証跡',
          'カーネルを変えずにプロファイル適応',
        ],
        stats: [
          { value: '7', label: '認可状態' },
          { value: '4', label: '結果タイプ' },
          { value: '100%', label: 'Fail-Closed 設計' },
          { value: String(docsNav.value.length), label: '公開ドキュメント数' },
        ],
      },
      how: {
        eyebrow: 'How It Works',
        title: '実行直前の認可レイヤー',
      },
      visuals: {
        eyebrow: 'Visuals',
        title: 'コアモデルの要点',
        cards: [
          { title: '認可フロー', image: authorizationFlow, alt: '認可フロー図' },
          { title: '監査証跡チェーン', image: auditEvidence, alt: '監査証跡図' },
          { title: '検証境界', image: verificationScope, alt: '形式検証範囲図' },
        ],
      },
      profiles: {
        eyebrow: 'Target Profiles',
        title: '高説明責任が必要な領域',
        items: [
          {
            title: '定量金融',
            text: '戦略の go-live / pause / kill-switch を認可境界で制御。',
            image: usecaseFinance,
            alt: '定量金融の認可イメージ',
          },
          {
            title: 'エンタープライズ IT Ops',
            text: 'CI/CD のデプロイ・変更を本番前で明示的にゲーティング。',
            image: usecaseItops,
            alt: 'IT運用の認可イメージ',
          },
          {
            title: '産業オートメーション',
            text: '高責任ワークフローでアクション単位のクリアランスを実施。',
            image: usecaseIndustrial,
            alt: '産業オートメーションの認可イメージ',
          },
        ],
      },
      pilot: {
        eyebrow: 'Pilot Blueprint',
        title: '30-60日で進める導入パス',
        phases: [
          {
            title: 'Phase 1: 合意と設定',
            window: 'Week 1-2',
            points: ['判断タイプと実行境界を 1 つに限定', '制約と ACK ルールを定義', '連携契約と成功条件を確定'],
          },
          {
            title: 'Phase 2: 連携とドライラン',
            window: 'Week 3-4',
            points: ['/authorize と /acknowledge を接続', '遷移と証跡生成を検証', '障害注入で fail-closed を確認'],
          },
          {
            title: 'Phase 3: 実運用/シャドー実行',
            window: 'Week 5-6',
            points: ['実環境近傍で認可判断を実施', 'バイパス耐性と責任説明性を評価', '採用判断向けレポートを作成'],
          },
        ],
      },
      api: {
        eyebrow: 'API Quickstart',
        title: '最小の決定論的連携面',
        request: 'リクエスト',
        response: 'レスポンス',
      },
      roles: {
        eyebrow: 'Roles',
        title: '誰が何を担うか',
        cards: [
          {
            title: 'Decision Owner',
            body: '実行可否に責任を持ち、インシデント時に認可根拠を説明します。',
          },
          {
            title: 'Acknowledging Authority',
            body: 'REQUIRE_ACK の際に境界付きで責任受諾を明示します。',
          },
          {
            title: 'Operator / SRE',
            body: '機械可読な結果に従い、認可された実行のみを実施します。',
          },
          {
            title: 'Audit / Compliance Reviewer',
            body: '時系列を再構成し、制御順守と制約挙動を検証します。',
          },
        ],
      },
      proof: {
        eyebrow: 'Proof',
        title: 'ドキュメントで裏付ける主張',
        all: '全ドキュメントを見る',
      },
      faq: {
        eyebrow: 'FAQ',
        title: '導入時のよくある質問',
        items: [
          {
            question: 'ClearanceGate は意思決定システムを置き換えますか？',
            answer:
              '置き換えません。実行可否のみを認可し、判断生成やドメイン妥当性は対象外です。',
          },
          {
            question: '最初から強制ブロックにする必要がありますか？',
            answer: 'いいえ。まず shadow mode で証跡と失敗モードを確認し、次に inline blocking に移行します。',
          },
          {
            question: '内部エラーや情報不足時はどうなりますか？',
            answer: '安全側の BLOCK / DEGRADE を返し、PROCEED へフォールバックしません。',
          },
          {
            question: '価格はどのように決まりますか？',
            answer: 'API 回数や席数ではなく、Authorization Domain 単位で設定されます。',
          },
        ],
      },
      cta: {
        eyebrow: 'CTA',
        title: 'パイロット可能な認可境界が必要ですか？',
        primary: 'パイロット計画を見る',
        secondary: 'API を確認',
      },
    }
  }

  return {
    nav: {
      value: 'Value',
      how: 'How',
      profiles: 'Profiles',
      pilot: 'Pilot',
      faq: 'FAQ',
      docs: 'Docs',
    },
    value: {
      eyebrow: 'Value',
      title: 'From Implicit Permission To Explicit Authorization',
      points: [
        'Deterministic authorization output for each request',
        'Fail-closed behavior under missing info and system uncertainty',
        'Explicit responsibility binding before execution',
        'Immutable, reconstructable audit evidence by construction',
        'Domain profile adaptation without changing kernel semantics',
      ],
      stats: [
        { value: '7', label: 'Authorization states' },
        { value: '4', label: 'Deterministic outcomes' },
        { value: '100%', label: 'Fail-closed by design' },
        { value: String(docsNav.value.length), label: 'Core docs published' },
      ],
    },
    how: {
      eyebrow: 'How It Works',
      title: 'Authorization Layer Before Execution',
    },
    visuals: {
      eyebrow: 'Visuals',
      title: 'Core Model At A Glance',
      cards: [
        { title: 'Authorization Flow', image: authorizationFlow, alt: 'Authorization flow diagram' },
        { title: 'Audit Evidence Chain', image: auditEvidence, alt: 'Audit evidence timeline diagram' },
        { title: 'Verification Boundary', image: verificationScope, alt: 'Formal verification scope diagram' },
      ],
    },
    profiles: {
      eyebrow: 'Target Profiles',
      title: 'High-Accountability Environments',
      items: [
        {
          title: 'Quantitative Finance',
          text: 'Go-live, pause, and kill-switch authorization on strategy execution boundaries.',
          image: usecaseFinance,
          alt: 'Quantitative finance authorization illustration',
        },
        {
          title: 'Enterprise IT Ops',
          text: 'Deployment and change gates for CI/CD operations and production safety windows.',
          image: usecaseItops,
          alt: 'Enterprise IT operations authorization illustration',
        },
        {
          title: 'Industrial Automation',
          text: 'Action-level clearance in high-accountability workflows and simulation-first rollouts.',
          image: usecaseIndustrial,
          alt: 'Industrial automation clearance illustration',
        },
      ],
    },
    pilot: {
      eyebrow: 'Pilot Blueprint',
      title: '30-60 Day Implementation Path',
      phases: [
        {
          title: 'Phase 1: Alignment & Setup',
          window: 'Week 1-2',
          points: [
            'Choose one decision type and one execution boundary',
            'Define profile constraints and acknowledgment rules',
            'Finalize integration contract and success criteria',
          ],
        },
        {
          title: 'Phase 2: Integration & Dry Run',
          window: 'Week 3-4',
          points: [
            'Integrate /authorize and /acknowledge endpoints',
            'Validate transitions and evidence generation',
            'Inject failures to verify fail-closed behavior',
          ],
        },
        {
          title: 'Phase 3: Live / Shadow Execution',
          window: 'Week 5-6',
          points: [
            'Run real authorization decisions in production-adjacent path',
            'Review bypass resistance and accountability clarity',
            'Produce pilot report and evidence pack for adoption decision',
          ],
        },
      ],
    },
    api: {
      eyebrow: 'API Quickstart',
      title: 'Minimal Deterministic Integration Surface',
      request: 'Request',
      response: 'Response',
    },
    roles: {
      eyebrow: 'Roles',
      title: 'Who Owns What',
      cards: [
        {
          title: 'Decision Owner',
          body: 'Accountable for whether execution proceeds and for explaining rationale during incident review.',
        },
        {
          title: 'Acknowledging Authority',
          body: 'Explicitly accepts bounded responsibility when REQUIRE_ACK is triggered.',
        },
        {
          title: 'Operator / SRE',
          body: 'Consumes machine-readable outcomes and executes only when authorization allows.',
        },
        {
          title: 'Audit / Compliance Reviewer',
          body: 'Reconstructs timelines, verifies control adherence, and reviews constraint behavior.',
        },
      ],
    },
    proof: {
      eyebrow: 'Proof',
      title: 'Documentation Backed Product Claims',
      all: 'View All Docs',
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Common Adoption Questions',
      items: [
        {
          question: 'Does ClearanceGate replace decision-making systems?',
          answer:
            'No. It enforces whether execution is authorized. Decision generation, strategy quality, and domain correctness stay outside the kernel.',
        },
        {
          question: 'Can we start without hard blocking?',
          answer:
            'Yes. Pilot in shadow mode first, then move to inline blocking after evidence and failure-mode review are complete.',
        },
        {
          question: 'What happens on internal errors or missing data?',
          answer:
            'The kernel remains fail-closed and returns safe outcomes (BLOCK or DEGRADE). It never defaults to PROCEED under uncertainty.',
        },
        {
          question: 'How is pricing calculated?',
          answer:
            'Pricing is per authorization domain and tied to risk boundary value, not API calls, seats, or AI usage volume.',
        },
      ],
    },
    cta: {
      eyebrow: 'CTA',
      title: 'Need A Pilot-Ready Authorization Boundary?',
      primary: 'Start Pilot Plan',
      secondary: 'Review API',
    },
  }
})

const requestExample = `POST /authorize
Authorization: Bearer <api_key>
Content-Type: application/json

{
  "request_id": "req-2026-001",
  "decision_id": "deploy-prod-784",
  "profile": "itops_change",
  "action": { "type": "DEPLOY", "description": "prod release v2.4.1" },
  "context": { "attributes": { "service": "payments", "region": "ap-northeast-1" } },
  "responsibility": { "owner": "platform-ops", "role": "change_owner" },
  "metadata": { "source_system": "cicd", "timestamp": "2026-03-12T05:00:00Z" }
}`

const responseExample = `{
  "decision_id": "deploy-prod-784",
  "outcome": "REQUIRE_ACK",
  "clearance_state": "AWAITING_ACK",
  "evidence_id": "evd-9a22",
  "reason": {
    "summary": "Explicit risk acknowledgment required",
    "constraints_triggered": ["RISK_ACK_REQUIRED"]
  },
  "version": { "kernel": "1.0.0", "policy": "itops_change_v1" }
}`
</script>

<template>
  <div class="site">
    <div class="scroll-progress" :style="{ transform: `scaleX(${scrollProgress})` }"></div>
    <div class="bg-grid" aria-hidden="true"></div>
    <div class="bg-orb orb-a" aria-hidden="true"></div>
    <div class="bg-orb orb-b" aria-hidden="true"></div>

    <header class="topbar reveal fade-in">
      <div class="brand">ClearanceGate</div>
      <div class="top-nav">
        <button class="top-cta top-link-btn" type="button" @click="scrollToSection('value')">{{ copy.nav.value }}</button>
        <button class="top-cta top-link-btn" type="button" @click="scrollToSection('how')">{{ copy.nav.how }}</button>
        <button class="top-cta top-link-btn" type="button" @click="scrollToSection('features')">{{ copy.nav.profiles }}</button>
        <button class="top-cta top-link-btn" type="button" @click="scrollToSection('pilot')">{{ copy.nav.pilot }}</button>
        <button class="top-cta top-link-btn" type="button" @click="scrollToSection('faq')">{{ copy.nav.faq }}</button>
        <RouterLink class="top-cta" :to="{ name: 'doc', params: { slug: 'constitution' } }">{{ copy.nav.docs }}</RouterLink>
        <div class="lang-switch" role="group" aria-label="Language">
          <button class="lang-btn" :class="{ active: locale === 'en' }" @click="setLocale('en')">EN</button>
          <button class="lang-btn" :class="{ active: locale === 'ja' }" @click="setLocale('ja')">日本語</button>
        </div>
      </div>
    </header>

    <main>
      <HeroSection @jump="scrollToSection" />

      <section id="value" class="section reveal fade-up">
        <div class="section-head">
          <p class="eyebrow">{{ copy.value.eyebrow }}</p>
          <h2>{{ copy.value.title }}</h2>
        </div>
        <div class="metrics-strip reveal fade-in">
          <article v-for="item in copy.value.stats" :key="item.label" class="metric-item">
            <p class="metric-value">{{ item.value }}</p>
            <p class="metric-label">{{ item.label }}</p>
          </article>
        </div>
        <div class="three-grid compact-grid">
          <article
            v-for="(point, idx) in copy.value.points"
            :key="point"
            class="card value-card reveal fade-up"
            :style="{ '--reveal-delay': `${idx * 80}ms` }"
          >
            <p>{{ point }}</p>
          </article>
        </div>
      </section>

      <section id="how" class="section reveal fade-up">
        <div class="section-head">
          <p class="eyebrow">{{ copy.how.eyebrow }}</p>
          <h2>{{ copy.how.title }}</h2>
        </div>
        <div class="card mono">Decision Proposal -> ClearanceGate Authorization -> PROCEED | BLOCK | REQUIRE_ACK | DEGRADE</div>
      </section>

      <section class="section reveal fade-up">
        <div class="section-head">
          <p class="eyebrow">{{ copy.visuals.eyebrow }}</p>
          <h2>{{ copy.visuals.title }}</h2>
        </div>
        <div class="three-grid visuals-grid">
          <article
            v-for="(item, idx) in copy.visuals.cards"
            :key="item.title"
            class="card visual-card reveal fade-up"
            :style="{ '--reveal-delay': `${idx * 85}ms` }"
          >
            <img class="visual-image" :src="item.image" :alt="item.alt" loading="lazy" />
            <h3>{{ item.title }}</h3>
          </article>
        </div>
      </section>

      <GuaranteesSection />
      <StateMachine />
      <ArchitectureSection />
      <VerificationSection />

      <section id="features" class="section reveal fade-up">
        <div class="section-head">
          <p class="eyebrow">{{ copy.profiles.eyebrow }}</p>
          <h2>{{ copy.profiles.title }}</h2>
        </div>
        <div class="three-grid">
          <article
            v-for="(item, idx) in copy.profiles.items"
            :key="item.title"
            class="card reveal fade-up feature-card"
            :style="{ '--reveal-delay': `${idx * 90}ms` }"
          >
            <img class="feature-image" :src="item.image" :alt="item.alt" loading="lazy" />
            <h3>{{ item.title }}</h3>
            <p>{{ item.text }}</p>
          </article>
        </div>
      </section>

      <section id="pilot" class="section reveal fade-up">
        <div class="section-head">
          <p class="eyebrow">{{ copy.pilot.eyebrow }}</p>
          <h2>{{ copy.pilot.title }}</h2>
        </div>
        <div class="three-grid compact-grid">
          <article v-for="phase in copy.pilot.phases" :key="phase.title" class="card phase-card">
            <p class="phase-window">{{ phase.window }}</p>
            <h3>{{ phase.title }}</h3>
            <ul class="phase-list">
              <li v-for="point in phase.points" :key="point">{{ point }}</li>
            </ul>
          </article>
        </div>
      </section>

      <section class="section reveal fade-up">
        <div class="section-head">
          <p class="eyebrow">{{ copy.api.eyebrow }}</p>
          <h2>{{ copy.api.title }}</h2>
        </div>
        <div class="split-grid compact-grid">
          <article class="card">
            <p class="tile-kicker">{{ copy.api.request }}</p>
            <pre class="code-block"><code>{{ requestExample }}</code></pre>
          </article>
          <article class="card">
            <p class="tile-kicker">{{ copy.api.response }}</p>
            <pre class="code-block"><code>{{ responseExample }}</code></pre>
          </article>
        </div>
      </section>

      <section class="section reveal fade-up">
        <div class="section-head">
          <p class="eyebrow">{{ copy.roles.eyebrow }}</p>
          <h2>{{ copy.roles.title }}</h2>
        </div>
        <div class="split-grid compact-grid">
          <article v-for="item in copy.roles.cards" :key="item.title" class="card">
            <h3>{{ item.title }}</h3>
            <p>{{ item.body }}</p>
          </article>
        </div>
      </section>

      <PricingSection />

      <section id="proof" class="section reveal fade-up">
        <div class="section-head">
          <p class="eyebrow">{{ copy.proof.eyebrow }}</p>
          <h2>{{ copy.proof.title }}</h2>
        </div>
        <div class="three-grid compact-grid">
          <RouterLink
            v-for="(doc, idx) in docsNav.slice(0, 6)"
            :key="doc.slug"
            class="card card-link reveal fade-up"
            :style="{ '--reveal-delay': `${idx * 70}ms` }"
            :to="{ name: 'doc', params: { slug: doc.slug } }"
          >
            <h3>{{ doc.title }}</h3>
            <p class="mono">/docs/{{ doc.slug }}</p>
          </RouterLink>
        </div>
        <div class="proof-actions">
          <RouterLink class="btn btn-ghost" :to="{ name: 'doc' }">{{ copy.proof.all }}</RouterLink>
        </div>
      </section>

      <section id="faq" class="section reveal fade-up">
        <div class="section-head">
          <p class="eyebrow">{{ copy.faq.eyebrow }}</p>
          <h2>{{ copy.faq.title }}</h2>
        </div>
        <div class="faq-list">
          <details v-for="item in copy.faq.items" :key="item.question" class="card faq-item">
            <summary>{{ item.question }}</summary>
            <p>{{ item.answer }}</p>
          </details>
        </div>
      </section>

      <section class="section reveal fade-up">
        <div class="card cta-block">
          <p class="eyebrow">{{ copy.cta.eyebrow }}</p>
          <h2>{{ copy.cta.title }}</h2>
          <div class="hero-actions">
            <RouterLink class="btn btn-primary" :to="{ name: 'doc', params: { slug: 'pilot-plan' } }">
              {{ copy.cta.primary }}
            </RouterLink>
            <RouterLink class="btn btn-ghost" :to="{ name: 'doc', params: { slug: 'api' } }">
              {{ copy.cta.secondary }}
            </RouterLink>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

