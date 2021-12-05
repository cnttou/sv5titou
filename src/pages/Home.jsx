import { lazy } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { registerActivityAction } from '../store/actions';
import { Layout, Button, BackTop, message, Modal } from 'antd';
import { PlusCircleOutlined, UpOutlined } from '@ant-design/icons';
import SlideShow from '../components/SlideShow';
const ListActivityFeed = lazy(() => import('../components/ListActivityFeed'));
const SiderContent = lazy(() => import('../components/SiderContent'));
import styles from '../styles/Home.module.css';
import Loading from '../components/Loading';
import { useState } from 'react';
import ActivityFeed from '../components/ActivityFeed';

const { Content } = Layout;

function getAction(isRegistered, onClick, loading) {
	return isRegistered
		? null
		: [
				<Button
					key={'đăng ký'}
					icon={<PlusCircleOutlined />}
					type="primary"
					onClick={onClick}
					size="large"
					loading={loading}
				>
					Đăng ký
				</Button>,
		  ];
}

function User() {
	const [visible, setVisible] = useState(false);
	const [index, setIndex] = useState(0);
	const activities = useSelector((state) => state.activity.value);
	const myActivity = useSelector((state) => state.myActivity.value);

	const checkRegister = (id) => (myActivity[id] ? true : false);

	const getColorCard = (id, confirm) =>
		checkRegister(id) ? '#69c0ff' : 'white';

	const handleClickActivityFeed = (index, activityClicked) => {
		activities.forEach((c, index) => {
			if (c.id === activityClicked.id) {
				setIndex(index);
			}
		});
		setVisible(true);
	};

	return (
		<Layout>
			<SlideShow />
			<Content className={styles.content}>
				{activities.length !== 0 ? (
					<ListActivityFeed
						data={activities || []}
						handleClick={handleClickActivityFeed}
						getColorCard={getColorCard}
					/>
				) : (
					<Loading />
				)}
			</Content>
			{activities.length !== 0 && <SiderContent />}
			<BackTop>
				<div className={styles.backTopButton}>
					<UpOutlined size="30" style={{ color: 'white' }} />
				</div>
			</BackTop>
			<DetailModal
				index={index}
				visible={visible}
				setVisible={setVisible}
				getColorCard={getColorCard}
				checkRegister={checkRegister}
			/>
		</Layout>
	);
}

const DetailModal = ({
	index,
	visible,
	setVisible,
	getColorCard,
	checkRegister,
}) => {
	const { registering } = useSelector((s) => s.myActivity);
	const dispatch = useDispatch();
	const user = useSelector((s) => s.user.value);
	const activities = useSelector((state) => state.activity.value);

	const handleRegister = () => {
		if (!user.id) {
			message.info('Vui lòng đăng nhập để đăng ký hoạt động.');
			return;
		}
		dispatch(registerActivityAction({ ...activities[index] }))
	};
	return (
		<Modal
			className="modeUseModel"
			bodyStyle={{ padding: 0 }}
			visible={visible}
			title={'Chi tiết'}
			footer={
				visible
					? getAction(
							checkRegister(activities[index].id),
							handleRegister,
							registering !== 0
					  )
					: null
			}
			centered={true}
			onCancel={() => setVisible(false)}
		>
			<ActivityFeed
				{...activities[index]}
				showFull={true}
				getColorCard={getColorCard}
				btnDetail={false}
			/>
		</Modal>
	);
};

export default User;
