import { Space, List, Typography, Button, message, Modal } from 'antd';
import { useState } from 'react';
import useModel from '../hooks/useModel';
import InputUpload from '../components/InputUpload';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import styles from '../styles/ListRowActivityRegistered.module.css';
import {
	cancelMyConfirmProofAction,
	editProofActivityAction,
	getImageProofByActivityAction,
	removeRegisteredActivityAction,
} from '../store/actions';
import {
	deleteFolderImageActivityApi,
	taskEvent,
	upFileApi,
} from '../api/firebaseStorage';
import { addImageToActivityAction } from '../store/reducers/myActivitySlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

const { Text, Title } = Typography;
const { confirm } = Modal;
const initInputUpload = {
	onUploadSuccess: true,
	onUploadStart: false,
	onUploadError: null,
	uploadProgress: 0,
};

function ListRowActivityRegistered() {
	const [inputUpload, setInputUpload] = useState(initInputUpload);

	const dispatch = useDispatch();
	let data = useSelector((s) =>
		s.myActivity.value.filter((c) => c.typeActivity === 'register')
	);
	let { loading } = useSelector((s) => s.myActivity);

	const setState = (name, value) => {
		setInputUpload((s) => ({ ...s, [name]: value }));
	};
	const showBoxQuestion = () => {
		confirm({
			title: 'Bạn có chắc muốn hủy hoạt động?',
			icon: <ExclamationCircleOutlined />,
			content:
				'Tất cả những file minh chứng của hoạt động này cũng bị xóa theo.',
			onOk() {
				console.log('clicked unregister', dataModel);
				return handleUnregister();
			},
			onCancel() {},
		});
	};
	const handleUnregister = async () => {
		if (dataModel.confirm === true) {
			message.warning('Họat động đã được xác nhận nên không thể hủy.');
			return;
		}
		return dispatch(removeRegisteredActivityAction(dataModel.id))
			.then(() => {
				deleteFolderImageActivityApi(dataModel.id)
					.then(() => {
						message.success('Đã hủy thành công');
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
		if (dataModel.confirm === true) {
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
		if (dataModel.confirm !== false) {
			dispatch(cancelMyConfirmProofAction(dataModel.id));
		}
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
			dispatch(
				editProofActivityAction({
					number: 1,
					acId: dataModel.id,
				})
			);
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
		<Button
			key={'Hủy đăng ký'}
			icon={<DeleteOutlined />}
			type="danger"
			onClick={showBoxQuestion}
		>
			Hủy đăng ký
		</Button>,
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
			if (!dataModel.images && dataModel.proof !== 0)
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

export default ListRowActivityRegistered;
