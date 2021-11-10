import { Collapse, message, Typography } from 'antd';
import { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { taskEvent, upFileApi } from '../api/firebaseStorage';
import { getOtherActivitiesApi } from '../api/firestore';
import {
	cancelMyConfirmProofAction,
	deleteImageByFullPathAction,
	editProofActivityAction,
	getImageProofByActivityAction,
	registerActivityAction,
} from '../store/actions';
import { addImageToActivityAction } from '../store/reducers/myActivitySlice';
import { ShowProof } from './ActivityFeed';
import InputUpload from './InputUpload';

const { Panel } = Collapse;
const { Text } = Typography;

const initInputUpload = {
	onUploadSuccess: true,
	onUploadStart: false,
	onUploadError: null,
	uploadProgress: 0,
};

const ListRowOtherActivity = () => {
	const [otherActivity, setOtherActivity] = useState([]);
	const [dataModel, setDataModel] = useState({});
	const [inputUpload, setInputUpload] = useState(initInputUpload);

	const dispatch = useDispatch();
	const registerActivity = useSelector((s) =>
		s.myActivity.value.filter((c) => c.typeActivity === 'other')
	);

	const getStatusProof = (id) => {
		let current = registerActivity.find((c) => c.id === id);
		if (!current) return;
		const { confirm, proof } = current;
		if (confirm === undefined || proof === 0) return;
		else if (confirm === 'false' || confirm === false)
			return <Text>Minh chứng chưa xác nhận</Text>;
		else if (confirm === true || confirm === 'true')
			return <Text type="success">Đã xác nhận</Text>;
		return <Text type="danger">{confirm}</Text>;
	};

	const setState = (name, value) => {
		setInputUpload((s) => ({ ...s, [name]: value }));
	};

	useEffect(() => {
		getOtherActivitiesApi().then((data) => {
			setOtherActivity(data);
		});
	}, []);

	const handleBeforeUpload = (file) => {
		if (dataModel?.confirm && dataModel.confirm === true) {
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
		if (dataModel?.confirm && dataModel.confirm !== false) {
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
			if (dataModel.confirm !== undefined)
				dispatch(
					editProofActivityAction({
						number: 1,
						acId: dataModel.id,
					})
				);
			else {
				dispatch(
					registerActivityAction({
						id: dataModel.id,
						proof: 1,
						...dataModel,
					})
				);
			}
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
				setDataModel((preState) => ({
					...preState,
					images: preState.images
						? [...preState.images, image]
						: [image],
				}));
			});
		});
	};
	const handleRemoveImage = (image) => {
		if (dataModel.confirm === true) {
			message.warning('Họat động đã được xác nhận nên không xóa ảnh.');
			return;
		}
		let acId = dataModel['id'];

		console.log('remove image: ', image);
		if (acId) {
			dispatch(
				deleteImageByFullPathAction({ path: image.fullPath, acId })
			).then(() => {
				message.success('Xóa ảnh thành công');
				setDataModel((preState) => ({
					...preState,
					images: preState.images.filter(
						(c) => c.name !== image.name
					),
				}));
				dispatch(
					editProofActivityAction({
						number: -1,
						acId,
					})
				);
			});
		}
	};
	const handleChangeCollapse = (id) => {
		if (id) {
			const t = registerActivity.find((c) => c.id == id) || {};
			const t2 = otherActivity.find((c) => c.id === id);
			if (t && t.proof && !t.images && t.proof !== 0) {
				dispatch(getImageProofByActivityAction(id)).then((res) => {
					setDataModel((preState) => ({
						...preState,
						images: res.payload.images,
					}));
				});
			} else {
				setDataModel({ ...t2, ...t });
			}
			setOtherActivity((preState) =>
				preState.map((c, i) =>
					c.id === id ? { ...c, confirm: t.confirm } : c
				)
			);
			console.log({ ...t2, ...t });
		}
	};

	return (
		<Collapse onChange={handleChangeCollapse} accordion={true}>
			{otherActivity.length &&
				otherActivity.map((c, i) => (
					<Panel
						header={c.name}
						key={c.id}
						extra={getStatusProof(c.id)}
					>
						<p>{c.summary}</p>
						{dataModel.images && (
							<ShowProof
								images={dataModel.images}
								handleRemoveImage={
									c.confirm === true
										? null
										: handleRemoveImage
								}
							/>
						)}
						<br />
						{c.confirm === true ? null : (
							<InputUpload
								inputUpload={inputUpload}
								text="Thêm minh chứng"
								key={'proof'}
								handleUpload={handleUpload}
								handleBeforeUpload={handleBeforeUpload}
							/>
						)}
					</Panel>
				))}
		</Collapse>
	);
};

export default ListRowOtherActivity;
