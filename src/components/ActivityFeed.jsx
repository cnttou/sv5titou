import {
	CloseCircleOutlined,
	DeleteOutlined,
	LinkOutlined,
	PaperClipOutlined,
} from '@ant-design/icons';
import { Typography, Button, Card, Image, List } from 'antd';
import ReactQuill from 'react-quill';
import styles from '../styles/ActivityFeed.module.css';
import Loading from './Loading';
import { nameLevelActivity } from '../config';
import 'antd/lib/tooltip/style/index.css';
import { nameTarget } from '../config';
import { nameDepartmentActivity } from '../config';

const { Text, Title } = Typography;

export const typeFileimage = ['jpeg', 'jpg', 'png'];

function ActivityFeed(props) {
	const {
		loading,
		showFull,
		handleClickDetail,
		handleRemoveImage,
		hoverable,
		bordered,
		btnDetail,
		getColorCard,
		maxHeight,
		overflow,
		...dataItem
	} = props;
	const {
		location,
		numPeople,
		target,
		date,
		department,
		summary,
		name,
		id,
		proof,
		confirm,
		level,
		image,
	} = dataItem;
	const handleClick = () => {
		if (handleClickDetail) handleClickDetail(props.index, dataItem);
	};
	return (
		<Card
			hoverable={hoverable || false}
			bordered={bordered || false}
			className={styles.card}
			id={`activity_${id}`}
			style={
				showFull
					? {
							maxHeight: maxHeight || '75vh',
							overflow: overflow || 'auto',
					  }
					: null
			}
			headStyle={{
				background: getColorCard(id, confirm),
			}}
			bodyStyle={{ paddingBottom: 0 }}
			title={
				<>
					<Title ellipsis={true} level={5}>
						{name}
					</Title>
					<Text type="secondary">{nameLevelActivity[level]}</Text>
				</>
			}
			size="small"
			extra={
				showFull && (
					<Text
						copyable={{
							text: `https://sv5titou.web.app/news/${id}`,
						}}
					>
						<LinkOutlined />
					</Text>
				)
			}
			cover={
				image && (
					<img
						style={
							showFull
								? {
										objectFit: 'cover',
								  }
								: {
										objectFit: 'cover',
										maxHeight: 320,
								  }
						}
						alt={''}
						src={image}
					/>
				)
			}
			onClick={handleClick}
		>
			{department && (
				<p>
					<strong>Khoa:</strong> {nameDepartmentActivity[department]}
				</p>
			)}
			{date && (
				<p>
					<strong>Thời gian:</strong> {date}
				</p>
			)}
			{location && (
				<p>
					<strong>Địa điểm:</strong> {location}
				</p>
			)}
			{showFull && numPeople && (
				<p>
					<strong>Số lượng tối đa:</strong> {numPeople}
				</p>
			)}
			{target && (
				<p>
					<strong>Tiêu chí xét SV5T:</strong>{' '}
					{target.map((c) => nameTarget[c]).join(', ')}
				</p>
			)}
			{showFull && summary && (
				<div style={{ marginBottom: 0 }}>
					<strong>Thông tin chi tiết:</strong>
					<ReactQuill
						theme={null}
						value={summary}
						readOnly={true}
						className={showFull ? '' : styles.editer}
						style={{ height: '100%' }}
					/>
				</div>
			)}
			{showFull && proof && Object.keys(proof).length ? (
				<ShowProof
					proof={Object.values(proof)}
					handleRemoveImage={handleRemoveImage}
				/>
			) : null}
			{loading === true ? <Loading size="default" /> : null}
		</Card>
	);
}

export const ShowProof = ({ proof, handleRemoveImage }) => (
	<>
		<div>
			<strong>Minh chứng đã thêm:</strong>
			<List
				itemLayout="horizontal"
				size="small"
				bordered={false}
				dataSource={proof}
				renderItem={(image) =>
					typeFileimage.includes(image.typeFile) ? null : (
						<List.Item key={image.name}>
							<List.Item.Meta
								icon={<PaperClipOutlined />}
								title={
									<a target="_blank" href={image.url}>
										{`${image.name} - ${
											nameTarget[image.target]
										}`}
									</a>
								}
							/>
							{handleRemoveImage && (
								<DeleteOutlined
									style={{ color: 'red' }}
									onClick={() => {
										handleRemoveImage(image);
									}}
								/>
							)}
						</List.Item>
					)
				}
			/>
		</div>
		<Image.PreviewGroup>
			{proof.map((image, index) =>
				typeFileimage.includes(image.typeFile) ? (
					<div
						key={index}
						style={{
							width: '50%',
							display: 'inline-block',
							marginTop: 5,
							position: 'relative',
						}}
					>
						<Image
							style={{
								objectFit: 'cover',
								objectPosition: 'center center',
							}}
							width={'100%'}
							height={115}
							src={image.url}
						/>
						<p style={{ textAlign: 'center' }}>
							{nameTarget[image.target]}
						</p>
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
									handleRemoveImage(image);
								}}
							/>
						)}
					</div>
				) : null
			)}
		</Image.PreviewGroup>
	</>
);

export default ActivityFeed;
