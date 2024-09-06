import * as React from 'react';
import { IAccount, deleteToken, getAccount, getAuthUrl, getToken } from './api-types/cloud';
import { v4 } from 'uuid';

export const SAGLAccountContext  = React.createContext<{
	account: IAccount | null;
	loadAccount: () => Promise<void>;
	logout: () => void;
	login: (path?: string) => void;
}>({
	loadAccount: async () => {},
	logout() {

	},
	login() {},
	account: null,
});

export const SAGLAccount = React.memo((props: React.PropsWithChildren<{}>) => {
	const [user, setUser] = React.useState<IAccount | null>(null);
	const [ready, setReady] = React.useState(false);

	const loadUser = React.useCallback(() => {
		return getAccount()
			.then(res => {
				setUser(res);
			})
			.catch(() => {
				deleteToken();
				setUser(null);
			})
	}, []);

	const logout = React.useCallback(() => {
		deleteToken();
		window.location.href = '/';
		setUser(null);
	}, []);
	const login = React.useCallback((path?: string) => {
		const state = v4();
		if (path) {
			localStorage.setItem('authpath', path);
		}
		getAuthUrl(state).then((url) => {
			localStorage.setItem('authstate', state);
			window.location.href = url.redirectUrl;
		});
	}, []);

	React.useEffect(() => {
		const jwt = getToken();
		if (jwt) {
			loadUser().then(() => {
				setReady(true);
			});
		} else {
			setReady(true);
		}
	}, []);

	return (
		<SAGLAccountContext.Provider value={{ account: user, loadAccount: loadUser, logout, login }}>
			{ready && props.children}
		</SAGLAccountContext.Provider>
	)
});
