import { Layout } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { checkLogin } from '../api/authentication';
import { getDetailActivityApi, registerActivityApi } from '../api/firestore';
import ActivityFeed from '../components/ActivityFeed';
import Loading from '../components/Loading';
import styles from '../styles/NewDetail.module.css';

const { Content } = Layout;

export default function NewDetail() {
	let { id } = useParams();
	const dispatch = useDispatch();
	const [news, setNews] = useState({});
	const [show, setShow] = useState(false);
	let history = useHistory();

	useEffect(() => {
		if (id !== '') {
			getDetailActivityApi(id).then((data) => setNews(data));
		}
	}, [id]);

	const handleRegister = async () => {
		if (await checkLogin())
			dispatch(
				registerActivityApi(id, news.name, news.date, news.location)
			);
		else setShow(true);
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
		</Content>
	);
}
