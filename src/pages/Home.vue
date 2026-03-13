<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getDocsForLocale } from '../docs/nav'
import { useLocale } from '../composables/useLocale'
import { useReveal } from '../composables/useReveal'
import { useSeo } from '../composables/useSeo'
import usecaseFinance from '../assets/usecase-finance.svg'
import usecaseItops from '../assets/usecase-itops.svg'
import usecaseIndustrial from '../assets/usecase-industrial.svg'

const NOTION_DOC_URL =
  'https://hyper-truck-b3a.notion.site/2e9adcdd14e1809d8473d1f53e8aaed8?v=2e9adcdd14e18073b7e7000c9b1016c3&source=copy_link'

useReveal('.reveal', { threshold: 0.14, rootMargin: '0px 0px -12% 0px' })

const route = useRoute()
const router = useRouter()
const { locale, setLocale } = useLocale()

const activeLocale = computed(() => {
  const fromRoute = String(route.params.locale || '')
  return fromRoute === 'ja' || fromRoute === 'en' ? fromRoute : locale.value
})

watch(
  () => route.params.locale,
  (next) => {
    const value = String(next || '')
    if (value === 'ja' || value === 'en') {
      setLocale(value)
    }
  },
  { immediate: true },
)

const switchLocale = (nextLocale) => {
  setLocale(nextLocale)
  router.push({ name: 'home', params: { locale: nextLocale } })
}

const localizedDocs = computed(() => getDocsForLocale(activeLocale.value))
const docsNav = computed(() => localizedDocs.value.nav)
const docsContent = computed(() => localizedDocs.value.content)

const seoCopy = computed(() => {
  if (activeLocale.value === 'ja') {
    return {
      title: '実行前認可インフラ',
      description:
        'ClearanceGate は高リスク実行の直前で認可を強制し、fail-closed・責任明確化・監査証跡を提供します。',
    }
  }

  return {
    title: 'Authorization Before Execution',
    description:
      'ClearanceGate enforces deterministic authorization immediately before high-risk execution with fail-closed behavior and auditable accountability.',
  }
})

useSeo({
  title: computed(() => seoCopy.value.title),
  description: computed(() => seoCopy.value.description),
  path: computed(() => `/${activeLocale.value}`),
  type: 'website',
})

const scrollProgress = ref(0)
const activeFaq = ref(0)

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

const resolveDocTitle = (slug) => docsNav.value.find((item) => item.slug === slug)?.title || slug
const resolveDocSummary = (slug) => {
  const body = docsContent.value[slug]?.sections?.[0]?.body
  return body?.[0] || ''
}

const documentationHighlights = computed(() => {
  const slugs = ['executive-summary', 'constitution', 'architecture', 'security', 'api', 'pilot-plan']
  return slugs
    .map((slug) => {
      const doc = docsContent.value[slug]
      if (!doc) return null
      return {
        slug,
        title: resolveDocTitle(slug),
        heading: doc.sections[0]?.heading || '',
        summary: resolveDocSummary(slug),
      }
    })
    .filter(Boolean)
})

const docsTotalSections = computed(() =>
  Object.values(docsContent.value).reduce((sum, doc) => sum + (doc.sections?.length || 0), 0),
)

