'use client'
import * as React from 'react';
import { PieTooltipProps, ResponsivePie } from '@nivo/pie';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { getNetworkASNDistribution } from '@buf/xeonr_sagl-servers.connectrpc_query-es/serversapi/v1/api-StatisticsService_connectquery';

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

const Card = styled.div`
	color: #FFF;
	padding: 10px;
	margin: 10px;
	border-radius: 5px;
	background: linear-gradient(215deg, rgb(255 255 255 / 8%), rgb(255 255 255 / 0%));
	border: 1px solid #ffffff1a;
`

const Tooltip = React.memo(({ datum }: PieTooltipProps<any>) => {
	return <TooltipEl>{datum.label} <strong style={{ color: datum.color }}>({datum.value} servers)</strong> </TooltipEl>
});
Tooltip.displayName = 'Tooltip';

export const HostingProvider = React.memo(() => {
	const networkAsn = useQuery(getNetworkASNDistribution.useQuery());

	const data = React.useMemo(() => {
		if (networkAsn.isLoading) {
			return [];
		}
		const servers = networkAsn.data!.networkAsns.filter(i => i.count >= 5);
		const bad = networkAsn.data!.networkAsns.filter(i => i.count < 5).reduce((val, curr) => val + curr.count, 0);

		return [
			...servers.map((r: any) => ({
				id: r.name,
				label: r.name,
				value: r.count,
			})),
			{
				id: 'other',
				label: 'Other',
				value: bad
			}
		];
	}, [networkAsn.isLoading, networkAsn.data]);

	return (
		<Card style={{ height: 500 }}>
			<h2> Top hosting companies: </h2>
			<br />
			<div style={{ height: 425 }}>
				<ResponsivePie
					data={data}
					innerRadius={0.6}
					margin={{ top: 20, left: 50, right: 100, bottom: 50 }}
					colors={{ scheme: 'dark2' }}
					arcLinkLabelsSkipAngle={30}
					arcLinkLabelsTextColor="#FFF"
					arcLinkLabelsThickness={3}
					arcLinkLabelsColor={{ from: 'color' }}
					arcLabelsSkipAngle={1}
					tooltip={Tooltip}
					arcLabelsTextColor="#FFF"
					defs={[
						{
							id: 'dots',
							type: 'patternDots',
							background: 'inherit',
							color: 'rgba(255, 255, 255, 0.1)',
							size: 4,
							padding: 1,
							stagger: true
						},
						{
							id: 'lines',
							type: 'patternLines',
							background: 'inherit',
							color: 'rgba(255, 255, 255, 0.1)',
							rotation: -45,
							lineWidth: 6,
							spacing: 10
						}
					]}
					fill={[
						{
							match: {
								id: 'OVH SAS'
							},
							id: 'dots'
						},
						{
							match: {
								id: 'LLC Baxet'
							},
							id: 'lines'
						},
						{
							match: {
								id: 'RS-Media LLC'
							},
							id: 'lines'
						},
					]}
				/>
			</div>
		</Card>
	)
})


HostingProvider.displayName = 'HostingProvider';
