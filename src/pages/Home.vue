<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import GuaranteesSection from '../components/GuaranteesSection.vue'
import HeroSection from '../components/HeroSection.vue'
import PricingSection from '../components/PricingSection.vue'
import StateMachine from '../components/StateMachine.vue'
import { getDocsForLocale } from '../docs/nav'
import { useLocale } from '../composables/useLocale'
import { useReveal } from '../composables/useReveal'
import { useSeo } from '../composables/useSeo'
import usecaseFinance from '../assets/usecase-finance.svg'
import usecaseItops from '../assets/usecase-itops.svg'
import usecaseIndustrial from '../assets/usecase-industrial.svg'

useReveal('.reveal')

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
      'ClearanceGate enforces authorization immediately before high-risk execution with fail-closed behavior and auditable accountability.',
  }
})

const seoPath = computed(() => `/${activeLocale.value}`)

useSeo({
  title: computed(() => seoCopy.value.title),
  description: computed(() => seoCopy.value.description),
  path: seoPath,
  type: 'website',
})

const scrollProgress = ref(0)
const activeDocLayerIndex = ref(0)
const activeProductIndex = ref(0)

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
  if (activeLocale.value === 'ja') {
    return {
      nav: {
        product: 'Product',
        usecases: 'Use Cases',
        trust: 'Trust',
        docs: 'Docs',
      },
      trust: {
        eyebrow: 'Early Access Trust',
        title: '開発段階でも検証可能な信頼指標を公開',
        stats: [
          { value: 'Private Preview', label: 'Current stage' },
          { value: '2026-03-12', label: 'Last deployment' },
          { value: '5 / 5', label: 'CI tests passing' },
          { value: '2', label: 'Design partners sought' },
        ],
        signals: [
          'Known limitations と Non-Claims を公開',
          'Fail-closed fault scenarios を検証済み',
          '監査証跡の再構成フローを文書化',
        ],
      },
      product: {
        eyebrow: 'Product',
        title: '実行直前で認可を強制する最小カーネル',
        cards: [
          {
            kicker: 'Deterministic',
            title: 'Single Outcome',
            body: 'PROCEED / BLOCK / REQUIRE_ACK / DEGRADE のいずれか一つだけを返す。',
          },
          {
            kicker: 'Fail-Closed',
            title: 'No Implicit Allow',
            body: '情報不足や内部異常で PROCEED にフォールバックしない。',
          },
          {
            kicker: 'Auditable',
            title: 'Evidence Required',
            body: '非ブロック判断では証跡が必須で、事後再構成を可能にする。',
          },
        ],
      },
      usecases: {
        eyebrow: 'Use Cases',
        title: '高説明責任領域への初期適用',
        items: [
          {
            title: 'Quant Finance',
            text: '戦略 go-live / pause / kill の認可統制。',
            image: usecaseFinance,
            alt: 'Quant finance use case',
          },
          {
            title: 'Enterprise IT Operations',
            text: 'CI/CD の変更とデプロイを実行前でゲート。',
            image: usecaseItops,
            alt: 'Enterprise IT operations use case',
          },
          {
            title: 'Industrial Automation',
            text: 'アクション単位のクリアランスで安全側制御。',
            image: usecaseIndustrial,
            alt: 'Industrial automation use case',
          },
        ],
      },
      docs: {
        eyebrow: 'Documentation',
        title: 'Start Here から段階的に読む',
        layers: [
          {
            title: 'Start Here',
            desc: '全体像と境界条件',
            slug: 'executive-summary',
            links: ['executive-summary', 'constitution'],
          },
          {
            title: 'Architecture',
            desc: '状態機械と技術構成',
            slug: 'architecture',
            links: ['state-machine', 'architecture'],
          },
          {
            title: 'Security',
            desc: 'Fail-closed と運用ガイド',
            slug: 'security',
            links: ['security', 'enterprise-guide'],
          },
          {
            title: 'API',
            desc: '連携仕様と意味論',
            slug: 'api',
            links: ['api', 'formal-verification'],
          },
          {
            title: 'Commercial',
            desc: '価格と導入計画',
            slug: 'pricing',
            links: ['pricing', 'pilot-plan'],
          },
        ],
        all: '全ドキュメント',
      },
      cta: {
        eyebrow: 'Pilot',
        title: '限定スコープで Start Pilot を開始',
        primary: 'Start Pilot',
        secondary: 'Read Docs',
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
      product: 'Product',
      usecases: 'Use Cases',
      trust: 'Trust',
      docs: 'Docs',
    },
    trust: {
      eyebrow: 'Early Access Trust',
      title: 'Real Confidence Signals While Still In Development',
      stats: [
        { value: 'Private Preview', label: 'Current stage' },
        { value: '2026-03-12', label: 'Last deployment' },
        { value: '5 / 5', label: 'CI tests passing' },
        { value: '2', label: 'Design partners sought' },
      ],
      signals: [
        'Known limitations and non-claims published',
        'Fail-closed fault scenarios tested',
        'Audit evidence replay flow documented',
      ],
    },
    product: {
      eyebrow: 'Product',
      title: 'A Minimal Authorization Kernel Before Execution',
      cards: [
        {
          kicker: 'Deterministic',
          title: 'Single Outcome',
          body: 'Every request resolves to exactly one outcome: PROCEED, BLOCK, REQUIRE_ACK, or DEGRADE.',
        },
        {
          kicker: 'Fail-Closed',
          title: 'No Implicit Allow',
          body: 'Missing context and internal faults never fall through to PROCEED.',
        },
        {
          kicker: 'Auditable',
          title: 'Evidence Required',
          body: 'Non-blocked decisions require reconstructable evidence by design.',
        },
      ],
    },
    usecases: {
      eyebrow: 'Use Cases',
      title: 'Early Deployment Patterns In High-Accountability Domains',
      items: [
        {
          title: 'Quant Finance',
          text: 'Gate strategy go-live, pause, and kill-switch operations.',
          image: usecaseFinance,
          alt: 'Quant finance use case',
        },
        {
          title: 'Enterprise IT Operations',
          text: 'Enforce deployment and change authorization before production execution.',
          image: usecaseItops,
          alt: 'Enterprise IT operations use case',
        },
        {
          title: 'Industrial Automation',
          text: 'Control action-level clearance in safety-critical workflows.',
          image: usecaseIndustrial,
          alt: 'Industrial automation use case',
        },
      ],
    },
    docs: {
      eyebrow: 'Documentation',
      title: 'A Layered Reading Path',
      layers: [
        {
          title: 'Start Here',
          desc: 'Overview and boundaries',
          slug: 'executive-summary',
          links: ['executive-summary', 'constitution'],
        },
        {
          title: 'Architecture',
          desc: 'State machine and system shape',
          slug: 'architecture',
          links: ['state-machine', 'architecture'],
        },
        {
          title: 'Security',
          desc: 'Fail-closed and operating model',
          slug: 'security',
          links: ['security', 'enterprise-guide'],
        },
        {
          title: 'API',
          desc: 'Integration surface and semantics',
          slug: 'api',
          links: ['api', 'formal-verification'],
        },
        {
          title: 'Commercial',
          desc: 'Pricing and pilot plan',
          slug: 'pricing',
          links: ['pricing', 'pilot-plan'],
        },
      ],
      all: 'All documents',
    },
    cta: {
      eyebrow: 'Pilot',
      title: 'Run A Narrow-Scope Pilot First',
      primary: 'Start Pilot',
      secondary: 'Read Docs',
    },
    affiliation: {
      title: 'Operated by',
      text: 'ClearanceGate is planned, developed, and operated by Ishitake Co., Ltd.',
      link: 'Visit Ishitake Corporate Site',
    },
  }
})

