import { MetaService, ServerService, StatisticsService, TimeseriesService } from '@buf/xeonr_sagl-servers.connectrpc_es/serversapi/v1/api_connect';
import { Interceptor, createPromiseClient } from '@connectrpc/connect'
import { createConnectTransport } from '@connectrpc/connect-web'
import { getToken } from './cloud';

export const HOSTNAME = 'https://server-api.sagl.app';

const authInterceptor: Interceptor = (next) => async (req) => {
	if (getToken()) {
		req.header.set('Authorization', `Bearer ${getToken()}`);
	}

	return await next(req);
};

export const connectClient = createConnectTransport({
	baseUrl: HOSTNAME,
	interceptors: [authInterceptor],
});

export const serverClient = createPromiseClient(
	ServerService,
	createConnectTransport({
		baseUrl: HOSTNAME,
		interceptors: [authInterceptor],
		fetch: (url, options) => {
			// allow fetch inside cf worker
			if (!globalThis.window) {
				delete (options as any).mode;
				delete (options as any).credentials;
				(options as any).redirect = 'manual';
			}
			return fetch(url, options);
		},
	})
)

export const timeseriesClient = createPromiseClient(
	TimeseriesService,
	createConnectTransport({
		baseUrl: HOSTNAME,
	})
)

export const metaClient = createPromiseClient(
	MetaService,
	createConnectTransport({
		baseUrl: HOSTNAME,
		interceptors: [authInterceptor],
	})
)


export const statisticsClient = createPromiseClient(
	StatisticsService,
	createConnectTransport({
		baseUrl: HOSTNAME,
		fetch: (url, options) => {
			// allow fetch inside cf worker
			if (!globalThis.window) {
				delete (options as any).mode;
				delete (options as any).credentials;
				(options as any).redirect = 'manual';
			}
			return fetch(url, options);
		},
	})
)
