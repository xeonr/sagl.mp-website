// import { ServerOverview } from '../../features/servers/ServerOverview';
import { useQuery } from '@tanstack/react-query';
import { Wrapper } from '../../theme';
import { getServer} from '@buf/xeonr_sagl-servers.connectrpc_query-es/serversapi/v1/api-ServerService_connectquery';
import { useParams } from 'react-router';
import { ServerOverview } from '../../features/servers/ServerOverview';
export function Server() {
	const { address } = useParams();
	const fixedAddress = address?.includes(':') ? address : `${address}:7777`;
	const server = useQuery(getServer.useQuery({ target: fixedAddress  }))

	if (server.isLoading) {
		return <Wrapper><p> loading .. </p></Wrapper>
	}

	if (!server.data || !server.data.server) {
		return <Wrapper><p> no server? </p></Wrapper>
	}

	return (
		<Wrapper>
			<ServerOverview server={server.data.server} />
		</Wrapper>
	)
}
