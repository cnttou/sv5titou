import { CloseCircleOutlined } from '@ant-design/icons';
import { Button, Card, Image } from 'antd';
import styles from '../styles/ActivityFeed.module.css';
import Loading from './Loading';

export const nameTarget = {
	'hoi-nhap': 'Hội Nhập',
	'hoc-tap': 'Học Tập',
	'dao-duc': 'Đạo Đức',
	'tinh-nguyen': 'Tình Nguyện',
};

function ActivityFeed(props) {
	const {
		loading,
		showFull,
		handleClickDetail,
		handleRemoveImage,
		hoverable,
		bordered,
		btnDetail,
		colorCard,
		...data
	} = props;
	const {
		location,
		numPeople,
		target,
		date,
		summary,
		name,
		id,
		proof,
		images,
		confirm,
	} = data;
	return (
		<>
			<Card
				hoverable={hoverable || false}
				bordered={bordered || false}
				className={styles.card}
				style={
					showFull ? { maxHeight: '65vh', overflow: 'scroll' } : null
				}
				headStyle={{ background: colorCard(id, confirm) }}
				title={name}
				extra={
					btnDetail && (
						<a onClick={() => handleClickDetail(props.index, data)}>
							Chi tiết
						</a>
					)
				}
			>
				<p>
					<strong>Thời gian:</strong> {date}
				</p>
				<p>
					<strong>Địa điểm:</strong> {location}
				</p>
				<p>
					<strong>Số lượng tối đa:</strong> {numPeople}
				</p>
				<p>
					<strong>Tiêu chí xét SV5T:</strong> {nameTarget[target]}
				</p>
				<p>
					<strong>Thông tin chi tiết:</strong>
					{summary}
				</p>
				{images && (
					<div>
						<strong>Minh chứng đã thêm:</strong>
						<br />
						<Image.PreviewGroup>
							{images.map((c, index) => (
								<div
									key={index}
									style={{
										position: 'relative',
										width: '50%',
										display: 'inline-block',
									}}
								>
									<Image width={'100%'} src={c.url} />
									<Button
										style={{
											position: 'absolute',
											right: 0,
											top: 0,
										}}
										type="ghost"
										shape="circle"
										size="large"
										icon={<CloseCircleOutlined />}
										onClick={() => {
											handleRemoveImage(c);
										}}
									/>
								</div>
							))}
						</Image.PreviewGroup>
						{images.length === 0 && (
							<p>Bạn chưa có minh chứng nào</p>
						)}
					</div>
				)}
				{loading === true && images === undefined ? (
					<Loading size="default" />
				) : null}
			</Card>
		</>
	);
}

export default ActivityFeed;
