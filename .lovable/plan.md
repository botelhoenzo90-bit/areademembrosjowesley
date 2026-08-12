# Plan: Hero's Journey Interactive Experience

The user wants to verify and complete the "Jornada do Herói Interior" (Hero's Journey) within the "Reprogramação Mental" module. The core structure exists (tables, main route, splash, data functions), but the detailed interactive stages for each archetype, the gamified progression (2700-char scripts), the diagnosis system, and the "Hero Map" need to be implemented or expanded according to the 37-point specification.

## User Review

The user provided the full 37-point prompt again to ensure the implementation is "perfect" and matches every detail.

## Proposed Changes

### Database & Backend
- Complete the `hero_journey_archetypes` and `hero_journey_stats` logic.
- Ensure all 6 archetypes are seeded or handled in `src/lib/hero-content.ts`.
- Add server functions for specific reflexions, missions, and protocols.

### Frontend - New Routes & Components
- **`src/routes/_authenticated/hero-journey.archetype.$id.tsx`**: The main interactive container for the 6-stage journey of each archetype (Discover, Understand, Observe, Experiment, Implement, Conclude).
- **`src/routes/_authenticated/hero-journey.diagnostico.tsx`**: The final interactive assessment.
- **`src/routes/_authenticated/hero-journey.resultado.tsx`**: The result screen with the "Hero Map".
- **`src/routes/_authenticated/hero-journey.reflexoes.tsx`**: A personal library of saved insights.

### Refined UI/UX
- **Splash Screen**: Ensure it correctly identifies the user by name.
- **Home Dashboard**: Update to show the visual "Mapa do Herói Interior" with the 6 stations and current status.
- **Gamification**: Implement the specific badges, consciousness levels (1-6), and long-form narrative scripts (approx. 2700 chars) for each conclusion.
- **Reset Functionality**: Add a verified way to restart the journey.

## Technical Details

- **Archetype Flow**: 
    1. **Discover**: Essence, strength, shadow, etc.
    2. **Understand**: Interactive categories (Thoughts, Emotions, etc.).
    3. **Observe**: "Do you recognize yourself?" questions.
    4. **Experiment**: Reflection field (Olhe para Dentro).
    5. **Implement**: Mission and 5-step Protocol.
    6. **Conclude**: Narrative script + XP/Consciência gain.
- **Diagnosis Logic**: A weighted calculation based on responses throughout the journey plus a final quiz.
- **Visuals**: Use premium, cinematic imagery for each archetype.

## Constraints
- Do not build a traditional video lesson library.
- Maintain the existing "Código da Mente Extraordinária" lesson as a resource.
- Mobile-first, premium minimal design.
