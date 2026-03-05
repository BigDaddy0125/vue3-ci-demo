<script setup>
const states = [
  { id: 'INIT', x: 90, y: 130, kind: 'neutral' },
  { id: 'INFO_INSUFFICIENT', x: 290, y: 65, kind: 'risk' },
  { id: 'RISK_FLAGGED', x: 290, y: 130, kind: 'risk' },
  { id: 'AWAITING_ACK', x: 290, y: 195, kind: 'risk' },
  { id: 'AUTHORIZED', x: 520, y: 65, kind: 'good' },
  { id: 'BLOCKED', x: 520, y: 130, kind: 'bad' },
  { id: 'DEGRADED', x: 520, y: 195, kind: 'warn' },
]

const transitions = [
  ['INIT', 'INFO_INSUFFICIENT'],
  ['INIT', 'RISK_FLAGGED'],
  ['INIT', 'AUTHORIZED'],
  ['INIT', 'DEGRADED'],
  ['INFO_INSUFFICIENT', 'BLOCKED'],
  ['INFO_INSUFFICIENT', 'DEGRADED'],
  ['RISK_FLAGGED', 'AWAITING_ACK'],
  ['RISK_FLAGGED', 'BLOCKED'],
  ['RISK_FLAGGED', 'DEGRADED'],
  ['AWAITING_ACK', 'AUTHORIZED'],
  ['AWAITING_ACK', 'BLOCKED'],
  ['AWAITING_ACK', 'DEGRADED'],
  ['DEGRADED', 'BLOCKED'],
]

const byId = Object.fromEntries(states.map((s) => [s.id, s]))
</script>

<template>
  <section class="section reveal fade-up">
    <div class="section-head">
      <p class="eyebrow">State Machine</p>
      <h2>Deterministic Authorization State Machine</h2>
    </div>
    <div class="card machine-wrap">
      <svg viewBox="0 0 640 265" class="machine-svg" role="img" aria-label="ClearanceGate authorization state machine">
        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 z" fill="currentColor" />
          </marker>
        </defs>
        <g class="machine-links">
          <line
            v-for="(t, idx) in transitions"
            :key="`${t[0]}-${t[1]}`"
            :x1="byId[t[0]].x + 50"
            :y1="byId[t[0]].y + 18"
            :x2="byId[t[1]].x - 12"
            :y2="byId[t[1]].y + 18"
            :style="{ '--delay': `${idx * 90}ms` }"
            marker-end="url(#arrow)"
          />
        </g>
        <g class="machine-nodes">
          <g v-for="state in states" :key="state.id" :class="['machine-node', state.kind]">
            <rect :x="state.x - 46" :y="state.y" rx="9" ry="9" width="98" height="36" />
            <text :x="state.x + 2" :y="state.y + 23">{{ state.id }}</text>
          </g>
        </g>
      </svg>
      <p class="mono machine-note">Outcomes: AUTHORIZED→PROCEED · BLOCKED/INFO_INSUFFICIENT/RISK_FLAGGED→BLOCK · AWAITING_ACK→REQUIRE_ACK · DEGRADED→DEGRADE</p>
    </div>
  </section>
</template>

