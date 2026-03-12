<script setup>
import { computed } from 'vue'
import { useLocale } from '../composables/useLocale'

const { locale } = useLocale()

const copy = computed(() => {
  if (locale.value === 'ja') {
    return {
      eyebrow: 'アーキテクチャ',
      title: '実行スタック内の認可レイヤー',
      stack: ['意思決定提案', '実行時認可 (ClearanceGate)', '実行インフラ'],
      cards: [
        { kicker: 'Layer 1', title: 'ポリシーエンジン', body: '明示制約とリスクフラグを評価。' },
        { kicker: 'Layer 2', title: '認可カーネル', body: '決定論的遷移と単一結果を強制。' },
        { kicker: 'Layer 3', title: '監査証跡レイヤー', body: '非ブロック経路の再構成可能証跡を生成。' },
      ],
    }
  }

  return {
    eyebrow: 'Architecture',
    title: 'Authorization Layer In The Execution Stack',
    stack: ['Decision Proposal', 'Runtime Authorization (ClearanceGate)', 'Execution Infrastructure'],
    cards: [
      { kicker: 'Layer 1', title: 'Policy Engine', body: 'Evaluates explicit constraints and risk flags.' },
      { kicker: 'Layer 2', title: 'Authorization Kernel', body: 'Enforces deterministic transitions and single-outcome semantics.' },
      { kicker: 'Layer 3', title: 'Audit Evidence Layer', body: 'Produces reconstructable evidence for every non-blocked path.' },
    ],
  }
})
</script>

<template>
  <section class="section reveal fade-up">
    <div class="section-head">
      <p class="eyebrow">{{ copy.eyebrow }}</p>
      <h2>{{ copy.title }}</h2>
    </div>
    <div class="card stack-card">
      <div class="stack-row">{{ copy.stack[0] }}</div>
      <div class="stack-row active">{{ copy.stack[1] }}</div>
      <div class="stack-row">{{ copy.stack[2] }}</div>
    </div>
    <div class="three-grid compact-grid">
      <article v-for="item in copy.cards" :key="item.title" class="card reveal fade-in">
        <p class="tile-kicker">{{ item.kicker }}</p>
        <h3>{{ item.title }}</h3>
        <p>{{ item.body }}</p>
      </article>
    </div>
  </section>
</template>

