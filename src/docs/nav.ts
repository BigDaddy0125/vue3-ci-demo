export const docsNav = [
  { slug: 'constitution', title: 'System Constitution' },
  { slug: 'state-machine', title: 'State Machine & Invariants' },
  { slug: 'formal-verification', title: 'Formal Verification Scope' },
  { slug: 'architecture', title: 'Technical Architecture' },
  { slug: 'api', title: 'API Documentation' },
  { slug: 'security', title: 'Security Compliance Report' },
  { slug: 'enterprise-guide', title: 'Enterprise Implementation Guide' },
  { slug: 'pricing', title: 'Pricing Logic' },
]

export const docsContent = {
  constitution: {
    title: 'ClearanceGate System Constitution',
    sections: [
      {
        heading: 'Purpose',
        body: [
          'ClearanceGate is a formal authorization system that decides whether execution is authorized under explicit constraints.',
          'It does not decide what action should be taken and does not replace expert decision-makers.',
        ],
      },
      {
        heading: 'Constitutional Guarantees',
        body: [
          'Deterministic authorization outcome for each valid input.',
          'Mutual exclusivity of outcomes and fail-closed behavior under uncertainty.',
          'Auditability as a system invariant with reconstructable records.',
        ],
      },
      {
        heading: 'Boundary',
        body: [
          'ClearanceGate guarantees structural correctness, not outcome correctness.',
          'External systems remain responsible for input quality, execution behavior, and domain decisions.',
        ],
      },
    ],
  },
  'state-machine': {
    title: 'Clearance State Machine & Invariants',
    sections: [
      {
        heading: 'States',
        body: [
          'INIT, INFO_INSUFFICIENT, RISK_FLAGGED, AWAITING_ACK, AUTHORIZED, BLOCKED, DEGRADED.',
          'Each decision instance exists in exactly one state at any moment.',
        ],
      },
      {
        heading: 'Outcome Mapping',
        body: [
          'AUTHORIZED→PROCEED, AWAITING_ACK→REQUIRE_ACK.',
          'INFO_INSUFFICIENT/RISK_FLAGGED/BLOCKED→BLOCK, DEGRADED→DEGRADE.',
        ],
      },
      {
        heading: 'Invariants',
        body: [
          'Mutual exclusivity and outcome totality.',
          'Fail-closed authorization under uncertainty.',
          'Acknowledgment cannot override non-overridable constraints.',
        ],
      },
    ],
  },
  'formal-verification': {
    title: 'Formal Verification Scope',
    sections: [
      {
        heading: 'Verification Target',
        body: [
          'The clearance authorization kernel: states, transitions, outcome mapping, invariants.',
          'Verification is structural and specification-level.',
        ],
      },
      {
        heading: 'In Scope',
        body: [
          'Mutual exclusivity, outcome totality, fail-closed behavior, auditability reachability.',
          'Constraint semantics and acknowledgment boundary enforcement.',
        ],
      },
      {
        heading: 'Out Of Scope',
        body: [
          'Decision correctness, risk estimation quality, model performance, physical-world outcomes.',
        ],
      },
    ],
  },
  architecture: {
    title: 'Technical Architecture',
    sections: [
      {
        heading: 'Core Components',
        body: [
          'Policy and constraint engine, state machine engine, authorization kernel, evidence generator.',
          'Kernel remains deterministic and profile-independent.',
        ],
      },
      {
        heading: 'Integration Boundary',
        body: [
          'ClearanceGate is placed immediately before execution.',
          'It exposes authorization APIs and evidence retrieval, not execution APIs.',
        ],
      },
    ],
  },
  api: {
    title: 'API Documentation',
    sections: [
      {
        heading: 'Endpoints',
        body: [
          'POST /authorize, POST /acknowledge, GET /audit/{decision_id}.',
          'Responses always contain a deterministic authorization outcome and evidence reference.',
        ],
      },
      {
        heading: 'Operational Semantics',
        body: [
          'Idempotent request_id handling and replay safety.',
          '500/internal errors never authorize execution and remain fail-closed.',
        ],
      },
    ],
  },
  security: {
    title: 'Security Compliance Report',
    sections: [
      {
        heading: 'Security Model',
        body: [
          'Governance-first security with explicit trust boundaries.',
          'Threats include unauthorized execution, bypass risk, and audit tampering.',
        ],
      },
      {
        heading: 'Evidence Integrity',
        body: [
          'Audit records are authorization-critical and must be preserved.',
          'Failure to persist evidence prevents authorization.',
        ],
      },
    ],
  },
  'enterprise-guide': {
    title: 'Enterprise Implementation Guide',
    sections: [
      {
        heading: 'Deployment Topologies',
        body: [
          'Inline gate (preferred), shadow mode for pilots, asynchronous token validation.',
          'No untracked bypass path is permitted in production mode.',
        ],
      },
      {
        heading: 'Operations',
        body: [
          'Monitor outcome distribution, degraded events, and missing information patterns.',
          'Any kernel-level semantic change requires explicit review and re-verification.',
        ],
      },
    ],
  },
  pricing: {
    title: 'Pricing Logic',
    sections: [
      {
        heading: 'Pricing Principle',
        body: [
          'ClearanceGate is priced as risk infrastructure, not usage software.',
          'License unit is authorization domain rather than calls, seats, or model usage.',
        ],
      },
      {
        heading: 'Commercial Dynamics',
        body: [
          'Paid pilots transition to embedded annual enterprise licenses.',
          'Optional compliance and audit enablement services support adoption.',
        ],
      },
    ],
  },
}

