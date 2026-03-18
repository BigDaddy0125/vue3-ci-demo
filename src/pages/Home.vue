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

const getDoc = (slug) => docsContent.value[slug]

const featuredDocs = computed(() => {
  const slugs = ['executive-summary', 'constitution', 'architecture', 'api', 'security', 'enterprise-guide']
  return slugs.map((slug) => ({ slug, ...getDoc(slug) })).filter((doc) => Boolean(doc.title))
})

const businessDocs = computed(() => {
  const slugs = ['market-opportunity', 'competitive-landscape', 'financial-projections', 'pitch-deck']
  return slugs.map((slug) => ({ slug, ...getDoc(slug) })).filter((doc) => Boolean(doc.title))
})

const trackOrder = ['Core', 'Engineering', 'Operations', 'Business']

const trackMetrics = computed(() =>
  trackOrder
    .map((track) => {
      const count = Object.values(docsContent.value).filter((doc) => doc.track === track).length
      return { track, count }
    })
    .filter((item) => item.count > 0),
)

const docsTotalSections = computed(() =>
  Object.values(docsContent.value).reduce((sum, doc) => sum + (doc.sections?.length || 0), 0),
)

const statusMetrics = computed(() => {
  const map = Object.values(docsContent.value).reduce((acc, doc) => {
    acc[doc.status] = (acc[doc.status] || 0) + 1
    return acc
  }, {})
  return Object.entries(map).map(([status, count]) => ({ status, count }))
})

const launchChecklist = computed(() => [
  getDoc('enterprise-guide')?.sections?.[1]?.body?.[0] || 'Route all execution paths through ClearanceGate.',
  getDoc('enterprise-guide')?.sections?.[1]?.body?.[1] || 'Review shadow evidence before hard blocking mode.',
  getDoc('security')?.sections?.[1]?.body?.[0] || 'Keep internal failures fail-closed.',
  getDoc('pilot-plan')?.sections?.[2]?.body?.[1] || 'Enforce clear pass criteria with complete evidence.',
])

const pilotPhases = computed(() => {
  const text = getDoc('pilot-plan')?.sections?.[2]?.body?.[0] || ''
  return text.split('. ').filter(Boolean)
})

const localizeTrack = (track) => {
  if (activeLocale.value !== 'ja') return track
  return {
    Core: '中核',
    Engineering: '技術',
    Operations: '運用',
    Business: '事業',
  }[track] || track
}

const localizeStatus = (status) => {
  if (activeLocale.value !== 'ja') return status
  return {
    Draft: '草案',
    'In Progress': '作成中',
    'Pilot Ready': 'パイロット準備完了',
    Published: '公開済み',
  }[status] || status
}

