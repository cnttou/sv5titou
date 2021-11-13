import { lazy } from 'react';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
	fetchActivityAction,
	fetchRegisteredActivityAction,
	registerActivityAction,
} from '../store/actions';
import { Layout, Button, BackTop, message } from 'antd';
import { PlusCircleOutlined, UpOutlined } from '@ant-design/icons';
const ListActivityFeed = lazy(() => import('../components/ListActivityFeed'));
const SiderContent = lazy(() => import('../components/SiderContent'));
import styles from '../styles/Home.module.css';
import Loading from '../components/Loading';
import useModel from '../hooks/useModel';

const { Content } = Layout;

function User() {
	const listNews = useSelector((state) => state.activity.value);
	const listActivity = useSelector((state) => state.myActivity.value);
	const user = useSelector((state) => state.user.value);

	const dispatch = useDispatch();

	useEffect(() => {
		if (user.uid !== undefined && listNews.length === 0) {
			dispatch(fetchRegisteredActivityAction());
		}
	}, [user]);

	useEffect(() => {
		if (listNews.length === 0) dispatch(fetchActivityAction(10));
	}, []);

	const checkRegister = (acId) => {
		if (
			listActivity.length !== 0 &&
			listActivity.find((c) => c.id === acId)
		)
			return true;

		return false;
	};

	const handleRegister = () => {
		if (checkRegister(dataModel.id)) {
			message.info('Hoạt động này đã đăng ký.');
			return;
		}
		if (!user.uid) {
			message.info('Vui lòng đăng nhập để đăng ký hoạt động.');
			return;
		}
		if (user.uid) {
			dispatch(
				registerActivityAction({
					...dataModel,
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
		console.log('clicked register', dataModel);
	};

	const action = [
		<Button
			key={'đăng ký'}
			icon={<PlusCircleOutlined />}
			type="primary"
			onClick={handleRegister}
			size="large"
		>
			Đăng ký
		</Button>,
	];
	const { dataModel, setIndexData, ui, setVisible } = useModel({
		action,
		title: 'Chi tiết bài viết',
		data: listNews,
		checkRegister,
	});
	const handleClickActivityFeed = (index, obj) => {
		if (index === null || index === undefined) {
			message.error('Vui lòng tải lại trang và thử lại');
			return;
		}
		listNews.forEach((c, index) => {
			if (c.id === obj.id) {
				setIndexData(index);
			}
		});
		setVisible(true);
	};

	return (
		<Layout>
			<Content className={styles.content}>
				{listNews.length !== 0 ? (
					<ListActivityFeed
						checkRegister={checkRegister}
						data={listNews || []}
						handleClick={handleClickActivityFeed}
					/>
				) : (
					<Loading />
				)}
			</Content>
			<SiderContent />
			<BackTop>
				<div className={styles.backTopButton}>
					<UpOutlined size="30" style={{ color: 'white' }} />
				</div>
			</BackTop>
			{ui()}
		</Layout>
	);
}

export default User;
