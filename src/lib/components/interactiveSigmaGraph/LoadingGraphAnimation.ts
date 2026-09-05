import Graph from 'graphology'

import {
	AnimatedGraph,
	type AnimationFrame
} from './AnimatedGraph'

export class LoadingGraphAnimation extends AnimatedGraph {
	constructor() {
		const graph = new Graph()

		graph.addNode('a', {
			x: 0,
			y: 1,
			size: 12,
			color: '#888'
		})

		graph.addNode('b', {
			x: -0.866,
			y: -0.5,
			size: 8,
			color: '#888'
		})

		graph.addNode('c', {
			x: 0.866,
			y: -0.5,
			size: 8,
			color: '#888'
		})

		graph.addUndirectedEdge('a', 'b')
		graph.addUndirectedEdge('b', 'c')
		graph.addUndirectedEdge('c', 'a')

		const frames: AnimationFrame[] = [
			{
				a: { x: 0.866, y: -0.5, size: 8 },
				b: { x: 0, y: 1, size: 8 },
				c: { x: -0.866, y: -0.5, size: 8 }
			},
			{
				a: { x: -0.866, y: -0.5, size: 8 },
				b: { x: 0.866, y: -0.5, size: 8 },
				c: { x: 0, y: 1, size: 8 }
			},
			{
				a: { x: 0, y: 1, size: 8 },
				b: { x: -0.866, y: -0.5, size: 8 },
				c: { x: 0.866, y: -0.5, size: 8 }
			}
		]

		super(graph, frames, {
			duration: 2000,
			easing: 'linear'
		})
	}
}