const copy = computed(() => {
  if (activeLocale.value === 'ja') {
    return {
      nav: {
        guarantees: '保証',
        docs: '文書',
        market: '市場',
        pilot: '導入',
        faq: 'FAQ',
      },
      hero: {
        badge: 'ClearanceGate ドキュメント',
        title: '実行前認可',
        subtitle: '実行直前で認可を強制するガバナンス境界',
        body: 'ClearanceGate は高リスク実行の直前で、決定論的な認可結果を返します。曖昧な責任状態を排除し、監査説明可能性を運用の前提にします。',
        primary: 'パイロットを開始',
        secondary: 'ドキュメントを読む',
        metrics: {
          publishedDocs: '公開文書',
          docSections: '文書セクション',
          outcomes: '認可結果',
          publishedSpecs: '公開仕様',
        },
        panel: {
          kicker: '認可エンベロープ',
          input: '入力: 意思決定リクエスト',
          kernel: 'カーネル: 制約 + 状態遷移',
          output: '出力: PROCEED | BLOCK | REQUIRE_ACK | DEGRADE',
        },
      },
      guarantees: {
        eyebrow: '中核',
        title: '中核保証',
        lead: 'システム憲章と状態機械に基づく中核保証。',
        invariant: '不変条件',
      },
      docs: {
        eyebrow: 'ドキュメント範囲',
        title: '技術・運用・事業資料を一体化したドキュメント基盤',
        body: 'Notion を正本にしながら、公開サイトで導入判断に必要な情報を段階的に提示します。',
        trackSummary: 'アーキテクチャ、ポリシー意味論、ロールアウト運用までをカバーします。',
        read: '文書を開く',
        openBrief: '概要を見る',
        documentsSuffix: '件の文書',
        all: 'すべての文書を見る',
        source: 'Notion 正本',
      },
      market: {
        eyebrow: '市場分析',
        title: '市場機会・競争・財務計画を公開',
      },
      usecases: {
        eyebrow: '導入例',
        title: '高説明責任領域での導入パターン',
      },
      readiness: {
        eyebrow: '導入準備',
        title: '本番導入に必要な運用ガードレール',
      },
      pilot: {
        eyebrow: '導入計画',
        title: '6週間パイロットで構造的安全性を検証',
        phase: 'フェーズ',
      },
      faq: {
        eyebrow: 'FAQ',
        title: '導入前の主要論点',
        items: [
          {
            q: 'ClearanceGate が保証する範囲は？',
            a: '意思決定の正しさではなく、認可の構造的正当性と監査説明可能性を保証します。',
          },
          {
            q: '既存ワークフローへ段階導入できますか？',
            a: '可能です。Shadow Mode で証跡を検証後、Blocking Mode へ移行します。',
          },
          {
            q: '価格は利用量課金ですか？',
            a: '利用量ではなく Authorization Domain 単位のインフラライセンスです。',
          },
        ],
      },
      cta: {
        eyebrow: '次のステップ',
        title: '限定スコープで Pilot を開始し、運用適合性を確認',
        primary: 'パイロットを開始',
        secondary: '文書を確認',
      },
      affiliation: {
        title: '運営主体',
        text: 'ClearanceGate は 石竹株式会社（Ishitake Co., Ltd.）が企画・開発・運営しています。',
        link: '石竹株式会社のサイトへ',
      },
    }
  }

  return {
    nav: {
      guarantees: 'Guarantees',
      docs: 'Docs',
      market: 'Market',
      pilot: 'Pilot',
      faq: 'FAQ',
    },
    hero: {
      badge: 'ClearanceGate Documentation',
      title: 'Authorization Before Execution',
      subtitle: 'A Governance Boundary Immediately Before Irreversible Actions',
      body: 'ClearanceGate enforces deterministic authorization right before execution. It removes ambiguous accountability paths and turns auditability into a runtime requirement.',
      primary: 'Start Pilot',
      secondary: 'Read Documentation',
      metrics: {
        publishedDocs: 'Published Docs',
        docSections: 'Documentation Sections',
        outcomes: 'Authorization Outcomes',
        publishedSpecs: 'Published Specs',
      },
      panel: {
        kicker: 'Authorization Envelope',
        input: 'INPUT: Decision Proposal',
        kernel: 'KERNEL: Constraint + State Transition',
        output: 'OUTPUT: PROCEED | BLOCK | REQUIRE_ACK | DEGRADE',
      },
    },
    guarantees: {
      eyebrow: 'Core',
      title: 'Core Guarantees',
      lead: 'Kernel-level invariants from constitution, state machine, and formal verification scope.',
      invariant: 'Invariant',
    },
    docs: {
      eyebrow: 'Documentation Coverage',
      title: 'A Unified Launch-Ready Documentation Surface',
      body: 'Engineering, operations, and business documents are exposed in one coherent public documentation stack.',
      trackSummary: 'Coverage includes architecture, policy semantics, and rollout operations.',
      read: 'Read document',
      openBrief: 'Open brief',
      documentsSuffix: 'documents',
      all: 'Open all documents',
      source: 'Notion Source',
    },
    market: {
      eyebrow: 'Market Intelligence',
      title: 'Market Opportunity, Competition, and Financial Discipline',
    },
    usecases: {
      eyebrow: 'Use Cases',
      title: 'Deployment Patterns In High-Accountability Domains',
    },
    readiness: {
      eyebrow: 'Launch Readiness',
      title: 'Production Guardrails Before Enterprise Rollout',
    },
    pilot: {
      eyebrow: 'Pilot Plan',
      title: 'Validate Structural Safety In A Six-Week Pilot',
      phase: 'Phase',
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Common Questions Before Adoption',
      items: [
        {
          q: 'What does ClearanceGate actually guarantee?',
          a: 'Structural authorization correctness, explicit responsibility, and reconstructable evidence for governed execution.',
        },
        {
          q: 'Can we adopt without a full workflow rewrite?',
          a: 'Yes. Start in shadow mode, verify evidence and outcomes, then turn on blocking mode on bounded execution surfaces.',
        },
        {
          q: 'Is this priced as usage software?',
          a: 'No. Pricing is based on authorization domain risk exposure, not seat count or API call volume.',
        },
      ],
    },
    cta: {
      eyebrow: 'Next Step',
      title: 'Run A Narrow Pilot Before Full Enterprise Expansion',
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

const guarantees = computed(() => [
  {
    title: 'Deterministic Outcome',
    body: getDoc('constitution')?.sections?.[1]?.body?.[0] || 'Deterministic authorization outcome for each valid input.',
  },
  {
    title: 'Mutual Exclusivity',
    body: getDoc('state-machine')?.sections?.[2]?.body?.[0] || 'No conflicting outcomes for the same decision instance.',
  },
  {
    title: 'Fail-Closed',
    body: getDoc('security')?.sections?.[1]?.body?.[0] || 'Uncertain or invalid states resolve to safe outcomes only.',
  },
  {
    title: 'Auditability',
    body: getDoc('security')?.sections?.[2]?.body?.[0] || 'Audit records are authorization-critical.',
  },
])

const useCases = computed(() => [
  ...(activeLocale.value === 'ja'
    ? [
        {
          title: 'クオンツ金融',
          text: '戦略稼働、停止、キルスイッチ実行を明示的な責任境界のもとで認可します。',
          image: usecaseFinance,
          alt: 'クオンツ金融のユースケース',
        },
        {
          title: 'エンタープライズ IT 運用',
          text: '本番デプロイや運用変更を不可逆な実行の直前でゲートします。',
          image: usecaseItops,
          alt: 'エンタープライズ IT 運用のユースケース',
        },
        {
          title: '産業オートメーション',
          text: '失敗コストの高い安全重要システムで、アクション単位のクリアランスを適用します。',
          image: usecaseIndustrial,
          alt: '産業オートメーションのユースケース',
        },
      ]
    : [
        {
          title: 'Quant Finance',
          text: 'Authorize strategy go-live, pause, and kill-switch execution under explicit accountability.',
          image: usecaseFinance,
          alt: 'Quant finance use case',
        },
        {
          title: 'Enterprise IT Operations',
          text: 'Gate production deployments and operational changes before irreversible execution.',
          image: usecaseItops,
          alt: 'Enterprise IT operations use case',
        },
        {
          title: 'Industrial Automation',
          text: 'Apply action-level clearance in safety-critical systems where failure cost is high.',
          image: usecaseIndustrial,
          alt: 'Industrial automation use case',
        },
      ]),
])

const seoCopy = computed(() => ({
  title: 'Authorization Before Execution',
  description:
    'ClearanceGate provides launch-ready authorization infrastructure with deterministic outcomes, fail-closed behavior, and auditable accountability.',
}))

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
  scrollProgress.value = max <= 0 ? 0 : Math.min(1, Math.max(0, doc.scrollTop / max))
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
        <button class="cg-nav-btn" type="button" @click="scrollToSection('docs-path')">{{ copy.nav.docs }}</button>
        <button class="cg-nav-btn" type="button" @click="scrollToSection('market-intel')">{{ copy.nav.market }}</button>
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
            <div class="cg-metric-strip">
              <article class="cg-metric-item">
                <p class="cg-metric-value">{{ docsNav.length }}</p>
                <p class="cg-metric-label">{{ copy.hero.metrics.publishedDocs }}</p>
              </article>
              <article class="cg-metric-item">
                <p class="cg-metric-value">{{ docsTotalSections }}</p>
                <p class="cg-metric-label">{{ copy.hero.metrics.docSections }}</p>
              </article>
              <article class="cg-metric-item">
                <p class="cg-metric-value">4</p>
                <p class="cg-metric-label">{{ copy.hero.metrics.outcomes }}</p>
              </article>
              <article class="cg-metric-item">
                <p class="cg-metric-value">{{ statusMetrics.find((item) => item.status === 'Published')?.count || 0 }}</p>
                <p class="cg-metric-label">{{ copy.hero.metrics.publishedSpecs }}</p>
              </article>
            </div>
          </div>

          <aside class="cg-hero-panel">
            <p class="cg-card-kicker">{{ copy.hero.panel.kicker }}</p>
            <p class="cg-panel-line">{{ copy.hero.panel.input }}</p>
            <p class="cg-panel-line">{{ copy.hero.panel.kernel }}</p>
            <p class="cg-panel-line">{{ copy.hero.panel.output }}</p>
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
            <article v-for="item in guarantees" :key="item.title" class="cg-card">
              <p class="cg-card-kicker">{{ copy.guarantees.invariant }}</p>
              <h3 class="cg-card-title">{{ item.title }}</h3>
              <p class="cg-card-body">{{ item.body }}</p>
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
          <div class="cg-track-grid">
            <article v-for="item in trackMetrics" :key="item.track" class="cg-card cg-track-card">
              <p class="cg-card-kicker">{{ localizeTrack(item.track) }}</p>
              <h3 class="cg-card-title">{{ item.count }} {{ copy.docs.documentsSuffix }}</h3>
              <p class="cg-card-body">{{ copy.docs.trackSummary }}</p>
            </article>
          </div>
          <div class="cg-doc-grid">
            <article v-for="doc in featuredDocs" :key="doc.slug" class="cg-card cg-doc-card">
              <p class="cg-doc-heading">{{ localizeTrack(doc.track) }} / {{ localizeStatus(doc.status) }}</p>
              <h3 class="cg-card-title">{{ doc.title }}</h3>
              <p class="cg-card-body">{{ doc.summary }}</p>
              <RouterLink class="cg-btn cg-btn-link" :to="{ name: 'doc', params: { locale: activeLocale, slug: doc.slug } }">
                {{ copy.docs.read }}
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

      <section id="market-intel" class="cg-section reveal fade-up">
        <div class="cg-container">
          <header class="cg-section-head">
            <p class="cg-eyebrow">{{ copy.market.eyebrow }}</p>
            <h2>{{ copy.market.title }}</h2>
          </header>
          <div class="cg-business-grid">
            <article v-for="doc in businessDocs" :key="doc.slug" class="cg-card cg-business-card">
              <p class="cg-doc-heading">{{ localizeStatus(doc.status) }}</p>
              <h3 class="cg-card-title">{{ doc.title }}</h3>
              <p class="cg-card-body">{{ doc.summary }}</p>
              <p class="cg-card-body">{{ doc.sections[0]?.body?.[0] }}</p>
              <RouterLink class="cg-btn cg-btn-link" :to="{ name: 'doc', params: { locale: activeLocale, slug: doc.slug } }">
                {{ copy.docs.openBrief }}
              </RouterLink>
            </article>
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
            <article v-for="item in useCases" :key="item.title" class="cg-card cg-usecase-card">
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
            <li v-for="item in launchChecklist" :key="item">{{ item }}</li>
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
            <article v-for="(phase, idx) in pilotPhases" :key="phase" class="cg-card cg-timeline-step">
              <p class="cg-step-index">{{ copy.pilot.phase }} {{ idx + 1 }}</p>
              <p class="cg-card-body">{{ phase }}</p>
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
