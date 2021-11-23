import { Space, List, Typography, Button, message, Modal } from 'antd';
import { useState } from 'react';
import InputUpload from '../components/InputUpload';
import styles from '../styles/ListRowActivityRegistered.module.css';
import {
	addConfirmActivityAction,
	deleteImageByFullPathAction,
	editProofActivityAction,
	getImageProofByActivityAction,
} from '../store/actions';
import { addImageToActivityAction } from '../store/reducers/myActivitySlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import ActivityFeed from './ActivityFeed';
import { colorCard } from './ListRowActivityRegistered';

const { Text, Title } = Typography;

function ListRowOtherActivity() {
	const [visible, setVisible] = useState(false);
	const [indexData, setIndexData] = useState(0);

	const dispatch = useDispatch();
	let data = useSelector((s) =>
		s.myActivity.value.filter((c) => c.typeActivity === 'other')
	);
	let { loading } = useSelector((s) => s.myActivity);

	const handleBeforeUpload = (file) => {
		if (data[indexData].confirm && data[indexData].confirm === true) {
			message.warning('Không thể thêm khi hoạt động đã được xác nhận');
			return false;
		}
		return true;
	};
	const handleAfterUpload = (url, snapshot) => {
		let dataAction = {
			...data[indexData],
			number: 1,
			acId: data[indexData].id,
		};
		if (data[indexData].proof)
			dispatch(editProofActivityAction(dataAction));
		else dispatch(addConfirmActivityAction({ ...dataAction, proof: 1 }));
		let image = {
			url,
			fullPath: snapshot.ref.fullPath,
			name: snapshot.ref.name,
		};
		dispatch(addImageToActivityAction({ acId: data[indexData].id, image }));
	};

	useEffect(() => {
		if (visible === true) {
			console.log('Show model', data[indexData]);
			if (data[indexData].proof && !data[indexData].images)
				dispatch(getImageProofByActivityAction(data[indexData].id));
		}
	}, [visible]);

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
		if (proof === 0) return;
		else if (confirm === 'false' || confirm === false)
			return <Text>Minh chứng chưa xác nhận</Text>;
		else if (confirm === true || confirm === 'true')
			return <Text type="success">Đã xác nhận</Text>;
		return <Text type="danger">{confirm}</Text>;
	};
	const getActionModal = () =>
		visible && data[indexData].confirm !== true
			? [
					<InputUpload
						text="Thêm minh chứng"
						key={'proof'}
						id={data[indexData].id}
						handleAfterUpload={handleAfterUpload}
						handleBeforeUpload={handleBeforeUpload}
					/>,
			  ]
			: null;
	const handleRemoveImage = (image) => {
		if (data[indexData].confirm === true) {
			message.warning('Họat động đã được xác nhận nên không xóa ảnh.');
			return;
		}
		let acId = data[indexData]['id'];

		console.log('remove image: ', image);
		if (acId) {
			dispatch(
				deleteImageByFullPathAction({
					path: image.fullPath,
					acId,
				})
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

	return (
		<>
			<Space direction="vertical">
				<List
					header={<Title level={5}>Danh sách minh chứng khác</Title>}
					bordered
					style={{ cursor: 'pointer' }}
					className={styles.list}
					dataSource={data}
                    loading={loading!==0}
					renderItem={(item, index) => (
						<List.Item
							onClick={() => handleClickActivityFeed(index, item)}
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
					<ActivityFeed
						{...data[indexData]}
						showFull={true}
						colorCard={colorCard}
						btnDetail={false}
						loading={false}
						handleRemoveImage={
							data[indexData].confirm === true
								? null
								: handleRemoveImage
						}
					/>
				</Modal>
			)}
		</>
	);
}

export default ListRowOtherActivity;
