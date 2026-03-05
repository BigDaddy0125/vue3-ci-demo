<script setup>
import ArchitectureSection from '../components/ArchitectureSection.vue'
import GuaranteesSection from '../components/GuaranteesSection.vue'
import HeroSection from '../components/HeroSection.vue'
import PricingSection from '../components/PricingSection.vue'
import StateMachine from '../components/StateMachine.vue'
import VerificationSection from '../components/VerificationSection.vue'
import { docsNav } from '../docs/nav'
import { useReveal } from '../composables/useReveal'

useReveal('.reveal')

const useCases = [
  {
    title: 'Quantitative Finance',
    text: 'Strategy go-live, pause, and kill authorization paths for accountable execution.',
  },
  {
    title: 'Enterprise IT Ops',
    text: 'Deployment and change gates for CI/CD and production operations.',
  },
  {
    title: 'Industrial Automation',
    text: 'Action-level authorization in high-accountability machine workflows.',
  },
]
</script>

<template>
  <div class="site">
    <div class="bg-grid" aria-hidden="true"></div>
    <div class="bg-orb orb-a" aria-hidden="true"></div>
    <div class="bg-orb orb-b" aria-hidden="true"></div>

    <header class="topbar reveal fade-in">
      <div class="brand">ClearanceGate</div>
      <RouterLink class="top-cta" :to="{ name: 'doc', params: { slug: 'constitution' } }">Docs</RouterLink>
    </header>

    <main>
      <HeroSection />

      <section class="section reveal fade-up">
        <div class="section-head">
          <p class="eyebrow">Problem</p>
          <h2>Execution Speed Increased, Authorization Did Not</h2>
        </div>
        <div class="card">
          <p>
            AI and automation make decisions and actions cheap, fast, and high-volume.
            Authorization boundaries remain fragmented, manual, and post-incident.
            ClearanceGate closes this liability gap with deterministic pre-execution authorization.
          </p>
        </div>
      </section>

      <section class="section reveal fade-up">
        <div class="section-head">
          <p class="eyebrow">Solution</p>
          <h2>Explicit Authorization Layer</h2>
        </div>
        <div class="card mono">
          Decision Proposal → ClearanceGate Authorization → PROCEED | BLOCK | REQUIRE_ACK | DEGRADE
        </div>
      </section>

      <GuaranteesSection />
      <StateMachine />
      <ArchitectureSection />
      <VerificationSection />

      <section class="section reveal fade-up">
        <div class="section-head">
          <p class="eyebrow">Use Cases</p>
          <h2>High-Accountability Environments</h2>
        </div>
        <div class="three-grid">
          <article
            v-for="(item, idx) in useCases"
            :key="item.title"
            class="card reveal fade-up"
            :style="{ '--reveal-delay': `${idx * 90}ms` }"
          >
            <h3>{{ item.title }}</h3>
            <p>{{ item.text }}</p>
          </article>
        </div>
      </section>

      <PricingSection />

      <section class="section reveal fade-up">
        <div class="section-head">
          <p class="eyebrow">Docs</p>
          <h2>Whitepaper & Operational Documentation</h2>
        </div>
        <div class="three-grid">
          <RouterLink
            v-for="(doc, idx) in docsNav"
            :key="doc.slug"
            class="card card-link reveal fade-up"
            :style="{ '--reveal-delay': `${idx * 70}ms` }"
            :to="{ name: 'doc', params: { slug: doc.slug } }"
          >
            <h3>{{ doc.title }}</h3>
            <p class="mono">/docs/{{ doc.slug }}</p>
          </RouterLink>
        </div>
      </section>
    </main>
  </div>
</template>

