import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faDiscord, faFacebook, faInstagram, faTwitter, faVk, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faGamepad, faLink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import styled, { css } from 'styled-components';

export const socialConfig: { [key: string]: { name: string; icon: IconProp; parse(value: string): string; colour: string; unparse(value: string): string; }} = {
	url: {
		icon: faLink,
		parse: url => url,
		unparse: url => url,
		colour: 'inherit',
		name: 'Website',
	},

	sagl: {
		icon: faLink,
		parse: url => url,
		unparse: url => url,
		colour: '#e28b10',
		name: 'SA:GL',
	},
	discord: {
		icon: faDiscord,
		parse: url => `https://discord.gg/${url}`,
		unparse: url => url.split('/').slice(3).join('/'),
		colour: '#5865F2',
		name: 'Discord',
	},
	facebook: {
		icon: faFacebook,
		parse: url => `https://facebook.com/${url}`,
		unparse: url => url.split('/')[3],
		colour: '#3B5998',
		name: 'Facebook',
	},
	youtube: {
		icon: faYoutube,
		parse: url => `https://youtube.com/${url}`,
		unparse: url => url.split('/').slice(3).join('/'),
		colour: '#FF0000',
		name: 'YouTube',
	},
	twitter: {
		icon: faTwitter,
		parse: url => `https://twitter.com/${url}`,
		unparse: url => url.split('/')[3],
		colour: '#00acee',
		name: 'Twitter',
	},
	vk: {
		icon: faVk,
		parse: url => `https://vk.com/${url}`,
		unparse: url => url.split('/')[3],
		colour: '#2787f5',
		name: 'VK',
	},
	instagram: {
		icon: faInstagram,
		parse: url => `https://instagram.com/${url}`,
		unparse: url => url.split('/')[3],
		colour: '#8a3ab9',
		name: 'Instagram',
	},
};

const platforms = Object.keys(socialConfig);

const SocialSection = styled.div`
	display:flex;
	flex-wrap: wrap;
	width: calc(100% + 15px);
	margin: -7.5px;
`;

export const ThemedButton = styled.a<{ $platform: string; }>`
	background: linear-gradient(215deg,rgb(255 255 255 / 8%),rgb(255 255 255 / 0%));
	${p => socialConfig[p.$platform] && css`background-color: ${socialConfig[p.$platform].colour} !important;`}
	border: 1px solid #ffffff1a;
	border-radius: 3px;
	padding: 5px 20px;
	margin: 20px 7.5px 0px;
	color: #ffffff;
	font-family: 'Bank Gothic Regular';
	font-size: 1.0rem;
	justify-content: center;
	align-items: center;
	display: flex;
	transition: 0.3s ease;
	text-decoration: none;

	svg {
		font-size: 1rem;
		margin-right: 7.5px;
	}

	&:hover {
		color: rgba(255, 255, 255, 0.5) !important;
	}
`;


export const Social = ({ platform, url }: { platform: string; url: string }) => {
	const parsedUrl = React.useMemo(() => socialConfig[platform].parse(url), [platform, url]);

	if (!url || !socialConfig[platform]) {
		return <></>;
	}

	return (
		<ThemedButton $platform={platform} href={parsedUrl}>
			<FontAwesomeIcon icon={socialConfig[platform].icon} /> {socialConfig[platform].name}
		</ThemedButton>
	)
}

export const Socials = (props: { hostname: string; socials: { [key: string]: string }}) => {
	return (
		<SocialSection>
			{platforms.map(key => <Social key={key} platform={key} url={props.socials[key]} />)}
			<span style={{ flex: '1' }} />
			<ThemedButton $platform="url" href={`samp://${props.hostname}`}>
				<FontAwesomeIcon icon={faGamepad} /> Open SA:MP
			</ThemedButton>

			<ThemedButton $platform="sagl" href={`sagl://${props.hostname}`}>
				<FontAwesomeIcon icon={faGamepad} /> Open SA:GL
			</ThemedButton>
		</SocialSection>
	)
}
