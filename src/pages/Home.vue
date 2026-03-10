<script setup>
import ArchitectureSection from '../components/ArchitectureSection.vue'
import GuaranteesSection from '../components/GuaranteesSection.vue'
import HeroSection from '../components/HeroSection.vue'
import PricingSection from '../components/PricingSection.vue'
import StateMachine from '../components/StateMachine.vue'
import VerificationSection from '../components/VerificationSection.vue'
import { docsNav } from '../docs/nav'
import { useReveal } from '../composables/useReveal'
import { useSeo } from '../composables/useSeo'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import authorizationFlow from '../assets/authorization-flow.svg'
import auditEvidence from '../assets/audit-evidence.svg'
import verificationScope from '../assets/verification-scope.svg'
import usecaseFinance from '../assets/usecase-finance.svg'
import usecaseItops from '../assets/usecase-itops.svg'
import usecaseIndustrial from '../assets/usecase-industrial.svg'

useReveal('.reveal')
useSeo({
  title: 'Deterministic Authorization Infrastructure',
  description:
    'ClearanceGate enforces deterministic authorization before execution with fail-closed behavior, explicit responsibility, and auditability by construction.',
  path: '/',
  type: 'website',
})
const scrollProgress = ref(0)

const updateScrollProgress = () => {
  const doc = document.documentElement
  const max = doc.scrollHeight - doc.clientHeight
  if (max <= 0) {
    scrollProgress.value = 0
    return
  }
  scrollProgress.value = Math.min(1, Math.max(0, doc.scrollTop / max))
}

onMounted(() => {
  updateScrollProgress()
  window.addEventListener('scroll', updateScrollProgress, { passive: true })
  window.addEventListener('resize', updateScrollProgress)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateScrollProgress)
  window.removeEventListener('resize', updateScrollProgress)
})

