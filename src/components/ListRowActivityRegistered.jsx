import { Space, List, Typography } from 'antd';
import styles from '../styles/ListRowActivityRegistered.module.css';

const { Text, Title } = Typography;

function ListRowActivityRegistered(props) {
	const { data, handleClick } = props;

	const getStatusProof = (confirm, proof) => {
		if (proof === 0) return <Text>Chưa thêm minh chứng</Text>;
		else if (confirm === 'false' || confirm === false)
			return <Text>Minh chứng chưa xác nhận</Text>;
		else if (confirm === true || confirm === 'true')
			return <Text type="success">Đã xác nhận</Text>;
		return <Text type="danger">{confirm}</Text>;
	};
	return (
		<>
			<Space direction="vertical">
				<List
					header={
						<Title level={5}>Danh sách hoạt động đã đăng ký</Title>
					}
					bordered
					className={styles.list}
					dataSource={data}
					renderItem={(item, index) => (
						<List.Item
							onClick={() => handleClick(index, item)}
							className={styles.listItem}
						>
							<Text ellipsis={true}>{item.name}</Text>
							<Text>
								{getStatusProof(item.confirm, item.proof)}
							</Text>
						</List.Item>
					)}
				/>
			</Space>
		</>
	);
}

export default ListRowActivityRegistered;
