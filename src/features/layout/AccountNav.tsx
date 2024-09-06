import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { Nav, Sidenav } from 'rsuite';

export const AccountNav = React.memo(() => {
	const [expanded, setExpanded] = React.useState(true);
	const [activeKey, setActiveKey] = React.useState('1');

	return (
		<Sidenav appearance="subtle" expanded={expanded} defaultOpenKeys={['3', '4']} style={{ width: 300, height: 'calc(100vh - 130px)', background: 'rgba(0, 0, 0, 0.15)'}}>
			<Sidenav.Body>
				<Nav activeKey={activeKey} onSelect={setActiveKey} style={{}}>
					<Nav.Item as={NavLink} eventKey="3" to='/account/claimed'>
						Claimed Servers
					</Nav.Item>
				</Nav>
			</Sidenav.Body>
			<Sidenav.Toggle expanded={expanded} onToggle={expanded => setExpanded(expanded)} />
		</Sidenav>

	)
});
