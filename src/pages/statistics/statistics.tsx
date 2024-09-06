'use client'

import { Countries } from '../../features/statistics/Countries'
import { HostingProvider } from '../../features/statistics/HostingProvider'
import { PlayerCount } from '../../features/statistics/PlayerCount'
import { Wrapper } from '../../theme'

export default function Statistics() {
	return (
		<Wrapper>
			<PlayerCount />

			<div style={{ display: 'flex', flexDirection: 'row' }}>
				<div style={{ flex: 1 }}>
					<Countries />
				</div>
				<div style={{ flex: 1 }}>
					<HostingProvider />
				</div>
			</div>
		</Wrapper>
	)
}