const resolveDocTitle = (slug) => {
  const found = docsNav.value.find((d) => d.slug === slug)
  return found ? found.title : slug
}

const activeDocLayer = computed(() => copy.value.docs.layers[activeDocLayerIndex.value] || copy.value.docs.layers[0])
const activeProductCard = computed(() => copy.value.product.cards[activeProductIndex.value] || copy.value.product.cards[0])

watch(
  () => activeLocale.value,
  () => {
    activeDocLayerIndex.value = 0
    activeProductIndex.value = 0
  },
)
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
        <button class="top-cta top-link-btn" type="button" @click="scrollToSection('product')">{{ copy.nav.product }}</button>
        <button class="top-cta top-link-btn" type="button" @click="scrollToSection('usecases')">{{ copy.nav.usecases }}</button>
        <button class="top-cta top-link-btn" type="button" @click="scrollToSection('trust')">{{ copy.nav.trust }}</button>
        <button class="top-cta top-link-btn" type="button" @click="scrollToSection('docs-path')">{{ copy.nav.docs }}</button>
        <div class="lang-switch" role="group" aria-label="Language">
          <button class="lang-btn" :class="{ active: activeLocale === 'en' }" @click="switchLocale('en')">EN</button>
          <button class="lang-btn" :class="{ active: activeLocale === 'ja' }" @click="switchLocale('ja')">日本語</button>
        </div>
      </div>
    </header>

    <main>
      <HeroSection @jump="scrollToSection" />

      <section id="trust" class="section section-tone-trust reveal fade-up trust-section">
        <div class="section-head">
          <p class="eyebrow">{{ copy.trust.eyebrow }}</p>
          <h2>{{ copy.trust.title }}</h2>
        </div>
        <div class="metrics-strip reveal fade-in">
          <article v-for="item in copy.trust.stats" :key="item.label" class="metric-item">
            <p class="metric-value metric-value-sm">{{ item.value }}</p>
            <p class="metric-label">{{ item.label }}</p>
          </article>
        </div>
        <article class="card">
          <ul class="security-list">
            <li v-for="signal in copy.trust.signals" :key="signal">{{ signal }}</li>
          </ul>
        </article>
      </section>

      <section id="product" class="section section-tone-product reveal fade-up">
        <div class="section-head">
          <p class="eyebrow">{{ copy.product.eyebrow }}</p>
          <h2>{{ copy.product.title }}</h2>
        </div>
        <div class="product-journey card card-tint-teal">
          <aside class="product-switch">
            <button
              v-for="(item, idx) in copy.product.cards"
              :key="item.title"
              type="button"
              class="product-switch-btn"
              :class="{ active: activeProductIndex === idx }"
              @click="activeProductIndex = idx"
            >
              <span class="tile-kicker">{{ item.kicker }}</span>
              <span>{{ item.title }}</span>
            </button>
          </aside>

          <article class="product-detail card card-tint-slate reveal fade-up">
            <p class="tile-kicker">{{ activeProductCard.kicker }}</p>
            <h3>{{ activeProductCard.title }}</h3>
            <p>{{ activeProductCard.body }}</p>
            <div class="product-detail-actions">
              <button class="btn btn-primary" type="button" @click="scrollToSection('cta')">{{ copy.cta.primary }}</button>
            </div>
          </article>
        </div>
      </section>

      <GuaranteesSection />
      <StateMachine />

      <section id="usecases" class="section section-tone-usecases reveal fade-up">
        <div class="section-head">
          <p class="eyebrow">{{ copy.usecases.eyebrow }}</p>
          <h2>{{ copy.usecases.title }}</h2>
        </div>
        <div class="usecase-layout">
          <article class="card card-tint-blue feature-card usecase-feature reveal fade-up">
            <img class="feature-image" :src="copy.usecases.items[0].image" :alt="copy.usecases.items[0].alt" loading="lazy" />
            <h3>{{ copy.usecases.items[0].title }}</h3>
            <p>{{ copy.usecases.items[0].text }}</p>
          </article>
          <div class="usecase-list">
            <article
              v-for="(item, idx) in copy.usecases.items.slice(1)"
              :key="item.title"
              class="card card-tint-slate feature-card reveal fade-up"
              :style="{ '--reveal-delay': `${(idx + 1) * 80}ms` }"
            >
              <img class="feature-image" :src="item.image" :alt="item.alt" loading="lazy" />
              <h3>{{ item.title }}</h3>
              <p>{{ item.text }}</p>
            </article>
          </div>
        </div>
      </section>

      <section id="docs-path" class="section section-tone-docs reveal fade-up">
        <div class="section-head">
          <p class="eyebrow">{{ copy.docs.eyebrow }}</p>
          <h2>{{ copy.docs.title }}</h2>
        </div>
        <div class="docs-journey card card-tint-slate">
          <aside class="docs-steps">
            <button
              v-for="(layer, idx) in copy.docs.layers"
              :key="layer.title"
              type="button"
              class="docs-step-btn"
              :class="{ active: activeDocLayerIndex === idx }"
              @click="activeDocLayerIndex = idx"
            >
              <span class="doc-step-no">0{{ idx + 1 }}</span>
              <span>{{ layer.title }}</span>
            </button>
          </aside>

          <article class="docs-detail">
            <p class="tile-kicker">{{ activeDocLayer.title }}</p>
            <h3>{{ activeDocLayer.desc }}</h3>
            <div class="doc-layer-links">
              <RouterLink
                v-for="slug in activeDocLayer.links"
                :key="slug"
                class="docs-link"
                :to="{ name: 'doc', params: { locale: activeLocale, slug } }"
              >
                {{ resolveDocTitle(slug) }}
              </RouterLink>
            </div>
            <div class="docs-detail-actions">
              <RouterLink class="btn btn-primary" :to="{ name: 'doc', params: { locale: activeLocale, slug: activeDocLayer.slug } }">
                {{ copy.cta.secondary }}
              </RouterLink>
            </div>
          </article>
        </div>
        <div class="docs-path-actions">
          <RouterLink class="btn btn-ghost" :to="{ name: 'doc', params: { locale: activeLocale } }">{{ copy.docs.all }}</RouterLink>
        </div>
      </section>

      <section id="pricing">
        <PricingSection />
      </section>

      <section id="cta" class="section section-tone-cta reveal fade-up">
        <div class="card cta-block cta-focused">
          <p class="eyebrow">{{ copy.cta.eyebrow }}</p>
          <h2>{{ copy.cta.title }}</h2>
          <div class="hero-actions">
            <RouterLink class="btn btn-primary" :to="{ name: 'doc', params: { locale: activeLocale, slug: 'pilot-plan' } }">
              {{ copy.cta.primary }}
            </RouterLink>
            <RouterLink class="btn btn-ghost" :to="{ name: 'doc', params: { locale: activeLocale } }">
              {{ copy.cta.secondary }}
            </RouterLink>
          </div>
        </div>
      </section>
    </main>

    <footer class="site-footnote reveal fade-up">
      <div class="site-footnote-copy">
        <p class="site-footnote-title">{{ copy.affiliation.title }}</p>
        <p>{{ copy.affiliation.text }}</p>
      </div>
      <a class="site-footnote-link" href="https://ishitakes.com/" target="_blank" rel="noopener noreferrer">{{ copy.affiliation.link }}</a>
    </footer>
  </div>
</template>
