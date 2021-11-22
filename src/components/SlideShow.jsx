import { Modal, Carousel, Card } from 'antd';
import { CloseCircleTwoTone } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { addSlideShow, hideSlideShow } from '../store/reducers/otherSlide';
import { useHistory } from 'react-router';
import { s } from '../../dist/assets/vendor.1ae3cce0';
import { useEffect } from 'react';
import { getImageSlideShowApi } from '../api/firestore';

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
					style={{ fontSize: '25px', marginRight: 5 }}
				/>
			}
			footer={null}
			onCancel={handleCLick}
		>
			<Carousel autoplay={true} dotPosition="top">
				{slideShowItems.length && slideShowItems.map((c, index) => (
					<Card
                        key={index}
						hoverable
						bodyStyle={{ padding: 5 }}
						onClick={() => handleCLick(c.link)}
						cover={
							<>
								<img
									style={{ maxHeight: '70vh', objectFit: 'cover'}}
									alt="example"
									src={c.image}
								/>
							</>
						}
					>
						<Card.Meta
							style={{ textAlign: 'center' }}
							title={c.title}
							description={s.description}
						/>
					</Card>
				))}
			</Carousel>
		</Modal>
	);
}
