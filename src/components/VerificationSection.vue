<template>
  <section class="section reveal fade-up">
    <div class="section-head">
      <p class="eyebrow">Formal Verification</p>
      <h2>Verification Scope Is Structural, Not Predictive</h2>
    </div>
    <div class="split-grid compact-grid">
      <article class="card">
        <p class="tile-kicker">In Scope</p>
        <h3>In Scope</h3>
        <div class="chip-list">
          <span class="chip">State transitions</span>
          <span class="chip">Mutual exclusivity</span>
          <span class="chip">Outcome totality</span>
          <span class="chip">Fail-closed reachability</span>
          <span class="chip">Auditability reachability</span>
        </div>
      </article>
      <article class="card">
        <p class="tile-kicker">Out Of Scope</p>
        <h3>Out Of Scope</h3>
        <div class="chip-list">
          <span class="chip chip-muted">Decision correctness</span>
          <span class="chip chip-muted">Risk estimation accuracy</span>
          <span class="chip chip-muted">Domain expertise validity</span>
          <span class="chip chip-muted">External system behavior</span>
        </div>
      </article>
    </div>
  </section>
</template>

