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

function User() {
	const activities = useSelector((state) =>
		state.activity.value.filter((c) => c.typeActivity === 'register')
	);
	const myActivity = useSelector((state) => state.myActivity.value);
    const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);
	const [visible, setVisible] = useState(false);
	const [indexSelected, setIndexSelected] = useState(null);

	const getColorCard = (id, confirm) =>{
		return myActivity[id] ? '#69c0ff' : 'white';
    }

	const handleRegister = async () => {
		setLoading(true);
		await dispatch(
			registerActivityAction({ id: activities[indexSelected].id })
		);
		setLoading(false);
	};

	const handleClickActivityFeed = (index, activityClicked) => {
		activities.forEach((c, index) => {
			if (c.id === activityClicked.id) {
				setIndexSelected(index);
			}
		});
		setVisible(true);
	};

	return (
		<Layout>
			<SlideShow />
			<Content className={styles.content}>
				{activities?.length ? (
					<ListActivityFeed
						data={activities}
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
			<Modal
				className="modeUseModel"
				bodyStyle={{ padding: 0 }}
				visible={visible}
				title={'Chi tiết'}
				footer={
					visible && !myActivity[activities[indexSelected].id] ? (
						<Button
							key={'đăng ký'}
							icon={<PlusCircleOutlined />}
							type="primary"
							onClick={handleRegister}
							size="large"
							loading={loading}
						>
							Đăng ký
						</Button>
					) : null
				}
				centered={true}
				onCancel={() => setVisible(false)}
			>
				<ActivityFeed
					{...activities[indexSelected]}
					showFull={true}
					getColorCard={getColorCard}
					btnDetail={false}
				/>
			</Modal>
		</Layout>
	);
}

export default User;
