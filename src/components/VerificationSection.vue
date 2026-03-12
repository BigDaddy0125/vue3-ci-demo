<script setup>
import { computed } from 'vue'
import { useLocale } from '../composables/useLocale'

const { locale } = useLocale()

const copy = computed(() => {
  if (locale.value === 'ja') {
    return {
      eyebrow: '形式検証',
      title: '検証範囲は予測ではなく構造に限定',
      inScope: '対象内',
      outScope: '対象外',
      inItems: ['状態遷移', '相互排他性', '結果全域性', 'Fail-Closed 到達可能性', '監査到達可能性'],
      outItems: ['意思決定の正しさ', 'リスク推定精度', 'ドメイン知識の妥当性', '外部システム挙動'],
    }
  }

  return {
    eyebrow: 'Formal Verification',
    title: 'Verification Scope Is Structural, Not Predictive',
    inScope: 'In Scope',
    outScope: 'Out Of Scope',
    inItems: ['State transitions', 'Mutual exclusivity', 'Outcome totality', 'Fail-closed reachability', 'Auditability reachability'],
    outItems: ['Decision correctness', 'Risk estimation accuracy', 'Domain expertise validity', 'External system behavior'],
  }
})
</script>

<template>
  <section class="section reveal fade-up">
    <div class="section-head">
      <p class="eyebrow">{{ copy.eyebrow }}</p>
      <h2>{{ copy.title }}</h2>
    </div>
    <div class="split-grid compact-grid">
      <article class="card">
        <p class="tile-kicker">{{ copy.inScope }}</p>
        <h3>{{ copy.inScope }}</h3>
        <div class="chip-list">
          <span v-for="item in copy.inItems" :key="item" class="chip">{{ item }}</span>
        </div>
      </article>
      <article class="card">
        <p class="tile-kicker">{{ copy.outScope }}</p>
        <h3>{{ copy.outScope }}</h3>
        <div class="chip-list">
          <span v-for="item in copy.outItems" :key="item" class="chip chip-muted">{{ item }}</span>
        </div>
      </article>
    </div>
  </section>
</template>

