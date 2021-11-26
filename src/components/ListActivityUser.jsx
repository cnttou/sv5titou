import {
	Space,
	List,
	Typography,
	Button,
	message,
	Modal,
	InputNumber,
} from 'antd';
import InputUpload from '../components/InputUpload';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import styles from '../styles/ListRowActivityRegistered.module.css';
import {
	addUserDetailAction,
	deleteImageByFullPathAction,
	editProofActivityAction,
	getImageProofByActivityAction,
	registerActivityAction,
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
	if (confirm === false) return '#cde4f5';
	else if (confirm === true) return '#73d13d';
	return 'white';
};

const listIndex = [
	{
		label: '1. Đạo đức tốt',
		target: ['dao-duc'],
	},
	{
		label: '2. Học tập tốt',
		target: ['hoc-tap'],
	},
	{
		label: '3. Thể lực tốt',
		target: ['the-luc'],
	},
	{
		label: '4. Tình nguyện tốt',
		target: ['tinh-nguyen'],
	},
	{
		label: '5. Hội nhập tốt',
		target: ['hoi-nhap', 've-ky-nang', 've-ngoai-ngu'],
	},
	{
		label: '6. Các thành tích tiêu biểu khác:',
		target: ['tieu-bieu-khac'],
	},
];

function ListActivityUser() {
	const [visible, setVisible] = useState(false);
	const [indexData, setIndexData] = useState(0);

	const dispatch = useDispatch();
	const data = useSelector((s) => s.myActivity.value);
	const user = useSelector((s) => s.user.value);

	const { loading, unregistering } = useSelector((s) => s.myActivity);
	useEffect(() => {
		if (visible === true) {
			console.log('Show model', data[indexData]);
			if (!data[indexData].images && data[indexData].proof)
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
		return true;
	};
	const handleAfterUpload = (url, snapshot) => {
		const image = {
			url,
			fullPath: snapshot.ref.fullPath,
			name: snapshot.ref.name,
		};
		if (data[indexData].proof !== undefined) {
			dispatch(
				editProofActivityAction({ number: 1, acId: data[indexData].id })
			);
			dispatch(
				addImageToActivityAction({ acId: data[indexData].id, image })
			);
		} else
			dispatch(
				registerActivityAction({ ...data[indexData], proof: 1 })
			).then(() => {
				dispatch(
					addImageToActivityAction({
						acId: data[indexData].id,
						image,
					})
				);
			});
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
	const getStatusProof = (confirm, proof, typeActivity) => {
		if (proof === 0 && typeActivity === 'require')
			return null;
		else if (confirm === true || confirm === 'true')
			return <Text type="success">Đã xác nhận</Text>;
		else if (proof === 0) return <Text>Chưa thêm minh chứng</Text>;
		else if (confirm === 'false' || confirm === false)
			return <Text>Minh chứng chưa xác nhận</Text>;
		return <Text type="danger">{confirm}</Text>;
	};
	const saveMoreData = (key, e) => {
		const value = e.target.value;
        if (value !== user[key])
		dispatch(addUserDetailAction({ [key]: value })).catch(() => {
			message.warning('Thêm không thành công, vui lòng thử lại.');
		});
		console.log({key, value});
	};
	const getActionModal = (activity) => {
		const listBtn = [];

		const inputPointLearning = (
			<InputNumber
				key={'input-gpa'}
				defaultValue={parseInt(user.gpa)}
				style={{ width: '140px' }}
				min={0}
				max={10}
				placeholder="Điểm TB học kỳ"
				onBlur={(e) => saveMoreData('gpa', e)}
			/>
		);
		const inputPointTraing = (
			<InputNumber
				key={'input-pointtraing'}
				defaultValue={parseInt(user.pointTraining)}
				style={{ width: '140px' }}
				step={10}
				min={0}
				max={100}
				placeholder="Điểm rèn luyện"
				onBlur={(e) => saveMoreData('pointTraining', e)}
			/>
		);
		const btnUnregister = (
			<Button
				key={'Hủy đăng ký'}
				icon={<DeleteOutlined />}
				type="danger"
				onClick={activity.proof ? showBoxQuestion : handleUnregister}
				loading={unregistering !== 0}
			>
				Hủy đăng ký
			</Button>
		);

		const btnUpload = (
			<InputUpload
				text="Thêm minh chứng"
				key={'proof'}
				id={activity.id}
				handleAfterUpload={handleAfterUpload}
				handleBeforeUpload={handleBeforeUpload}
			/>
		);
		if (
			activity.typeActivity === 'require' &&
			activity.target.includes('hoc-tap')
		)
			listBtn.push(inputPointLearning);
		if (
			activity.typeActivity === 'require' &&
			activity.target.includes('dao-duc')
		)
			listBtn.push(inputPointTraing);
		if (activity.confirm === true) return null;
		if (activity.confirm !== true) listBtn.push(btnUpload);
		if (activity.typeActivity === 'register') listBtn.push(btnUnregister);
		return listBtn;
	};

	const loadActivityByType = (label, target) => (
		<List
			header={<Title level={5}>{label}</Title>}
			size="small"
			bordered={false}
			className={styles.list}
			dataSource={data}
			renderItem={(item, index) =>
				target.some((c) => item.target.includes(c)) ? (
					<List.Item
						onClick={() => handleClickActivityFeed(index, item)}
						className={styles.listItem}
						style={{ cursor: 'pointer', marginLeft: 20 }}
					>
						<Text ellipsis={true}>{item.name}</Text>
						<Text>{getStatusProof(item.confirm, item.proof, item.typeActivity)}</Text>
					</List.Item>
				) : null
			}
		/>
	);

	return (
		<>
			<Space direction="vertical">
				<List
					header={
						<Title level={5}>Danh sách hoạt động đã đăng ký</Title>
					}
					size="small"
					bordered
					split={false}
					loading={loading !== 0}
					className={styles.list}
					dataSource={listIndex}
					renderItem={(item, index) => (
						<List.Item style={{ width: '100%', padding: 0 }}>
							{loadActivityByType(item.label, item.target)}
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
					footer={visible ? getActionModal(data[indexData]) : null}
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

export default ListActivityUser;
