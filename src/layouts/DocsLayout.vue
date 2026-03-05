<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { docsContent, docsNav } from '../docs/nav'
import { useReveal } from '../composables/useReveal'

const route = useRoute()
useReveal('.reveal')

const activeSlug = computed(() => {
  const slug = String(route.params.slug || docsNav[0].slug)
  return docsContent[slug] ? slug : docsNav[0].slug
})

const activeDoc = computed(() => docsContent[activeSlug.value])
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
        <h1>{{ activeDoc.title }}</h1>
        <section v-for="section in activeDoc.sections" :key="section.heading" class="doc-section">
          <h3>{{ section.heading }}</h3>
          <p v-for="line in section.body" :key="line">{{ line }}</p>
        </section>
      </article>
    </main>
  </div>
</template>

