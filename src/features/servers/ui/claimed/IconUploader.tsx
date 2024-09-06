import { faSpinner, faTrash, faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react'
import { Avatar, Button } from 'rsuite';
import { metaClient } from '../../../../api-types/client';

export const IconUploader = React.memo((props: { value: string | undefined; onChange(value: string | undefined): void }) => {
	const ref = React.useRef<HTMLInputElement>(null);
	const [saving, setSaving] = React.useState(false);
	const onChange = React.useCallback(() => {
		if (ref.current?.files?.length) {
			const file = ref.current.files[0];
			if (!file) {
				return;
			}

			setSaving(true);

			metaClient.startImageUpload({
				filename: file?.name!,
				filesize: BigInt(file?.size ?? 0),
				contentType: file?.type!
			}).then(image => {
				return fetch(image.uploadUrl, {
					method: 'PUT',
					body: file!,
					mode: 'cors',
				}).then(() => image)
			})
				.then((image) => {
					props.onChange(`https://sagl-servers-prod.s3.eu-west-2.amazonaws.com/usercontent/${image.uploadId}`)
				})
				.catch(err => {
					console.log(err);
				})
				.finally(() => {
					setSaving(false);
				})
		}
	}, []);

	const onUpload = React.useCallback(() => {
		ref.current?.click();
	}, []);

	if (!props.value) {
		return (
			<>
				<input style={{ display: 'none' }} type="file" onChange={onChange} ref={ref} />
				<Button size='md' onClick={onUpload}>
					{!saving && <FontAwesomeIcon icon={faUpload} />}
					{saving && <FontAwesomeIcon icon={faSpinner} spin />}
				</Button>
			</>
		)
	}
	return (
		<div style={{ display: 'flex', flexDirection: 'row' }}>
			<Avatar size='md' src={props.value} style={{ display: 'block' }} />
			<Button size="md" style={{ marginLeft: 10 }} appearance='primary' color='red' onClick={() => props.onChange(undefined)}><FontAwesomeIcon icon={faTrash} /></Button>
		</div>
	)
})
