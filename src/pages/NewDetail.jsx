import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Layout, message } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import ActivityFeed from '../components/ActivityFeed';
import Loading from '../components/Loading';
import { registerActivityAction } from '../store/actions';
import styles from '../styles/NewDetail.module.css';

const { Content } = Layout;

export default function NewDetail() {
	let { id } = useParams();
	const dispatch = useDispatch();
	const [news, setNews] = useState({});
	const listActivity = useSelector((state) => state.activity.value);
	const listMyActivity = useSelector((state) => state.myActivity.value);
	const user = useSelector((state) => state.user.value);

	useEffect(() => {
		if (listActivity.length && id) {
			const activity = listActivity.find((c) => c.id === id);
			if (activity) setNews(activity);
		}
	}, [user]);

	const checkRegister = (acId) => {
		if (
			listMyActivity.length !== 0 &&
			Object.values(listMyActivity).find((c) => c.id === acId)
		)
			return true;

		return false;
	};
	const handleRegister = () => {
		if (!user.uid) {
			message.info('Vui lòng đăng nhập để đăng ký hoạt động.');
			return;
		}
		if (user.uid) {
			dispatch(
				registerActivityAction({
					...news,
				})
			);
            setNews(pre=>({...pre, confirm: false, proof: 0}));
		}
		console.log('clicked register', news);
	};

	const getColorCard = (id, confirm) => {
		if (confirm === false) return '#69c0ff';
		else if (confirm === true) return '#73d13d';
		return 'white';
	};

	return (
		<Content className={styles.content}>
			{news?.name ? (
				<>
					<ActivityFeed
						{...news}
						maxHeight={'none'}
						overflow={'hidden'}
						getColorCard={getColorCard}
						showFull={true}
						bordered={true}
					/>
					{checkRegister(id) === false && (
						<Button
							key={'đăng ký'}
							icon={<PlusCircleOutlined />}
							type="primary"
							onClick={news.id && handleRegister}
							size="large"
						>
							Đăng ký
						</Button>
					)}
				</>
			) : (
				<Loading />
			)}
		</Content>
	);
}
