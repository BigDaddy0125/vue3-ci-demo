<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getDocsForLocale } from '../docs/nav'
import { useLocale } from '../composables/useLocale'
import { useReveal } from '../composables/useReveal'
import { useSeo } from '../composables/useSeo'

const NOTION_DOC_URL =
  'https://hyper-truck-b3a.notion.site/2e9adcdd14e1809d8473d1f53e8aaed8?v=2e9adcdd14e18073b7e7000c9b1016c3&source=copy_link'

const route = useRoute()
const router = useRouter()
const { locale, setLocale } = useLocale()

useReveal('.reveal', { threshold: 0.14, rootMargin: '0px 0px -12% 0px' })

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

const localizedDocs = computed(() => getDocsForLocale(activeLocale.value))
const docsNav = computed(() => localizedDocs.value.nav)
const docsContent = computed(() => localizedDocs.value.content)

const activeSlug = computed(() => {
  const fallback = docsNav.value[0]?.slug || 'constitution'
  const slug = String(route.params.slug || fallback)
  return docsContent.value[slug] ? slug : fallback
})

const switchLocale = (nextLocale) => {
  setLocale(nextLocale)
  router.push({ name: 'doc', params: { locale: nextLocale, slug: activeSlug.value } })
}

const activeDoc = computed(() => docsContent.value[activeSlug.value])
const searchQuery = ref('')

const filteredNav = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return docsNav.value
  return docsNav.value.filter((item) => item.title.toLowerCase().includes(query) || item.slug.toLowerCase().includes(query))
})

const countDocLines = (doc) => doc.sections.reduce((sum, section) => sum + (section.body?.length || 0), 0)
const estimateReadMinutes = (doc) => {
  const text = doc.sections.flatMap((section) => section.body || []).join(' ')
  const words = text.trim().split(/\s+/).filter(Boolean).length
  const chars = text.replace(/\s/g, '').length
  const units = words > 0 ? words : chars / 2
  return Math.max(1, Math.ceil(units / 180))
}

const docStatsMap = computed(() =>
  docsNav.value.reduce((map, item) => {
    const doc = docsContent.value[item.slug]
    if (!doc) return map
    map[item.slug] = {
      lines: countDocLines(doc),
      minutes: estimateReadMinutes(doc),
    }
    return map
  }, {}),
)

const activeStats = computed(() => docStatsMap.value[activeSlug.value] || { lines: 0, minutes: 1 })

const headingToId = (heading, index) => {
  const normalized = heading.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  return `section-${index + 1}-${normalized || 'doc'}`
}

const sectionsWithId = computed(() =>
  activeDoc.value.sections.map((section, index) => ({
    ...section,
    id: headingToId(section.heading, index),
  })),
)

const relatedDocs = computed(() => docsNav.value.filter((item) => item.slug !== activeSlug.value).slice(0, 4))

const docDescription = computed(() => {
  const lines = activeDoc.value.sections[0]?.body || []
  return lines.join(' ').slice(0, 170)
})

useSeo({
  title: computed(() => activeDoc.value.title),
  description: docDescription,
  path: computed(() => `/${activeLocale.value}/docs/${activeSlug.value}`),
  type: 'article',
})

const copy = computed(() => {
  if (activeLocale.value === 'ja') {
    return {
      home: 'Home',
      docs: 'Docs',
      badge: 'Documentation Hub',
      intro: 'システム憲章・状態意味論・導入運用を横断して検索可能な実装ドキュメント。',
      searchLabel: 'ドキュメント検索',
      searchPlaceholder: 'タイトルまたは slug で検索',
      noResults: '一致するドキュメントがありません。',
      document: 'Document',
      minutesRead: 'min read',
      minuteShort: 'min',
      sections: 'sections',
      lines: 'lines',
      outline: 'Section Outline',
      sourceTitle: 'Source Of Truth',
      sourceBody: '原本は Notion の ClearanceGate Documentation です。このサイトは運用向けに再構成した公開ビューです。',
      sourceCta: 'Open Notion Source',
      related: 'Related Documents',
      startPilot: 'Start Pilot From This Doc Set',
      affiliation: {
        title: '運営主体',
        text: 'ClearanceGate は 石竹株式会社（Ishitake Co., Ltd.）が企画・開発・運営しています。',
        link: '石竹株式会社 公式サイト',
      },
    }
  }

  return {
    home: 'Home',
    docs: 'Docs',
    badge: 'Documentation Hub',
    intro: 'Searchable implementation references across constitutional guarantees, state semantics, and rollout operations.',
    searchLabel: 'Search docs',
    searchPlaceholder: 'Search by title or slug',
    noResults: 'No documents matched your search.',
    document: 'Document',
    minutesRead: 'min read',
    minuteShort: 'min',
    sections: 'sections',
    lines: 'lines',
    outline: 'Section Outline',
    sourceTitle: 'Source Of Truth',
    sourceBody: 'The canonical source is the Notion-based ClearanceGate Documentation. This site provides a rollout-ready, localized product view.',
    sourceCta: 'Open Notion Source',
    related: 'Related Documents',
    startPilot: 'Start Pilot From This Doc Set',
    affiliation: {
      title: 'Operated by',
      text: 'ClearanceGate is planned, developed, and operated by Ishitake Co., Ltd.',
      link: 'Visit Ishitake Corporate Site',
    },
  }
})

