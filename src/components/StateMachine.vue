<script setup>
import { computed, ref } from 'vue'
import { useLocale } from '../composables/useLocale'

const { locale } = useLocale()
const activeState = ref('INIT')

const stateRows = [
  { id: 'INIT', lane: 'entry', outcome: 'BLOCK_OR_ROUTE' },
  { id: 'INFO_INSUFFICIENT', lane: 'risk', outcome: 'BLOCK' },
  { id: 'RISK_FLAGGED', lane: 'risk', outcome: 'BLOCK' },
  { id: 'AWAITING_ACK', lane: 'review', outcome: 'REQUIRE_ACK' },
  { id: 'AUTHORIZED', lane: 'terminal', outcome: 'PROCEED' },
  { id: 'BLOCKED', lane: 'terminal', outcome: 'BLOCK' },
  { id: 'DEGRADED', lane: 'terminal', outcome: 'DEGRADE' },
]

const laneOrder = ['entry', 'risk', 'review', 'terminal']

const laneRows = computed(() => {
  const groups = Object.fromEntries(laneOrder.map((lane) => [lane, []]))
  for (const row of stateRows) {
    groups[row.lane].push(row)
  }
  return groups
})

const outcomeTone = {
  PROCEED: 'good',
  BLOCK: 'bad',
  REQUIRE_ACK: 'warn',
  DEGRADE: 'muted',
  BLOCK_OR_ROUTE: 'muted',
}

const copy = computed(() => {
  if (locale.value === 'ja') {
    return {
      eyebrow: '状態機械',
      title: '認可フロー（整形ビュー）',
      subtitle: '交差線図ではなく、状態群と結果マッピングを分離して表示',
      lanes: {
        entry: '入力状態',
        risk: 'リスク評価状態',
        review: '責任確認状態',
        terminal: '終端状態',
      },
      outcomeLabel: '結果',
      outcomes: {
        PROCEED: 'PROCEED',
        BLOCK: 'BLOCK',
        REQUIRE_ACK: 'REQUIRE_ACK',
        DEGRADE: 'DEGRADE',
        BLOCK_OR_ROUTE: 'BLOCK / 追加判定',
      },
      notes: [
        'AUTHORIZED -> PROCEED',
        'INFO_INSUFFICIENT / RISK_FLAGGED / BLOCKED -> BLOCK',
        'AWAITING_ACK -> REQUIRE_ACK',
        'DEGRADED -> DEGRADE',
      ],
    }
  }

  return {
    eyebrow: 'State Machine',
    title: 'Authorization Flow (Structured View)',
    subtitle: 'State lanes and outcome mapping, without crossing lines.',
    lanes: {
      entry: 'Entry State',
      risk: 'Risk Evaluation States',
      review: 'Responsibility Review State',
      terminal: 'Terminal States',
    },
    outcomeLabel: 'Outcome',
    outcomes: {
      PROCEED: 'PROCEED',
      BLOCK: 'BLOCK',
      REQUIRE_ACK: 'REQUIRE_ACK',
      DEGRADE: 'DEGRADE',
      BLOCK_OR_ROUTE: 'BLOCK / Route Further',
    },
    notes: [
      'AUTHORIZED -> PROCEED',
      'INFO_INSUFFICIENT / RISK_FLAGGED / BLOCKED -> BLOCK',
      'AWAITING_ACK -> REQUIRE_ACK',
      'DEGRADED -> DEGRADE',
    ],
  }
})
</script>

<template>
  <section id="state-machine" class="section section-tone-machine reveal fade-up">
    <div class="section-head">
      <p class="eyebrow">{{ copy.eyebrow }}</p>
      <h2>{{ copy.title }}</h2>
      <p class="machine-subtitle">{{ copy.subtitle }}</p>
    </div>

    <div class="card card-tint-blue machine-structured">
      <div v-for="lane in laneOrder" :key="lane" class="machine-lane">
        <p class="tile-kicker machine-lane-title">{{ copy.lanes[lane] }}</p>
        <div class="machine-lane-grid">
          <button
            v-for="row in laneRows[lane]"
            :key="row.id"
            type="button"
            class="machine-state-chip"
            :class="{ active: activeState === row.id }"
            @click="activeState = row.id"
          >
            <span class="mono">{{ row.id }}</span>
            <span class="machine-arrow">-></span>
            <span class="machine-outcome" :class="outcomeTone[row.outcome]">{{ copy.outcomes[row.outcome] }}</span>
          </button>
        </div>
      </div>

      <div class="machine-notes">
        <p class="tile-kicker">{{ copy.outcomeLabel }}</p>
        <ul>
          <li v-for="note in copy.notes" :key="note" class="mono">{{ note }}</li>
        </ul>
      </div>
    </div>
  </section>
</template>
