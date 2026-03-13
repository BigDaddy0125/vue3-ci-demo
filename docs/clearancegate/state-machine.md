# Clearance State Machine and Invariants

- Source: <https://www.notion.so/2e9adcdd14e18030886de03b32d9ac8f>
- Snapshot date: `2026-03-13`

## States

- `INIT`, `INFO_INSUFFICIENT`, `RISK_FLAGGED`, `AWAITING_ACK`, `AUTHORIZED`, `BLOCKED`, `DEGRADED`.
- Each decision instance exists in exactly one state at any moment.

## Outcome Mapping

- `AUTHORIZED -> PROCEED`, `AWAITING_ACK -> REQUIRE_ACK`.
- `INFO_INSUFFICIENT/RISK_FLAGGED/BLOCKED -> BLOCK`, `DEGRADED -> DEGRADE`.

## Invariants

- Mutual exclusivity and outcome totality.
- Fail-closed authorization under uncertainty.
- Acknowledgment cannot override non-overridable constraints.
