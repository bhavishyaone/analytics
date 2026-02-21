import pino from 'pino'
import pinoHttp from 'pino-http'

const logger = pino({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    transport:
        process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty' }
            : undefined,
});

export const httpLogger = pinoHttp({
    logger,
    customLogLevel: (_req, res) => {
        if (res.statusCode >= 500) return 'error';
        if (res.statusCode >= 400) return 'warn';
        return 'info';
    },
    serializers: {
        req(req) {
            return {
                method: req.method,
                url: req.url,
            };
        },
        res(res) {
            return {
                statusCode: res.statusCode,
            };
        },
    },
});

export default logger;
