'use client'

import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import styled from 'styled-components';
import { Wrapper, Heading1, layout, layoutAlign, Flex, withBreak, Breakpoints } from '../../theme';
import { ThemedButton } from '../servers/ui/Socials';
import { Download } from './Download';
import { Link } from 'react-router-dom';
import { Button } from 'rsuite';
import { SAGLAccountContext } from '../../SAGLAccount';

const Header = styled.header`
	padding: 30px 0px;

	${layout('row', 'wrap')}
	${withBreak(layout('column', 'wrap'), [Breakpoints.XS])}
	${layoutAlign('start', 'center')}
`;

const Logo = styled.img.attrs(() => ({ src: '/assets/logo.png', alt: 'SA:GL' })) <{}>`
	height: 60px;
`;

const LogoText = styled(Heading1)`
	font-size: 2rem;
	padding: 0px 0px;
	color: rgba(255, 255, 255, 0.5);
`

const LogoTextSmall = styled(Heading1)`
	font-size: 1rem;
	padding: 0px 0px;
	margin-top: -6px;
	margin-left: 3px;
	color: rgba(255, 255, 255, 0.8);
`

const NavLink = styled(Link)`
	color: #FFF;
	font-family: 'Bank Gothic Regular';
	font-size: 1.5rem;
	cursor: pointer;
	padding: 5px 15px;
	transition: 0.3s ease;
	text-decoration: none;

	&:hover {
		color: #e28b10;
	}
`

const PlainLink = styled.a`
	color: #FFF;
	font-family: 'Bank Gothic Regular';
	font-size: 1.5rem;
	cursor: pointer;
	padding: 5px 15px;
	transition: 0.3s ease;
	text-decoration: none;

	&:hover {
		color: #e28b10;
	}
`
export const Nav = React.memo(() => {
	const sagl = React.useContext(SAGLAccountContext);
	const skipDownload = true;

	const login = React.useCallback(() => {
		sagl.login();
	}, [sagl.login]);
	return (
		<Wrapper>
			<Header>
				<NavLink to="/"><Logo /></NavLink>
				<NavLink to="/">
					<LogoText> SA:GL </LogoText>
					<LogoTextSmall>Server List </LogoTextSmall>
				</NavLink>

				<NavLink to="/"> Servers </NavLink>
				<NavLink to="/statistics"> Statistics </NavLink>
				<NavLink to="/statistics/map"> Map </NavLink>
				<PlainLink href="https://sagl.app"> Launcher </PlainLink>

				<Flex dir="row" />

				<ThemedButton $platform="discord" href="https://discord.com/invite/rWM5NHKvUE" style={{ padding: '10px 5px 10px 10px', margin: 0, marginRight: 10 }}>
					<FontAwesomeIcon icon={faDiscord} />
				</ThemedButton>

				{!skipDownload && <Download />}
				{sagl.account  && <Button as="a" href="/account/claimed" style={{ padding: 0, marginRight: 10 }}>
					<img src={sagl.account?.discordAvatar} style={{ padding: 0, height: 40, width: 40 }} />
				</Button>}
				{!sagl.account && <Button onClick={login} appearance='primary'>Login</Button>}
				{sagl.account && <Button onClick={sagl.logout} appearance='primary'><FontAwesomeIcon icon={faRightFromBracket} /></Button>}
			</Header>
		</Wrapper>
	)
})
