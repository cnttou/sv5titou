import { Modal, Carousel, Card, Typography } from 'antd';
import { CloseCircleTwoTone } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { addSlideShow, hideSlideShow } from '../store/reducers/otherSlide';
import { useHistory } from 'react-router';
import { useEffect } from 'react';
import { getImageSlideShowApi } from '../api/firestore';
import styles from '../styles/SlideShow.module.css';

export default function SlideShow() {
	const { isShowSlide, slideShowItems } = useSelector((state) => state.other);
	const dispatch = useDispatch();
	const history = useHistory();

	useEffect(() => {
		if (slideShowItems.length === 0)
			getImageSlideShowApi().then((res) => {
				dispatch(addSlideShow(res));
				if (res.length === 0) {
					dispatch(hideSlideShow());
				}
			});
	}, []);

	const handleCLick = (url) => {
		if (url) {
			history.push(url);
		}
		dispatch(hideSlideShow());
	};

	return (
		<Modal
			visible={isShowSlide}
			width={1000}
			style={{ padding: 0, marginBottom: 0 }}
			bodyStyle={{ padding: 0 }}
			closeIcon={
				<CloseCircleTwoTone
					style={{ fontSize: '25px', marginRight: 1 }}
				/>
			}
			footer={null}
			onCancel={handleCLick}
		>
			<Carousel autoplay={true} dotPosition="top" effect="fade">
				{slideShowItems.length &&
					slideShowItems.map((c, index) => (
						<Card
                            key={index}
							bodyStyle={{ maxHeight: 560, padding: 0 }}
							onClick={() => handleCLick(c.url)}
						>
							<img
								style={{
									objectFit: 'cover',
									width: '100%',
									maxWidth: 1000,
								}}
								alt={index}
								src={c.image}
							/>
						</Card>
					))}
			</Carousel>
		</Modal>
	);
}
