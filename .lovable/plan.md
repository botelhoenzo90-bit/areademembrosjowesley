# Plan - 18 Princípios Journey Fix & Optimization

The user is reporting that changes to the journey systems are not reflecting. This plan focuses on fixing the state transitions in the "18 Princípios" (Treinamento Premium) and "Jornada do Herói Interior" (Reprogramação Mental) modules, ensuring progress is correctly tracked and UI updates are immediate.

## User Review Required

> [!IMPORTANT]
> The fixes involve structural changes to how navigation and state are handled between steps (Lesson -> Quiz -> Diagnosis -> Protocol).

- The "Próximo Princípio" button will now use internal navigation instead of a full page reload for better performance.
- Added debug logging to help identify why progress might be getting "stuck" for some users.
- Standardized navigation to use TanStack Router `params` for Archetypes to avoid route matching conflicts.

## Proposed Changes

### Treinamento Premium (18 Princípios)
- **Fix Navigation:** Replace `window.location.href` with TanStack Router `navigate` to maintain SPA state.
- **State Resilience:** Add defensive programming (optional chaining) to prevent crashes when data is partially loaded.
- **Completion Flow:** Ensure `handleCompleteProtocol` correctly updates local state and triggers the next principle's availability.

### Reprogramação Mental (Jornada do Herói Interior)
- **Archetype Navigation:** Update `reprogramacao-mental.tsx` to use `params` instead of template literals for route parameters, ensuring TanStack Router matches the route correctly.
- **State Initialization:** Refactor `archetype.$id.tsx` to use a `useEffect` for state initialization from `currentArchData`, preventing "stale" UI states when switching between archetypes.
- **Protocol Persistence:** Ensure protocol step updates are sent to the server immediately on click.

### General
- **Cache Invalidation:** The Vite dev server has been restarted to clear any lingering route or HMR cache.
- **Robustness:** Standardized how YouTube URLs are parsed to handle varied parameter formats.

## Technical Details

- **File Modifications:**
    - `src/routes/_authenticated/jornada.tsx`: Fix state machine transitions and navigation.
    - `src/routes/_authenticated/reprogramacao-mental.tsx`: Fix archetype card navigation.
    - `src/routes/_authenticated/hero-journey/archetype.$id.tsx`: Fix state sync with database data and protocol updates.
- **Data Flow:** All progress is persisted via `createServerFn` to Supabase.
