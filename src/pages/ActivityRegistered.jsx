import {
	Space,
	List,
	Typography,
	Button,
	message,
	Modal,
	InputNumber,
	Layout,
	Select,
} from 'antd';
import InputUpload from '../components/InputUpload';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import styles from '../styles/PageActivityRegistered.module.css';
import {
	createOrUpdateUserAction,
	deleteImageByFullPathAction,
	updateProofActivityAction,
	registerActivityAction,
	deleteRegisteredActivityAction,
	deleteProofActivityAction,
} from '../store/actions';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { handleSortActivity } from '../utils/compareFunction';
import ActivityFeed from '../components/ActivityFeed';
import { nameTarget } from '../config';

const { Option } = Select;
const { Content } = Layout;
const { Text, Title } = Typography;
const { confirm } = Modal;
export const getColorCard = (id, confirm) => {
	if (confirm === false) return '#69c0ff';
	else if (confirm === true) return '#73d13d';
	return 'white';
};
const regSpecialChar = /[^a-zA-Z1-9\.]/g;
const listLabel = [
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
const catchError = () => message.error('Vui lòng tải lại trang');
function ActivityRegistered() {
	const [visible, setVisible] = useState(false);
	const [index, setIndex] = useState(0);
	const [targetImage, setTargetImage] = useState({ list: [], choose: '' });

	const dispatch = useDispatch();
	const data = useSelector((s) =>
		Object.values(s.myActivity.value).sort(handleSortActivity)
	);
	const user = useSelector((s) => s.user.value);
	const { loading, unregistering } = useSelector((s) => s.myActivity);

	useEffect(() => {
		if (visible === true) {
			console.log('Target Image', targetImage);
			console.log('Show model', data[index]);
		}
	}, [visible]);

	const showBoxQuestion = () => {
		confirm({
			title: 'Bạn có chắc muốn hủy hoạt động?',
			icon: <ExclamationCircleOutlined />,
			content:
				'Tất cả những file minh chứng của hoạt động này cũng bị xóa theo.',
			onOk() {
				console.log('clicked unregister', data[index]);
				return handleUnregister();
			},
			onCancel() {},
		});
	};
	const handleUnregister = async () => {
		if (data[index].confirm === true) {
			message.warning('Họat động đã được xác nhận nên không thể hủy.');
			return;
		}
		return dispatch(deleteRegisteredActivityAction(data[index].id))
			.then(() => {
				setVisible(false);
			})
	};
	const handleBeforeUpload = (file) => {
		if (data[index].confirm === true) {
			message.warning('Không thể thêm khi hoạt động đã được xác nhận');
			return false;
		}
		return true;
	};
	const handleAfterUpload = (url, snapshot) => {
		const imageAdd = {
			url,
			fullPath: snapshot.ref.fullPath,
			name: snapshot.ref.name.replace(regSpecialChar, ''),
			target: targetImage.choose || targetImage.list[0],
		};
		console.log('image upload is: ', imageAdd);
		if (data[index].images) {
			if (data[index].images[imageAdd.name.split('.')[0]])
				message.warning('Ảnh trùng tên nên thay thế ảnh cũ');
			dispatch(
				updateProofActivityAction({
					proof: data[index].images[imageAdd.name.split('.')[0]]
						? 0
						: 1,
					id: data[index].id,
					imageAdd,
				})
			);
		} else
			dispatch(
				registerActivityAction({
					id: data[index].id,
					proof: 1,
					imageAdd,
				})
			);
	};
	const handleRemoveImage = (image) => {
		if (data[index].confirm === true) {
			message.warning('Họat động đã xác nhận, xóa ảnh không thành công');
			return;
		}
		let id = data[index]['id'];

		console.log('remove image: ', image);
		if (id && image.fullPath) {
			dispatch(
				deleteImageByFullPathAction({ path: image.fullPath, acId: id })
			).then(() => {
				dispatch(
					deleteProofActivityAction({
						imageId: image.name.split('.')[0],
						id,
					})
				);
			});
		}
	};
	const handleClickActivityFeed = (indexData, obj, target) => {
		if (indexData === null || indexData === undefined) {
			Modal.error({
				title: 'Lỗi',
				content: 'Vui lòng tải lại trang và thử lại',
			});
			return;
		}
		const targetImages = data[indexData].target.filter((targetActivity) =>
			target.includes(targetActivity)
		);

		setTargetImage({
			list: targetImages,
			choose: targetImages.length > 1 ? null : targetImages[0],
		});
		setIndex(indexData);
		setVisible(true);
	};
	const getStatusProof = (confirm, proof, typeActivity, target) => {
		if (!proof && ['require', 'other'].includes(typeActivity)) return null;
		else if (confirm === true)
			return <Text type="success">Đã xác nhận</Text>;
		else if (proof === 0 || target === false)
			return <Text>Chưa thêm minh chứng</Text>;
		else if (confirm === false)
			return <Text>Minh chứng chưa xác nhận</Text>;
		else return <Text type="danger">{confirm}</Text>;
	};
	const saveMoreData = (key, e) => {
		const value = e.target.value;
		if (value !== user[key])
			dispatch(createOrUpdateUserAction({ [key]: value }))
	};
	const getActionModal = (activity) => {
		const listBtn = [];
		const { typeActivity, confirm, proof, id, target } = activity;

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
				onClick={proof ? showBoxQuestion : handleUnregister}
				loading={unregistering !== 0}
			>
				Hủy đăng ký
			</Button>
		);
		const selectTargetImage = (
			<Select
				value={targetImage.choose}
				placeholder="Chọn tiêu chí của MC"
				style={{ width: 150 }}
				onChange={(value) =>
					setTargetImage((pre) => ({ ...pre, choose: value }))
				}
			>
				{targetImage.list.map((item, index) => (
					<Option key={index} value={item}>
						{nameTarget[item]}
					</Option>
				))}
			</Select>
		);
		const btnUpload = (
			<InputUpload
				text="Thêm minh chứng"
				key={'proof'}
				id={id}
				disabled={targetImage.choose ? false : true}
				handleAfterUpload={handleAfterUpload}
				handleBeforeUpload={handleBeforeUpload}
			/>
		);
		if (confirm === true) return null;

		if (targetImage.list.length > 1) listBtn.push(selectTargetImage);
		if (typeActivity === 'require' && target.includes('hoc-tap'))
			listBtn.push(inputPointLearning);
		if (typeActivity === 'require' && target.includes('dao-duc'))
			listBtn.push(inputPointTraing);
		if (confirm !== true) listBtn.push(btnUpload);
		if (typeActivity === 'register') listBtn.push(btnUnregister);
		return listBtn;
	};

	const renderActivityByType = (label, target) => (
		<List
			header={<Title level={5}>{label}</Title>}
			size="small"
			bordered={false}
			className={styles.list}
			dataSource={data}
			renderItem={(item, index) =>
				item.target && target.some((c) => item.target.includes(c)) ? (
					<List.Item
						key={index}
						onClick={() =>
							handleClickActivityFeed(index, item, target)
						}
						className={styles.listItem}
						style={{ cursor: 'pointer', marginLeft: 20 }}
					>
						<Text ellipsis={true}>{item.name}</Text>
						<Text>
							{getStatusProof(
								item.confirm,
								item.proof,
								item.typeActivity,
								item.images
									? Object.values(item.images).some((e) =>
											target.includes(e.target)
									  )
									: false
							)}
						</Text>
					</List.Item>
				) : null
			}
		/>
	);

	return (
		<Content className={styles.content} key={'activity-register'}>
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
					dataSource={listLabel}
					renderItem={(item, index) => (
						<List.Item
							key={index}
							style={{ width: '100%', padding: 0 }}
						>
							{renderActivityByType(item.label, item.target)}
						</List.Item>
					)}
				/>
			</Space>
			<Modal
				className="modeUseModel"
				bodyStyle={{ padding: 0 }}
				visible={visible}
				title="Chi tiết"
				footer={
					visible && data[index] ? getActionModal(data[index]) : null
				}
				centered={true}
				onCancel={() => setVisible(false)}
			>
				{visible && data[index] ? (
					<ActivityFeed
						{...data[index]}
						showFull={true}
						getColorCard={getColorCard}
						btnDetail={false}
						loading={loading || false}
						handleRemoveImage={
							data[index].confirm !== true
								? handleRemoveImage
								: null
						}
					/>
				) : null}
			</Modal>
		</Content>
	);
}

export default ActivityRegistered;
