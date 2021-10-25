import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
	fetchActivityAction,
	fetchRegisteredActivityAction,
	registerActivityAction,
} from '../store/actions';
import SortItem from '../components/SortNewsItem';
import { Layout, Button, BackTop, message, Input, Typography } from 'antd';
import {
	CloudSyncOutlined,
	PlusCircleOutlined,
	UpOutlined,
} from '@ant-design/icons';
import useModel from '../hooks/useModel';
import ListActivityFeed from '../components/ListActivityFeed';
import SiderContent from '../components/SiderContent';
import { currentUser } from '../api/authentication';
import styles from '../styles/Home.module.css';
import Loading from '../components/Loading';
import { useState } from 'react';

const { Text } = Typography;
const { Search } = Input;
const { Content } = Layout;

function User() {
	const [resultSearch, setResultSearch] = useState([]);

	const listNews = useSelector((state) => state.activity.value);
	const listActivity = useSelector((state) => state.myActivity.value);
	const user = useSelector((state) => state.user.value);

	const dispatch = useDispatch();

	useEffect(() => {
		if (user.uid !== undefined && listNews.length === 0) {
			dispatch(fetchRegisteredActivityAction());
		}
		if (listNews.length === 0) dispatch(fetchActivityAction(10));
	}, [user]);

	const checkRegister = (acId) => {
		if (
			listActivity.length !== 0 &&
			listActivity.find((c) => c.id === acId)
		)
			return true;

		return false;
	};
	const onSearch = (value) => {
		let kw = value.toLowerCase();
		let rs = listNews.filter((c) => {
			return c.name.toLowerCase().indexOf(kw) !== -1;
		});
		setResultSearch(rs);
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
		if (currentUser().uid) {
			const {
				id,
				name,
				date,
				location,
				numPeople,
				summary,
				target,
				active,
				level,
			} = dataModel;
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
	const { dataModel, setIndexData, ui, setVisible, visible } = useModel({
		action,
		title: 'Chi tiết bài viết',
		data: listNews,
		checkRegister,
	});
	const handleClickActivityFeed = (index, obj) => {
		if (index === null || index === undefined) {
			Modal.error({
				title: 'Lỗi',
				content: 'Vui lòng tải lại trang và thử lại',
			});
			return;
		}

		setIndexData(index);
		setVisible(true);
	};
	const loadList = (listNews = []) => (
		<ListActivityFeed
			checkRegister={checkRegister}
			data={listNews || []}
			handleClick={handleClickActivityFeed}
		/>
	);

	return (
		<Layout>
			<Content className={styles.content}>
				<SortItem />
				<div className={styles.wrapper}>
					<Text className={styles.text}>Tìm kiếm</Text>
					<Search
						placeholder="Nhập tên chương trình cần tìm."
						onSearch={onSearch}
						enterButton
						allowClear
						className={styles.search}
					/>
				</div>
				{resultSearch.length !== 0 ? (
					loadList(resultSearch)
				) : listNews?.length ? (
					loadList(listNews)
				) : (
					<Loading />
				)}
			</Content>
			<SiderContent />
			<BackTop>
				<div className={styles.backTopButton}>
					<UpOutlined size="30" />
				</div>
			</BackTop>
			{visible && ui()}
		</Layout>
	);
}

export default User;
