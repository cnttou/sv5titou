import { GoogleOutlined } from '@ant-design/icons';
import { Button, Layout, message } from 'antd';
import { loginByGoogle, logoutApi } from '../api/authentication';
import { useDispatch } from 'react-redux';
import { loginAction, logoutAction } from '../store/actions';
import styles from '../styles/Login.module.css';
import { useEffect } from 'react';
import { useHistory } from 'react-router';

const { Content } = Layout;

export const nameMajors = {
	105: 'CNTT-Công nghệ thông tin',
	405: 'IM-Hệ thống thông tin quản lý',
};

const Login = () => {
	const router = useHistory();
	const dispatch = useDispatch();

	useEffect(() => {
		logoutApi()
			.then(() => {
				dispatch(logoutAction());
			})
			.catch((error) => {
				message.warning(
					'Hiện tại không đăng xuất được vui lòng thử lại'
				);
				console.log(error.message);
			});
	});

	const handleLoginWithGmail = () => {
		loginByGoogle()
			.then((result) => {
				const user = result.user;
				if (user.email.slice(-9) === 'ou.edu.vn') {
					router.replace('/');
				} else if (user.email) {
					message.warning('Vui lòng đăng nhập email trường cấp!');
					logoutApi();
				} else
					message.warning(
						'Đăng nhập không thành công vui lòng thử lại!'
					);
			})
			.catch((error) => {
				message.error('Đăng nhập không thành công!');
				console.log('Lỗi đăng nhập: ', error.message);
			});
	};

	return (
		<Content className={styles.content}>
			<Button
				icon={
					<GoogleOutlined
						style={{ fontSize: '16px', color: 'red' }}
						fill="red"
					/>
				}
				className={styles.btnLoginGG}
				onClick={handleLoginWithGmail}
			>
				Đăng nhập Gmail @ou.edu.vn
			</Button>
		</Content>
	);
};

export default Login;
