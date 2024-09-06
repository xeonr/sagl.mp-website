import * as React from 'react';
import { Avatar, Button, Tooltip, Whisper } from 'rsuite';
import styled from 'styled-components';
import { flex, Heading2, layout } from '../../theme';
import { transformCountryName } from './ui/transformCountryName';
import { Graph } from './ui/Graph';
import { Server } from '@buf/xeonr_sagl-servers.bufbuild_es/serversapi/v1/api_pb';
import { ServerListItem } from './ServerListItem';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { MDStyle } from './ui/Md';
import { Link } from 'react-router-dom';

const Layout = styled.div`
	${layout('row')}
`

const Content = styled.div`
	${flex(66, 'row')}
`

const Stats = styled.div`
	${flex(33, 'row')}
`

const SectionTitle = styled(Heading2)`
	margin-top: 15px;
`

const Text = styled.p`
	color: rgba(255, 255, 255, 0.7);

`
export const ServerContext = React.createContext<{ loading: boolean; server: Server | null; }>({ loading: true, server: null });

export const ServerOverview = React.memo(({ server }: { server: Server }) => {
	const ctx = React.useMemo(() => ({ server, loading: false }), [server]);
	const countryName = React.useMemo(() => transformCountryName(server?.networkDetails?.country || ''), [server]);

	if (!server) {
		return <></>;
	}

	return (
		<ServerContext.Provider value={ctx}>
			<Layout>
				<Content>
					<ServerListItem server={server} includeSocials={true}  />

					<br />
					<br />
					{server.saglMetadata?.description && <MDStyle><ReactMarkdown remarkPlugins={[remarkGfm]} children={server.saglMetadata?.description} /></MDStyle>}

					<SectionTitle>Game mode</SectionTitle>
					<Text>{server.gamemode} </Text>

					<SectionTitle>Language</SectionTitle>
					<Text>{server.language} </Text>

					<SectionTitle>Version</SectionTitle>
					<Text>{server.rules.version} </Text>

					<SectionTitle>Located in</SectionTitle>
					<Text>{countryName} </Text>

					<SectionTitle>Hosted By</SectionTitle>
					<Text>{server.networkDetails?.asnName} ({server.networkDetails?.asn}) </Text>


					<SectionTitle>Owned By</SectionTitle>
					<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: -10 }}>
						{server.saglOwners.map(owner => (
							<Whisper speaker={<Tooltip>{owner.username}</Tooltip>}><Avatar src={owner.avatar} size="sm" style={{ marginLeft: 10 }} /></Whisper>
						))}
						<Button size="sm" as={Link} to={`/account/claimed?ip=${server.address}`} appearance='link'> Claim Server</Button>
					</div>

					<br />
					<br />
					<br />
				</Content>

				<Stats>
					<Graph metric="players" server={server} timeframe="24h" />
					<Graph metric="players" server={server} timeframe="7d" />
				</Stats>
			</Layout>
		</ServerContext.Provider>
	);
})

ServerOverview.displayName = 'ServerOverview';
