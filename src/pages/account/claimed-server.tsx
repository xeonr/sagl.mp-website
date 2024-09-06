import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Wrapper } from '../../theme';
import { getServer } from '@buf/xeonr_sagl-servers.connectrpc_query-es/serversapi/v1/api-ServerService_connectquery';
import { useParams } from 'react-router';
import { ServerSettings } from '../../features/servers/ui/claimed/ServerSettings';
import { SAGLAccountContext } from '../../SAGLAccount';
import { Button, Message } from 'rsuite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

export function ClaimedServerPage() {
	const { address } = useParams();
	const fixedAddress = address?.includes(':') ? address : `${address}:7777`;
	const server = useQuery(getServer.useQuery({ target: fixedAddress }))
	const user = React.useContext(SAGLAccountContext);

	if (server.isLoading) {
		return <p> loading .. </p>
	}

	if (!server.data || !server.data.server) {
		return <p> no server? </p>
	}

	return (
		<Wrapper>
			<Button as={Link} to="/account/claimed" style={{ paddingLeft: 20 }} appearance="link"> <FontAwesomeIcon icon={faArrowLeft} />  &nbsp; Back to claimed </Button>

			{user.account?.admin &&(
				<Message type="warning">
					Note: you're logged in as an admin enabling you to edit any server (even if you haven't claimed it)!
				</Message>

			)}
			<ServerSettings server={server.data.server} />
		</Wrapper>
	)
}
