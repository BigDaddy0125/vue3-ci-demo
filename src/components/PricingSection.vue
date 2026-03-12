<script setup>
import { computed } from 'vue'
import { useLocale } from '../composables/useLocale'

const { locale } = useLocale()

const copy = computed(() => {
  if (locale.value === 'ja') {
    return {
      eyebrow: '価格',
      title: '価値ベースのインフラライセンス',
      flow: ['有償パイロット', '組み込み導入', '年次更新'],
      cards: [
        {
          kicker: 'Unit',
          title: 'ライセンス単位',
          body: 'API 回数や席数ではなく Authorization Domain 単位で課金。',
        },
        {
          kicker: 'Moat',
          title: '商流',
          body: 'パイロットから埋め込み導入を経て、年契約の更新へ移行。',
        },
        {
          kicker: 'Add-On',
          title: 'オプションサービス',
          body: '監査・コンプライアンス対応の実装支援を追加可能。',
        },
      ],
    }
  }

  return {
    eyebrow: 'Pricing',
    title: 'Value-Based Infrastructure Licensing',
    flow: ['Paid Pilot', 'Embedded Deployment', 'Annual Renewal'],
    cards: [
      {
        kicker: 'Unit',
        title: 'License Unit',
        body: 'Per Authorization Domain, not per API call, seat, or model usage.',
      },
      {
        kicker: 'Moat',
        title: 'Commercial Motion',
        body: 'Paid pilot to embedded deployment to annual enterprise renewal.',
      },
      {
        kicker: 'Add-On',
        title: 'Optional Services',
        body: 'Compliance and audit enablement for governance-ready deployments.',
      },
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
    <div class="pricing-flow card">
      <div class="flow-step">{{ copy.flow[0] }}</div>
      <div class="flow-arrow">-></div>
      <div class="flow-step">{{ copy.flow[1] }}</div>
      <div class="flow-arrow">-></div>
      <div class="flow-step">{{ copy.flow[2] }}</div>
    </div>
    <div class="three-grid compact-grid">
      <article v-for="item in copy.cards" :key="item.title" class="card">
        <p class="tile-kicker">{{ item.kicker }}</p>
        <h3>{{ item.title }}</h3>
        <p>{{ item.body }}</p>
      </article>
    </div>
  </section>
</template>

