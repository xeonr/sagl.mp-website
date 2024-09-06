import * as React from 'react';
import { Button, Form, Modal } from 'rsuite';
import { serverClient } from '../../api-types/client';

export const AddServerModal = React.memo(({ open, onClose }: { open: boolean; onClose(): void }) => {
	const [ip, setIp] = React.useState('');
	const [error, setError] = React.useState('');
	const add = React.useCallback(() => {
		setError('');
		const details = ip.split(':');
		if (!details[1]) {
			details[1] = '7777';
		}
		serverClient.trackServer({
			ipAddress: details[0],
			port: parseInt(details[1]),
		}).then((response) => {
			if (response.server) {
				window.location.href = `/server/${response.server.hostname}`;
			} else {
				setError('Unable to contact a SA:MP server at that address, please try again.');
			}
		});
	}, [ip]);
	return (
		<Modal backdrop={'static'} keyboard={false} open={open} onClose={onClose}>
					<Form>
					<Modal.Header>
						<Modal.Title>Add server to SA:GL</Modal.Title>
					</Modal.Header>

					<Modal.Body>
						<p> Please enter the IP address you want to add to SA:GL. New additions can take up to 30 minutes to show up, so you don't need to re-add it.</p>
						<br />
						<Form.Control style={{ width: '100%' }} name="ip" errorPlacement='topEnd' errorMessage={error} placeholder='play.example.com:7777' value={ip} onChange={e => setIp(e)} />
					</Modal.Body>
					<Modal.Footer>
						<Button type="submit" onClick={add} appearance="primary" disabled={!ip}>
							Add
						</Button>
						<Button onClick={onClose} appearance="subtle">
							Cancel
						</Button>
					</Modal.Footer>
					</Form>
				</Modal>
	)
});
