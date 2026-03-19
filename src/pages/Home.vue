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

const statusMetrics = computed(() => {
  const map = Object.values(docsContent.value).reduce((acc, doc) => {
    acc[doc.status] = (acc[doc.status] || 0) + 1
    return acc
  }, {})

  return Object.entries(map).map(([status, count]) => ({ status, count }))
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

const launchChecklist = computed(() => [
  getDoc('enterprise-guide')?.sections?.[1]?.body?.[0] || 'Route every execution path through ClearanceGate.',
  getDoc('enterprise-guide')?.sections?.[1]?.body?.[1] || 'Validate fail-closed behavior before hard blocking mode.',
  getDoc('security')?.sections?.[1]?.body?.[0] || 'Missing inputs and internal failures must resolve safely.',
  getDoc('pilot-plan')?.sections?.[2]?.body?.[1] || 'Require complete evidence for every non-blocking outcome.',
])

const pilotPhases = computed(() => {
  const text = getDoc('pilot-plan')?.sections?.[2]?.body?.[0] || ''
  return text
    .split(';')
    .join('.')
    .split('.')
    .map((item) => item.trim())
    .filter(Boolean)
})

const localizeTrack = (track) => {
  if (activeLocale.value !== 'ja') return track

  return {
    Core: 'コア',
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
      lang: '日本語',
      nav: {
        guarantees: '保証',
        docs: '資料',
        market: '市場',
        pilot: '実証',
        faq: 'FAQ',
      },
      hero: {
        badge: 'ClearanceGate Documentation Surface',
        title: '実行の直前に、認可を置く。',
        subtitle: '取り返しのつかない処理の前で、責任・制約・監査証跡を明示する。',
        body:
          'ClearanceGate は、意思決定生成そのものではなく実行直前の認可境界を提供します。責任の所在を曖昧にせず、監査可能性を後工程ではなく実行条件として扱うためのインフラです。',
        primary: 'パイロットを開始',
        secondary: '資料を読む',
        proof: [
          '結果は PROCEED / BLOCK / REQUIRE_ACK / DEGRADE の 4 種に限定。',
          '不確実性や内部障害では fail-closed を維持。',
          '技術・運用・事業資料を、ひとつの公開面に統合。',
        ],
        metrics: {
          publishedDocs: '公開ドキュメント',
          docSections: '総セクション数',
          outcomes: '認可結果',
          publishedSpecs: '公開済み仕様',
        },
        panel: {
          kicker: 'Authorization Envelope',
          input: 'INPUT: 判断提案と責任情報',
          kernel: 'KERNEL: 制約評価と状態遷移',
          output: 'OUTPUT: PROCEED | BLOCK | REQUIRE_ACK | DEGRADE',
        },
        review: {
          title: '読む順序まで設計する',
          body: '最初に製品の骨格を掴み、その後に市場、導入、実証へと自然に進める構成にしています。',
        },
      },
      guarantees: {
        eyebrow: 'Core Guarantees',
        title: '主張を広げるより、守れる保証を鋭く見せる。',
        lead: '価値の中心を不変条件に寄せることで、見た目の強さと内容の厳密さを一致させています。',
        invariant: 'Invariant',
      },
      docs: {
        eyebrow: 'Documentation Coverage',
        title: '断片的な説明ではなく、ひとつの公開ドキュメント面へ。',
        body: '技術・運用・事業の文書を一つの入口にまとめ、閲覧の負荷と理解コストを下げます。',
        trackSummary: '各トラックは単独でも読めますが、全体では導入判断のための連続した物語になります。',
        read: '資料を開く',
        openBrief: '概要を見る',
        documentsSuffix: '本の資料',
        all: 'すべての資料を見る',
        source: 'Notion 原本',
      },
      market: {
        eyebrow: 'Market Intelligence',
        title: '市場性は熱量ではなく、構造需要と導入順序で見せる。',
        body: '競争、成長余地、収益性を抽象論ではなく導入可能な形で提示します。',
      },
      usecases: {
        eyebrow: 'Deployment Patterns',
        title: '高責任領域に絞った導入パターン。',
      },
      readiness: {
        eyebrow: 'Launch Readiness',
        title: 'ローンチ前に確認すべき運用ガードレール。',
        panelTitle: '公開面の成熟度',
      },
      pilot: {
        eyebrow: 'Pilot Plan',
        title: '6 週間の実証で、構造安全性を確かめる。',
        phase: 'Phase',
      },
      faq: {
        eyebrow: 'FAQ',
        title: '導入前によく出る問い。',
        items: [
          {
            q: 'ClearanceGate が保証するのは何ですか。',
            a: '意思決定の正しさではなく、実行可否が明示的な制約と責任のもとで決まり、その根拠を後から再構成できることです。',
          },
          {
            q: '既存ワークフローを全面刷新しないと導入できませんか。',
            a: 'いいえ。まずは shadow mode で比較検証し、証跡と結果分布を確認した上で限定された実行面から blocking mode に進めます。',
          },
          {
            q: '料金は API 使用量ベースですか。',
            a: 'いいえ。価格は seat 数や call 数ではなく、どの認可ドメインの責任とリスクを引き受けるかに基づきます。',
          },
        ],
      },
      cta: {
        eyebrow: 'Next Step',
        title: '全社展開の前に、狭い範囲で良いので実証を切る。',
        primary: 'パイロット資料へ',
        secondary: '資料一覧へ',
      },
      affiliation: {
        title: '運営',
        text: 'ClearanceGate は Ishitake Co., Ltd. により企画・開発・運営されています。',
        link: 'Ishitake のコーポレートサイトへ',
      },
    }
  }

  return {
    lang: 'Japanese',
    nav: {
      guarantees: 'Guarantees',
      docs: 'Docs',
      market: 'Market',
      pilot: 'Pilot',
      faq: 'FAQ',
    },
    hero: {
      badge: 'ClearanceGate Documentation Surface',
      title: 'Authorization Before Execution',
      subtitle: 'A narrow, explicit control boundary before irreversible actions.',
      body:
        'ClearanceGate frames authorization as infrastructure. It reduces ambiguous accountability paths, keeps failure modes fail-closed, and makes auditability part of runtime behavior instead of post-incident cleanup.',
      primary: 'Start Pilot',
      secondary: 'Read Documentation',
      proof: [
        'Exactly four outcomes: PROCEED, BLOCK, REQUIRE_ACK, and DEGRADE.',
        'Fail-closed semantics under uncertainty, invalid state, or internal failure.',
        'Public-facing engineering, operations, and business materials in one surface.',
      ],
      metrics: {
        publishedDocs: 'Published Docs',
        docSections: 'Doc Sections',
        outcomes: 'Outcomes',
        publishedSpecs: 'Published Specs',
      },
      panel: {
        kicker: 'Authorization Envelope',
        input: 'INPUT: Decision proposal with responsibility context',
        kernel: 'KERNEL: Constraint evaluation plus state transition',
        output: 'OUTPUT: PROCEED | BLOCK | REQUIRE_ACK | DEGRADE',
      },
      review: {
        title: 'Built for fast comprehension',
        body: 'The page now moves from product thesis to proof surface, market framing, and pilot plan without forcing the reader to reconstruct the story.',
      },
    },
    guarantees: {
      eyebrow: 'Core Guarantees',
      title: 'The value proposition is clearest when reduced to structural guarantees.',
      lead: 'This section avoids broad claims and keeps attention on what the system can defend under scrutiny.',
      invariant: 'Invariant',
    },
    docs: {
      eyebrow: 'Documentation Coverage',
      title: 'A single release-ready documentation surface instead of fragmented explanation.',
      body: 'The public site, the docs catalog, and the canonical Notion source now read as one coherent system.',
      trackSummary: 'Each track can be scanned independently, but together they form a complete launch narrative.',
      read: 'Read document',
      openBrief: 'Open brief',
      documentsSuffix: 'documents',
      all: 'Open all documents',
      source: 'Notion Source',
    },
    market: {
      eyebrow: 'Market Intelligence',
      title: 'Market framing should feel disciplined, not inflated.',
      body: 'The business layer is presented as deployment logic, risk structure, and commercialization discipline.',
    },
    usecases: {
      eyebrow: 'Deployment Patterns',
      title: 'Where explicit authorization matters most.',
    },
    readiness: {
      eyebrow: 'Launch Readiness',
      title: 'Operational guardrails before enterprise rollout.',
      panelTitle: 'Release maturity snapshot',
    },
    pilot: {
      eyebrow: 'Pilot Plan',
      title: 'Validate structural safety in a constrained six-week pilot.',
      phase: 'Phase',
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Questions that should be answered before adoption.',
      items: [
        {
          q: 'What does ClearanceGate actually guarantee?',
          a: 'It guarantees explicit authorization outcomes, responsibility binding, and reconstructable evidence for governed execution. It does not claim decision quality or business optimality.',
        },
        {
          q: 'Can teams adopt this without rewriting their workflow?',
          a: 'Yes. Start in shadow mode, compare outcomes, validate evidence quality, and then enable hard blocking only on bounded execution surfaces.',
        },
        {
          q: 'Is this priced like usage software?',
          a: 'No. The pricing logic is infrastructure-style and tied to authorization domains, accountability exposure, and operating risk rather than seats or request volume.',
        },
      ],
    },
    cta: {
      eyebrow: 'Next Step',
      title: 'Run a narrow pilot before expanding the control surface.',
      primary: 'Open Pilot Plan',
      secondary: 'Browse Docs',
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
    title: activeLocale.value === 'ja' ? '決定的な結果' : 'Deterministic Outcome',
    body:
      getDoc('constitution')?.sections?.[1]?.body?.[0] ||
      'Deterministic authorization outcome for each valid input.',
  },
  {
    title: activeLocale.value === 'ja' ? '相互排他' : 'Mutual Exclusivity',
    body: getDoc('state-machine')?.sections?.[2]?.body?.[0] || 'No conflicting outcomes for the same decision instance.',
  },
  {
    title: activeLocale.value === 'ja' ? 'Fail-Closed' : 'Fail-Closed',
    body: getDoc('security')?.sections?.[1]?.body?.[0] || 'Uncertain or invalid states resolve to safe outcomes only.',
  },
  {
    title: activeLocale.value === 'ja' ? '監査可能性' : 'Auditability',
    body: getDoc('security')?.sections?.[2]?.body?.[0] || 'Audit records are authorization-critical.',
  },
])

const useCases = computed(() => [
  ...(activeLocale.value === 'ja'
    ? [
        {
          title: 'クオンツ金融',
          text: '戦略の go-live、停止、kill-switch を、暗黙の判断ではなく明示的な責任と認可で扱います。',
          image: usecaseFinance,
          alt: 'クオンツ金融のユースケース',
        },
        {
          title: 'エンタープライズ IT 運用',
          text: '本番変更やデプロイの直前に認可境界を置き、不可逆な操作の前で制約を強制します。',
          image: usecaseItops,
          alt: 'エンタープライズ IT 運用のユースケース',
        },
        {
          title: '産業オートメーション',
          text: '失敗コストの高い安全重要系で、アクション単位の clearance を適用します。',
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

const readinessSignals = computed(() => [
  {
    label: activeLocale.value === 'ja' ? '公開済み' : 'Published',
    value: statusMetrics.value.find((item) => item.status === 'Published')?.count || 0,
  },
  {
    label: activeLocale.value === 'ja' ? 'パイロット準備完了' : 'Pilot Ready',
    value: statusMetrics.value.find((item) => item.status === 'Pilot Ready')?.count || 0,
  },
  {
    label: activeLocale.value === 'ja' ? '進行中' : 'In Progress',
    value: statusMetrics.value.find((item) => item.status === 'In Progress')?.count || 0,
  },
])

const seoCopy = computed(() => ({
  title: activeLocale.value === 'ja' ? '実行前認可の公開サイト' : 'Authorization Before Execution',
  description:
    activeLocale.value === 'ja'
      ? 'ClearanceGate は実行直前の認可インフラを提供し、fail-closed・監査可能性・明示責任を一つの公開ドキュメント面で示します。'
      : 'ClearanceGate provides launch-ready authorization infrastructure with deterministic outcomes, fail-closed behavior, and auditable accountability.',
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
          <button class="cg-lang-btn" :class="{ active: activeLocale === 'ja' }" @click="switchLocale('ja')">{{ copy.lang }}</button>
        </div>
      </nav>
    </header>

    <main class="cg-main">
      <section class="cg-hero reveal fade-up">
        <div class="cg-container cg-hero-grid">
          <div class="cg-hero-copy cg-hero-copy-strong">
            <p class="cg-badge">{{ copy.hero.badge }}</p>
            <h1 class="cg-title">
              {{ copy.hero.title }}
              <span class="cg-title-accent">{{ copy.hero.subtitle }}</span>
            </h1>
            <p class="cg-body">{{ copy.hero.body }}</p>

            <ul class="cg-proof-list">
              <li v-for="item in copy.hero.proof" :key="item">{{ item }}</li>
            </ul>

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

          <aside class="cg-hero-side">
            <article class="cg-hero-panel">
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
            </article>

            <article class="cg-side-card cg-hero-note">
              <p class="cg-card-kicker">Editorial Review</p>
              <h2 class="cg-side-note-title">{{ copy.hero.review.title }}</h2>
              <p class="cg-card-body">{{ copy.hero.review.body }}</p>
            </article>
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
            <article v-for="item in guarantees" :key="item.title" class="cg-card cg-card-emphasis">
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
            <p>{{ copy.market.body }}</p>
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
        <div class="cg-container cg-readiness-layout">
          <div class="cg-readiness-wrap">
            <header class="cg-section-head">
              <p class="cg-eyebrow">{{ copy.readiness.eyebrow }}</p>
              <h2>{{ copy.readiness.title }}</h2>
            </header>
            <ul class="cg-checklist">
              <li v-for="item in launchChecklist" :key="item">{{ item }}</li>
            </ul>
          </div>

          <aside class="cg-side-card cg-readiness-panel">
            <p class="cg-card-kicker">{{ copy.readiness.panelTitle }}</p>
            <div class="cg-signal-list">
              <div v-for="item in readinessSignals" :key="item.label" class="cg-signal-row">
                <span class="cg-signal-label">{{ item.label }}</span>
                <strong class="cg-signal-value">{{ item.value }}</strong>
              </div>
            </div>
          </aside>
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
            >
              <button class="cg-faq-trigger" type="button" @click="activeFaq = activeFaq === idx ? -1 : idx">
                <span class="cg-faq-q">{{ item.q }}</span>
                <span class="cg-faq-icon">{{ activeFaq === idx ? '−' : '+' }}</span>
              </button>
              <p v-if="activeFaq === idx" class="cg-card-body">{{ item.a }}</p>
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
