import { Layout } from 'antd';

const { Footer } = Layout;

function FooterContent(props) {
	return (
		<Footer style={styles.footer}>
			Design ©2021 Created by Kanj
		</Footer>
	);
}

const styles = {
	footer: {
		textAlign: 'center',
        marginTop: "10px",
	},
};

export default FooterContent;
