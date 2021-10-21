import { Input, Select, Typography } from 'antd';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { sortActivityByNameAction } from '../store/reducers/activitySlide';
import styles from '../styles/SortItem.module.css';

const { Text } = Typography;
const { Option } = Select;

export default function SortItem() {
	const [orderBy, setOrderBy] = useState('date');
	const [typeSort, setTypeSort] = useState(false);
	const dispatch = useDispatch();

	const handleOrderBy = (value) => {
		setOrderBy(value);
		dispatch(sortActivityByNameAction({ typeSort, orderBy: value }));
	};
	const handleTypeSort = (value) => {
		setTypeSort(value);
		dispatch(
			sortActivityByNameAction({
				typeSort: value,
				orderBy,
			})
		);
	};
	return (
		<div className={styles.wrapper}>
			<Text className={styles.text}>Sắp xếp</Text>
			<div className={styles.content}>
				<Select
					defaultValue="name"
					value={orderBy}
					onChange={handleOrderBy}
					className={styles.item}
					style={{ width: '50%' }}
					
				>
					<Option value="name">Tên</Option>
					<Option value="target">Tiêu chí</Option>
					<Option value="date">Thời gian</Option>
					<Option value="numPeople">Số người</Option>
				</Select>
				<Select
					
					defaultValue={true}
					value={typeSort}
					onChange={handleTypeSort}
					className={styles.item}
					style={{ width: '50%' }}
				>
					<Option value={true}>Tăng dần</Option>
					<Option value={false}>Giảm dần</Option>
				</Select>
			</div>
		</div>
	);
}
