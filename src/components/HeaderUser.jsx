import { Link } from 'react-router-dom';
import { Menu, Layout, Image } from 'antd';
import {
	CheckCircleOutlined,
	HomeOutlined,
	LogoutOutlined,
	UserOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../styles/Header.module.css';
import { logoutAction } from '../store/actions';
import { useState } from 'react';

const { Header } = Layout;

export default function HeaderUser() {
	const user = useSelector((s) => s.user.value);

	return (
		<>
			<Header className={styles.header} style={{ background: 'white' }}>
				<div className={styles.wrapperLogo}>
					<Image
						width={75}
						preview={false}
						src="/logo.png"
						alt="logo menu bar"
						className={styles.logo}
					/>
				</div>
				<Menu
					defaultSelectedKeys={['home']}
					mode="horizontal"
					className={styles.menu}
					expandIcon={false}
				>
					<Menu.Item
						key="home"
						icon={
							<Link to="/news">
								<HomeOutlined />
							</Link>
						}
					>
						<Link to="/news" className={styles.itemText}>
							Trang chủ
						</Link>
					</Menu.Item>
					<Menu.Item
						key="register-activity"
						icon={
							<Link to="/register-activity">
								<CheckCircleOutlined />
							</Link>
						}
						disabled={user.email ? false : true}
					>
						<Link
							to="/register-activity"
							className={styles.itemText}
						>
							Hoạt động đã đăng ký
						</Link>
					</Menu.Item>
					<Menu.Item
						key="profile"
						icon={
							<Link to="/profile">
								<UserOutlined />
							</Link>
						}
						disabled={user.email ? false : true}
					>
						<Link to="/profile" className={styles.itemText}>
							Thông tin cá nhân
						</Link>
					</Menu.Item>
					<Menu.Item
						key="login"
						className="btnLogout"
						icon={
							<Link to="/login">
								<LogoutOutlined />
							</Link>
						}
					>
						<Link to="/login" className={styles.itemText}>
							{user.email ? 'Đăng xuất' : 'Đăng nhập'}
						</Link>
					</Menu.Item>
				</Menu>
			</Header>
		</>
	);
}
