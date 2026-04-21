# Core presentation model
- There must be a stage which owns the slideshow as a whole.
- There must be an ordered presentation sequence owned by the stage.
- Individual slide components must not need awareness of their position in the overall deck.
- Global ordering is stage metadata, not slide behaviour.

## Stage responsibilities
- Hold the visible viewport area.
- Control outer slide placement and movement.
- Receive user navigation intent such as next and previous.
- Decide which slides are currently kept alive near the current slide.
- Decide when slide-to-slide movement occurs.
- Decide when an in-flight navigation is abandoned.
- Ignore stale responses from older navigation attempts.

## Slide responsibilities
- Own their own internal progression and substeps.
- Be able to consume forward navigation internally.
- Be able to consume backward navigation internally.
- Be able to report when they are out of forward substeps.
- Be able to report when they are out of backward substeps.
- Be isolated from the state of other slides.
- Not own global mounting, swapping, or deck order.

## Residency / preloading model
- The stage must not only think in terms of one prev, one current, one next as a hard remount cycle.
- The stage must maintain a resident window of nearby slides.
- Nearby slides may be mounted off-screen in order to preload heavy work.
- Residency must be separate from visual role.
- A slide becoming current should ideally be a role/position change of an already-living instance.
- Slides far enough away may be evicted.

## Visual role model
- Resident slides may temporarily occupy roles such as previous, current, or next.
- Role is stage-owned and temporary.
- Role changes should not imply that the slide is recreated.
- Slides may need to know their current local role, but not their global deck index.

## Transition model
- Outer slide movement is owned by stage.
- Inner content animation is owned by the slide.
- These two timing systems must not be hard-coupled.
- Stage must not assume a slide is ready based on elapsed time alone.
- Slides must explicitly report meaningful milestones back to stage.

## Navigation contract
- User input first goes to stage.
- Stage first asks the current slide whether the input is consumed internally or requires deck movement.
- Forward and backward navigation must follow the same conceptual contract.
- Navigation intent is a command, not a passive shared state value.

### Child response contract
- A slide must be able to report “I consumed that internally”.
- A slide must be able to report “I cannot consume that further; move to another slide”.
- A slide must be able to report “I have reached a stable state suitable for promotion to current”.
- Stage must act on explicit responses, not guessed timing.

### Promotion / role rotation
- When a nearby slide becomes current, the user should perceive continuity.
- Promotion should happen only when stage considers it visually safe.
- Promotion is a stage concern.
- The actual role rotation should ideally occur without visible discontinuity.
- Heavy slides should already be warm before they are promoted.

### Interruption policy
- Repeated user input must not corrupt presentation state.
- The stage must be allowed to abandon in-flight choreography.
- A fast-forward or skip is a discrete snap, not a request for children to hurry up.
- On interruption, stage may hard-reset the resident roles to a coherent idle arrangement.
- Children do not need to negotiate or “settle” for this reset.

### Stale response protection
- Every navigation attempt must be distinguishable from older ones.
- Late callbacks from old attempts must be ignorable.
- Old async completions must never mutate the current truth.
- This protection is mandatory once interruption is supported.
- Data / expensive work lifetime
- Expensive work must not be tied blindly to the moment a slide becomes current.
- Expensive work may begin while a slide is resident but off-screen.
- Expensive work that must survive role changes should live above the slide instance, or otherwise be keyed to the slide entry rather than mount timing.
- Promotion from next to current must not cause needless re-fetch or re-initialisation.

### Cleanup / eviction
- Old resident slides should eventually be cleaned up.
- Cleanup should use a simple bounded policy, not a complicated memory-pressure-driven system.
- The system should prefer predictable residency limits over clever runtime memory heuristics.
- Memory management should be stage-owned, not slide-owned.
- Type / contract enforcement
- The stage must accept only slide components that satisfy the agreed slide contract.
- That contract should cover required props and required upward callbacks.
- The stage should operate on slide entries, not just raw component references.
- Slide entries should contain the metadata needed for residency, preload, and stable keyed rendering.
- High-level architectural outcome
- A stage-owned ordered deck
- A bounded resident window of nearby slides
- Stage-owned outer navigation and interruption
- Slide-owned internal forward/backward progression
- Explicit command/result handshakes
- Stable promotion without visible pop-in
- Persistence of expensive work across role changes where needed
