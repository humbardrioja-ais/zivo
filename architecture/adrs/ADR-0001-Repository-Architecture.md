# ADR-0001: Repository Architecture

## Status

Accepted

## Date

2026-06-27

## Context

Zivo OS is an enterprise work management platform requiring web and mobile applications, shared domain logic, multiple backend services, and supporting infrastructure. The team needs a repository structure that scales with the product and enforces clear boundaries between domains.

## Decision

Adopt a DDD-aligned monorepo with the following top-level structure:

- **apps/** — Deployable client applications (web, mobile), each with domain-specific UI modules and a widget architecture.
- **packages/** — Shared libraries including `domain-core` (pure domain entities and interfaces), `ui` (component library), `widget-sdk`, `shared` utilities, and `config`.
- **services/** — Backend services: `api` (primary gateway), `ai`, `automation-engine`, and `storage` (with policy-based governance).
- **database/** — Centralized migrations, seeds, and canonical schema definitions.
- **docs/** — Separated into `product/` (PRDs, roadmap) and `engineering/` (developer guides, runbooks).
- **architecture/** — ADRs, RFCs, and system diagrams at the top level for high visibility.
- **design/** — Design tokens, brand assets, and UX guidelines.
- **infra/** — Docker, CI/CD, IaC, and monitoring configuration.
- **tests/** — Cross-service E2E, load, and contract tests.
- **.ai/** — AI project memory, prompt templates, and agent configurations.

## Consequences

- Each bounded context is a vertical slice across `domain-core`, app domains, and API domains.
- Teams must keep the three domain layers in sync; `domain-core` is the source of truth.
- Adding a new domain requires creating the module in all three layers.
- The widget architecture supports future extensibility via `widget-sdk`.
