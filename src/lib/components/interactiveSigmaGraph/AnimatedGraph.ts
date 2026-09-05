import type Graph from 'graphology'
import type { AnimateOptions } from 'sigma/utils'

export type AnimationFrame = Record<
	string,
	Record<string, number>
>

export class AnimatedGraph {
	private playing = false
	private cancelCurrentFrame?: () => void

	constructor(
		public readonly graph: Graph,
		private readonly frames: AnimationFrame[],
		private readonly options: Partial<AnimateOptions> = {}
	) {}

	async play(loop = true): Promise<void> {
		if (this.playing || this.frames.length === 0) return

		this.playing = true

		const { animateNodes } = await import('sigma/utils')

		if (!this.playing) return

		let frameIndex = 0

		const playNextFrame = (): void => {
			if (!this.playing) return

			this.cancelCurrentFrame = animateNodes(
				this.graph,
				this.frames[frameIndex],
				this.options,
				() => {
					frameIndex++

					if (frameIndex >= this.frames.length) {
						if (!loop) {
							this.playing = false
							return
						}

						frameIndex = 0
					}

					playNextFrame()
				}
			)
		}

		playNextFrame()
	}

	stop(): void {
		this.playing = false
		this.cancelCurrentFrame?.()
		this.cancelCurrentFrame = undefined
	}
}