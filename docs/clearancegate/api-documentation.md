# ClearanceGate API Documentation

- Source: <https://www.notion.so/2e9adcdd14e180dea077d90588b2d607>
- Snapshot date: `2026-03-13`

## Endpoints

- `POST /authorize`
- `POST /acknowledge`
- `GET /audit/{decision_id}`
- Responses always include a deterministic authorization outcome and evidence reference.

## Request Semantics

- Each request requires `request_id`, `decision_id`, `profile`, `action`, `context`, `responsibility`, and source metadata.
- `request_id` must be unique to ensure idempotency and replay safety.

## Operational Semantics

- Identical inputs under the same rule version produce the same authorization outcome.
- Internal errors never authorize execution and remain fail-closed.
