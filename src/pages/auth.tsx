import * as React from 'react';
import { postAuth, setToken } from '../api-types/cloud';
import { SAGLAccountContext } from '../SAGLAccount';
import { useNavigate } from 'react-router';
export const Auth = React.memo(() => {
	const { loadAccount } = React.useContext(SAGLAccountContext);
	const navigate = useNavigate();
	React.useEffect(() => {
		postAuth(localStorage.getItem('authstate')!).then((res) => {
			if (res.jwt) {
				setToken(res.jwt);
				localStorage.removeItem('authstate');
				loadAccount()
					.then(() => {
						const path = localStorage.getItem('authpath') ?? '/';
						localStorage.removeItem('authpath');
						navigate(path);
					});
			} else {
				navigate('/');
			}
		});
	}, [loadAccount, navigate])

	return (
		<></>
	)
});
