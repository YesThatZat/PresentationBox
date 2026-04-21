import type { Component } from 'svelte';

export type PresentationComponentEventHandler = () => void

export interface PresentationComponentProps {
    // This slide is no longer running a transitional animation
	onIdle?: PresentationComponentEventHandler
    // stepForward was called but there is no next step. Advance should be called instead.
	onNoNextStep?: PresentationComponentEventHandler
    // stepBackward was called but there is no previous step, Retreat should be called instead.
	onNoPrevStep?: PresentationComponentEventHandler
}

export interface PresentationComponentExports {
    // Run this slides 'in' animation now, which will bring all elements needed for the first step in with a transition.
	slide_in(): void
    // Ask this slide to snap immediately to the idle state of it's starting step.
	stepStart(): void
    // Ask this slide to go to its next step. (It will raise onNoNextStep if it can't)
	stepForward(): void
    // Ask this slide to snap immediately to the idle state of a specific step. Will return false if there is no nth step for this slide.
    stepNth(index:number): boolean
    // Ask this slide to go to its previous step. (It will raise onNoPrevStep if it can't)
	stepBackward(): void
    // Ask this slide to snap immediately to the idle state of it's last step.
	stepEnd(): void
    // Run this slides 'out' animation now, which will remove all elements in the last step with a transition.
	slide_out(): void
    // Immediately make this slide remove itself from the presentation area
    outNow(): void
}

export type PresentationComponent = Component<
	PresentationComponentProps,
	PresentationComponentExports
>

export type PresentationComponentInstance = PresentationComponentExports