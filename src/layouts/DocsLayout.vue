<script setup>
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getDocsForLocale } from '../docs/nav'
import { useLocale } from '../composables/useLocale'
import { useReveal } from '../composables/useReveal'
import { useSeo } from '../composables/useSeo'

const route = useRoute()
const router = useRouter()
const { locale, setLocale } = useLocale()

useReveal('.reveal')

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
  router.push({ name: 'doc', params: { locale: nextLocale, slug: activeSlug.value } })
}

const localizedDocs = computed(() => getDocsForLocale(activeLocale.value))
const docsNav = computed(() => localizedDocs.value.nav)
const docsContent = computed(() => localizedDocs.value.content)

const activeSlug = computed(() => {
  const first = docsNav.value[0]?.slug || 'constitution'
  const slug = String(route.params.slug || first)
  return docsContent.value[slug] ? slug : first
})

const activeDoc = computed(() => docsContent.value[activeSlug.value])

const docTitle = computed(() => activeDoc.value.title)
const docDescription = computed(() => {
  const lines = activeDoc.value.sections[0]?.body || []
  return lines.join(' ').slice(0, 160)
})
const docPath = computed(() => `/${activeLocale.value}/docs/${activeSlug.value}`)

useSeo({
  title: docTitle,
  description: docDescription,
  path: docPath,
  type: 'article',
})

const copy = computed(() => {
  if (activeLocale.value === 'ja') {
    return {
      badge: 'ドキュメント',
      docs: '資料',
      intro: 'システム憲章、状態意味論、導入運用を定義する基準ドキュメント。',
      document: '文書',
      chips: ['認可インフラ', '予測は非対象', '監査証跡は必須'],
      affiliation: {
        title: '運営主体',
        text: 'ClearanceGate は 石竹株式会社（Ishitake Co., Ltd.）が企画・開発・運営しています。',
        link: '石竹株式会社 公式サイト',
      },
    }
  }

  return {
    badge: 'Documentation',
    docs: 'Docs',
    intro: 'Canonical references for constitutional guarantees, state semantics, and deployment.',
    document: 'Document',
    chips: ['Authorization Infrastructure', 'No Prediction Claims', 'Auditability Required'],
    affiliation: {
      title: 'Operated by',
      text: 'ClearanceGate is planned, developed, and operated by Ishitake Co., Ltd.',
      link: 'Visit Ishitake Corporate Site',
    },
  }
})
</script>

<template>
  <div class="site">
    <div class="bg-grid" aria-hidden="true"></div>
    <div class="bg-orb orb-a" aria-hidden="true"></div>
    <div class="bg-orb orb-b" aria-hidden="true"></div>

    <header class="topbar reveal fade-in">
      <RouterLink class="brand-link" :to="{ name: 'home', params: { locale: activeLocale } }">ClearanceGate</RouterLink>
      <div class="top-nav">
        <span class="eyebrow">{{ copy.badge }}</span>
        <div class="lang-switch" role="group" aria-label="Language">
          <button class="lang-btn" :class="{ active: activeLocale === 'en' }" @click="switchLocale('en')">EN</button>
          <button class="lang-btn" :class="{ active: activeLocale === 'ja' }" @click="switchLocale('ja')">日本語</button>
        </div>
      </div>
    </header>

    <main class="docs-layout">
      <aside class="card docs-nav reveal fade-up">
        <h2>{{ copy.docs }}</h2>
        <p class="docs-nav-copy">{{ copy.intro }}</p>
        <nav>
          <RouterLink
            v-for="item in docsNav"
            :key="item.slug"
            class="docs-link"
            :class="{ active: activeSlug === item.slug }"
            :to="{ name: 'doc', params: { locale: activeLocale, slug: item.slug } }"
          >
            {{ item.title }}
          </RouterLink>
        </nav>
      </aside>
      <article class="card docs-content reveal fade-up">
        <header class="docs-hero">
          <p class="tile-kicker">{{ copy.document }}</p>
          <h1>{{ activeDoc.title }}</h1>
          <div class="docs-hero-meta">
            <span v-for="chip in copy.chips" :key="chip" class="chip">{{ chip }}</span>
          </div>
        </header>
        <section v-for="section in activeDoc.sections" :key="section.heading" class="doc-section">
          <h3>{{ section.heading }}</h3>
          <p v-for="line in section.body" :key="line">{{ line }}</p>
        </section>
      </article>
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