const copy = computed(() => {
  if (activeLocale.value === 'ja') {
    return {
      nav: {
        guarantees: 'Guarantees',
        architecture: 'Architecture',
        docs: 'Docs',
        pilot: 'Pilot',
        faq: 'FAQ',
      },
      hero: {
        badge: 'ClearanceGate Documentation',
        title: 'Authorization Before Execution',
        subtitle: '不可逆実行の直前で認可を強制するガバナンス境界',
        body: '実行可否を決定論的に判定し、曖昧な責任状態を残さない。ClearanceGate は「許可されていない実行を通さない」ことを製品特性として実装します。',
        primary: 'Start Pilot',
        secondary: 'Read Documentation',
        points: [
          'PROCEED / BLOCK / REQUIRE_ACK / DEGRADE の単一結果',
          '不確実時に fail-closed',
          '非ブロック判断は監査証跡を必須化',
          '実行 API ではなく認可境界に特化',
        ],
        panelTitle: 'Authorization Envelope',
      },
      guarantees: {
        eyebrow: 'Core',
        title: 'Core Guarantees',
        lead: 'システム憲章で定義した不変条件を製品実装に反映',
        items: [
          {
            label: 'Deterministic Outcome',
            body: '同一入力・同一ルール版では同一認可結果を返します。',
          },
          {
            label: 'Fail-Closed',
            body: '情報欠落や内部異常時に PROCEED へフォールバックしません。',
          },
          {
            label: 'Mutual Exclusivity',
            body: '全判断インスタンスは常に 1 状態のみを持ち、結果は相互排他です。',
          },
          {
            label: 'Auditability',
            body: '証跡永続化失敗時は認可を拒否し、再構成可能性を維持します。',
          },
        ],
      },
      architecture: {
        eyebrow: 'Architecture',
        title: 'Execution Boundary Design',
        summary:
          '意思決定提案と実行の間に認可カーネルを配置し、未承認経路・無監査経路を構造上排除します。',
        steps: [
          { title: 'Decision Proposal', body: '外部システムが文脈付きで実行提案を送信。' },
          { title: 'Authorization Kernel', body: '制約評価・状態遷移・結果決定を単一責務で実行。' },
          { title: 'Outcome & Evidence', body: '結果と証跡参照を同時返却。証跡欠落時は認可しない。' },
          { title: 'Controlled Execution', body: 'PROCEED のみ実行可能。DEGRADE は明示復旧が必要。' },
        ],
      },
      docs: {
        eyebrow: 'Documentation',
        title: '運用導入に必要な資料を一式公開',
        body: 'Notion ドキュメントを基にした中核資料を公開しています。Start Here から Enterprise 実装まで段階的に確認できます。',
        all: '全ドキュメントを開く',
        source: 'Notion Source',
      },
      usecases: {
        eyebrow: 'Use Cases',
        title: '高説明責任領域の実装パターン',
        items: [
          {
            title: 'Quant Finance',
            text: 'go-live / pause / kill-switch の実行直前で認可を強制。',
            image: usecaseFinance,
            alt: 'Quant finance use case',
          },
          {
            title: 'Enterprise IT Operations',
            text: '本番変更とデプロイを fail-closed で統制。',
            image: usecaseItops,
            alt: 'Enterprise IT operations use case',
          },
          {
            title: 'Industrial Automation',
            text: '安全クリティカル操作を action 単位で認可。',
            image: usecaseIndustrial,
            alt: 'Industrial automation use case',
          },
        ],
      },
      readiness: {
        eyebrow: 'Launch Readiness',
        title: '正式運用を前提にした設計ガードレール',
        checklist: [
          '全実行入口を特定し ClearanceGate 経由を強制',
          'Shadow Mode 証跡レビュー後に Blocking Mode へ移行',
          'Kernel 意味論変更時は明示レビューと再検証',
          '価格インセンティブで安全な BLOCK を阻害しない',
        ],
      },
      pilot: {
        eyebrow: 'Pilot Plan',
        title: '6 週間で構造的安全性を検証',
        phases: [
          { week: 'Week 1-2', text: 'スコープ合意・プロファイル定義・責任境界整理' },
          { week: 'Week 3-4', text: '統合実装・ドライラン・証跡再構成の確認' },
          { week: 'Week 5-6', text: '本番または Shadow 実行・合格条件レビュー' },
        ],
      },
      faq: {
        eyebrow: 'FAQ',
        title: '導入前に確認されるポイント',
        items: [
          {
            q: 'ClearanceGate が保証する範囲は？',
            a: '保証対象は構造的正当性です。意思決定の正しさや業務成果は外部システム責務です。',
          },
          {
            q: '内部エラー時に実行は継続されますか？',
            a: '継続されません。内部エラー時は fail-closed で PROCEED を返さない設計です。',
          },
          {
            q: '既存システムへ段階導入できますか？',
            a: '可能です。まず Shadow Mode で証跡と挙動を検証し、問題がなければ Blocking Mode に移行します。',
          },
          {
            q: '価格体系は利用量課金ですか？',
            a: '利用量課金ではありません。Authorization Domain 単位のインフラライセンスです。',
          },
        ],
      },
      cta: {
        eyebrow: 'Next Step',
        title: '限定スコープの Pilot で運用適合性を検証',
        primary: 'Start Pilot',
        secondary: 'Explore Docs',
      },
      affiliation: {
        title: '運営主体',
        text: 'ClearanceGate は 石竹株式会社（Ishitake Co., Ltd.）が企画・開発・運営しています。',
        link: '石竹株式会社 公式サイト',
      },
    }
  }

  return {
    nav: {
      guarantees: 'Guarantees',
      architecture: 'Architecture',
      docs: 'Docs',
      pilot: 'Pilot',
      faq: 'FAQ',
    },
    hero: {
      badge: 'ClearanceGate Documentation',
      title: 'Authorization Before Execution',
      subtitle: 'A Governance Boundary Immediately Before Irreversible Actions',
      body: 'ClearanceGate enforces deterministic authorization at execution time, eliminating ambiguous accountability paths and unaudited execution decisions.',
      primary: 'Start Pilot',
      secondary: 'Read Documentation',
      points: [
        'Single outcome: PROCEED, BLOCK, REQUIRE_ACK, or DEGRADE',
        'Fail-closed under uncertainty and internal failures',
        'Evidence required for all non-blocking outcomes',
        'Focused on authorization boundary, not execution orchestration',
      ],
      panelTitle: 'Authorization Envelope',
    },
    guarantees: {
      eyebrow: 'Core',
      title: 'Core Guarantees',
      lead: 'Constitutional invariants translated directly into product behavior',
      items: [
        {
          label: 'Deterministic Outcome',
          body: 'Identical inputs under the same rule version produce the same authorization output.',
        },
        {
          label: 'Fail-Closed',
          body: 'Missing context and internal errors never default to PROCEED.',
        },
        {
          label: 'Mutual Exclusivity',
          body: 'Every decision instance has exactly one state at any moment.',
        },
        {
          label: 'Auditability',
          body: 'Evidence persistence is authorization-critical and enforced by design.',
        },
      ],
    },
    architecture: {
      eyebrow: 'Architecture',
      title: 'Execution Boundary Design',
      summary:
        'ClearanceGate is inserted between decision proposal and execution to remove bypass routes and unaudited outcomes at the structural level.',
      steps: [
        { title: 'Decision Proposal', body: 'External systems submit action requests with bounded context.' },
        { title: 'Authorization Kernel', body: 'Constraints, state transitions, and outcome mapping are evaluated deterministically.' },
        { title: 'Outcome & Evidence', body: 'Outcome and evidence references are returned together. Missing evidence blocks authorization.' },
        { title: 'Controlled Execution', body: 'Only PROCEED can execute. DEGRADE requires explicit recovery handling.' },
      ],
    },
    docs: {
      eyebrow: 'Documentation',
      title: 'Full Documentation Coverage For Rollout',
      body: 'The complete doc set spans constitutional guarantees, architecture, API semantics, enterprise integration, and pilot execution.',
      all: 'Open all documents',
      source: 'Notion Source',
    },
    usecases: {
      eyebrow: 'Use Cases',
      title: 'Deployment Patterns In High-Accountability Domains',
      items: [
        {
          title: 'Quant Finance',
          text: 'Authorize go-live, pause, and kill-switch execution boundaries.',
          image: usecaseFinance,
          alt: 'Quant finance use case',
        },
        {
          title: 'Enterprise IT Operations',
          text: 'Gate production changes and deployments before irreversible execution.',
          image: usecaseItops,
          alt: 'Enterprise IT operations use case',
        },
        {
          title: 'Industrial Automation',
          text: 'Apply action-level clearance in safety-critical control workflows.',
          image: usecaseIndustrial,
          alt: 'Industrial automation use case',
        },
      ],
    },
    readiness: {
      eyebrow: 'Launch Readiness',
      title: 'Production-Grade Guardrails',
      checklist: [
        'Enumerate all execution entry points and enforce ClearanceGate routing',
        'Review shadow-mode evidence before enabling hard blocking mode',
        'Require explicit review and re-verification for kernel semantic changes',
        'Avoid pricing incentives that discourage safe BLOCK decisions',
      ],
    },
    pilot: {
      eyebrow: 'Pilot Plan',
      title: 'Validate Structural Safety In 6 Weeks',
      phases: [
        { week: 'Week 1-2', text: 'Scope alignment, profile setup, and role accountability binding' },
        { week: 'Week 3-4', text: 'Integration, dry runs, and evidence replay checks' },
        { week: 'Week 5-6', text: 'Live or shadow execution with pass/fail governance review' },
      ],
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Common Questions Before Adoption',
      items: [
        {
          q: 'What does ClearanceGate guarantee?',
          a: 'It guarantees structural authorization correctness, not decision quality or business outcomes.',
        },
        {
          q: 'What happens on internal errors?',
          a: 'Internal errors remain fail-closed and cannot authorize execution.',
        },
        {
          q: 'Can we integrate gradually with existing systems?',
          a: 'Yes. Start in shadow mode, validate evidence and outcomes, then enable blocking mode.',
        },
        {
          q: 'Is pricing usage-based?',
          a: 'No. The license unit is authorization domain, aligned with risk infrastructure positioning.',
        },
      ],
    },
    cta: {
      eyebrow: 'Next Step',
      title: 'Run A Narrow-Scope Pilot Before Enterprise Rollout',
      primary: 'Start Pilot',
      secondary: 'Explore Docs',
    },
    affiliation: {
      title: 'Operated by',
      text: 'ClearanceGate is planned, developed, and operated by Ishitake Co., Ltd.',
      link: 'Visit Ishitake Corporate Site',
    },
  }
})

