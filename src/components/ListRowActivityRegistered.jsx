import { Space, List, Typography, Button } from 'antd';
import styles from '../styles/ListActivityFeed.module.css';

const { Text } = Typography;

function ListRowActivityRegistered(props) {
	const { data, handleClick } = props;

	const getStatusProof = (confirm) => {
		if (confirm === 'false' || confirm === false)
			return <Text>Minh chứng chưa xác nhận</Text>;
		else if (confirm === true || confirm === 'true')
			return <Text type="success">Đã xác nhận</Text>;
		return <Text type="danger">{`Không hợp lệ vì ${confirm}`}</Text>;
	};
	return (
		<>
			<Space direction="vertical" className={styles.content}>
				<List
					header={<div>Danh sách hoạt động đã đăng ký</div>}
					bordered
					className={styles.list}
					dataSource={data}
					renderItem={(item, index) => (
						<List.Item>
							<Button
								type="link"
								onClick={() => handleClick(index, item)}
								style={{ paddingLeft: 0 }}
							>
								{item.name}
							</Button>
							<Text>{getStatusProof(item.confirm)}</Text>
						</List.Item>
					)}
				/>
			</Space>
		</>
	);
}

export default ListRowActivityRegistered;
