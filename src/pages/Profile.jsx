import {
	Divider,
	Layout,
	Avatar,
	Card,
	Button,
	Form,
	Select,
	Result,
	Input,
	message,
	Tag,
} from 'antd';
import DatePicker from '../components/DatePicker';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
	nameDepartmentActivity,
	nameMajors,
	nameSex,
	nameLevelRegister,
} from '../config';
import { addUserDetailAction } from '../store/actions';
import styles from '../styles/Profile.module.css';
import dayjs from 'dayjs';
import { useState } from 'react';
import { nameTarget } from '../config';

const { Content } = Layout;
const { Meta } = Card;
const { Item } = Form;
const { Option } = Select;

const sexOption = Object.entries(nameSex).map((c, index) => (
	<Option key={index} value={c[0]}>
		{c[1]}
	</Option>
));
const majorsOption = Object.entries(nameMajors).map((c, index) => (
	<Option key={index} value={c[0]}>
		{c[1]}
	</Option>
));
const optionDepartment = Object.entries(nameDepartmentActivity).map(
	(c, index) => (
		<Option key={index} value={c[0]}>
			{c[1]}
		</Option>
	)
);
const optionLevelRegister = Object.entries(nameLevelRegister).map(
	(c, index) => (
		<Option key={index} value={c[0]}>
			{c[1]}
		</Option>
	)
);
const colorOption = {
	'hoc-tap': '#ff9c6e',
	'tinh-nguyen': '#ffc53d',
	'the-luc': '#bae637',
	'dao-duc': '#f759ab',
	'hoi-nhap': '#40a9ff',
};
const rules = [{ required: true, message: 'Vui lòng điền thông tin' }];
const rulesPointLearn = [
	{
		required: true,
		message: 'Vui lòng điền thông tin',
		type: 'string',
		max: 2,
		mix: 1,
	},
];
const rulesPointTraing = [
	{
		required: true,
		message: 'Vui lòng điền thông tin',
		type: 'string',
		max: 2,
		mix: 1,
	},
];
const rulesPhone = [
	{
		required: true,
		message: 'Vui lòng điền thông tin',
		type: 'string',
		max: 11,
		mix: 10,
	},
];
const rulesStudentCode = [
	{ required: true, message: 'Vui lòng điền thông tin', len: 10 },
];

function Profile(props) {
	const [levelReview, setLevelReview] = useState(null);
	const [loading, setLoading] = useState(false);
	const [form] = Form.useForm();

	const dispatch = useDispatch();
	const user = useSelector((s) => s.user.value);

	useEffect(async () => {
		if (!user.uid) return;
		else if (user.fullName === undefined) {
			if (user.levelReview) setLevelReview(user.levelReview);
			return;
		}
		let birthday = null;
		if (user.birthday) birthday = dayjs(user.birthday, 'DD-MM-YYYY');
		form.setFieldsValue({ ...user, birthday });
		if (user.levelReview) setLevelReview(user.levelReview);
	}, [user]);

	const onFinish = (values) => {
		setLoading(true);
		let birthday = dayjs(values.birthday).format('DD-MM-YYYY');
		console.log({ ...values, birthday });
		dispatch(
			addUserDetailAction({
				...values,
				birthday,
				classUser: values.classUser.toUpperCase(),
			})
		).then(
			(res) => {
				setLoading(false);
			},
			() => {
				setLoading(false);
				message.warning('Thêm không thành công, vui lòng thử lại.');
			}
		);
	};
	const saveMoreData = (value) => {
		dispatch(addUserDetailAction({ levelReview: value })).then(
			(res) => {
				setLevelReview(value);
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
				title={user.fullName || user.displayName}
				description={user.studentCode}
			/>
			<Divider plain></Divider>
			<div>
				<strong>Đăng ký xét SV5T cấp: </strong>
				<Select
					placeholder="Chọn cấp xét"
					onChange={saveMoreData}
					value={levelReview}
				>
					{optionLevelRegister}
				</Select>
			</div>
			<div>
				<strong>Các tiêu chí đã hoàn thành:</strong>
				{user.targetSuccess &&
					user.targetSuccess.map((c, i) => (
						<Tag color={colorOption[c]} key={i}>
							{nameTarget[c]}
						</Tag>
					))}
			</div>
			<Divider plain></Divider>
			<Form
				form={form}
				name="basic"
				labelCol={{ span: 6 }}
				wrapperCol={{ span: 16 }}
				onFinish={onFinish}
				layout="horizontal"
			>
				<Item label="Họ và tên" name="fullName" rules={rules}>
					<Input placeholder="Thêm họ và tên có dấu" />
				</Item>
				<Item label="Lớp" name="classUser" rules={rules}>
					<Input placeholder="Thêm tên lớp vd: DH18IT01" />
				</Item>
				<Item
					label="Mã số sinh viên"
					name="studentCode"
					rules={rulesStudentCode}
				>
					<Input placeholder="Nhập mssv" />
				</Item>
				<Item label="Ngày sinh" name="birthday" rules={rules}>
					<DatePicker
						format="DD-MM-YYYY"
						style={{ width: '100%' }}
						placeholder="Thêm ngày sinh (DD-MM-YYYY)"
					/>
				</Item>
				<Item label="Giới tính" name="sex" rules={rules}>
					<Select placeholder="Chọn giới tính">{sexOption}</Select>
				</Item>
				<Item label="Khoa" name="department" rules={rules}>
					<Select placeholder="Chọn khoa hiện tại">
						{optionDepartment}
					</Select>
				</Item>
				<Item label="Chyên ngành" name="majors" rules={rules}>
					<Select placeholder="Chọn chuyên ngành hiện tại">
						{majorsOption}
					</Select>
				</Item>
				<Item
					label="Số điện thoại:"
					name="phoneNumber"
					rules={rulesPhone}
				>
					<Input placeholder="Thêm số đt liên lạc" />
				</Item>
				<Item label="Số CMND" name="idCard" rules={rules}>
					<Input placeholder="Nhập số CMND hoặc CCCD" />
				</Item>
				<Item label="Số ngân hàng" name="bankNumber" rules={rules}>
					<Input placeholder="Số tài khoản Nam Á bank" />
				</Item>
				<Item wrapperCol={{ span: 24 }}>
					<Button
						type="primary"
						htmlType="submit"
						block
						loading={loading}
					>
						Lưu
					</Button>
				</Item>
			</Form>
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
