# Claude Code Project Configuration

## Project

Zivo OS — Enterprise Work Management Platform

## Architecture

- Monorepo with Domain-Driven Design
- Bounded contexts: projects, tasks, meetings, calendar, automations, notifications
- Domain logic shared via `packages/domain-core`
- Widget architecture with SDK for extensibility

## Conventions

- ADRs in `architecture/adrs/` using format `ADR-NNNN-Title.md`
- Product docs in `docs/product/`, engineering docs in `docs/engineering/`
- AI memory and context in `.ai/`
