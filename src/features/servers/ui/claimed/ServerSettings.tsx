import { SAGLMetadata, Server } from '@buf/xeonr_sagl-servers.bufbuild_es/serversapi/v1/api_pb';
import * as React from 'react';
import { Button, Checkbox, Form } from 'rsuite';
import { ServerListItem } from '../../ServerListItem';
import { serverClient } from '../../../../api-types/client';
import { MDStyle } from '../Md';
import { CKEditor } from '@ckeditor/ckeditor5-react';

import Editor from './editor';
import { ImageUploadPlugin } from './uploader';
import { IconUploader } from './IconUploader';
import { SocialConfig } from './SocialConfig';
import { SAGLAccountContext } from '../../../../SAGLAccount';

export const ServerSettings = React.memo((props: { server: Server }) => {
	const [hostname, setHostname] = React.useState(props.server.saglMetadata?.hostname || undefined);
	const [displayName, setDisplayName] = React.useState(props.server.saglMetadata?.displayName || undefined);
	const [description, setDescription] = React.useState(props.server.saglMetadata?.description || undefined);
	const [profileIcon, setProfileIcon] = React.useState<string | undefined>(props.server.saglMetadata?.profileIcon ?? undefined);
	const [socials, setSocials] = React.useState<{ [key: string]: string }>(props.server.saglMetadata?.socialNetworks ?? {});
	const [supporter, setSupporter] = React.useState<boolean>(props.server.saglMetadata?.isSupporter ?? false);
	const { account } = React.useContext(SAGLAccountContext);


	const customServer = React.useMemo(() => {
		const server = Server.fromJson(props.server.toJson());
		server.saglMetadata = new SAGLMetadata();

		if (hostname) {
			server.saglMetadata.hostname = hostname;
		}

		if (displayName) {
			server.saglMetadata.displayName = displayName;
		}

		if (description) {
			server.saglMetadata.description = description;
		}

		if (profileIcon) {
			server.saglMetadata.profileIcon = profileIcon;
		}

		server.saglMetadata.socialNetworks = socials ?? props.server.saglMetadata?.socialNetworks ?? [] as any;
		server.saglMetadata.isSupporter = supporter ?? false;
		return server;
	}, [hostname, displayName, description, profileIcon, socials, supporter]);

	const onSubmit = React.useCallback(() => {
		serverClient.updateClaimedServer({
			ipAddress: props.server.ipAddress,
			port: props.server.port,
			saglMetadata: customServer.saglMetadata,
		}).then(r => {
			console.log(r);
		})
			.catch(err => {
				console.log(err);
			})
	}, [customServer.saglMetadata]);

	return (
		<>
			<ServerListItem server={customServer} includeSocials={true} link='/server'/>
			<Form style={{ marginTop: 30 }} onSubmit={onSubmit}>
				<div style={{ display: 'flex', flexDirection: 'row' }}>
					<Form.Group controlId="hostname" style={{ flex: 1 }}>
						<Form.ControlLabel>Custom Hostname (DNS)</Form.ControlLabel>
						<Form.Control size='lg' name="email" type="text" placeholder={props.server.hostname} value={hostname} onChange={(e) => setHostname(e)} />
						<Form.HelpText tooltip>A custom hostname that points to your servers IP address (Note: we periodically confirm this DNS still resolves)</Form.HelpText>
					</Form.Group>

					<Form.Group controlId="email-6" style={{ flex: 1 }}>
						<Form.ControlLabel>Display Name</Form.ControlLabel>
						<Form.Control size='lg' style={{ width: '100%' }} name="email" type="text" placeholder={props.server.name} value={displayName} onChange={(e) => setDisplayName(e)} />
						<Form.HelpText tooltip>This overrides the hostname reported by the SA:MP server.</Form.HelpText>
					</Form.Group>

					<Form.Group controlId="email-6" style={{ flex: 1 }}>
						<Form.ControlLabel>Icon</Form.ControlLabel>
						<IconUploader value={profileIcon} onChange={setProfileIcon} />
					</Form.Group>
				</div>

				<Form.ControlLabel>Description</Form.ControlLabel>
				<MDStyle editor={true}>
					<CKEditor
						editor={Editor}
						config={{ extraPlugins: [ImageUploadPlugin as any], heading: {
							options: [
								{ model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
								{ model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
								{ model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
								{ model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
								{ model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
							]
						} }}
						data={description}
						onChange={(_, editor) => {
							const data = editor.getData();
							setDescription(data);
						}}
					/>
				</MDStyle>

				<br />
				<br />
				<Form.ControlLabel>Social Networks</Form.ControlLabel>
				<SocialConfig socials={socials} onChange={setSocials} />


				{account?.admin && (
					<>
						<Form.ControlLabel>Admin?</Form.ControlLabel>
						<br />
						<Checkbox checked={supporter} onClick={() => setSupporter(!supporter)}> Supports SA:GL</Checkbox>
					</>
				)}

				<br />
				<br />
				<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', width: '100%' }}>
					<Button type="submit" size="lg" appearance='primary'> Save </Button>
				</div>
			</Form>
		</>
	)
})
