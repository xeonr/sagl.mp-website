import '../../../../editor.css';
/**
 * @license Copyright (c) 2014-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

import { BalloonEditor } from '@ckeditor/ckeditor5-editor-balloon';

import { Alignment } from '@ckeditor/ckeditor5-alignment';
import { Autoformat } from '@ckeditor/ckeditor5-autoformat';
import {
	Bold,
	Code,
	Italic,
	Strikethrough,
	Subscript,
	Superscript,
	Underline
} from '@ckeditor/ckeditor5-basic-styles';
import { BlockQuote } from '@ckeditor/ckeditor5-block-quote';
import { CodeBlock } from '@ckeditor/ckeditor5-code-block';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { FindAndReplace } from '@ckeditor/ckeditor5-find-and-replace';
import { Heading } from '@ckeditor/ckeditor5-heading';
import { HorizontalLine } from '@ckeditor/ckeditor5-horizontal-line';
import { AutoImage, Image, ImageToolbar, ImageUpload } from '@ckeditor/ckeditor5-image';
import { AutoLink, Link, LinkImage } from '@ckeditor/ckeditor5-link';
import { List, ListProperties } from '@ckeditor/ckeditor5-list';
import { Markdown } from '@ckeditor/ckeditor5-markdown-gfm';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import {
	Table,
	TableToolbar
} from '@ckeditor/ckeditor5-table';
import { BlockToolbar } from '@ckeditor/ckeditor5-ui';

// You can read more about extending the build with additional plugins in the "Installing plugins" guide.
// See https://ckeditor.com/docs/ckeditor5/latest/installation/plugins/installing-plugins.html for details.

class Editor extends BalloonEditor {
	public static override builtinPlugins = [
		Alignment,
		AutoImage,
		AutoLink,
		Autoformat,
		BlockQuote,
		BlockToolbar,
		Bold,
		Code,
		CodeBlock,
		Essentials,
		FindAndReplace,
		Heading,
		HorizontalLine,
		Image,
		ImageToolbar,
		ImageUpload,
		Italic,
		Link,
		LinkImage,
		List,
		ListProperties,
		Markdown,
		Paragraph,
		Strikethrough,
		Subscript,
		Superscript,
		Table,
		TableToolbar,
		Underline
	];

	public static override defaultConfig = {
		toolbar: {
			items: [
				'heading',
				'bold',
				'italic',
				'underline',
				'link',
				'code',
				'strikethrough',
				'superscript',
				'subscript'
			]
		},
		language: 'en',
		blockToolbar: [
			'heading',
			'blockQuote',
			'codeBlock',
			'horizontalLine',
			'numberedList',
			'bulletedList',
			'insertTable',
			'uploadImage',
		],
		image: {
			toolbar: [
				'imageTextAlternative',
				'linkImage'
			]
		},
		table: {
			contentToolbar: [
				'tableColumn',
				'tableRow',
				'mergeTableCells',
				'tableCellProperties'
			]
		}
	};
}

export default Editor;
