# Zivo OS

Enterprise Work Management Platform inspired by Asana with AI, Meetings, Calendar, Automation, and Enterprise Workflow.

## Repository Structure

```
zivo/
├── apps/           — Deployable applications (web, mobile)
├── packages/       — Shared libraries and domain logic
├── services/       — Backend services (API, AI engine, automation, storage)
├── database/       — Migrations, seeds, and schema definitions
├── docs/           — Product, engineering, module, and UX documentation
├── architecture/   — ADRs, RFCs, and system diagrams
├── design/         — Design tokens, assets, and brand guidelines
├── infra/          — Docker, CI/CD, IaC, and monitoring
├── tests/          — Cross-app E2E, load, and contract tests
└── .ai/            — AI project memory and agent configuration
```

## Architecture

This repository follows a **Domain-Driven Design (DDD)** monorepo architecture. Each bounded context (projects, tasks, meetings, calendar, automations, notifications) is represented as a vertical slice across the `packages/domain-core`, `apps/*/domains/`, and `services/api/domains/` layers.

See [architecture/SYSTEM_ARCHITECTURE.md](architecture/SYSTEM_ARCHITECTURE.md) for the full system overview and [architecture/adrs/](architecture/adrs/) for decision records.
