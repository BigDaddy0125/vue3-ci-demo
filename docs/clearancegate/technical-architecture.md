# ClearanceGate Technical Architecture

- Source: <https://www.notion.so/2e9adcdd14e180c594d3f5a43bd48aee>
- Snapshot date: `2026-03-13`

## Core Components

- Policy and constraint engine, state machine engine, authorization kernel, evidence generator.
- The kernel remains deterministic and profile-independent.

## Integration Boundary

- ClearanceGate is placed immediately before execution.
- It exposes authorization APIs and evidence retrieval, not execution APIs.

## Deployment Topologies

- Inline gate for production control, shadow mode for evaluation, async pre-authorization for legacy execution systems.
- No unaudited bypass path should exist in blocking mode.
