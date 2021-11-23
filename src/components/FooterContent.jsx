import { Layout } from 'antd';
import styles from '../styles/Footer.module.css'

const { Footer } = Layout;

function FooterContent(props) {
	return (
		<Footer className={styles.footer}>
			<span className={styles.copyright}>Copyright © 2021</span> Trường Đại học Mở Thành Phố Hồ Chí
			Minh
		</Footer>
	);
}


export default FooterContent;
