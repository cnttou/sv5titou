import { lazy } from 'react';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
	fetchActivityAction,
	fetchRegisteredActivityAction,
	registerActivityAction,
} from '../store/actions';
import {
	Layout,
	Button,
	BackTop,
	message,
	Input,
	Select,
} from 'antd';
import { PlusCircleOutlined, UpOutlined } from '@ant-design/icons';
const ListActivityFeed = lazy(() => import('../components/ListActivityFeed'));
const SiderContent = lazy(() => import('../components/SiderContent'));
import styles from '../styles/Home.module.css';
import Loading from '../components/Loading';
import { useState } from 'react';
import { sortActivityByNameAction } from '../store/reducers/activitySlide';
import useModel from '../hooks/useModel';

const { Option } = Select;
const { Search } = Input;
const { Content } = Layout;

function User() {
	const [resultSearch, setResultSearch] = useState([]);

	const listNews = useSelector((state) => state.activity.value);
	const listActivity = useSelector((state) => state.myActivity.value);
	const user = useSelector((state) => state.user.value);
	const [sort, setSort] = useState();

	const dispatch = useDispatch();

	const handleSort = (value) => {
		setSort(value);
		dispatch(sortActivityByNameAction({ sort: value }));
	};

	const handleFilter = (value) => {
		let rs = [];
		if (resultSearch.length === 0) {
			rs = listNews.filter((c) => {
				if (value.includes(c.target)) return true;
				return false;
			});
		} else {
			rs = resultSearch.filter((c) => {
				if (value.includes(c.target)) return true;
				return false;
			});
		}
		setResultSearch(rs);
	};

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
		if (user.uid) {
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
				<div className={styles.wrapper}>
					<Search
						placeholder="Nhập tên chương trình cần tìm."
						onSearch={onSearch}
						enterButton
						allowClear
						className={styles.search}
					/>
				</div>
				<Input.Group compact className={styles.wrapper}>
					<Select
						placeholder="Sắp xếp theo"
						value={sort}
						onChange={handleSort}
						style={{ width: '50%' }}
					>
						<Option value="nameaz">Tên A-Z</Option>
						<Option value="nameza">Tên Z-A</Option>
						<Option value="dateaz">Thời gian xa-gần</Option>
						<Option value="dateza">Thời gian gần-xa</Option>
					</Select>
					<Select
						placeholder="Lọc hoạt động"
						mode="multiple"
						onChange={handleFilter}
						style={{ width: '50%' }}
					>
						<Option value={'tinh-nguyen'}>
							Tiêu chí tình nguyện
						</Option>
						<Option value={'hoi-nhap'}>Tiêu chí hội nhập</Option>
						<Option value={'dao-duc'}>Tiêu chí đạo đức</Option>
						<Option value={'suc-khoe'}>Tiêu chí thể lực</Option>
						<Option value={'hoc-tap'}>Tiêu chí học tập</Option>
					</Select>
				</Input.Group>
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