const scrollToSection = (id) => {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const useCases = [
  {
    title: 'Quantitative Finance',
    text: 'Go-live, pause, and kill-switch authorization.',
    image: usecaseFinance,
    alt: 'Quantitative finance authorization illustration',
  },
  {
    title: 'Enterprise IT Ops',
    text: 'Deployment and change gates for CI/CD operations.',
    image: usecaseItops,
    alt: 'Enterprise IT operations authorization illustration',
  },
  {
    title: 'Industrial Automation',
    text: 'Action-level clearance in high-accountability workflows.',
    image: usecaseIndustrial,
    alt: 'Industrial automation clearance illustration',
  },
]

const valuePoints = [
  'Deterministic authorization output',
  'Fail-closed under uncertainty',
  'Audit trail by construction',
]

const proofStats = [
  { value: '7', label: 'Authorization states' },
  { value: '4', label: 'Deterministic outcomes' },
  { value: '100%', label: 'Fail-closed by design' },
  { value: '8', label: 'Core docs published' },
]

const visualCards = [
  { title: 'Authorization Flow', image: authorizationFlow, alt: 'Authorization flow diagram' },
  { title: 'Audit Evidence Chain', image: auditEvidence, alt: 'Audit evidence timeline diagram' },
  { title: 'Verification Boundary', image: verificationScope, alt: 'Formal verification scope diagram' },
]
</script>

<template>
  <div class="site">
    <div class="scroll-progress" :style="{ transform: `scaleX(${scrollProgress})` }"></div>
    <div class="bg-grid" aria-hidden="true"></div>
    <div class="bg-orb orb-a" aria-hidden="true"></div>
    <div class="bg-orb orb-b" aria-hidden="true"></div>

    <header class="topbar reveal fade-in">
      <div class="brand">ClearanceGate</div>
      <div class="top-nav">
        <button class="top-cta top-link-btn" type="button" @click="scrollToSection('value')">Value</button>
        <button class="top-cta top-link-btn" type="button" @click="scrollToSection('how')">How</button>
        <button class="top-cta top-link-btn" type="button" @click="scrollToSection('features')">Features</button>
        <button class="top-cta top-link-btn" type="button" @click="scrollToSection('proof')">Proof</button>
        <RouterLink class="top-cta" :to="{ name: 'doc', params: { slug: 'constitution' } }">Docs</RouterLink>
        <RouterLink class="top-cta" :to="{ name: 'doc', params: { slug: 'enterprise-guide' } }">Pilot</RouterLink>
      </div>
    </header>

    <main>
      <HeroSection @jump="scrollToSection" />

      <section id="value" class="section reveal fade-up">
        <div class="section-head">
          <p class="eyebrow">Value</p>
          <h2>From Implicit Permission To Explicit Authorization</h2>
        </div>
        <div class="metrics-strip reveal fade-in">
          <article v-for="item in proofStats" :key="item.label" class="metric-item">
            <p class="metric-value">{{ item.value }}</p>
            <p class="metric-label">{{ item.label }}</p>
          </article>
        </div>
        <div class="three-grid compact-grid">
          <article
            v-for="(point, idx) in valuePoints"
            :key="point"
            class="card value-card reveal fade-up"
            :style="{ '--reveal-delay': `${idx * 80}ms` }"
          >
            <p>{{ point }}</p>
          </article>
        </div>
      </section>

      <section id="how" class="section reveal fade-up">
        <div class="section-head">
          <p class="eyebrow">How It Works</p>
          <h2>Authorization Layer Before Execution</h2>
        </div>
        <div class="card mono">
          Decision Proposal -> ClearanceGate Authorization -> PROCEED | BLOCK | REQUIRE_ACK | DEGRADE
        </div>
      </section>

      <section class="section reveal fade-up">
        <div class="section-head">
          <p class="eyebrow">Visuals</p>
          <h2>Core Model At A Glance</h2>
        </div>
        <div class="three-grid visuals-grid">
          <article
            v-for="(item, idx) in visualCards"
            :key="item.title"
            class="card visual-card reveal fade-up"
            :style="{ '--reveal-delay': `${idx * 85}ms` }"
          >
            <img class="visual-image" :src="item.image" :alt="item.alt" loading="lazy" />
            <h3>{{ item.title }}</h3>
          </article>
        </div>
      </section>

      <GuaranteesSection />
      <StateMachine />
      <ArchitectureSection />
      <VerificationSection />

      <section id="features" class="section reveal fade-up">
        <div class="section-head">
          <p class="eyebrow">Features</p>
          <h2>High-Accountability Environments</h2>
        </div>
        <div class="three-grid">
          <article
            v-for="(item, idx) in useCases"
            :key="item.title"
            class="card reveal fade-up feature-card"
            :style="{ '--reveal-delay': `${idx * 90}ms` }"
          >
            <img class="feature-image" :src="item.image" :alt="item.alt" loading="lazy" />
            <h3>{{ item.title }}</h3>
            <p>{{ item.text }}</p>
          </article>
        </div>
      </section>

      <PricingSection />

      <section id="proof" class="section reveal fade-up">
        <div class="section-head">
          <p class="eyebrow">Proof</p>
          <h2>Documentation Backed Product Claims</h2>
        </div>
        <div class="three-grid compact-grid">
          <RouterLink
            v-for="(doc, idx) in docsNav.slice(0, 4)"
            :key="doc.slug"
            class="card card-link reveal fade-up"
            :style="{ '--reveal-delay': `${idx * 70}ms` }"
            :to="{ name: 'doc', params: { slug: doc.slug } }"
          >
            <h3>{{ doc.title }}</h3>
            <p class="mono">/docs/{{ doc.slug }}</p>
          </RouterLink>
        </div>
        <div class="proof-actions">
          <RouterLink class="btn btn-ghost" :to="{ name: 'doc' }">View All Docs</RouterLink>
        </div>
      </section>

      <section class="section reveal fade-up">
        <div class="card cta-block">
          <p class="eyebrow">CTA</p>
          <h2>Need A Pilot-Ready Authorization Boundary?</h2>
          <div class="hero-actions">
            <RouterLink class="btn btn-primary" :to="{ name: 'doc', params: { slug: 'enterprise-guide' } }">
              Start Enterprise Pilot
            </RouterLink>
            <RouterLink class="btn btn-ghost" :to="{ name: 'doc', params: { slug: 'api' } }">
              Review API
            </RouterLink>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>
