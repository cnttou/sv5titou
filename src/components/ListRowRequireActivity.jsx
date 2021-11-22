import { Space, List, Typography, message, Modal } from 'antd';
import { useState } from 'react';
import useModel from '../hooks/useModel';
import InputUpload from '../components/InputUpload';
import styles from '../styles/ListRowActivityRegistered.module.css';
import {
    addConfirmActivityAction,
	editProofActivityAction,
	getImageProofByActivityAction,
} from '../store/actions';
import {
	taskEvent,
	upFileApi,
} from '../api/firebaseStorage';
import { addImageToActivityAction } from '../store/reducers/myActivitySlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

const { Text, Title } = Typography;

const initInputUpload = {
	onUploadSuccess: true,
	onUploadStart: false,
	onUploadError: null,
	uploadProgress: 0,
};

function ListRowRequireActivity() {
	const [inputUpload, setInputUpload] = useState(initInputUpload);

	const dispatch = useDispatch();
	let data = useSelector((s) =>
		s.myActivity.value.filter((c) => c.typeActivity === 'require')
	);
	let { loading } = useSelector((s) => s.myActivity);

	const setState = (name, value) => {
		setInputUpload((s) => ({ ...s, [name]: value }));
	};
	const handleBeforeUpload = (file) => {
		if (dataModel.confirm && dataModel.confirm === true) {
			message.warning('Không thể thêm khi hoạt động đã được xác nhận');
			return false;
		}
		const isLt5M = file.size / 1024 / 1024 < 4;
		if (!isLt5M) {
			message.error('Ảnh phải nhỏ hơn 4MB!');
		}
		return isLt5M;
	};
	const handleUpload = (data) => {
		const task = upFileApi(dataModel.id, data.file);
		task.on(
			taskEvent,
			(snapshot) => {
				const progress = Math.round(
					(100 * snapshot.bytesTransferred) / snapshot.totalBytes
				);
				data.file.percent = progress;
				setState('onUploadStart', true);
				setState('uploadProgress', progress);
			},
			(error) => {
				data.file.status = 'error';
				message.error('Có lỗi xảy ra vui lòng thử lại');
				setState('onUploadError', error);
				setState('onUploadSuccess', false);
			},
			() => {
				data.file.status = 'success';
				setState('onUploadSuccess', true);
				setState('onUploadStart', false);
			}
		);
		task.then((snapshot) => {
			message.success('Tải lên hoàn tất!!');
			let dataAction = { ...dataModel, number: 1, acId: dataModel.id };
			if (dataModel.proof) dispatch(editProofActivityAction(dataAction));
			else dispatch(addConfirmActivityAction({ ...dataAction, proof: 1 }));
			data.file.status = 'done';
			snapshot.ref.getDownloadURL().then((url) => {
				let image = {
					url,
					fullPath: snapshot.ref.fullPath,
					name: snapshot.ref.name,
				};
				dispatch(
					addImageToActivityAction({ acId: dataModel.id, image })
				);
			});
		});
	};
	const action = [
		<InputUpload
			inputUpload={inputUpload}
			text="Thêm minh chứng"
			key={'proof'}
			handleUpload={handleUpload}
			handleBeforeUpload={handleBeforeUpload}
		/>,
	];
	const { dataModel, setIndexData, ui, setVisible, visible } = useModel({
		action,
		title: 'Chi tiết bài viết',
		data,
		loading,
	});

	useEffect(() => {
		if (visible === true) {
			setInputUpload(initInputUpload);
			console.log('Show model', dataModel);
			if (dataModel.proof && !dataModel.images)
				dispatch(getImageProofByActivityAction(dataModel.id));
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
		else if (confirm === false)
			return <Text>Minh chứng chưa xác nhận</Text>;
		else if (confirm === true)
			return <Text type="success">Đã xác nhận</Text>;
		return <Text type="danger">{confirm}</Text>;
	};
	return (
		<>
			<Space direction="vertical">
				<List
					header={
						<Title level={5}>Danh sách minh chứng bắt buộc</Title>
					}
					bordered
					className={styles.list}
					dataSource={data}
					style={{ cursor: 'pointer' }}
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
			{ui()}
		</>
	);
}

export default ListRowRequireActivity;
