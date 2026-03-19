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
const activeTrack = ref('All')

const availableTracks = computed(() => {
  const trackSet = new Set(docsNav.value.map((item) => docsContent.value[item.slug]?.track).filter(Boolean))
  return ['All', ...Array.from(trackSet)]
})

const filteredNav = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  return docsNav.value.filter((item) => {
    const doc = docsContent.value[item.slug]
    if (!doc) return false
    const matchTrack = activeTrack.value === 'All' || doc.track === activeTrack.value
    const haystack = `${item.title} ${item.slug} ${doc.summary}`.toLowerCase()
    const matchQuery = !query || haystack.includes(query)
    return matchTrack && matchQuery
  })
})

const countDocLines = (doc) => doc.sections.reduce((sum, section) => sum + (section.body?.length || 0), 0)

const estimateReadMinutes = (doc) => {
  const text = doc.sections.flatMap((section) => section.body || []).join(' ')
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 170))
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
    index: `${index + 1}`.padStart(2, '0'),
  })),
)

const relatedDocs = computed(() =>
  docsNav.value
    .filter((item) => item.slug !== activeSlug.value && docsContent.value[item.slug]?.track === activeDoc.value.track)
    .slice(0, 4),
)

const docDescription = computed(() => {
  const lines = activeDoc.value.sections[0]?.body || []
  return lines.join(' ').slice(0, 170)
})

const docLead = computed(() => activeDoc.value.sections[0]?.body?.[0] || activeDoc.value.summary)
const docSupport = computed(() => activeDoc.value.sections[1]?.body?.[0] || activeDoc.value.sections[0]?.body?.[1] || activeDoc.value.summary)
const folio = computed(() => `/${activeLocale.value}/docs/${activeSlug.value}`)

