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
	Alert,
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
		label: '6. Các thành tích tiêu biểu khác',
		target: ['tieu-bieu-khac'],
	},
];
function ActivityRegistered() {
	const [visible, setVisible] = useState(false);
	const [dataModel, setDataModel] = useState({});
	const [targetImage, setTargetImage] = useState({ list: [], choose: '' });

	const dispatch = useDispatch();
	const activities = useSelector((state) =>
		[...state.activity.value].sort(handleSortActivity)
	);
	const myActivity = useSelector((state) => state.myActivity.value);
	const user = useSelector((s) => s.user.value);
	const { loading, unregistering } = useSelector((s) => s.myActivity);

	const showBoxQuestion = () => {
		confirm({
			title: 'Bạn có chắc muốn hủy hoạt động?',
			icon: <ExclamationCircleOutlined />,
			content:
				'Tất cả những file minh chứng của hoạt động này cũng bị xóa theo.',
			onOk() {
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
		return dispatch(deleteRegisteredActivityAction(dataModel.id)).then(
			() => {
				setVisible(false);
			}
		);
	};
	const handleBeforeUpload = (file) => {
		if (dataModel.confirm === true) {
			message.warning('Không thể thêm khi hoạt động đã được xác nhận');
			return false;
		}
		return true;
	};
	const handleAfterUpload = (url, snapshot) => {
		const fullNameFile = snapshot.ref.name
			.replace(regSpecialChar, '')
			.split('.').slice(-2);
		const imageAdd = {
			url,
			fullPath: snapshot.ref.fullPath,
			name: fullNameFile[0] + '_' + fullNameFile[1],
			typeFile: fullNameFile[1],
			target: targetImage.choose || dataModel.target[0],
		};
		const proof = { ...dataModel.proof, [imageAdd.name]: imageAdd };
		if (dataModel.proof) {
			dataModel.proof[imageAdd.name] &&
				message.warning('Ảnh trùng tên nên thay thế ảnh cũ');
			dispatch(
				updateProofActivityAction({
					proof,
					id: dataModel.id,
					acId: dataModel.acId,
				})
			);
		} else
			dispatch(
				registerActivityAction({
					id: dataModel.id,
					imageAdd,
				})
			);
		setDataModel((pre) => ({
			...pre,
			proof,
		}));
	};
	const handleRemoveImage = (image) => {
		if (dataModel.confirm === true) {
			message.warning('Họat động đã xác nhận, xóa ảnh không thành công');
			return;
		}
		const {acId, id} = dataModel;

		if (acId && image.fullPath) {
			dispatch(
				deleteImageByFullPathAction({ path: image.fullPath, acId })
			).then(() => {
				dispatch(
					deleteProofActivityAction({
						imageId: image.name,
						acId, 
                        id,
					})
				);
                const proof ={...dataModel.proof};
                delete proof[image.name];
                setDataModel((pre) => ({
					...pre,
					proof,
				}));
			});
		}
	};
	const handleClickActivityFeed = (obj) => {
		console.log('Click activity: ', obj);
		setDataModel(obj);
		setVisible(true);
	};
	const getStatusProof = (confirm, proof, typeActivity) => {
		if (confirm === true) return <Text type="success">Đã xác nhận</Text>;
		else if (typeof confirm !== 'boolean')
			return <Text type="danger">{confirm}</Text>;
		else if (
			Object.keys(proof).length === 0 &&
			['require', 'other'].includes(typeActivity)
		)
			return null;
		else if (Object.keys(proof).length === 0)
			return <Text type="secondary">Chưa thêm minh chứng</Text>;
		else return <Text type="warning">Minh chứng chưa xác nhận</Text>;
	};
	const saveMoreData = (key, e) => {
		const value = parseFloat(e.target.value);
		if (isNaN(value)) {
			message.error('Vui lòng nhập số');
			return;
		}
		if (value !== user[key])
			dispatch(createOrUpdateUserAction({ [key]: value }));
		message.success('Đã lưu thành công');
	};
	const getActionModal = () => {
		const listBtn = [];
		const { typeActivity, confirm, proof, id, target } = dataModel;
		if (!id) return;

        const inputPointLearning = (
			<InputNumber
				key={'input-gpa'}
				defaultValue={parseInt(user.gpa)}
				style={{ width: '140px' }}
				controls={false}
				placeholder="Điểm TB học kỳ"
				onBlur={(e) =>
					/^(10|[0-9]{1}|[0-9]{1}\.[1-9]{1,2})$/.test(e.target.value)
						? saveMoreData('gpa', e)
						: message.error(
								'Vui lòng nhập từ 0-10 và làm tròn 2 chữ số'
						  )
				}
			/>
		);
		const inputPointTraing = (
			<InputNumber
				key={'input-pointtraing'}
				defaultValue={parseInt(user.pointTraining)}
				style={{ width: '140px' }}
				controls={false}
				placeholder="Điểm rèn luyện"
				onBlur={(e) =>
					/^(100|[0-9]{2})$/.test(e.target.value)
						? saveMoreData('pointTraining', e)
						: message.error('Vui lòng nhập từ 10-100')
				}
			/>
		);

        const btnUnregister = (
			<Button
				key={'Hủy đăng ký'}
				icon={<DeleteOutlined />}
				type="danger"
				onClick={
					proof && Object.keys(proof).length
						? showBoxQuestion
						: handleUnregister
				}
				loading={unregistering !== 0}
			>
				Hủy đăng ký
			</Button>
		);
		const selectTargetImage = (
			<Select
				value={targetImage.choose}
				placeholder="Loại minh chứng"
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
				handleAfterUpload={handleAfterUpload}
				handleBeforeUpload={handleBeforeUpload}
			/>
		);

        if (confirm === true) return null;
		if (target.length > 1) listBtn.push(selectTargetImage);
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
			dataSource={activities
				.filter(
					(c) => myActivity[c.id] || c.typeActivity !== 'register'
				)
				.map((c) => ({ ...c, ...myActivity[c.id] }))}
			renderItem={(item, index) =>
				item.target && target.some((c) => item.target.includes(c)) ? (
					<List.Item
						key={index}
						onClick={() => handleClickActivityFeed(item)}
						className={styles.listItem}
						style={{ cursor: 'pointer', marginLeft: 20 }}
					>
						<Text ellipsis={true}>{item.name}</Text>
						<Text>
							{getStatusProof(
								item.confirm,
								item.proof,
								item.typeActivity
							)}
						</Text>
					</List.Item>
				) : null
			}
		/>
	);

	return (
		<Content className={styles.content} key={'activity-register'}>
			{user.fullName === undefined && (
				<Alert
					message="Vui lòng điền thông tin cá nhân để Admin xác nhận minh chứng cho bạn"
					type="warning"
				/>
			)}
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
				footer={visible ? getActionModal() : null}
				centered={true}
				onCancel={() => setVisible(false)}
			>
				{visible && dataModel ? (
					<ActivityFeed
						{...dataModel}
						showFull={true}
						getColorCard={getColorCard}
						btnDetail={false}
						loading={loading || false}
						handleRemoveImage={
							dataModel.confirm !== true
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
