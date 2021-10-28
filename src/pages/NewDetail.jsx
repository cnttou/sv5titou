import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Layout, message } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { checkLogin, currentUser } from '../api/authentication';
import { getDetailActivityApi, registerActivityApi } from '../api/firestore';
import ActivityFeed from '../components/ActivityFeed';
import Loading from '../components/Loading';
import { fetchRegisteredActivityAction, registerActivityAction } from '../store/actions';
import styles from '../styles/NewDetail.module.css';

const { Content } = Layout;

export default function NewDetail() {
	let { id } = useParams();
	const dispatch = useDispatch();
	const [news, setNews] = useState({});
	const listActivity = useSelector((state) => state.myActivity.value);
	const user = useSelector((state) => state.user.value);

	useEffect(() => {
		if (id !== '' && news.id === undefined) {
			getDetailActivityApi(id).then((data) => setNews(data));
		}
        if (user.uid !== undefined && listActivity.length === 0) {
			dispatch(fetchRegisteredActivityAction());
		}
	}, [id, user]);

	const checkRegister = (acId) => {
		if (
			listActivity.length !== 0 &&
			listActivity.find((c) => c.id === acId)
		)
			return true;

		return false;
	};
	const handleRegister = () => {
		if (checkRegister(news.id)) {
			message.info('Hoạt động này đã đăng ký.');
			return;
		}
		if (!user.uid) {
			message.info('Vui lòng đăng nhập để đăng ký hoạt động.');
			return;
		}
		if (user.uid) {
			const { id, name, date, location, numPeople } = news;
			const { summary, target, active, level } = news;
			dispatch(
				registerActivityAction({
					id,
					name,
					date,
					location,
					numPeople,
					summary,
					target,
					active,
					level,
				})
			)
				.then(() => {
					message.success('Đăng kí thành công.');
				})
				.catch((err) => {
					message.warning('Đăng kí thất bại, vui lòng thử lại.');
					console.log('Đăng ký lỗi: ', err);
				});
		} else
			message.warning(
				'Bạn phải đăng nhập để thực hiện được chức năng này'
			);
		console.log('clicked register', news);
	};

	const colorCard = (id, confirm) => {
		if (confirm === false) return '#69c0ff';
		else if (confirm === true) return '#73d13d';
		return 'white';
	};

	return (
		<Content className={styles.content}>
			{news?.name ? (
				<ActivityFeed {...news} colorCard={colorCard} showFull={true} />
			) : (
				<Loading />
			)}
			<Button
				key={'đăng ký'}
				icon={<PlusCircleOutlined />}
				type="primary"
				onClick={handleRegister}
				size="large"
			>
				Đăng ký
			</Button>
		</Content>
	);
}
