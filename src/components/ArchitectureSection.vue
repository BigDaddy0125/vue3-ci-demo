<template>
  <section class="section reveal fade-up">
    <div class="section-head">
      <p class="eyebrow">Architecture</p>
      <h2>Authorization Layer In The Execution Stack</h2>
    </div>
    <div class="card stack-card">
      <div class="stack-row">Decision Proposal (Human / AI / System)</div>
      <div class="stack-row active">Runtime Authorization (ClearanceGate)</div>
      <div class="stack-row">Execution Infrastructure</div>
    </div>
    <div class="three-grid">
      <article class="card reveal fade-in">
        <h3>Policy Engine</h3>
        <p>Evaluates explicit declared constraints and risk flags.</p>
      </article>
      <article class="card reveal fade-in">
        <h3>Authorization Kernel</h3>
        <p>Enforces deterministic state transitions and single outcome semantics.</p>
      </article>
      <article class="card reveal fade-in">
        <h3>Audit Evidence Layer</h3>
        <p>Produces reconstructable records for every non-blocked authorization path.</p>
      </article>
    </div>
  </section>
</template>

