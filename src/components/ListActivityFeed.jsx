import { Space } from 'antd';
import ActivityFeed from './ActivityFeed';
import styles from '../styles/ListActivityFeed.module.css';

function ListActivityFeed(props) {
	const { data, checkRegister, handleClick } = props;

	const colorCard = (id, confirm) => {
		if ((checkRegister && checkRegister(id)) || confirm === false)
			return '#69c0ff';
		else if (confirm === true) return '#73d13d';
		return 'white';
	};
	const handleRemoveImage = (c) => {
		console.log('remove image: ', c);
	};
	return (
		<>
			<Space direction="vertical">
				{data.map((c, index) => (
					<ActivityFeed
						key={index}
						{...c}
						colorCard={colorCard}
						btnDetail={true}
						hoverable={true}
						bordered={true}
						handleClickDetail={handleClick}
						handleRemoveImage={handleRemoveImage}
						index={index}
					/>
				))}
			</Space>
		</>
	);
}

export default ListActivityFeed;
