import { Link, useLocation } from 'react-router-dom';
import { Menu, Layout, Image } from 'antd';
import {
	AppstoreAddOutlined,
	AuditOutlined,
	CheckCircleOutlined,
	HomeOutlined,
	LogoutOutlined,
	UserOutlined,
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import styles from '../styles/Header.module.css';

const { Header } = Layout;

export default function HeaderUser() {
	const user = useSelector((s) => s.user.value);
	let location = useLocation();

	return (
		<>
			<Header className={styles.header} style={{ background: 'white' }}>
				<div className={styles.wrapperLogo}>
					<Image
						width={75}
						preview={false}
						src="/logo-dhm.png"
						alt="logo menu bar"
						className={styles.logo}
					/>
				</div>
				<Menu
					defaultSelectedKeys={['home']}
					selectedKeys={[location.pathname.slice(1)]}
					mode="horizontal"
					className={styles.menu}
					expandIcon={false}
				>
					<Menu.Item
						key="news"
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
