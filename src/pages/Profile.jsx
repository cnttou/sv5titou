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
} from 'antd';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
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
	const [showSaveBtn, setShowSaveBtn] = useState(false);

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
	const loadProfile = () => (
		<Card bordered={true} className={styles.card}>
			<Meta
				avatar={<Avatar src={user.photoURL} />}
				title={user.displayName}
				description={user.studentCode}
			/>
			<Divider plain></Divider>
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