const localizeTrack = (track) => {
  if (activeLocale.value !== 'ja') return track
  return {
    All: 'すべて',
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

const localizeAudience = (audience) => {
  if (activeLocale.value !== 'ja') return audience
  return {
    Leadership: '経営',
    Investors: '投資家',
    Partners: 'パートナー',
    'Internal Team': '社内チーム',
    Developers: '開発者',
    Customers: '顧客',
    Sales: '営業',
  }[audience] || audience
}

const localizeConfidentiality = (value) => {
  if (activeLocale.value !== 'ja') return value
  return {
    Public: '公開',
    Internal: '社内限定',
  }[value] || value
}

useSeo({
  title: computed(() => activeDoc.value.title),
  description: docDescription,
  path: computed(() => `/${activeLocale.value}/docs/${activeSlug.value}`),
  type: 'article',
})

const copy = computed(() => {
  if (activeLocale.value === 'ja') {
    return {
      home: 'ホーム',
      docs: '資料',
      lang: '日本語',
      badge: 'Editorial Reader',
      intro: '技術・運用・事業資料を、出版物のような版面で読むためのビューです。',
      searchLabel: '資料を検索',
      searchPlaceholder: 'タイトル、slug、要約で検索',
      filterLabel: 'トラックで絞り込み',
      noResults: '条件に一致する資料はありません。',
      document: 'Document',
      minutesRead: '分で読めます',
      minuteShort: '分',
      sections: 'セクション',
      lines: '本文行',
      outline: '目次',
      sourceTitle: '原本',
      sourceBody: '正本は Notion 上の ClearanceGate Documentation です。このビューは、読む順序と紙面の落ち着きを優先して再構成しています。',
      sourceCta: 'Notion 原本を開く',
      metadata: '文書メタデータ',
      summaryTitle: '先に掴むべき主張',
      summaryNote: '本文に入る前に、文書の主張と補助線を明確にします。',
      issueTitle: '読む前の要約',
      issueBody: 'この文書はプロダクト説明ではなく、判断材料として読まれる前提で組んでいます。',
      deckLabel: 'Deck',
      folioLabel: 'Folio',
      sectionsLabel: 'Sections',
      related: '関連資料',
      startPilot: 'この資料群からパイロットを始める',
    }
  }

  return {
    home: 'Home',
    docs: 'Docs',
    lang: 'Japanese',
    badge: 'Editorial Reader',
    intro: 'An editorial reading view for engineering, operations, and business materials.',
    searchLabel: 'Search docs',
    searchPlaceholder: 'Search by title, slug, or summary',
    filterLabel: 'Track Filter',
    noResults: 'No documents matched your filters.',
    document: 'Document',
    minutesRead: 'min read',
    minuteShort: 'min',
    sections: 'sections',
    lines: 'lines',
    outline: 'Section Outline',
    sourceTitle: 'Source Of Truth',
    sourceBody: 'The canonical source remains the Notion-based ClearanceGate Documentation. This view prioritizes reading order and calm page rhythm.',
    sourceCta: 'Open Notion Source',
    metadata: 'Document Metadata',
    summaryTitle: 'Argument at a glance',
    summaryNote: 'The page surfaces the thesis before detail, more like an editorial spread than an app panel.',
    issueTitle: 'Reading note',
    issueBody: 'This document is presented as a decision artifact, not a dashboard record.',
    deckLabel: 'Deck',
    folioLabel: 'Folio',
    sectionsLabel: 'Sections',
    related: 'Related Documents',
    startPilot: 'Start Pilot From This Doc Set',
  }
})

watch(
  () => activeLocale.value,
  () => {
    searchQuery.value = ''
    activeTrack.value = 'All'
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
          <button class="cg-lang-btn" :class="{ active: activeLocale === 'ja' }" @click="switchLocale('ja')">{{ copy.lang }}</button>
        </div>
      </nav>
    </header>

    <main class="cg-docs-shell cg-docs-shell-editorial">
      <aside class="cg-docs-nav-panel cg-docs-nav-panel-editorial reveal fade-up">
        <p class="cg-badge">{{ copy.badge }}</p>
        <p class="cg-docs-intro">{{ copy.intro }}</p>

        <label class="cg-search-label" for="doc-search">{{ copy.searchLabel }}</label>
        <input id="doc-search" v-model="searchQuery" class="cg-search-input" type="search" :placeholder="copy.searchPlaceholder" />

        <p class="cg-search-label cg-track-label">{{ copy.filterLabel }}</p>
        <div class="cg-track-filter">
          <button
            v-for="track in availableTracks"
            :key="track"
            type="button"
            class="cg-track-filter-btn"
            :class="{ active: activeTrack === track }"
            @click="activeTrack = track"
          >
            {{ localizeTrack(track) }}
          </button>
        </div>

        <nav class="cg-doc-list">
          <RouterLink
            v-for="item in filteredNav"
            :key="item.slug"
            class="cg-doc-link"
            :class="{ active: item.slug === activeSlug }"
            :to="{ name: 'doc', params: { locale: activeLocale, slug: item.slug } }"
          >
            <span class="cg-doc-link-title">{{ item.title }}</span>
            <span class="cg-doc-link-meta"
              >{{ localizeTrack(docsContent[item.slug]?.track) }} / {{ docStatsMap[item.slug]?.minutes || 1 }} {{ copy.minuteShort }}</span
            >
          </RouterLink>
          <p v-if="filteredNav.length === 0" class="cg-doc-empty">{{ copy.noResults }}</p>
        </nav>
      </aside>

      <article class="cg-docs-article cg-docs-article-editorial reveal fade-up">
        <header class="cg-doc-header cg-doc-header-editorial">
          <div class="cg-doc-folio-row">
            <p class="cg-card-kicker">{{ copy.document }}</p>
            <p class="cg-doc-folio">
              <span>{{ copy.folioLabel }}</span>
              <span>{{ folio }}</span>
            </p>
          </div>

          <h1>{{ activeDoc.title }}</h1>
          <p class="cg-doc-deck">{{ activeDoc.summary }}</p>

          <div class="cg-doc-summary-grid cg-doc-summary-grid-editorial">
            <section class="cg-doc-summary-card cg-doc-summary-card-editorial">
              <p class="cg-card-kicker">{{ copy.summaryTitle }}</p>
              <p class="cg-doc-summary-lead cg-doc-summary-lead-editorial">{{ docLead }}</p>
              <p class="cg-card-body">{{ docSupport }}</p>
            </section>

            <aside class="cg-doc-issue-note">
              <p class="cg-card-kicker">{{ copy.issueTitle }}</p>
              <p class="cg-card-body">{{ copy.issueBody }}</p>
              <p class="cg-doc-summary-note">{{ copy.summaryNote }}</p>
            </aside>
          </div>

          <div class="cg-doc-meta-rail">
            <span class="cg-chip">{{ localizeTrack(activeDoc.track) }}</span>
            <span class="cg-chip">{{ localizeStatus(activeDoc.status) }}</span>
            <span class="cg-chip">{{ activeStats.minutes }} {{ copy.minutesRead }}</span>
            <span class="cg-chip">{{ activeDoc.sections.length }} {{ copy.sections }}</span>
            <span class="cg-chip">{{ activeStats.lines }} {{ copy.lines }}</span>
          </div>
        </header>

        <section
          v-for="section in sectionsWithId"
          :id="section.id"
          :key="section.id"
          class="cg-doc-section cg-doc-section-editorial"
        >
          <div class="cg-doc-section-shell">
            <div class="cg-doc-section-index">{{ section.index }}</div>
            <div class="cg-doc-section-body">
              <h2>{{ section.heading }}</h2>
              <p v-for="line in section.body" :key="line">{{ line }}</p>
            </div>
          </div>
        </section>

        <div class="cg-doc-bottom-actions">
          <RouterLink class="cg-btn cg-btn-primary" :to="{ name: 'doc', params: { locale: activeLocale, slug: 'pilot-plan' } }">
            {{ copy.startPilot }}
          </RouterLink>
        </div>
      </article>

      <aside class="cg-docs-side cg-docs-side-editorial reveal fade-up">
        <section class="cg-side-card cg-side-card-editorial">
          <h2>{{ copy.metadata }}</h2>
          <dl class="cg-meta-list">
            <div class="cg-meta-item">
              <dt>Track</dt>
              <dd>{{ localizeTrack(activeDoc.track) }}</dd>
            </div>
            <div class="cg-meta-item">
              <dt>Status</dt>
              <dd>{{ localizeStatus(activeDoc.status) }}</dd>
            </div>
            <div class="cg-meta-item">
              <dt>Audience</dt>
              <dd>{{ activeDoc.audience.map(localizeAudience).join(', ') }}</dd>
            </div>
            <div class="cg-meta-item">
              <dt>Scope</dt>
              <dd>{{ localizeConfidentiality(activeDoc.confidentiality) }}</dd>
            </div>
            <div class="cg-meta-item">
              <dt>Updated</dt>
              <dd>{{ activeDoc.lastUpdated }}</dd>
            </div>
          </dl>
        </section>

        <section class="cg-side-card cg-side-card-editorial">
          <h2>{{ copy.outline }}</h2>
          <nav class="cg-toc">
            <a v-for="section in sectionsWithId" :key="section.id" :href="`#${section.id}`">
              <span class="cg-toc-no">{{ section.index }}</span>
              <span>{{ section.heading }}</span>
            </a>
          </nav>
        </section>

        <section class="cg-side-card cg-side-card-editorial">
          <h2>{{ copy.sourceTitle }}</h2>
          <p>{{ copy.sourceBody }}</p>
          <a class="cg-btn cg-btn-secondary" :href="activeDoc.source || NOTION_DOC_URL" target="_blank" rel="noopener noreferrer">{{ copy.sourceCta }}</a>
        </section>

        <section class="cg-side-card cg-side-card-editorial">
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
  </div>
</template>
