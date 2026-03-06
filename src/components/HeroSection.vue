<script setup>
const emit = defineEmits(['jump'])
</script>

<template>
  <section class="hero reveal fade-up">
    <div class="hero-grid">
      <div class="hero-main">
        <p class="eyebrow">Runtime Authorization Infrastructure</p>
        <h1>
          Authorization
          <span class="hero-gradient">Before Execution</span>
        </h1>
        <p class="hero-copy">
          ClearanceGate enforces whether execution is authorized. It does not generate decisions or predictions.
        </p>
        <div class="hero-inline-points">
          <span>Deterministic</span>
          <span>Fail-Closed</span>
          <span>Auditable</span>
        </div>
        <div class="hero-actions">
          <button class="btn btn-primary" type="button" @click="emit('jump', 'core-guarantees')">Core Guarantees</button>
          <RouterLink class="btn btn-ghost" :to="{ name: 'doc', params: { slug: 'constitution' } }">Read Constitution</RouterLink>
        </div>
        <p class="hero-quote">When decisions become cheap, authorization becomes priceless.</p>
      </div>

      <aside class="hero-panel card reveal fade-in">
        <p class="tile-kicker">Live Authorization Preview</p>
        <h3>Decision Proposal</h3>
        <p class="mono panel-line">AI/Operator Signal -> ClearanceGate</p>
        <div class="panel-outcomes">
          <span class="outcome good">PROCEED</span>
          <span class="outcome bad">BLOCK</span>
          <span class="outcome warn">REQUIRE_ACK</span>
          <span class="outcome muted">DEGRADE</span>
        </div>
        <p class="panel-note">Single outcome. Explicit responsibility. Audit evidence attached.</p>
      </aside>
    </div>
  </section>
</template>
