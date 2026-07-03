# AGENTS.md

## Project Context

This project uses Nuxt 3, Vue 3, TypeScript, Tailwind CSS, and Nuxt UI.

Follow the existing code structure, naming conventions, and component style in this repository. Prioritize consistency with the current codebase over introducing new patterns.

## Tech Stack

- Nuxt 3
- Vue 3
- TypeScript
- `<script setup lang="ts">`
- Tailwind CSS
- Nuxt UI components
- Nuxt Image where image optimization is needed

## General Rules

- Use Vue Composition API with `<script setup lang="ts">`.
- Always use TypeScript.
- Follow the existing folder structure.
- Do not introduce new libraries unless explicitly requested.
- Do not change unrelated files.
- Keep changes focused on the requested task.
- Prefer readable and maintainable code over overly clever solutions.
- Reuse existing utilities, constants, components, composables, and types when available.
- Do not duplicate logic if a helper already exists.
- Match the current coding style, formatting, and naming conventions.

## Vue / Nuxt Guidelines

- Use `ref`, `computed`, and `watch` only when needed.
- Use `defineProps` and `defineEmits` with TypeScript types.
- Prefer typed props over `any`.
- Avoid `any` unless there is no practical alternative.
- Use Nuxt auto-imports where already used in the project.
- Use `useFetch`, `useAsyncData`, or existing repository/composable patterns according to the current project style.
- Use `useRuntimeConfig()` for public runtime values such as base image URLs or API URLs.
- Use `NuxtLink` for internal navigation.
- Use `NuxtImg` for images when the project already uses it.
- For dynamic HTML rendering, use `v-html` carefully and only with trusted/sanitized content.

## Styling Guidelines

- Use Tailwind CSS utility classes.
- Follow existing spacing, color, border, radius, and shadow patterns.
- Keep responsive design in mind.
- Use mobile-first responsive classes.
- Prefer:
  - `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
  - `flex flex-col sm:flex-row`
  - `px-4 md:px-6 lg:px-8`
- Use existing theme colors such as `primary`, `muted`, or project-defined colors.
- Do not hardcode new colors unless consistent with the existing design.
- For rich HTML content, use Tailwind Typography with `prose` classes when available.

## Folder Structure Rules

Always follow the existing folder structure in this Nuxt project.

Before creating a new file:

- Check whether a similar feature, page, component, composable, type, or constant already exists.
- Place new files near related existing files.
- Do not create a new folder pattern if the project already has one.
- Do not move files unless explicitly requested.
