import HeaderUser from '../components/HeaderUser';
import { Layout } from 'antd';
import FooterContent from '../components/FooterContent';

const UserLayout =
	(Component) =>
	({ ...rest }) => {
		return (
			<>
				<Layout className="layout">
					<Component {...rest} />
				</Layout>
			</>
		);
	};
export default UserLayout;
