import styled, { css } from 'styled-components';

export const Button = styled.button<{ variant?: 'none' | 'primary' }>`
	position: relative;
	background: none;
	background-color: rgba(255, 255, 255, 0.08);
	color: #FFF;
	font-family: 'Bank Gothic Regular';
	margin: 0 .25em 0 0;
	padding: 0.75em 1.5em;
	font-weight: 700;
	line-height: 1em;
	text-align: center;
	border-radius: 3px;
    border: 1px solid hsla(0,0%,100%,.25);
	cursor: pointer;
	text-decoration: none;
	transition: background-color .2s linear,color .2s linear;

	${p => (p.variant === 'none' || !p.variant) && css`
		background-color: rgba(255, 255, 255, 0.08);
	`}

	${p => p.variant === 'primary' && css`
		background-color: #e28b10;

		&:hover {
			background-color: #d47e05;
		}
	`}
`;

export const TransparentButton = styled.button`
	background: transparent;
	border: none;
`
