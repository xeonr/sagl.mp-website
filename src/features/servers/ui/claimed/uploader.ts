import { FileLoader, UploadResponse } from '@ckeditor/ckeditor5-upload';
import { metaClient } from '../../../../api-types/client';
import { BalloonEditor } from '@ckeditor/ckeditor5-editor-balloon';

// @ts-nocheck
class MyUploadAdapter {

	constructor(private loader: FileLoader) {
	}

	// Starts the upload process.
	upload(): Promise<UploadResponse> {
		return this.loader.file
			.then(async file => {
				const image = await metaClient.startImageUpload({
					filename: file?.name!,
					filesize: BigInt(file?.size ?? 0),
					contentType: file?.type!
				});

				return fetch(image.uploadUrl, {
					method: 'PUT',
					body: file!,
					mode: 'cors',
				}).then(() => {
					return {
						default: `https://sagl-servers-prod.s3.eu-west-2.amazonaws.com/usercontent/${image.uploadId}`,
					}
				});
			});
	}
}

export function ImageUploadPlugin(editor: BalloonEditor) {
	editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
		// Configure the URL to the upload script in your back-end here!
		return new MyUploadAdapter(loader);
	};
}
