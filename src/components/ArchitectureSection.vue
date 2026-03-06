<template>
  <section class="section reveal fade-up">
    <div class="section-head">
      <p class="eyebrow">Architecture</p>
      <h2>Authorization Layer In The Execution Stack</h2>
    </div>
    <div class="card stack-card">
      <div class="stack-row">Decision Proposal</div>
      <div class="stack-row active">Runtime Authorization (ClearanceGate)</div>
      <div class="stack-row">Execution Infrastructure</div>
    </div>
    <div class="three-grid compact-grid">
      <article class="card reveal fade-in">
        <p class="tile-kicker">Layer 1</p>
        <h3>Policy Engine</h3>
        <p>Evaluates explicit constraints and risk flags.</p>
      </article>
      <article class="card reveal fade-in">
        <p class="tile-kicker">Layer 2</p>
        <h3>Authorization Kernel</h3>
        <p>Enforces deterministic transitions and single-outcome semantics.</p>
      </article>
      <article class="card reveal fade-in">
        <p class="tile-kicker">Layer 3</p>
        <h3>Audit Evidence Layer</h3>
        <p>Produces reconstructable evidence for every non-blocked path.</p>
      </article>
    </div>
  </section>
</template>

