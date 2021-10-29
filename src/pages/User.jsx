import { lazy } from 'react';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
	fetchActivityAction,
	fetchRegisteredActivityAction,
	registerActivityAction,
} from '../store/actions';
import { Layout, Button, BackTop, message, Input, Select } from 'antd';
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
	const [filter, setFilter] = useState({ level: null, target: null });

	const dispatch = useDispatch();

	const handleSort = (value) => {
		setSort(value);
		dispatch(sortActivityByNameAction({ sort: value }));
	};

	const handleFilter = (value, type) => {
		let rs = listNews;

		if (value) {
			rs = rs.filter((c) => value === c[type]);
		}
		setFilter((state) => ({ ...state, [type]: value }));
		type = type === 'target' ? 'level' : 'target';
		if (filter[type]) {
			rs = rs.filter((c) => filter[type] === c[type]);
		}
		if (rs.length === 0) {
			message.info('Không có hoạt động nào thỏa điều kiện!!');
		} else setResultSearch(rs);
	};
	const handleFilterLevel = (value) => handleFilter(value, 'level');
	const handleFilterTarget = (value) => handleFilter(value, 'target');
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
						placeholder="Sắp xếp"
						value={sort}
						onChange={handleSort}
						style={{ width: '33%' }}
					>
						<Option value="nameaz">Tên A-Z</Option>
						<Option value="nameza">Tên Z-A</Option>
						<Option value="dateaz">Thời gian xa-gần</Option>
						<Option value="dateza">Thời gian gần-xa</Option>
					</Select>
					<Select
						placeholder="Lọc tiêu chí"
						onChange={handleFilterTarget}
						style={{ width: '33%' }}
						value={filter.target}
					>
						<Option value={null}> -- </Option>
						<Option value={'tinh-nguyen'}>Tình nguyện</Option>
						<Option value={'hoi-nhap'}>Hội nhập</Option>
						<Option value={'dao-duc'}>Đạo đức</Option>
						<Option value={'suc-khoe'}>Thể lực</Option>
						<Option value={'hoc-tap'}>Học tập</Option>
					</Select>
					<Select
						placeholder="Lọc cấp HĐ"
						onChange={handleFilterLevel}
						value={filter.level}
						style={{ width: '33%' }}
					>
						<Option value={null}> -- </Option>
						<Option value={'truong'}>Cấp trường</Option>
						<Option value={'khoa'}>Cấp khoa</Option>
						<Option value={'lop'}>Cấp chi</Option>
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
