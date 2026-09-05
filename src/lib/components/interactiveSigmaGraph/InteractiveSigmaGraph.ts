import type Graph from 'graphology'
import type Sigma from 'sigma'

export class InteractiveSigmaGraph {
	private renderer!: Sigma

	private constructor(private graph: Graph) {}

	static async create(
		element: HTMLElement,
		graph: Graph
	): Promise<InteractiveSigmaGraph> {
		const instance = new InteractiveSigmaGraph(graph)
		const { default: Sigma } = await import('sigma')

		instance.renderer = new Sigma(graph, element)

		return instance
	}

	setGraph(graph: Graph): void {
		this.graph = graph
		this.renderer.setGraph(graph)
	}

	destroy(): void {
		this.renderer.kill()
	}
}