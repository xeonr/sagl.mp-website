import * as React from 'react';
import {Marker, TileLayer, MapContainer} from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import styled from 'styled-components';
// @ts-ignore
import emoji from 'country-code-emoji';
import { NearbyServersResponse, NearbyServersResponse_CloseGameServer } from '@buf/xeonr_sagl-servers.bufbuild_es/serversapi/v1/api_pb';
import { Link } from 'react-router-dom';

// const icon = new Icon({
// 	iconUrl: '/assets/icons/2.png',
// 	iconSize: [24, 24],
// })
const serverIcon = new Icon({
	iconUrl: '/assets/icons/31.png',
	iconSize: [24, 24],
})

const InlineServerBox = styled.div`
	background: rgba(255,255,255,0.1);
	padding: 5px 10px;
	display: flex;
	flex-direction: row;
	margin: 5px 10px;
	align-items: center;
	color: #FFF;
	text-decoration: none;

	&:hover {
		background: rgba(255,255,255,0.3);
	}
`;

const InlineServerBoxDistance = styled.span`
	background: rgb(0 0 0 / 20%);
	padding: 5px;
	font-size: 23px;

	span {
		font-size: 14px;
	}
`;

const InlineServer = React.memo((props: { server: NearbyServersResponse_CloseGameServer }) => {
	return (
		<Link to={`/server/${props.server.hostname}`} style={{ textDecoration: 'none' }}>
			<InlineServerBox>
				<div style={{ flex: 1, overflow: 'hidden', flexDirection: 'column' }}>
					<h4 style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 5  }}>
						<span>
							{emoji(props.server.country)}
						</span>
						{props.server.hostname}
					</h4>
					<h3 style={{ flex: 1, overflow: 'hidden', opacity: 0.5 }}>
						{props.server.onlinePlayers} / {props.server.maxPlayers} players
					</h3>
				</div>

				<div>
					<InlineServerBoxDistance>
						{props.server.distanceMi.toFixed(1)}<span>mi</span>
					</InlineServerBoxDistance>
				</div>
			</InlineServerBox>
		</Link>
	)
});

InlineServer.displayName = 'InlineServer';

export const Map = ({ server }: { server: NearbyServersResponse }) => {
	const [selectedServers, setSelectedServers] = React.useState<NearbyServersResponse_CloseGameServer[]>(server.servers.slice(0, 20));
	const [nearest, setNearest] = React.useState<boolean>(true);
	return (
		<div style={{ height: 'calc(100vh - 130px)', width: '100%', flexDirection: 'row', display: 'flex' }}>
			<MapContainer center={{ lat: server.currentLatitude, lng: server.currentLongitude}} zoom={5} style={{ height: '100%', flex: 1 }}>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
				/>
{/* 				<Marker position={{ lat: server.currentLatitude, lng: server.currentLongitude }} icon={icon} /> */}

				{server.servers.map(i => (
					<Marker key={i.id} position={{ lat: i.latitude, lng: i.longitude }} icon={serverIcon} eventHandlers={{ click(e) {
						const servers = server.servers.filter(i => i.latitude === e.latlng.lat && i.longitude === e.latlng.lng);
						setSelectedServers(servers.sort((a, b) => b.onlinePlayers - a.onlinePlayers));
						setNearest(false);
					}}}/>
				))}
			</MapContainer>
			{selectedServers.length && (
				<div style={{ width: 400, overflowY: 'auto', }}>
					{nearest && <h2 style={{ padding: '0px 10px' }}> Nearest Servers: </h2>}
					{selectedServers.map(i => <InlineServer server={i} key={i.id} />)};
				</div>
			)}
		</div>
	)
}
