import { Space, List, Typography, Button, message, Modal } from 'antd';
import InputUpload from '../components/InputUpload';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import styles from '../styles/ListRowActivityRegistered.module.css';
import {
	cancelMyConfirmProofAction,
	deleteImageByFullPathAction,
	editProofActivityAction,
	getImageProofByActivityAction,
	removeRegisteredActivityAction,
} from '../store/actions';
import { deleteFolderImageActivityApi } from '../api/firebaseStorage';
import { addImageToActivityAction } from '../store/reducers/myActivitySlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useState } from 'react';
import ActivityFeed from './ActivityFeed';

const { Text, Title } = Typography;
const { confirm } = Modal;
export const colorCard = (id, confirm) => {
	if (confirm === false) return '#69c0ff';
	else if (confirm === true) return '#73d13d';
	return 'white';
};
function ListRowActivityRegistered() {
	const [visible, setVisible] = useState(false);
	const [indexData, setIndexData] = useState(0);

	const dispatch = useDispatch();
	const data = useSelector((s) =>
		s.myActivity.value.filter((c) => c.typeActivity === 'register')
	);
	const { loading, unregistering } = useSelector((s) => s.myActivity);

	useEffect(() => {
		if (visible === true) {
			console.log('Show model', data[indexData]);
			if (!data[indexData].images && data[indexData].proof !== 0)
				dispatch(getImageProofByActivityAction(data[indexData].id));
		}
	}, [visible]);

	const showBoxQuestion = () => {
		confirm({
			title: 'Bạn có chắc muốn hủy hoạt động?',
			icon: <ExclamationCircleOutlined />,
			content:
				'Tất cả những file minh chứng của hoạt động này cũng bị xóa theo.',
			onOk() {
				console.log('clicked unregister', data[indexData]);
				return handleUnregister();
			},
			onCancel() {},
		});
	};
	const handleUnregister = async () => {
		if (data[indexData].confirm === true) {
			message.warning('Họat động đã được xác nhận nên không thể hủy.');
			return;
		}
		return dispatch(removeRegisteredActivityAction(data[indexData].id))
			.then(() => {
				deleteFolderImageActivityApi(data[indexData].id)
					.then(() => {
						setVisible(false);
					})
					.catch((error) => {
						message.warning(
							'Đã hủy thành công, nhưng minh chứng chưa xóa được'
						);
						console.log(error.message);
					});
			})
			.catch((error) => {
				message.error('Hủy thất bại, vui lòng thử lại');
				console.log(error.message);
			});
	};
	const handleBeforeUpload = (file) => {
		if (data[indexData].confirm === true) {
			message.warning('Không thể thêm khi hoạt động đã được xác nhận');
			return false;
		}
		if (data[indexData].confirm !== false) {
			dispatch(cancelMyConfirmProofAction(data[indexData].id));
		}
		return true;
	};
	const handleAfterUpload = (url, snapshot) => {
		dispatch(
			editProofActivityAction({
				number: 1,
				acId: data[indexData].id,
			})
		);
		let image = {
			url,
			fullPath: snapshot.ref.fullPath,
			name: snapshot.ref.name,
		};
		dispatch(addImageToActivityAction({ acId: data[indexData].id, image }));
	};
	const handleRemoveImage = (image) => {
		if (data[indexData].confirm === true) {
			message.warning('Họat động đã được xác nhận nên không xóa ảnh.');
			return;
		}
		let acId = data[indexData]['id'];

		console.log('remove image: ', image);
		if (acId) {
			dispatch(
				deleteImageByFullPathAction({ path: image.fullPath, acId })
			).then(() => {
				dispatch(
					editProofActivityAction({
						number: -1,
						acId,
					})
				);
			});
		}
	};
	const handleClickActivityFeed = (index, obj) => {
		if (index === null || index === undefined) {
			Modal.error({
				title: 'Lỗi',
				content: 'Vui lòng tải lại trang và thử lại',
			});
			return;
		}

		setIndexData(index);
		setVisible(true);
	};
	const getStatusProof = (confirm, proof) => {
		if (proof === 0) return <Text>Chưa thêm minh chứng</Text>;
		else if (confirm === 'false' || confirm === false)
			return <Text>Minh chứng chưa xác nhận</Text>;
		else if (confirm === true || confirm === 'true')
			return <Text type="success">Đã xác nhận</Text>;
		return <Text type="danger">{confirm}</Text>;
	};
	const getActionModal = () =>
		visible && data[indexData].confirm !== true
			? [
					<Button
						key={'Hủy đăng ký'}
						icon={<DeleteOutlined />}
						type="danger"
						onClick={
							data[indexData].proof
								? showBoxQuestion
								: handleUnregister
						}
						loading={unregistering !== 0}
					>
						Hủy đăng ký
					</Button>,
					<InputUpload
						text="Thêm minh chứng"
						key={'proof'}
						id={data[indexData].id}
						handleAfterUpload={handleAfterUpload}
						handleBeforeUpload={handleBeforeUpload}
					/>,
			  ]
			: null;

	return (
		<>
			<Space direction="vertical">
				<List
					header={
						<Title level={5}>Danh sách hoạt động đã đăng ký</Title>
					}
					bordered
					loading={loading !== 0}
					className={styles.list}
					dataSource={data}
					renderItem={(item, index) => (
						<List.Item
							onClick={() => handleClickActivityFeed(index, item)}
							className={styles.listItem}
							style={{ cursor: 'pointer' }}
						>
							<Text ellipsis={true}>{item.name}</Text>
							<Text>
								{getStatusProof(item.confirm, item.proof)}
							</Text>
						</List.Item>
					)}
				/>
			</Space>
			{data[indexData] && (
				<Modal
					className="modeUseModel"
					bodyStyle={{ padding: 0 }}
					visible={visible}
					title="Chi tiết"
					footer={getActionModal() || null}
					centered={true}
					onCancel={() => setVisible(false)}
				>
					{indexData !== null && (
						<ActivityFeed
							{...data[indexData]}
							showFull={true}
							colorCard={colorCard}
							btnDetail={false}
							loading={loading || false}
							handleRemoveImage={
								data[indexData].confirm !== true
									? handleRemoveImage
									: null
							}
						/>
					)}
				</Modal>
			)}
		</>
	);
}

export default ListRowActivityRegistered;
