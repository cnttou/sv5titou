import { Layout, List, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styles from '../styles/Sider.module.css';

const { Title } = Typography;
const { Sider } = Layout;

function SiderContent(props) {
    const activities = useSelector((state) =>
		state.activity.value.filter((c) => c.typeActivity === 'register')
	);
	const myActivity = useSelector((state) => state.myActivity.value);

	const { slideShowItems } = useSelector((state) => state.other);
    
	return (
		<Sider
			theme="light"
			className={styles.siderBar}
			width={300}
			style={{ maxHeight: 'calc(100vh - 115px)', overflowY: 'auto' }}
			id="sticky"
		>
			<List
				header={<Title level={5}>Các hoạt động đã đăng ký</Title>}
				bordered
				dataSource={activities.filter((c) => myActivity[c.id])}
				renderItem={(item) => (
					<List.Item key={item.id}>
						<a href={`#activity_${item.id}`}>{item.name}</a>
					</List.Item>
				)}
			/>
			<List
				header={<Title level={5}>Thông báo</Title>}
				bordered
				dataSource={slideShowItems}
				renderItem={(item) => (
					<List.Item key={item.id}>
						{item.url ? (
							<a href={item.url} target="_blank">
								<img
									style={{
										objectFit: 'cover',
										width: '100%',
									}}
									alt={''}
									src={item.image}
								/>
							</a>
						) : (
							<img
								style={{
									objectFit: 'cover',
									width: '100%',
								}}
								alt={''}
								src={item.image}
							/>
						)}
					</List.Item>
				)}
			/>
		</Sider>
	);
}

export default SiderContent;
