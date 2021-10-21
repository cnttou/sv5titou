import { useState } from 'react';
import { message, Modal } from 'antd';
import ActivityFeed from '../components/ActivityFeed';
import { useDispatch } from 'react-redux';
import { deleteImageByFullPathAction } from '../store/actions';

function useModel({ title, action, checkRegister, loading, data }) {
	const [visible, setVisible] = useState(false);
	const [indexData, setIndexData] = useState(null);
	const dispatch = useDispatch();

	const colorCard = (id, confirm) => {
		if ((checkRegister && checkRegister(id)) || confirm === false)
			return '#40a9ff';
		else if (confirm === true) return '#73d13d';
		return 'white';
	};
	const handleRemoveImage = (image) => {
		let acId = data[indexData]['id'];
		console.log('remove image: ', image);
		if (acId) {
			dispatch(
				deleteImageByFullPathAction({ path: image.fullPath, acId })
			).then(() => {
				message.success('Xóa ảnh thành công');
			});
		}
	};
	const ui = () => (
		<Modal
			bodyStyle={{ padding: 0 }}
			visible={visible}
			title={title || 'Chi tiết'}
			footer={action || null}
			centered={true}
			onCancel={() => setVisible(false)}
		>
			{indexData !== null && (
				<ActivityFeed
					{...data[indexData]}
					showFull={true}
					colorCard={colorCard}
					btnDetail={false}
					loading={loading || false}
					handleRemoveImage={handleRemoveImage}
				/>
			)}
		</Modal>
	);
	return {
		ui,
		visible,
		setVisible,
		dataModel: data[indexData],
		setIndexData,
	};
}

export default useModel;
