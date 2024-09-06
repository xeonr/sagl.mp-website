import { useQuery } from '@tanstack/react-query';
import * as React from 'react';
import { listClaimedServers } from '@buf/xeonr_sagl-servers.connectrpc_query-es/serversapi/v1/api-ServerService_connectquery';

import { Button, Checkbox } from 'rsuite';
import { SAGLAccountContext } from '../../SAGLAccount';
import { ServerListItem } from '../../features/servers/ServerListItem';
import { Navigate, useLocation } from 'react-router';
import { ClaimServerModal } from './ClaimServerModal';
import { Heading1, Heading2, Wrapper } from '../../theme';

function useQueryParams() {
	const { search } = useLocation();

	return React.useMemo(() => new URLSearchParams(search), [search]);
}

export function ClaimedPage() {
	const [admin, setAdmin] = React.useState(false);
	const data = useQuery({ ...listClaimedServers.useQuery({ admin }),  keepPreviousData: true });
	const user = React.useContext(SAGLAccountContext);
	const param = useQueryParams();
	const [claimDialog, setClaimDialog] = React.useState(param.has('ip'));

	if (data.isLoading) {
		return <p> Loading.. </p>
	}

	// admins claimed all servers
	if (user.account?.admin && param.has('ip')) {
		return <Navigate to={`/account/claimed/${param.get('ip')}`} />
	}

	return (
		<Wrapper>
			<Heading1 style={{ paddingLeft: 20 }}>Claimed servers </Heading1>
			<ClaimServerModal open={claimDialog} onClose={() => setClaimDialog(false)} prefillIp={param.get('ip') ?? ''} />
			<div style={{ display: 'flex', flexDirection: 'row', padding: 15, alignItems: 'center' }}>
				{user.account?.admin && <Checkbox checked={admin} onCheckboxClick={() => setAdmin(a => !a)}>List all configured servers</Checkbox>}
				<span style={{ flex: 1 }}></span>
				<div>
					<Button appearance='primary' onClick={() => setClaimDialog(true)}> Claim Server</Button>
				</div>
			</div>
			<div style={{ padding: '0px 15px'}}>
				{data.data?.server.length === 0 && (
					<div style={{ textAlign: 'center'}}>
						<Heading2> You haven't claimed any servers yet. </Heading2>
					</div>
				)}
				{data.data?.server.map(server => (
					<ServerListItem server={server} link={"/account/claimed"}  />
				))}
			</div>
		</Wrapper>
	)
}
