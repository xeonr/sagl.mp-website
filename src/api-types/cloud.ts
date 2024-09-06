const CLOUD_API_HOST = 'https://cloud-api.sagl.app';

const fetchThatThrowsErrors = (url: string, options: RequestInit) => {
	return fetch(url, options)
		.then(res => {
			if (!res.ok) {
				throw new Error(res.statusText);
			}
			return res;
		});
}

export function setToken(jwt: string) {
	localStorage.setItem('jwt', jwt);
}

export function getToken() {
	return localStorage.getItem('jwt');
}

export function deleteToken() {
	localStorage.removeItem('jwt');
}

export function getAuthUrl(state: string): Promise<{ redirectUrl: string }> {
	return fetch(`${CLOUD_API_HOST}/v1/auth?state=${state}&redirectUri=${window.location.origin}/auth`)
		.then(res => res.json());
}

export function getSaves(): Promise<{ slot: number, current: IGameSave }[]> {
	return fetchThatThrowsErrors(`${CLOUD_API_HOST}/v1/saves`, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem('jwt')}`,
		},
	})
		.then(res => res.json());
}
export function getGallery(): Promise<IGalleryImage[]> {
	return fetchThatThrowsErrors(`${CLOUD_API_HOST}/v1/gallery`, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem('jwt')}`,
		},
	})
		.then(res => res.json());
}


export function postAuth(state: string): Promise<{ jwt: string }> {
	return fetch(`${CLOUD_API_HOST}/v1/auth`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ state }),
	})
		.then(res => res.json());
}

export function getAccount(): Promise<IAccount> {
	return fetchThatThrowsErrors(`${CLOUD_API_HOST}/v1/account`, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem('jwt')}`,
		},
	})
		.then(res => res.json());
}

export interface IAccount {
	id: string;
	discordAvatar: string;
	discordUsername: string;
	discordDiscriminator: string;
	discordId: string;
	discordAccessToken: string;
	discordRefreshToken: string;
	discordAccessExpiry: string;
	email: string;
	sampUsername: string;
	launcherSettings: any;
	whitelisted: boolean;
	createdAt: string;
	updatedAt: string;
	admin: string;
}

export interface IGameSave {
	hash: string,
	name: string,
	version: string,
	completed: number,
	savedAt: string,
	createdAt: string,
	cdnUrl: string,
	computerId: string,
	computerName: string,
}

export interface IGalleryImage {
	id: string,
	name: string,
	source: string,
	originalCreatedAt: string,
	createdAt: string,
	cdnUrl: string,
	fileHash: string,
}
