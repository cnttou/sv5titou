import { Layout } from 'antd';

const { Footer } = Layout;

function FooterContent(props) {
	return (
		<Footer style={styles.footer}>
			Trường Đại học Mở Tp.Hồ Chính Minh <br/>
			<span>Design ©2021</span>
		</Footer>
	);
}

const styles = {
	footer: {
		textAlign: 'center',
		borderTop: '1px solid #5262a5',
		marginTop: '10px',
		padding: '12px 50px',
	},
};

export default FooterContent;
