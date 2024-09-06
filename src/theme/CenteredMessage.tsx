import React from 'react';
import Styled from 'styled-components';
const CenteredContent = Styled.div`
	display: flex;
	align-items:center;
	flex-direction: column;
`;
const Header = Styled.div`
	margin: 10px;
	font-size: 30pt;
`;
const Centered = Styled(CenteredContent)`
	margin-top: 100px;
`;
const Message = Styled.div`
	padding: 10px;
	font-size: 15pt;
	margin-bottom: 20px;
`;

interface Props {
	title: string,
	message: string,

	children?: React.ReactNode
}

export default function CenteredMessage(props: Props) {
	return (
		<Centered>
			<Header>{props.title}</Header>
			<Message>
				{props.message}
			</Message>
			{props.children}
		</Centered>
	);
}
