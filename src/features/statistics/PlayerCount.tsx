'use client'
import * as React from 'react';
import type { Point } from '@nivo/line'
import styled from 'styled-components';
import countries from 'i18n-iso-countries';
// @ts-ignore
import emoji from 'country-code-emoji';
import { schemePaired  } from 'd3-scale-chromatic';
import en from 'i18n-iso-countries/langs/en.json';
countries.registerLocale(en);
import { getPlayersByCountry } from '@buf/xeonr_sagl-servers.connectrpc_query-es/serversapi/v1/api-TimeseriesService_connectquery';
import { useQuery } from '@tanstack/react-query';
import { ResponsiveLine  } from '@nivo/line';

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

const SeriesItem = styled.div`
	color: #FFF;
	background: rgba(255,255,255,0.1);
	padding: 10px;
	margin: 5px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	cursor: pointer;

	&:hover {
		background: rgba(255,255,255,0.3);
	}
`

const Tooltip = React.memo(({ point }: { point: Point }) => {
	return <TooltipEl><strong>{Math.round(+point.data.y)}</strong> in {point.serieId}, {point.data.xFormatted}</TooltipEl>
});
Tooltip.displayName = 'tooltip';

const Card = styled.div`
	> div {
		color: #FFF;
		padding: 10px;
		margin: 10px;
		border-radius: 5px;
		background: linear-gradient(215deg, rgb(255 255 255 / 8%), rgb(255 255 255 / 0%));
	    border: 1px solid #ffffff1a;
	}
`

export const PlayerCount = React.memo(() => {
	const [hidden, setHidden] = React.useState<string[]>([]);
	const playersByCountry = useQuery(getPlayersByCountry.useQuery());

	const data = React.useMemo(() => {
		if (!playersByCountry.data) {
			return [];
		}
		return playersByCountry.data!.countries.filter((r) => r.country !== 'unknown').map((res, index: number) => ({
			id: countries.getName(res.country, 'en')!,
			color: schemePaired[index % schemePaired.length],
			label: countries.getName(res.country, 'en'),
			icon: emoji(res.country),
			data: res.datapoints.map((val) => ({ x: new Date(val.timestamp), y: Number(val.value) })),
		}))
		.filter(i => i.data.length >= 2)
		.sort((a: any, b: any) => {
			const ap = a.data[a.data.length - 2].y ?? 0;
			const bp = b.data[b.data.length - 2].y ?? 0;

			return bp - ap;
		});
	}, [playersByCountry.isLoading, playersByCountry.data]);

	const visible = React.useMemo(() => {
		return data.filter(srs => !hidden.includes(srs.id as any));
	}, [data, hidden]);


	if (!data.length) {
		return (
			<Card>
				<div>
					<h2> Players by host country </h2>
					<div style={{ height: 400 }}></div>
				</div>
			</Card>
		)
	}

	return (
		<Card>
			<div>
				<h2> Players by host country </h2>
				<div className="chart" style={{ height: 400, display: 'flex', flexDirection: 'row' }}>
					<div style={{ width: 'calc(100% - 220px)', height: 400 }}>
						<ResponsiveLine
							enableGridX={true}
							enableGridY={true}
							data={visible}
							xFormat="time:%I:%M %p %d %b"
							margin={{ top: 10, left: 60, right: 5, bottom: 50 }}
							xScale={{ type: "time", format: 'native' }}
							yScale={{ type: 'linear', min: 'auto', max: 'auto', }}
							// colors={{ scheme: 'category10' }}
							colors={{ datum: 'color' }}
							axisBottom={{
								legend: 'Last 7 days',
								format: '',
								legendOffset: 20,
								legendPosition: 'middle'
							}}
							axisLeft={{
								tickSize: 5,
								tickPadding: 5,
								tickRotation: 0,
								legend: 'Players',
								legendOffset: -55,
								legendPosition: 'middle'
							}}
							theme={{ axis: { ticks: { text: { fill: '#FFF' } }, legend: { text: { fill: '#FFF' } } }, grid: { line: { stroke: 'rgba(255, 255, 255, 0.1)' } } }}
							tooltip={Tooltip}
							pointSize={0}
							pointBorderWidth={0}
							useMesh={true}
						/>
					</div>

					<div style={{ width: 250, overflowY: 'scroll', height: '100%'}}>
						{data.map(srs => (
							<SeriesItem key={srs.id} style={{ opacity: hidden.includes(srs.id!) ? 0.3 : 1 }} onClick={() => {
								setHidden(h => {
									if (h.includes(srs.id)) {
										return h.filter(id => id !== srs.id);
									}

									return [...h, srs.id];
								});
							}}>
								<div>
								<div style={{ width: 12, height: 12, borderRadius: 12, backgroundColor: srs.color, marginRight: 10 }} />
								</div>
								<span style={{ whiteSpace: 'nowrap', flex: '1', overflow: 'hidden', textOverflow: 'ellipsis' }}>{srs.icon} {srs.label}</span>
								<span style={{ paddingLeft: 10, opacity: 0.5 }}>{(Math.round(srs.data[srs.data.length - 2].y)) ?? 0}</span>
							</SeriesItem>
						))}
					</div>
				</div>
			</div>
		</Card>
	);
});
