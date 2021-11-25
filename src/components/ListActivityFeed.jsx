import { Space, Select, Input, message } from 'antd';
import ActivityFeed from './ActivityFeed';
import styles from '../styles/ListActivityFeed.module.css';
import { useState } from 'react';
import { compareStringDate, compareStringName } from '../utils/compareFunction';
import { nameLevelActivity } from '../config';

const { Option } = Select;
const { Search } = Input;

const nameTarget = {
	'dao-duc': 'Đạo đức tốt',
	'hoc-tap': 'Học tập tốt',
	'the-luc': 'Thể lực tốt',
	'tinh-nguyen': 'Tình nguyện tốt',
	'hoi-nhap': 'Hội nhập tốt',
	've-ngoai-ngu': 'Về ngoại ngữ',
	've-ky-nang': 'Về kỹ năng',
};

const getOption = (nameList) =>
	Object.entries(nameList).map(([key, value]) => (
		<Option key={key} value={key}>
			{value}
		</Option>
	));

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
		// setResultSort(rs);

		rs = rs.filter((c) => {
			let rs1 = filter.level ? filter.level === c.level : true;
			let rs2 = filter.target ? c.target.includes(filter.target) : true;
			return rs1 && rs2;
		});
		setResultSearch(rs);
	};
	const handleFilterLevel = (value) => {
		let rs = resultSort.length !== 0 ? resultSort : data;

		if (value) {
			rs = rs.filter((c) => value === c.level);
		}

		setFilter((state) => ({ ...state, level: value }));

		if (filter.target) {
			rs = rs.filter((c) => c.target.includes(filter.target));
		}
		if (rs.length === 0) {
			message.info('Không có hoạt động nào thỏa điều kiện!!');
		} else setResultSearch(rs);
	};
	const handleFilterTarget = (value) => {
		let rs = resultSort.length !== 0 ? resultSort : data;

		if (value) {
			rs = rs.filter((c) => c.target.includes(value));
		}

		setFilter((state) => ({ ...state, target: value }));
		if (filter.level) rs = rs.filter((c) => filter.level === c.level);
		if (rs.length === 0) {
			message.info('Không có hoạt động nào thỏa điều kiện!!');
		} else setResultSearch(rs);
	};
	const onSearch = (value) => {
		let kw = value.toLowerCase();
		let rs = data.filter((c) => {
			return c.name.toLowerCase().indexOf(kw) !== -1;
		});
		if (rs.length === 0) {
			message.info('Tìm không thấy!!');
		} else {
			setResultSearch(rs);
			setSort(null);
			setFilter({ target: null, level: null });
		}
	};
	const loadListActivity = () => {
		let list = [];
		if (resultSearch.length !== 0) list = resultSearch;
		else list = resultSort.length !== 0 ? resultSort : data;

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
			<div className={styles.wrapperSearch}>
				<Search
					placeholder="Nhập tên chương trình cần tìm."
					onSearch={onSearch}
					enterButton
					allowClear
					className={styles.search}
				/>
			</div>
			<div className={styles.wrapperSearch}>
				<Input.Group compact>
					<Select
						placeholder="Sắp xếp"
						value={sort}
						onChange={handleSort}
						style={{ width: 'calc(100% / 3)' }}
					>
						<Option value="nameaz">Tên A-Z</Option>
						<Option value="nameza">Tên Z-A</Option>
						<Option value="dateaz">Thời gian xa-gần</Option>
						<Option value="dateza">Thời gian gần-xa</Option>
					</Select>
					<Select
						placeholder="Lọc tiêu chí"
						onChange={handleFilterTarget}
						style={{ width: 'calc(100% / 3)' }}
						value={filter.target}
					>
						<Option value={null}> -- </Option>
						{getOption(nameTarget)}
					</Select>
					<Select
						placeholder="Lọc cấp HĐ"
						onChange={handleFilterLevel}
						value={filter.level}
						style={{ width: 'calc(100% / 3)' }}
					>
						<Option value={null}> -- </Option>
						{getOption(nameLevelActivity)}
					</Select>
				</Input.Group>
			</div>
			<Space direction="vertical" className={styles.listActivity}>
				{loadListActivity()}
			</Space>
		</>
	);
}

export default ListActivityFeed;
