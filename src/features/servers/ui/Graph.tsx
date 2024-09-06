import * as React from 'react';
import { Point, ResponsiveLine, Serie } from '@nivo/line'
import styled from 'styled-components';
import { Heading1 } from '../../../theme';
import { AggregationType, Server, Timeframe } from '@buf/xeonr_sagl-servers.bufbuild_es/serversapi/v1/api_pb';
import { timeseriesClient } from '../../../api-types/client';

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

const Tooltip = React.memo(({ point }: { point: Point }) => {
	return <TooltipEl><strong>{Math.round(+point.data.y)}</strong> players, {point.data.xFormatted}</TooltipEl>
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

	.chart {
		height: 100px;

		path {
			stroke: #fdf9f2;
			filter: drop-shadow(0px 0px 3px #fdf9f2);
		}
	}
`

export const Graph = React.memo((props: { metric: string; server: Server; timeframe: string; }) => {
	const [data, setData] = React.useState<Serie[]>([]);

	React.useEffect(() => {
		const timeframe = {
			'24h': Timeframe.DAY,
			'7d': Timeframe.WEEK,
			'1m': Timeframe.MONTH,
		}[props.timeframe] ?? Timeframe.DAY;

		const metrics = {
			ping: (id: string, timeframe: Timeframe) => timeseriesClient.getServerPing({ ipAddress: id.split(':')[0], port: +id.split(':')[1], period: timeframe }),
			players: (id: string, timeframe: Timeframe) => timeseriesClient.getServerPlayers({ ipAddress: id.split(':')[0], port: +id.split(':')[1], period: timeframe, type: AggregationType.AVERAGE }),
		}[props.metric];
		metrics!(props.server.address, timeframe!).then(response => {
			setData([{
				id: "Player Count",

				data: response.datapoints.map(data => ({
					x: new Date(data.timestamp),
					y: Number(data.value),
				})),
			}]);
		})
	}, [props.metric, props.server.hostname, props.timeframe]);

	if (!data) {
		return <></>;
	}

	return (
		<Card>
			<div>
				<Heading1 style={{ fontSize: '1.5em', paddingBottom: 10, color: 'rgba(255, 255, 255, 0.8)' }}> {props.metric} <small>{props.timeframe}</small></Heading1>
				<div className="chart">
					<ResponsiveLine
						curve="basis"
						enableGridX={false}
						enableGridY={false}
						colors={["#FFF"]}
						data={data}
						xFormat="time:%I:%M %p %d %b"
						margin={{ top: 10, left: 10, right: 10, bottom: 10 }}
						xScale={{ type: "time", format: 'native' }}
						yScale={{ type: 'linear', min: 'auto', max: 'auto', }}
						axisBottom={null}
						axisLeft={null}
						tooltip={Tooltip}
						pointSize={0}
						pointBorderWidth={0}
						useMesh={true}
					/>
				</div>
			</div>
		</Card>
	);
});

Graph.displayName = 'Graph';
