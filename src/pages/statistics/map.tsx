import { useQuery } from '@tanstack/react-query';

import { nearbyServers } from '@buf/xeonr_sagl-servers.connectrpc_query-es/serversapi/v1/api-StatisticsService_connectquery'
import { connectClient } from '../../api-types/client';
import { Map } from '../../features/map/Map.client';

export function StatisticsMap() {
	const data = useQuery(nearbyServers.useQuery({}, { transport: connectClient }));

	if (data.isLoading) {
		return <p> Loading.. </p>
	}

	return (
		<Map server={data.data!} />
	)
}