const metrics = computed(() => {
  if (activeLocale.value === 'ja') {
    return [
      { value: `${docsNav.value.length}`, label: '公開ドキュメント数' },
      { value: `${docsTotalSections.value}`, label: '文書セクション' },
      { value: '4', label: '認可結果モデル' },
      { value: 'Fail-Closed', label: '安全既定動作' },
    ]
  }

  return [
    { value: `${docsNav.value.length}`, label: 'Published docs' },
    { value: `${docsTotalSections.value}`, label: 'Document sections' },
    { value: '4', label: 'Authorization outcomes' },
    { value: 'Fail-Closed', label: 'Default safety mode' },
  ]
})

watch(
  () => activeLocale.value,
  () => {
    activeFaq.value = 0
  },
)
</script>

<template>
  <div class="cg-site cg-home">
    <div class="cg-scroll-progress" :style="{ transform: `scaleX(${scrollProgress})` }"></div>
    <div class="cg-bg-grid" aria-hidden="true"></div>
    <div class="cg-bg-orb orb-a" aria-hidden="true"></div>
    <div class="cg-bg-orb orb-b" aria-hidden="true"></div>
    <div class="cg-bg-orb orb-c" aria-hidden="true"></div>

    <header class="cg-topbar reveal fade-in">
      <div class="cg-brand">ClearanceGate</div>
      <nav class="cg-nav" aria-label="Primary">
        <button class="cg-nav-btn" type="button" @click="scrollToSection('core-guarantees')">{{ copy.nav.guarantees }}</button>
        <button class="cg-nav-btn" type="button" @click="scrollToSection('architecture')">{{ copy.nav.architecture }}</button>
        <button class="cg-nav-btn" type="button" @click="scrollToSection('docs-path')">{{ copy.nav.docs }}</button>
        <button class="cg-nav-btn" type="button" @click="scrollToSection('pilot')">{{ copy.nav.pilot }}</button>
        <button class="cg-nav-btn" type="button" @click="scrollToSection('faq')">{{ copy.nav.faq }}</button>
        <div class="cg-lang-switch" role="group" aria-label="Language">
          <button class="cg-lang-btn" :class="{ active: activeLocale === 'en' }" @click="switchLocale('en')">EN</button>
          <button class="cg-lang-btn" :class="{ active: activeLocale === 'ja' }" @click="switchLocale('ja')">日本語</button>
        </div>
      </nav>
    </header>

    <main class="cg-main">
      <section class="cg-hero reveal fade-up">
        <div class="cg-container cg-hero-grid">
          <div class="cg-hero-copy">
            <p class="cg-badge">{{ copy.hero.badge }}</p>
            <h1 class="cg-title">
              {{ copy.hero.title }}
              <span class="cg-title-accent">{{ copy.hero.subtitle }}</span>
            </h1>
            <p class="cg-body">{{ copy.hero.body }}</p>
            <div class="cg-action-row">
              <RouterLink class="cg-btn cg-btn-primary" :to="{ name: 'doc', params: { locale: activeLocale, slug: 'pilot-plan' } }">
                {{ copy.hero.primary }}
              </RouterLink>
              <RouterLink class="cg-btn cg-btn-secondary" :to="{ name: 'doc', params: { locale: activeLocale } }">
                {{ copy.hero.secondary }}
              </RouterLink>
            </div>
            <ul class="cg-proof-list">
              <li v-for="point in copy.hero.points" :key="point">{{ point }}</li>
            </ul>
            <div class="cg-metric-strip">
              <article v-for="item in metrics" :key="item.label" class="cg-metric-item">
                <p class="cg-metric-value">{{ item.value }}</p>
                <p class="cg-metric-label">{{ item.label }}</p>
              </article>
            </div>
          </div>

          <aside class="cg-hero-panel">
            <p class="cg-card-kicker">{{ copy.hero.panelTitle }}</p>
            <p class="cg-panel-line">INPUT: Decision Proposal</p>
            <p class="cg-panel-line">KERNEL: Constraint + State Transition</p>
            <p class="cg-panel-line">OUTPUT: PROCEED | BLOCK | REQUIRE_ACK | DEGRADE</p>
            <div class="cg-outcomes">
              <span class="cg-outcome success">PROCEED</span>
              <span class="cg-outcome danger">BLOCK</span>
              <span class="cg-outcome warning">REQUIRE_ACK</span>
              <span class="cg-outcome neutral">DEGRADE</span>
            </div>
          </aside>
        </div>
      </section>

      <section id="core-guarantees" class="cg-section reveal fade-up">
        <div class="cg-container">
          <header class="cg-section-head">
            <p class="cg-eyebrow">{{ copy.guarantees.eyebrow }}</p>
            <h2>{{ copy.guarantees.title }}</h2>
            <p>{{ copy.guarantees.lead }}</p>
          </header>
          <div class="cg-guarantee-grid">
            <article v-for="item in copy.guarantees.items" :key="item.label" class="cg-card">
              <p class="cg-card-kicker">Invariant</p>
              <h3 class="cg-card-title">{{ item.label }}</h3>
              <p class="cg-card-body">{{ item.body }}</p>
            </article>
          </div>
        </div>
      </section>

      <section id="architecture" class="cg-section reveal fade-up">
        <div class="cg-container">
          <header class="cg-section-head">
            <p class="cg-eyebrow">{{ copy.architecture.eyebrow }}</p>
            <h2>{{ copy.architecture.title }}</h2>
            <p>{{ copy.architecture.summary }}</p>
          </header>
          <div class="cg-architecture-grid">
            <article v-for="(step, idx) in copy.architecture.steps" :key="step.title" class="cg-card cg-arch-step">
              <p class="cg-step-index">0{{ idx + 1 }}</p>
              <h3 class="cg-card-title">{{ step.title }}</h3>
              <p class="cg-card-body">{{ step.body }}</p>
            </article>
          </div>
        </div>
      </section>

      <section id="docs-path" class="cg-section reveal fade-up">
        <div class="cg-container">
          <header class="cg-section-head">
            <p class="cg-eyebrow">{{ copy.docs.eyebrow }}</p>
            <h2>{{ copy.docs.title }}</h2>
            <p>{{ copy.docs.body }}</p>
          </header>
          <div class="cg-doc-grid">
            <article v-for="item in documentationHighlights" :key="item.slug" class="cg-card cg-doc-card">
              <p class="cg-doc-heading">{{ item.heading }}</p>
              <h3 class="cg-card-title">{{ item.title }}</h3>
              <p class="cg-card-body">{{ item.summary }}</p>
              <RouterLink class="cg-btn cg-btn-link" :to="{ name: 'doc', params: { locale: activeLocale, slug: item.slug } }">
                {{ resolveDocTitle(item.slug) }}
              </RouterLink>
            </article>
          </div>
          <div class="cg-action-row cg-doc-actions">
            <RouterLink class="cg-btn cg-btn-primary" :to="{ name: 'doc', params: { locale: activeLocale } }">
              {{ copy.docs.all }}
            </RouterLink>
            <a class="cg-btn cg-btn-secondary" :href="NOTION_DOC_URL" target="_blank" rel="noopener noreferrer">{{ copy.docs.source }}</a>
          </div>
        </div>
      </section>

      <section class="cg-section reveal fade-up">
        <div class="cg-container">
          <header class="cg-section-head">
            <p class="cg-eyebrow">{{ copy.usecases.eyebrow }}</p>
            <h2>{{ copy.usecases.title }}</h2>
          </header>
          <div class="cg-usecase-grid">
            <article v-for="item in copy.usecases.items" :key="item.title" class="cg-card cg-usecase-card">
              <img class="cg-usecase-image" :src="item.image" :alt="item.alt" loading="lazy" />
              <h3 class="cg-card-title">{{ item.title }}</h3>
              <p class="cg-card-body">{{ item.text }}</p>
            </article>
          </div>
        </div>
      </section>

      <section class="cg-section reveal fade-up">
        <div class="cg-container cg-readiness-wrap">
          <header class="cg-section-head">
            <p class="cg-eyebrow">{{ copy.readiness.eyebrow }}</p>
            <h2>{{ copy.readiness.title }}</h2>
          </header>
          <ul class="cg-checklist">
            <li v-for="item in copy.readiness.checklist" :key="item">{{ item }}</li>
          </ul>
        </div>
      </section>

      <section id="pilot" class="cg-section reveal fade-up">
        <div class="cg-container">
          <header class="cg-section-head">
            <p class="cg-eyebrow">{{ copy.pilot.eyebrow }}</p>
            <h2>{{ copy.pilot.title }}</h2>
          </header>
          <div class="cg-timeline">
            <article v-for="phase in copy.pilot.phases" :key="phase.week" class="cg-card cg-timeline-step">
              <p class="cg-step-index">{{ phase.week }}</p>
              <p class="cg-card-body">{{ phase.text }}</p>
            </article>
          </div>
        </div>
      </section>

      <section id="faq" class="cg-section reveal fade-up">
        <div class="cg-container">
          <header class="cg-section-head">
            <p class="cg-eyebrow">{{ copy.faq.eyebrow }}</p>
            <h2>{{ copy.faq.title }}</h2>
          </header>
          <div class="cg-faq-list">
            <article
              v-for="(item, idx) in copy.faq.items"
              :key="item.q"
              class="cg-card cg-faq-item"
              :class="{ active: activeFaq === idx }"
              @click="activeFaq = idx"
            >
              <h3 class="cg-faq-q">{{ item.q }}</h3>
              <p class="cg-card-body">{{ item.a }}</p>
            </article>
          </div>
        </div>
      </section>

      <section id="cta" class="cg-section reveal fade-up">
        <div class="cg-container">
          <article class="cg-cta-card">
            <p class="cg-eyebrow">{{ copy.cta.eyebrow }}</p>
            <h2>{{ copy.cta.title }}</h2>
            <div class="cg-action-row">
              <RouterLink class="cg-btn cg-btn-primary" :to="{ name: 'doc', params: { locale: activeLocale, slug: 'pilot-plan' } }">
                {{ copy.cta.primary }}
              </RouterLink>
              <RouterLink class="cg-btn cg-btn-secondary" :to="{ name: 'doc', params: { locale: activeLocale } }">
                {{ copy.cta.secondary }}
              </RouterLink>
            </div>
          </article>
        </div>
      </section>
    </main>

    <footer class="cg-footer reveal fade-up">
      <div>
        <p class="cg-footer-title">{{ copy.affiliation.title }}</p>
        <p>{{ copy.affiliation.text }}</p>
      </div>
      <a class="cg-btn cg-btn-link" href="https://ishitakes.com/" target="_blank" rel="noopener noreferrer">{{ copy.affiliation.link }}</a>
    </footer>
  </div>
</template>
