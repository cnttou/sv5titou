import { Button, Layout, message, Modal } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import InputUpload from '../components/InputUpload';
import styles from '../styles/PageActivityRegistered.module.css';
import useModel from '../hooks/useModel';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	cancelMyConfirmProofAction,
	editProofActivityAction,
	fetchRegisteredActivityAction,
	getImageProofByActivityAction,
	removeRegisteredActivityAction,
} from '../store/actions';
import {
	deleteFolderImageActivityApi,
	taskEvent,
	upFileApi,
} from '../api/firebaseStorage';
import { addImageToActivityAction } from '../store/reducers/myActivitySlice';
import Loading from '../components/Loading';
import ListRowActivityRegistered from '../components/ListRowActivityRegistered';
import ListRowOtherActivity from '../components/ListRowOtherActivity';

const { Content } = Layout;
const { confirm } = Modal;

const initInputUpload = {
	onUploadSuccess: true,
	onUploadStart: false,
	onUploadError: null,
	uploadProgress: 0,
};

function ActivityRegistered(props) {
	const [inputUpload, setInputUpload] = useState(initInputUpload);

	const setState = (name, value) => {
		setInputUpload((s) => ({ ...s, [name]: value }));
	};

	const dispatch = useDispatch();
	let data = useSelector((s) =>
		s.myActivity.value.filter((c) => c.typeActivity === 'register')
	);
	let { loading } = useSelector((s) => s.myActivity);
	const user = useSelector((state) => state.user.value);

	useEffect(() => {
		if (user.uid !== undefined && data.length === 0)
			dispatch(fetchRegisteredActivityAction());
	}, [user]);

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
	return (
		<Content className={styles.content}>
			{loading === 0 || data.length !== 0 ? (
				<ListRowActivityRegistered
					data={data || []}
					handleClick={handleClickActivityFeed}
				/>
			) : (
				<Loading />
			)}
			<ListRowOtherActivity />
			{ui()}
		</Content>
	);
}

export default ActivityRegistered;
