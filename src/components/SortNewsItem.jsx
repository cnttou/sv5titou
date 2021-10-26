import { Input, Select, Typography } from 'antd';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { sortActivityByNameAction } from '../store/reducers/activitySlide';
import styles from '../styles/SortItem.module.css';

const { Text } = Typography;
const { Option } = Select;

export default function SortItem() {
	const [filter, setFilter] = useState([]);
	const [sort, setSort] = useState();
	const dispatch = useDispatch();

	const handleSort = (value) => {
		setSort(value);
		dispatch(sortActivityByNameAction({ sort, filter }));
	};
	const handleFilter = (value) => {
		setFilter(value);
		dispatch(sortActivityByNameAction({ sort, filter }));
	};
	return (
		<div className={styles.wrapper}>
			<div className={styles.content}>
				<Select
					defaultValue="dateaz"
					value={sort}
					onChange={handleSort}
					className={styles.item}
					style={{ width: '50%' }}
				>
					<Option value="nameaz">Tên A-Z</Option>
					<Option value="nameza">Tên Z-A</Option>
					<Option value="dateaz">Thời gian gần-xa</Option>
					<Option value="dateza">Thời gian xa-gần</Option>
				</Select>
				<Select
					placeholder="Lọc hoạt động"
					mode="multiple"
					value={filter}
					onChange={handleFilter}
					className={styles.item}
					style={{ width: '50%' }}
				>
					<Option value={'lop'}>HĐ cấp chi</Option>
					<Option value={'khoa'}>HĐ cấp khoa</Option>
					<Option value={'truong'}>HĐ cấp trường</Option>
					<Option value={'tinh-nguyen'}>Tiêu chí tình nguyện</Option>
					<Option value={'hoi-nhap'}>Tiêu chí hội nhập</Option>
					<Option value={'dao-duc'}>Tiêu chí đạo đức</Option>
					<Option value={'suc-khoe'}>Tiêu chí thể lực</Option>
					<Option value={'hoc-tap'}>Tiêu chí học tập</Option>
				</Select>
			</div>
		</div>
	);
}
