import { useState } from 'react';
import { message, Modal } from 'antd';
import ActivityFeed from '../components/ActivityFeed';
import { useDispatch } from 'react-redux';
import { deleteImageByFullPathAction, editProofActivityAction } from '../store/actions';

function useModel({ title, action, checkRegister, loading, data }) {
	const [visible, setVisible] = useState(false);
	const [indexData, setIndexData] = useState(0);
	const dispatch = useDispatch();

	const colorCard = (id, confirm) => {
		if ((checkRegister && checkRegister(id)) || confirm === false)
			return '#69c0ff';
		else if (confirm === true) return '#73d13d';
		return 'white';
	};
	const handleRemoveImage = (image) => {
		if (data[indexData].confirm === true) {
			message.warning('Họat động đã được xác nhận nên không xóa ảnh.');
			return;
		}
		let acId = data[indexData]['id'];

		console.log('remove image: ', image);
		if (acId) {
			dispatch(
				deleteImageByFullPathAction({ path: image.fullPath, acId })
			).then(() => {
				message.success('Xóa ảnh thành công');
                dispatch(
					editProofActivityAction({
						number: -1,
						acId,
					})
				);
			});
		}
	};
	const ui = () => (
		<Modal
			className="modeUseModel"
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
		dataModel: data ? data[indexData] : {},
		setIndexData,
	};
}

export default useModel;
