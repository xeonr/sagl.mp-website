import { faLinux, faWindows } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import styled from 'styled-components';
import { Button } from '../../theme';
import { ThemedButton } from '../servers/ui/Socials';

const Popover = styled.div`
	opacity: 0;
	position: absolute;
	pointer-events: none;
	top: calc(100% + 10px);
	right: 0;
	left: 0;
	flex-direction: row;
	display: flex;
	padding: 7.5px;
	background: rgba(255, 255, 255, 0.2);
	z-index: 1;
	border-radius: 5px;
	backdrop-filter: blur(5px);
	border: 1px solid rgba(255, 255, 255, 0.1);

	&.active {
		pointer-events: initial;
		opacity: 1;
	}

	> a {
		backdrop-filter: none;
		background-color: transparent !important;
		background: none;
		border: none;
		margin: 0;
		flex: 1 auto;
		padding: 5px 0px 5px 5px;
		border-radius: 0px;

		&:first-of-type {
			border-right: 1px solid rgba(255, 255, 255, 0.2);
		}

		svg {
			font-size: 1.2rem;
		}
	}
`

let DL_CACHE: { windowsUrl: string, linuxUrl: string, version: string } | null = null;

export const Download = React.memo(() => {
	const [active, setActive] = React.useState(false);
	const [versionState, setVerisonState] = React.useState<{ windowsUrl: string, linuxUrl: string, version: string } | null>(null);

	const toggleActive = React.useCallback(() => {
		setActive(e => !e);
	}, []);

	React.useEffect(() => {
		if (DL_CACHE) {
			setVerisonState(DL_CACHE);

			return;
		}

		fetch('https://api.github.com/repos/sa-gl/launcher-feedback/releases/latest')
			.then(res => res.json())
			.then((data: any) => {
				if (!data.name) {
					return;
				}
				const linux = data.assets.find((i: { name: string }) => i.name.endsWith('AppImage'));
				const windows = data.assets.find((i: { name: string }) => i.name.endsWith('exe'));
				const version = data.name;

				DL_CACHE = {
					version,
					linuxUrl: linux.browser_download_url,
					windowsUrl: windows.browser_download_url,
				};

				setVerisonState(DL_CACHE);
			})
	}, []);

	return (
		<Button variant="primary" onClick={toggleActive}>
			Download {versionState?.version}

			<Popover className={active ? 'active' : ''}>
				<ThemedButton $platform="url" href={versionState?.windowsUrl} style={{ margin: 0, marginRight: 10 }}>
					<FontAwesomeIcon icon={faWindows} />
				</ThemedButton>
				<ThemedButton $platform="url" href={versionState?.linuxUrl} style={{ margin: 0, marginRight: 0 }}>
					<FontAwesomeIcon icon={faLinux} />
				</ThemedButton>
			</Popover>
		</Button>
	)
})
