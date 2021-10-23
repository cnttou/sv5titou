/* eslint-disable react-hooks/rules-of-hooks */
import { SaveOutlined } from '@ant-design/icons';
import {
	Divider,
	Layout,
	Avatar,
	Card,
	Select,
	Space,
	Button,
	Typography,
	Result,
	Input,
	message,
} from 'antd';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { addUserDetailAction } from '../store/actions';
import styles from '../styles/Profile.module.css';

const { Content } = Layout;
const { Meta } = Card;
const { Option } = Select;
const { Title } = Typography;

const children = [];
for (let i = 10; i < 36; i++) {
	children.push(
		<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>
	);
}

function Profile(props) {
	const [inputClass, setInputClass] = useState('');
	const [inputName, setInputName] = useState('');
	const [showSaveBtn, setShowSaveBtn] = useState(false);

	const dispatch = useDispatch();
	const user = useSelector((s) => s.user.value);
	const listActivity = useSelector((state) => state.myActivity.value);

	const handleChangeInputClass = (value) => {
		setInputClass(value);
		setShowSaveBtn(true);
	};
	const saveClass = () => {
		console.log('saved: ', inputClass);
		setShowSaveBtn(false);
	};
    const onChangeName = (e)=>{
        setInputName(e.target.value)
    }
	const saveName = () => {
		dispatch(addUserDetailAction({ fullName: inputName })).then(
			() => {
				message.success('Thêm thành công');
			},
			() => {
				message.warning('Thêm không thành công, vui lòng thử lại.');
			}
		);
	};
	const loadProfile = () => (
		<Card bordered={true} className={styles.card}>
			<Meta
				avatar={<Avatar src={user.photoURL} />}
				title={user.displayName}
				description={user.studentCode}
			/>
			<Divider plain></Divider>
			<p>
				<strong>Họ tên có dấu:</strong>
				<Input
					placeholder="Nhập để thêm"
					defaultValue={user.fullName || user.displayName}
					onChange={onChangeName}
					addonAfter={
						inputName && <SaveOutlined onClick={saveName} />
					}
                    autoFocus={true}
				/>
			</p>
			<p>
				<strong>Email:</strong> {user.email}
			</p>
			<p>
				<strong>Chuyên ngành:</strong> {user.majors}
			</p>
			<p>
				<strong>Khóa:</strong> {user.studentCode.slice(0, 2)}
			</p>
			<p>
				<strong>Số hoạt động đã đăng ký:</strong>{' '}
				{listActivity.length || 0}
			</p>
			<Space className={styles.wrapperInputClass}>
				<p className={styles.labelClassName}>
					<strong>Tên lớp:</strong>
				</p>
				<Select
					className={styles.selectInput}
					placeholder="Nhập tên lớp"
					defaultValue={'a10'}
					onChange={handleChangeInputClass}
				>
					{children}
				</Select>
				{showSaveBtn && (
					<Button
						type="primary"
						size={'middle'}
						icon={<SaveOutlined onClick={saveClass} />}
					>
						Lưu
					</Button>
				)}
			</Space>
		</Card>
	);
	const loadNullProfile = () => (
		<Result
			status="warning"
			title="Trang không hợp lệ"
			subTitle="Vui lòng đăng nhập để thực hiện chức năng"
			extra={
				<Button type="primary">
					<Link to="/login">Đăng nhập</Link>
				</Button>
			}
		/>
	);
	return (
		<Content className={styles.content}>
			{user.email ? loadProfile() : loadNullProfile()}
		</Content>
	);
}

export default Profile;
