import * as Sentry from "@sentry/react";
import * as React from 'react';
Sentry.init({
	dsn: "https://d56211de9783e4bddce562b14a7a0f23@broken.prod.wtf/4",
	integrations: [
		new Sentry.BrowserTracing({
			// Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
			tracePropagationTargets: ["localhost", /^https:\/\/server-api.sagl.app\//, /^https:\/\/cloud-api.sagl.app\//],
			routingInstrumentation: Sentry.reactRouterV6Instrumentation(
				React.useEffect,
				useLocation,
				useNavigationType,
				createRoutesFromChildren,
				matchRoutes
			),
		}),
		new Sentry.Replay(),
	],
	// Performance Monitoring
	tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
	// Session Replay
	replaysSessionSampleRate: 1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
	replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

import ReactDOM from 'react-dom/client'
import 'rsuite/dist/rsuite-no-reset.min.css';
import './styles.css'
import './editor.css'
import { Outlet, RouterProvider, createBrowserRouter, createRoutesFromChildren, matchRoutes, useLocation, useNavigationType } from 'react-router-dom'
import { Theme, Wrapper } from './theme'
import { Nav } from './features/layout/Nav'
import Statistics from './pages/statistics/statistics'
import { StatisticsMap } from './pages/statistics/map'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TransportProvider } from '@connectrpc/connect-query'
import { connectClient } from './api-types/client'
import { Server } from './pages/servers/server'
import Servers from './pages/servers/list'
import { SAGLAccount, SAGLAccountContext } from './SAGLAccount'
import { Auth } from './pages/auth'
import { ClaimedPage } from './pages/account/claimed'
import { ClaimedServerPage } from './pages/account/claimed-server'
import { useContext } from 'react'


const App = () => (
	<>
		<Theme />
		<Nav />
		<Sentry.ErrorBoundary showDialog={true} fallback={<><h1> something went wrong. </h1></>}>
			<Outlet />
		</Sentry.ErrorBoundary>
	</>
)

const AccountApp = () => {
	const acc = useContext(SAGLAccountContext);
	acc
	if (!acc.account) {
		acc.login(`${window.location.pathname}${window.location.search}`);
		return <></>
	}

	return (
		<>

			<div style={{ display: 'flex', flexDirection: 'row' }}>
				<Wrapper>
					<Outlet />
				</Wrapper>
			</div>
		</>
	)
}

const sentryCreateBrowserRouter =
	Sentry.wrapCreateBrowserRouter(createBrowserRouter);


const router = sentryCreateBrowserRouter([
	{
		path: '/',
		element: <App />,
		children: [
			{
				path: '/',
				element: <Servers />,
			},
			{
				path: '/auth',
				element: <Auth />,
			},
			{
				path: '/statistics/map',
				element: <StatisticsMap />,
			},
			{
				path: '/statistics',
				element: <Statistics />,
			},
			{
				path: '/server/:address',
				element: <Server />,
			},
			{
				path: '/account',
				element: <AccountApp />,
				children: [
					{
						path: '/account',
						element: <div>Account</div>,
					},
					{
						path: '/account/claimed/:address',
						element: <ClaimedServerPage />,
					},
					{
						path: '/account/claimed',
						element: <ClaimedPage />,
					},
				]
			}
		],
	}
])

const queryClient = new QueryClient();


ReactDOM.createRoot(document.getElementById('root')!).render(
	<Sentry.ErrorBoundary fallback={<p>An error has occurred</p>} showDialog={true} >
		<TransportProvider transport={connectClient}>
			<QueryClientProvider client={queryClient}>
				<SAGLAccount>
					<RouterProvider router={router} />
				</SAGLAccount>
			</QueryClientProvider>
		</TransportProvider>
	</Sentry.ErrorBoundary>
)
