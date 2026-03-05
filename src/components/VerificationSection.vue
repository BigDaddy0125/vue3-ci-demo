<template>
  <section class="section reveal fade-up">
    <div class="section-head">
      <p class="eyebrow">Formal Verification</p>
      <h2>Verification Scope Is Structural, Not Predictive</h2>
    </div>
    <div class="split-grid">
      <article class="card">
        <h3>In Scope</h3>
        <ul>
          <li>State transition correctness</li>
          <li>Mutual exclusivity and outcome totality</li>
          <li>Fail-closed reachability constraints</li>
          <li>Auditability reachability for PROCEED / REQUIRE_ACK paths</li>
        </ul>
      </article>
      <article class="card">
        <h3>Out Of Scope</h3>
        <ul>
          <li>Decision correctness and optimization</li>
          <li>Risk estimation accuracy</li>
          <li>Domain expert validity</li>
          <li>External execution system behavior</li>
        </ul>
      </article>
    </div>
  </section>
</template>

