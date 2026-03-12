<script setup>
import { computed } from 'vue'
import { useLocale } from '../composables/useLocale'

const emit = defineEmits(['jump'])
const { locale } = useLocale()

const copy = computed(() => {
  if (locale.value === 'ja') {
    return {
      eyebrow: '実行時認可インフラ',
      titleA: '認可を',
      titleB: '実行前に',
      body: 'ClearanceGate は実行可否のみを判定します。意思決定の生成や予測は行いません。',
      points: ['決定論', 'Fail-Closed', '監査可能'],
      ctaPrimary: '中核保証を見る',
      ctaSecondary: '憲章を読む',
      quote: '判断が安くなるほど、認可の価値は高くなる。',
      panelKicker: '認可プレビュー',
      panelTitle: '意思決定提案',
      panelLine: 'AI/Operator Signal -> ClearanceGate',
      panelNote: '単一結果。明示責任。監査証跡を付与。',
    }
  }

  return {
    eyebrow: 'Runtime Authorization Infrastructure',
    titleA: 'Authorization',
    titleB: 'Before Execution',
    body: 'ClearanceGate enforces whether execution is authorized. It does not generate decisions or predictions.',
    points: ['Deterministic', 'Fail-Closed', 'Auditable'],
    ctaPrimary: 'Core Guarantees',
    ctaSecondary: 'Read Constitution',
    quote: 'When decisions become cheap, authorization becomes priceless.',
    panelKicker: 'Live Authorization Preview',
    panelTitle: 'Decision Proposal',
    panelLine: 'AI/Operator Signal -> ClearanceGate',
    panelNote: 'Single outcome. Explicit responsibility. Audit evidence attached.',
  }
})
</script>

<template>
  <section class="hero reveal fade-up">
    <div class="hero-grid">
      <div class="hero-main">
        <p class="eyebrow">{{ copy.eyebrow }}</p>
        <h1>
          {{ copy.titleA }}
          <span class="hero-gradient">{{ copy.titleB }}</span>
        </h1>
        <p class="hero-copy">{{ copy.body }}</p>
        <div class="hero-inline-points">
          <span v-for="point in copy.points" :key="point">{{ point }}</span>
        </div>
        <div class="hero-actions">
          <button class="btn btn-primary" type="button" @click="emit('jump', 'core-guarantees')">{{ copy.ctaPrimary }}</button>
          <RouterLink class="btn btn-ghost" :to="{ name: 'doc', params: { slug: 'constitution' } }">{{ copy.ctaSecondary }}</RouterLink>
        </div>
        <p class="hero-quote">{{ copy.quote }}</p>
      </div>

      <aside class="hero-panel card reveal fade-in">
        <p class="tile-kicker">{{ copy.panelKicker }}</p>
        <h3>{{ copy.panelTitle }}</h3>
        <p class="mono panel-line">{{ copy.panelLine }}</p>
        <div class="panel-outcomes">
          <span class="outcome good">PROCEED</span>
          <span class="outcome bad">BLOCK</span>
          <span class="outcome warn">REQUIRE_ACK</span>
          <span class="outcome muted">DEGRADE</span>
        </div>
        <p class="panel-note">{{ copy.panelNote }}</p>
      </aside>
    </div>
  </section>
</template>

