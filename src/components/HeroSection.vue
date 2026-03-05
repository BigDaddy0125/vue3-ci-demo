<template>
  <section class="hero reveal fade-up">
    <p class="eyebrow">Runtime Authorization Infrastructure</p>
    <h1>Authorization Before Execution</h1>
    <p class="hero-copy">
      ClearanceGate is an authorization kernel that sits between decision generation and execution.
      It does not generate decisions or predictions. It enforces explicit authorization.
    </p>
    <div class="hero-actions">
      <a class="btn btn-primary" href="#core-guarantees">Core Guarantees</a>
      <RouterLink class="btn btn-ghost" :to="{ name: 'doc', params: { slug: 'constitution' } }">Read Constitution</RouterLink>
    </div>
    <p class="hero-quote">“When decisions become cheap, authorization becomes priceless.”</p>
  </section>
</template>

