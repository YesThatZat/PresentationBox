import type { Component } from 'svelte';

export type Direction = 'next' | 'prev' | null;

export type SlidePhase = 'before' | 'active' | 'out';

export type SlideProps = {
	phase?: SlidePhase;
	isActive?: boolean;
};

export type SlideComponent = Component<SlideProps>;

export type SlideEntry = {
	id: string;
	component: SlideComponent;
};
