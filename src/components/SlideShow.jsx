import { Modal, Carousel, Card, Typography } from 'antd';
import { CloseCircleTwoTone } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { addSlideShow, hideSlideShow } from '../store/reducers/otherSlide';
import { useEffect } from 'react';
import { getImageSlideShowApi } from '../api/firestore';


export default function SlideShow() {
	const { isShowSlide, slideShowItems } = useSelector((state) => state.other);
	const dispatch = useDispatch();

	useEffect(() => {
		if (slideShowItems.length === 0)
			getImageSlideShowApi().then((res) => {
                dispatch(addSlideShow(res));
				if (res.length === 0) {
					dispatch(hideSlideShow());
				}
			}).catch(error=> console.log(error.message));
	}, []);

	const handleCLick = (url) => {
		dispatch(hideSlideShow());
	};

	return (
        slideShowItems.length !== 0?
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
							style={{ padding: 0 }}
							bodyStyle={{
								maxHeight: 664,
								padding: 0,
								maxWidth: 1000,
							}}
						>
							{c.url ? (
								<a href={c.url} target="_blank">
									<img
										style={{
											objectFit: 'cover',
											width: '100%',
										}}
										alt={''}
										src={c.image}
									/>
								</a>
							) : (
								<img
									style={{
										objectFit: 'cover',
										width: '100%',
									}}
									alt={''}
									src={c.image}
								/>
							)}
						</Card>
					))}
			</Carousel>
		</Modal>: null
	);
}