watch(
  () => activeLocale.value,
  () => {
    searchQuery.value = ''
  },
)
</script>

<template>
  <div class="cg-site cg-docs-site">
    <div class="cg-bg-grid" aria-hidden="true"></div>
    <div class="cg-bg-orb orb-a" aria-hidden="true"></div>
    <div class="cg-bg-orb orb-b" aria-hidden="true"></div>

    <header class="cg-topbar reveal fade-in">
      <RouterLink class="cg-brand-link" :to="{ name: 'home', params: { locale: activeLocale } }">ClearanceGate</RouterLink>
      <nav class="cg-nav cg-docs-nav-top" aria-label="Primary">
        <RouterLink class="cg-nav-btn-link" :to="{ name: 'home', params: { locale: activeLocale } }">{{ copy.home }}</RouterLink>
        <RouterLink class="cg-nav-btn-link active" :to="{ name: 'doc', params: { locale: activeLocale } }">{{ copy.docs }}</RouterLink>
        <div class="cg-lang-switch" role="group" aria-label="Language">
          <button class="cg-lang-btn" :class="{ active: activeLocale === 'en' }" @click="switchLocale('en')">EN</button>
          <button class="cg-lang-btn" :class="{ active: activeLocale === 'ja' }" @click="switchLocale('ja')">日本語</button>
        </div>
      </nav>
    </header>

    <main class="cg-docs-shell">
      <aside class="cg-docs-nav-panel reveal fade-up">
        <p class="cg-badge">{{ copy.badge }}</p>
        <p class="cg-docs-intro">{{ copy.intro }}</p>
        <label class="cg-search-label" for="doc-search">{{ copy.searchLabel }}</label>
        <input id="doc-search" v-model="searchQuery" class="cg-search-input" type="search" :placeholder="copy.searchPlaceholder" />

        <nav class="cg-doc-list">
          <RouterLink
            v-for="item in filteredNav"
            :key="item.slug"
            class="cg-doc-link"
            :class="{ active: item.slug === activeSlug }"
            :to="{ name: 'doc', params: { locale: activeLocale, slug: item.slug } }"
          >
            <span class="cg-doc-link-title">{{ item.title }}</span>
            <span class="cg-doc-link-meta">{{ docStatsMap[item.slug]?.minutes || 1 }} {{ copy.minuteShort }}</span>
          </RouterLink>
          <p v-if="filteredNav.length === 0" class="cg-doc-empty">{{ copy.noResults }}</p>
        </nav>
      </aside>

      <article class="cg-docs-article reveal fade-up">
        <header class="cg-doc-header">
          <p class="cg-card-kicker">{{ copy.document }}</p>
          <h1>{{ activeDoc.title }}</h1>
          <p class="cg-doc-header-copy">{{ activeDoc.sections[0]?.body?.[0] }}</p>
          <div class="cg-chip-row">
            <span class="cg-chip">{{ activeStats.minutes }} {{ copy.minutesRead }}</span>
            <span class="cg-chip">{{ activeDoc.sections.length }} {{ copy.sections }}</span>
            <span class="cg-chip">{{ activeStats.lines }} {{ copy.lines }}</span>
          </div>
        </header>

        <section v-for="section in sectionsWithId" :id="section.id" :key="section.id" class="cg-doc-section">
          <h2>{{ section.heading }}</h2>
          <p v-for="line in section.body" :key="line">{{ line }}</p>
        </section>

        <div class="cg-doc-bottom-actions">
          <RouterLink class="cg-btn cg-btn-primary" :to="{ name: 'doc', params: { locale: activeLocale, slug: 'pilot-plan' } }">
            {{ copy.startPilot }}
          </RouterLink>
        </div>
      </article>

      <aside class="cg-docs-side reveal fade-up">
        <section class="cg-side-card">
          <h2>{{ copy.outline }}</h2>
          <nav class="cg-toc">
            <a v-for="section in sectionsWithId" :key="section.id" :href="`#${section.id}`">{{ section.heading }}</a>
          </nav>
        </section>

        <section class="cg-side-card">
          <h2>{{ copy.sourceTitle }}</h2>
          <p>{{ copy.sourceBody }}</p>
          <a class="cg-btn cg-btn-secondary" :href="NOTION_DOC_URL" target="_blank" rel="noopener noreferrer">{{ copy.sourceCta }}</a>
        </section>

        <section class="cg-side-card">
          <h2>{{ copy.related }}</h2>
          <div class="cg-related-docs">
            <RouterLink
              v-for="item in relatedDocs"
              :key="item.slug"
              class="cg-btn cg-btn-link"
              :to="{ name: 'doc', params: { locale: activeLocale, slug: item.slug } }"
            >
              {{ item.title }}
            </RouterLink>
          </div>
        </section>
      </aside>
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
