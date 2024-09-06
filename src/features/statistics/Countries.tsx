"use client"
import * as React from 'react';
import { PieTooltipProps } from '@nivo/pie';
import styled from 'styled-components';
// @ts-ignore
import emoji from 'country-code-emoji';
import countries from 'i18n-iso-countries';
import { useQuery } from '@tanstack/react-query';
import { getNetworkCountryDistribution } from '@buf/xeonr_sagl-servers.connectrpc_query-es/serversapi/v1/api-StatisticsService_connectquery';
import en from 'i18n-iso-countries/langs/en.json';
countries.registerLocale(en);
const TooltipEl = styled.div`
	padding: 5px;
	background: #111;
	border-radius: 5px;
	font-family: 'Bank Gothic Regular';
	color: rgba(255, 255, 255, 0.8);
	strong {
		color: #e28b10;
	}
`

const Tooltip = React.memo(({ datum }: PieTooltipProps<any>) => {
	return <TooltipEl>{datum.label} <strong style={{ color: datum.color}}>({datum.value} servers)</strong> </TooltipEl>
});
Tooltip.displayName = 'Tooltip';

const Card = styled.div`
	color: #FFF;
	padding: 10px;
	margin: 10px;
	border-radius: 5px;
	background: linear-gradient(215deg, rgb(255 255 255 / 8%), rgb(255 255 255 / 0%));
	border: 1px solid #ffffff1a;

	thead td {
		padding: 10px 5px;
	}
	table {
		width: 100%;
	}

	tbody tr {
		background: rgba(255,255,255,0.1);
	}

	tbody tr td {
		padding: 8px;
		border-bottom: rgba(0, 0, 0,0.1) 5px solid;

		strong {
			color: #e28b10;
		}
	}

`

export const Countries = React.memo(() => {
	const networkCountries = useQuery(getNetworkCountryDistribution.useQuery());
	const data = React.useMemo(() => {
		if (networkCountries.isLoading) {
			return [];
		};

		const total = networkCountries.data!.networkCountries.reduce((val, curr) => val + curr.count, 0);

		return [
			...networkCountries.data!.networkCountries.filter(r => r.country !== 'unknown').map((r: any) => ({
				name: countries.getName(r.country, 'en'),
				code: r.country,
				value: r.count,
				emoji: emoji(r.country),
				percent: r.count / total * 100,
			})),
		];
	}, [networkCountries.data, networkCountries.isLoading]);

	return (
		<Card style={{ height: 500, overflowY: 'scroll' }}>
			<h2> Servers by country: </h2>
			<table>
				<thead>
					<td> Country Name </td>
					<td> Count </td>
				</thead>
				<tbody>
					{data.map(row => (
						<tr key={row.code}>
							<td> {row.emoji} {row.name} </td>
							<td> {row.value} <strong>({row.percent.toFixed(1)}%)</strong></td>
						</tr>
					))}
				</tbody>
			</table>
		</Card>
	)
})


Countries.displayName = 'HostingProvider';
