<script setup>
const guarantees = [
  'Deterministic authorization',
  'Fail-closed behavior under uncertainty',
  'Explicit responsibility acknowledgment',
  'Auditability by construction',
]

const nonClaims = [
  'No decision recommendation',
  'No prediction quality guarantee',
  'No domain correctness guarantee',
  'No risk elimination claim',
]
</script>

<template>
  <section id="core-guarantees" class="section reveal fade-up">
    <div class="section-head">
      <p class="eyebrow">Core</p>
      <h2>Core Guarantees</h2>
    </div>
    <div class="split-grid">
      <article class="card reveal fade-in">
        <h3>What ClearanceGate Guarantees</h3>
        <ul>
          <li v-for="item in guarantees" :key="item">{{ item }}</li>
        </ul>
      </article>
      <article class="card reveal fade-in">
        <h3>What ClearanceGate Does Not Guarantee</h3>
        <ul>
          <li v-for="item in nonClaims" :key="item">{{ item }}</li>
        </ul>
      </article>
    </div>
  </section>
</template>

