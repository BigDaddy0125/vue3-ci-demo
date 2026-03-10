<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { docsContent, docsNav } from '../docs/nav'
import { useReveal } from '../composables/useReveal'
import { useSeo } from '../composables/useSeo'

const route = useRoute()
useReveal('.reveal')

const activeSlug = computed(() => {
  const slug = String(route.params.slug || docsNav[0].slug)
  return docsContent[slug] ? slug : docsNav[0].slug
})

const activeDoc = computed(() => docsContent[activeSlug.value])

const docTitle = computed(() => activeDoc.value.title)
const docDescription = computed(() => {
  const lines = activeDoc.value.sections[0]?.body || []
  return lines.join(' ').slice(0, 160)
})
const docPath = computed(() => `/docs/${activeSlug.value}`)

useSeo({
  title: docTitle,
  description: docDescription,
  path: docPath,
  type: 'article',
})
</script>

<template>
  <div class="site">
    <div class="bg-grid" aria-hidden="true"></div>
    <div class="bg-orb orb-a" aria-hidden="true"></div>
    <div class="bg-orb orb-b" aria-hidden="true"></div>

    <header class="topbar reveal fade-in">
      <RouterLink class="brand-link" :to="{ name: 'home' }">ClearanceGate</RouterLink>
      <span class="eyebrow">Documentation</span>
    </header>

    <main class="docs-layout">
      <aside class="card docs-nav reveal fade-up">
        <h2>Docs</h2>
        <p class="docs-nav-copy">
          Canonical references for constitutional guarantees, state semantics, and deployment.
        </p>
        <nav>
          <RouterLink
            v-for="item in docsNav"
            :key="item.slug"
            class="docs-link"
            :class="{ active: activeSlug === item.slug }"
            :to="{ name: 'doc', params: { slug: item.slug } }"
          >
            {{ item.title }}
          </RouterLink>
        </nav>
      </aside>
      <article class="card docs-content reveal fade-up">
        <header class="docs-hero">
          <p class="tile-kicker">Document</p>
          <h1>{{ activeDoc.title }}</h1>
          <div class="docs-hero-meta">
            <span class="chip">Authorization Infrastructure</span>
            <span class="chip">No Prediction Claims</span>
            <span class="chip">Auditability Required</span>
          </div>
        </header>
        <section v-for="section in activeDoc.sections" :key="section.heading" class="doc-section">
          <h3>{{ section.heading }}</h3>
          <p v-for="line in section.body" :key="line">{{ line }}</p>
        </section>
      </article>
    </main>
  </div>
</template>

