import { Space, Select, Input, message } from 'antd';
import ActivityFeed from './ActivityFeed';
import styles from '../styles/ListActivityFeed.module.css';
import { useState } from 'react';
import { compareStringDate, compareStringName } from '../utils/compareFunction';

const { Option } = Select;
const { Search } = Input;

function ListActivityFeed(props) {
	const { data, checkRegister, handleClick } = props;
	const [sort, setSort] = useState();
	const [resultSearch, setResultSearch] = useState([]);
	const [resultSort, setResultSort] = useState([]);

	const [filter, setFilter] = useState({ level: null, target: null });
	const colorCard = (id, confirm) => {
		if (confirm === true) return '#73d13d';
		if ((checkRegister && checkRegister(id)) || confirm === false)
			return '#69c0ff';
		return 'white';
	};
	const handleSort = (value) => {
		let rs = resultSearch.length !== 0 ? resultSearch : [...data];

		if (value === 'nameaz') rs.sort((a, b) => compareStringName(a, b));
		else if (value === 'nameza') rs.sort((a, b) => compareStringName(b, a));
		else if (value === 'dateaz') rs.sort((a, b) => compareStringDate(a, b));
		else rs.sort((a, b) => compareStringDate(b, a));

		setSort(value);
		setResultSort(rs);
		setResultSearch(rs);
	};

	const handleFilter = (value, type) => {
		let rs = resultSort.length !== 0 ? resultSort : data;

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
	const onSearch = (value) => {
		let kw = value.toLowerCase();
		let rs = data.filter((c) => {
			return c.name.toLowerCase().indexOf(kw) !== -1;
		});
		setResultSearch(rs);
	};
	const loadListActivity = () => {
		let list = [];
		if (resultSearch.length !== 0) list = resultSearch;
		else list = data;

		return list.map((c, index) => (
			<ActivityFeed
				key={index}
				{...c}
				colorCard={colorCard}
				btnDetail={true}
				hoverable={true}
				bordered={true}
				handleClickDetail={handleClick}
				index={index}
			/>
		));
	};
	return (
		<>
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
					<Option value={'the-luc'}>Thể lực</Option>
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
			<Space direction="vertical">{loadListActivity()}</Space>
		</>
	);
}

export default ListActivityFeed;
