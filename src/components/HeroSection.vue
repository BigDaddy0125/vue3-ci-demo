<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useLocale } from '../composables/useLocale'

const emit = defineEmits(['jump'])
const { locale } = useLocale()
const route = useRoute()
const activeLocale = computed(() => String(route.params.locale || locale.value || 'en'))

const copy = computed(() => {
  if (locale.value === 'ja') {
    return {
      eyebrow: 'Authorization Infrastructure',
      titleA: 'Authorization',
      titleB: 'Before Execution',
      body: '高リスク実行の直前で、実行可否を決定論的に制御します。',
      primary: 'Start Pilot',
      secondary: 'Read Docs',
      bullets: ['Deterministic outcome', 'Fail-closed by default', 'Evidence required for non-blocked paths'],
      panelTitle: 'Runtime Decision Envelope',
      panelLineA: 'INPUT: Decision Proposal',
      panelLineB: 'GATE: Clearance Authorization',
      panelLineC: 'OUTPUT: PROCEED | BLOCK | REQUIRE_ACK | DEGRADE',
      panelFoot: 'No authorization, no execution.',
    }
  }

  return {
    eyebrow: 'Authorization Infrastructure',
    titleA: 'Authorization',
    titleB: 'Before Execution',
    body: 'Enforce deterministic authorization at the final boundary before execution.',
    primary: 'Start Pilot',
    secondary: 'Read Docs',
    bullets: ['Deterministic outcome', 'Fail-closed by default', 'Evidence required for non-blocked paths'],
    panelTitle: 'Runtime Decision Envelope',
    panelLineA: 'INPUT: Decision Proposal',
    panelLineB: 'GATE: Clearance Authorization',
    panelLineC: 'OUTPUT: PROCEED | BLOCK | REQUIRE_ACK | DEGRADE',
    panelFoot: 'No authorization, no execution.',
  }
})
</script>

<template>
  <section class="hero hero-contrast reveal fade-up">
    <div class="hero-grid hero-grid-contrast">
      <div class="hero-main">
        <p class="eyebrow hero-eyebrow-invert">{{ copy.eyebrow }}</p>
        <h1 class="hero-title-invert">
          {{ copy.titleA }}
          <span class="hero-gradient">{{ copy.titleB }}</span>
        </h1>
        <p class="hero-copy hero-copy-invert">{{ copy.body }}</p>

        <div class="hero-actions">
          <button class="btn btn-primary" type="button" @click="emit('jump', 'cta')">{{ copy.primary }}</button>
          <RouterLink class="btn btn-ghost btn-ghost-invert" :to="{ name: 'doc', params: { locale: activeLocale } }">{{ copy.secondary }}</RouterLink>
        </div>

        <ul class="hero-proof-list">
          <li v-for="item in copy.bullets" :key="item">{{ item }}</li>
        </ul>
      </div>

      <aside class="hero-panel hero-panel-dark card reveal fade-in">
        <p class="tile-kicker">{{ copy.panelTitle }}</p>
        <p class="mono panel-line">{{ copy.panelLineA }}</p>
        <p class="mono panel-line">{{ copy.panelLineB }}</p>
        <p class="mono panel-line">{{ copy.panelLineC }}</p>
        <p class="panel-note">{{ copy.panelFoot }}</p>
      </aside>
    </div>
  </section>
</template>
