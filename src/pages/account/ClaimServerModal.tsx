import * as React from 'react';
import { Button, Form, Message, Modal, Radio, RadioGroup } from 'rsuite';
import { serverClient } from '../../api-types/client';
import { ClaimServerRequest_ClaimType, Server } from '@buf/xeonr_sagl-servers.bufbuild_es/serversapi/v1/api_pb';
import { SAGLAccountContext } from '../../SAGLAccount';

export const ClaimServerModal = React.memo(({ open, onClose, prefillIp }: { prefillIp?: string, open: boolean; onClose(): void }) => {
	const [ip, setIp] = React.useState(prefillIp ?? '');
	const [error, setError] = React.useState('');
	const [canClaim, setCanClaim] = React.useState(false);
	const [fileLocation, setFileLocation] = React.useState<string>('');
	const [server, setServer] = React.useState<Server | null>(null);
	const [claimType, setClaimType] = React.useState<ClaimServerRequest_ClaimType | null>(null);
	const { account } = React.useContext(SAGLAccountContext);
	const [loading, setLoading] = React.useState(false);

	const close = React.useCallback(() => {
		setLoading(false);
		setError('');
		setCanClaim(false);
		setFileLocation('');
		setServer(null);
		setClaimType(null);
		setIp('');
		onClose();
	}, [onClose]);

	const add = React.useCallback(() => {
		setError('');
		setLoading(true);

		if (server) {
			serverClient.claimServer({
				ipAddress: server.ipAddress,
				port: server.port,
				claimType: claimType ?? ClaimServerRequest_ClaimType.HTTP,
			}).then((response) => {
				setLoading(false);
				if (response.success) {
					window.location.href = '/account/claimed';
				} else {
					setError('We were unable to find verification using this method for your server, please double check and try again.');
				}
			})
		} else {
			serverClient.getServer({
				target: ip,
			}).then((response) => {
				setLoading(false);
				if (response.server) {
					setCanClaim(true);
					setFileLocation(`http://${response.server.ipAddress}/sagl.json`);
					setServer(response.server);
				} else {
					setError('Unable to contact a SA:MP server at that address, please try again.');
				}
			});
		}

	}, [ip, claimType, server]);

	const description = {
		[ClaimServerRequest_ClaimType.HTTP]: (
			<>
				<p> Create a file containing the following text to a webserver at <code>{fileLocation}</code>:</p>
				<pre style={{ background: 'black', padding: 10 }}>
					<code>
						{JSON.stringify({
							owners: [...server?.saglOwners.map(i => i.username) ?? [], account?.discordUsername],
						}, null, 4)}
					</code>
				</pre>
			</>
		),
		[ClaimServerRequest_ClaimType.RULE]: (
			<>
				<p> Edit your <code>server.cfg</code> file for your SA:MP server and set <code>hostname</code> or <code>weburl</code> to the following (you can revert back once claimed):</p>
				<pre style={{ background: 'black', padding: 10 }}>
					<code>weburl sagl@{account?.discordUsername}</code>
				</pre>
				<i>or</i>
				<pre style={{ background: 'black', padding: 10 }}>
					<code>hostname sagl@{account?.discordUsername}</code>
				</pre>
			</>
		)
	}

	return (
		<Modal backdrop={'static'} keyboard={false} open={open} onClose={close}>
			<Form>
				<Modal.Header>
					<Modal.Title>Claim SA:GL Server</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					{!canClaim && (
						<>
							<p> Please enter the IP address and port of the server you want to claim.</p>
							<br />
							<Form.Control style={{ width: '100%' }} name="ip" errorPlacement='topEnd' errorMessage={error} placeholder='play.example.com:7777' value={ip} onChange={e => setIp(e)} />
						</>
					)}
					{canClaim && (
						<>
							{error && <Message style={{ marginBottom: 20 }} type="warning">{error}</Message>}
							<p> How would you prefer to verify your server?</p>
							<RadioGroup value={claimType as any} onChange={setClaimType as any}>
								<Radio value={ClaimServerRequest_ClaimType.RULE}> By altering my servers <code>weburl</code> or <code>hostname</code> setting temporarily</Radio>
								<Radio value={ClaimServerRequest_ClaimType.HTTP}> By uploading a file to <code>{fileLocation}</code></Radio>
							</RadioGroup>
							<br />
							{claimType && description[claimType]}
						</>
					)}
				</Modal.Body>
				<Modal.Footer>
					<Button type="submit" onClick={add} appearance="primary" disabled={!ip || loading}>
						{canClaim ? 'Claim' : 'Start'}
					</Button>
					<Button onClick={close} appearance="subtle">
						Cancel
					</Button>
				</Modal.Footer>
			</Form>
		</Modal>
	)
});
