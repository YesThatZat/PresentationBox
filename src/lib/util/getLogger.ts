import pino from 'pino'

const rootLogger = pino({
    base: undefined,
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: {
        level: (label) => ({ level: label })
    }
})

export function getLogger(className: string): AppLogger {
    return rootLogger.child({ className })
}
