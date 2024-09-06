import * as React from 'react';
import { socialConfig } from '../Socials';
import { Input } from 'rsuite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';



export const SocialConfig = React.memo((props: { socials: { [key: string]: string }, onChange: (socials: { [key: string]: string }) => void }) => {
	const [socialNetworkState, setSocialNetworkState] = React.useState<{ [key: string]: string }>({});
	React.useEffect(() => {
		const st: { [key: string]: string } = {};
		for (const [key, value] of Object.entries(socialConfig)) {
			st[key] = props.socials[key] ? value.parse(props.socials[key] ?? '') : '';
		}
		setSocialNetworkState(st);
	}, [props.socials]);

	const onChange = React.useCallback((key: string, value: string) => {
		const newState = { ...socialNetworkState };
		newState[key] = value;
		setSocialNetworkState(newState);
	}, [socialNetworkState, props.onChange]);

	const onBlur = React.useCallback(() => {
		const newState: { [key: string]: string } = {};
		for (const [key, value] of Object.entries(socialNetworkState)) {
			newState[key] = value.includes('/') ? socialConfig[key].unparse(value) : value ?? undefined;
		}
		props.onChange(newState);
	}, [socialNetworkState, props.onChange]);

	const networks = Object.entries(socialConfig).filter(([key]) => key !== 'sagl').map(([key, value]) => (
		<div style={{ flexDirection: 'row', alignItems: 'left', display: 'flex', marginBottom: 10 }}>
			<div style={{ flexDirection: 'row', alignItems: 'center', display: 'flex', width: 150 }}>
				<span style={{ color: value.colour, marginRight: 10, fontSize: 18 }}>
					<FontAwesomeIcon icon={value.icon} />
				</span>
				<p>{value.name}</p>
			</div>
			<Input type="text" placeholder={"SA:GL"} value={socialNetworkState[key]} onChange={(val) => onChange(key, val)} onBlur={() => onBlur()} />
		</div>
	));

	return (
		<>
			{networks}
		</>
	)
});
