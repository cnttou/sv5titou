/* eslint-disable react-hooks/rules-of-hooks */
import { SaveOutlined } from '@ant-design/icons';
import {
	Divider,
	Layout,
	Avatar,
	Card,
	Space,
	Button,
	Result,
	Input,
	message,
} from 'antd';
import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { addUserDetailAction, getUserDetailAction } from '../store/actions';
import styles from '../styles/Profile.module.css';

const { Content } = Layout;
const { Meta } = Card;

function Profile(props) {
	const [inputClass, setInputClass] = useState('');
	const [inputName, setInputName] = useState('');

	const dispatch = useDispatch();
	const user = useSelector((s) => s.user.value);
	const listActivity = useSelector((state) => state.myActivity.value);

	useEffect(() => {
		if (!user.uid) return;
		else if (user.fullName === undefined || user.classUser === undefined) {
			dispatch(getUserDetailAction()).then((res) => {
				if (res.payload.fullName) setInputName(res.payload.fullName);
				if (res.payload.classUser) setInputClass(res.payload.classUser);
			});
		} else {
			setInputName(user.fullName);
			setInputClass(user.classUser);
		}
	}, [user]);

	const handleChangeInputClass = (e) => {
		setInputClass(e.target.value);
	};
	const saveClass = () => {
		dispatch(addUserDetailAction({ classUser: inputClass })).then(
			(res) => {
				message.success('Thêm thành công');
			},
			() => {
				message.warning('Thêm không thành công, vui lòng thử lại.');
			}
		);
	};
	const onChangeName = (e) => {
		setInputName(e.target.value);
	};
	const saveName = () => {
		dispatch(addUserDetailAction({ fullName: inputName })).then(
			(res) => {
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
				<strong>Họ và tên có dấu:</strong>
				<Input
					placeholder="Nhập họ và tên có dấu"
					defaultValue={user.fullName || ""}
					onChange={onChangeName}
					value={inputName}
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
				<Input
					placeholder="Nhập tên lớp"
					defaultValue={user.classUser || ''}
					onChange={handleChangeInputClass}
					value={inputClass}
					addonAfter={
						inputClass && <SaveOutlined onClick={saveClass} />
					}
				/>
			</Space>
		</Card>
	);
	const loadNullProfile = () => (
		<Result
			status="warning"
			title="Vui lòng đăng nhập"
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
