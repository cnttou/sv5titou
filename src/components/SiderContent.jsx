import { Layout, List, Typography } from 'antd';
import { useSelector } from 'react-redux';
import styles from '../styles/Sider.module.css';

const { Title } = Typography;
const { Sider } = Layout;

function SiderContent(props) {
    const listActivity = useSelector((state) => Object.values(state.myActivity.value).filter(c=> c.typeActivity === 'register'));

	return (
		<Sider
			theme="light"
			className={styles.siderBar}
			width={300}
			id="sticky"
		>
			<List
				header={<Title level={5}>Các hoạt động đã đăng ký</Title>}
				bordered
				dataSource={listActivity}
				renderItem={(item) => <List.Item>{item.name}</List.Item>}
			/>
		</Sider>
	);
}

export default SiderContent;
