import styled, { css } from 'styled-components';

export const mdStyles = css`
	.remirror-editor-wrapper > div {
		outline: none;
	}

	.remirror-editor-wrapper {
		max-height: 400px;
    	overflow-y: scroll;
	}


	font-family: Arial, sans-serif;
	font-weight: 400;

	h1 {
		font-family: 'Bank Gothic Regular';
		font-size: 34px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.2);
		margin-top: 20px;
	}

	h2, h3, h4, h5, h6  {
		margin-top: 15px;
		font-family: 'Aharoni Bold';
	}

	h2 {
		font-size: 20px;
	}
	h3 {
		font-size: 18px;
	}

	h4 {
		font-size: 16px;
	}

	h5 {
		font-size: 14px;
	}

	p {
		color: white;
	}

	a {
		color: #e28b10!important;
		font-weight: bold;
		&:hover {
			opacity: 0.6;
		}
	}

	table {
		margin: 15px 0px;
		padding: 10px;
		border-radius: 5px;
		border: 1px solid rgba(255, 255, 255, 0.2);

		td, th {
			padding: 5px;
		}

		th {
			background: rgba(255, 255, 255, 0.1);
		}
	}

	pre, :not(pre) > code {
		background: rgba(255, 255, 255, 0.2);
		font-size: 12px;
		padding: 4px 6px;
		font-family: monospace;
	}

	p {
		padding-top: 10px;
	}


	blockquote {
		padding: 0;
		border-left: none;
		margin-top: 10px;
	}
	blockquote p {
		padding: 5px;
		max-width: 60%;
		padding-left: 15px;

		border-left: 3px solid rgba(255, 255, 255, 0.2);
	}
`;


export const MDStyle = styled.div<{ editor?: boolean }>`
	${p => p.editor && css`
	    padding: 5px;
		background: #1a1d24;
		border: 1px solid #ffffff21;
		border-radius: 5px;
	`}
	${mdStyles}
`
