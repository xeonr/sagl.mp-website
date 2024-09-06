import styled, { css } from 'styled-components';

export type Breakpoint = [number | null, number | null];

export const Breakpoints: { XS: Breakpoint; SM: Breakpoint; MD: Breakpoint } = {
	XS: [null, 599],
	SM: [600, 959],
	MD: [960, null],
}


export function flex(amount: number | null, direction: 'row' | 'column'): any {
	if (!amount) {
		return css`
			flex: 1 1 0%;
		`;
	}

	return css`
		flex: 1 1 100%;
		box-sizing: border-box;

		${direction === 'row' && css`max-width: ${amount}%;`}
		${direction === 'column' && css`max-height: ${amount}%;`}
	`;
}

export function layout(direction: 'column' | 'row' | 'column-reverse' | 'row-reverse', wrap?: 'wrap'): any {
	return css`
		display: flex;
		flex-direction: ${direction};

		${wrap && css`flex-wrap: wrap;`}
	`;
}

const alignments: { [key: string]: string } = {
	center: 'center', end: 'flex-end', start: 'flex-start', between: 'space-between', around: 'space-around'
};

export function layoutAlign(direction: string, otherDirection: string): any {
	return css`
		place-content: ${alignments[otherDirection]} ${alignments[direction]};
		justify-content: ${alignments[direction]};
		align-items: ${alignments[otherDirection]};
	`;
}

export function withBreak(style: any, bp: Breakpoint[]): any {
	const media = bp.map(i => {
		const strs = [];

		if (i[0]) {
			strs.push(`(min-width: ${i[0]}px)`);
		}

		if (i[1]) {
			strs.push(`(max-width: ${i[1]}px)`);
		}

		return strs.join(' and ');
	}).join(', ');

	return css`
		@media ${media} {
			${style}
		}
	`;
}

export const Flex = styled.div<{ dir: 'row' | 'column'}>`
	${p => flex(null, p.dir)}
`
