import { faLock, faRocket, faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { Tooltip, Whisper } from 'rsuite';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import { Server } from '@buf/xeonr_sagl-servers.bufbuild_es/serversapi/v1/api_pb';
import { Socials } from './ui/Socials';


const ServerContent = styled.div`
	flex: 1;
	padding: 5px 10px;
	border-top-left-radius: 5px;
	border-bottom-left-radius: 5px;
	background: rgba(255, 255, 255, 0.1);
	transition: 0.3s ease;
	border: 1px solid transparent;
	border-right: none;
	svg {
		margin-right: 10px;
	}

	> div {
		display: flex;
		flex-direction: row;
		align-items: center;
	}
`;

const Active = styled.div`
	background: rgba(255, 255, 255, 0.1);
	border-top-right-radius: 5px;
	border-bottom-right-radius: 5px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding-right: 15px;
	transition: 0.3s ease;
	border: 1px solid transparent;
	border-left: none;
`


const Title = styled.h1`
	font-size: 18px;
	font-family: 'Bank Gothic Regular';
	color: #FFF;


	&:hover {
		.a {
			display: none;
		}
		.b {
			display: initial;
		}
	}

	.b {
		display: none;
	}
`;

const ServerText = styled.div`
	font-size: 14px;
	color: rgba(255, 255, 255, 0.5);
`

const ServerContainer = styled(Link)<{ isSupporter: boolean; clickable: boolean }>`
	display: flex;
	flex-direction: row;
	margin-top: 10px;
	color: #FFF;
	text-decoration: none;
	cursor: default;
	${p => p.clickable && css`
		cursor: pointer;

		&:hover {
			${ServerContent}, ${Active} {
				background-color: rgba(0, 0, 0, 0.1);
				border-color: rgba(255, 255, 255, 0.2);
			}
		}
	`}

	${p => p.isSupporter && css`
		${ServerContent}, ${Active} {
			background-color: rgba(226, 139, 16, 0.25);
		}
	`}

	> img {
		border-radius: 5px;
		height: 58px;
		margin-right: 10px;
	}
`

export const ServerListItem = React.memo(({ server, link, includeSocials } : { server: Server; link?: string; includeSocials?: boolean }) => {
	const [clicked, setClicked] = React.useState(false);

	const HostedIcon = (
		<Whisper
			trigger="hover"
			placement="top"
			speaker={
			<Tooltip>
				Listed on the SA:MP hosted list
			</Tooltip>
			}
		>
			<FontAwesomeIcon style={{ color: '#e28b10' }} icon={faStar} />
		</Whisper>
	);

	const PasswordedIcon = (
		<Whisper
			trigger="hover"
			placement="top"
			speaker={
			<Tooltip>
				Server requires a password
			</Tooltip>
			}
		>
			<FontAwesomeIcon icon={faLock} />
		</Whisper>
	);

	const SupporterIcon = (
		<Whisper
			trigger="hover"
			placement="top"
			speaker={
			<Tooltip>
				Supports SA:GL
			</Tooltip>
			}
		>
			<FontAwesomeIcon icon={faRocket} />
		</Whisper>
	);

	return (
		<>
			<ServerContainer clickable={!!link} isSupporter={server.saglMetadata?.isSupporter ?? false} to={link ? `${link}/${server.address}` : undefined!}>
				{server.saglMetadata?.profileIcon && <img src={server.saglMetadata?.profileIcon} alt="Avatar" style={{ width: 58, height: 58 }} />}

				<ServerContent>
					<div>
						{server.isHosted && HostedIcon}
						{server.isPassworded && PasswordedIcon}
						{server.saglMetadata?.isSupporter && SupporterIcon}
						<Title><span className="a">{server.saglMetadata?.displayName ?? server.name}</span> <span className="b">{server.name}</span></Title>
					</div>
					<ServerText>
						<span onClick={() => setClicked(c => !c)}>{clicked ? server.address : server.saglMetadata?.hostname ?? server.hostname}</span> {server.language && <>&nbsp;//</>} {server.language} {server.gamemode && <>&nbsp;//</>} {server.gamemode}
					</ServerText>
				</ServerContent>

				<Active>
					{server.players?.currentPlayers}/{server.players?.maxPlayers} online
				</Active>
			</ServerContainer>

			{includeSocials && <div style={{ display: 'flex', flexDirection: 'row' }}>
				<Socials hostname={server.hostname} socials={server.saglMetadata?.socialNetworks ?? {}} />
			</div>}
		</>
	)
})

ServerListItem.displayName = 'ServerListItem';
