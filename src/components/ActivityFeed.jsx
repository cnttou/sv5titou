import {
	CloseCircleOutlined,
	DeleteOutlined,
	PaperClipOutlined,
} from '@ant-design/icons';
import {Typography, Button, Card, Image, List } from 'antd';
import ReactQuill from 'react-quill';
import { nameLevelActivity } from '../hooks/useCreateEditActivityModel';
import styles from '../styles/ActivityFeed.module.css';
import Loading from './Loading';

export const nameTarget = {
	'hoi-nhap': 'Hội nhập tốt',
	'hoc-tap': 'Học tập tốt',
	'dao-duc': 'Đạo đức tốt',
	'tinh-nguyen': 'Tình nguyện tốt',
	'suc-khoe': 'Thể lực tốt',
};
export const typeFileimage = ['.jpeg', '.jpg', '.png'];

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
        level,
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
				bodyStyle={{ maxHeight: 268 }}
				headStyle={{ background: colorCard(id, confirm) }}
				title={
					<>
						<Typography.Title level={5}>{name}</Typography.Title>
						<Typography.Text type="secondary">
							{nameLevelActivity[level]}
						</Typography.Text>
					</>
				}
				onClick={() => handleClickDetail(props.index, data)}
			>
				<p>
					<strong>Thời gian:</strong> {date}
				</p>
				<p>
					<strong>Địa điểm:</strong> {location}
				</p>
				{numPeople && (
					<p>
						<strong>Số lượng tối đa:</strong> {numPeople}
					</p>
				)}
				<p>
					<strong>Tiêu chí xét SV5T:</strong> {nameTarget[target]}
				</p>
				<p style={{ marginBottom: 0 }}>
					<strong>Thông tin chi tiết:</strong>
					<ReactQuill
						theme={null}
						defaultValue={summary}
						readOnly={true}
						className={showFull ? "" : styles.editer}
						style={{ height: '100%' }}
					/>
				</p>
				{images && (
					<div>
						<strong>Minh chứng đã thêm:</strong>
						<br />
						<List
							itemLayout="horizontal"
							size="small"
							bordered
							dataSource={images}
							renderItem={(item) =>
								typeFileimage.includes(
									item.name.slice(item.name.lastIndexOf('.'))
								) ? null : (
									<List.Item>
										<List.Item.Meta
											icon={<PaperClipOutlined />}
											title={
												<a
													target="_blank"
													href={item.url}
												>
													{item.name}
												</a>
											}
										/>

										{handleRemoveImage && (
											<DeleteOutlined
												style={{ color: 'red' }}
												onClick={() => {
													handleRemoveImage(item);
												}}
											/>
										)}
									</List.Item>
								)
							}
						/>
					</div>
				)}
				<Image.PreviewGroup>
					{images &&
						images.map((c, index) =>
							typeFileimage.includes(
								c.name.slice(c.name.lastIndexOf('.'))
							) ? (
								<div
									key={index}
									style={{
										width: '50%',
										display: 'inline-block',
										marginTop: 5,
										position: 'relative',
									}}
								>
									<Image width={'100%'} src={c.url} />
									{handleRemoveImage && (
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
									)}
								</div>
							) : null
						)}
				</Image.PreviewGroup>
				{loading === true && images === undefined ? (
					<Loading size="default" />
				) : null}
			</Card>
		</>
	);
}

export default ActivityFeed;
