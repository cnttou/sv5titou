import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../components/Loading';
import ModelBrowseFile from '../components/ModelBrowseFile';
import NewsRowTable from '../components/NewsRowTable';
import {
	cancelConfirmProofThunk,
	confirmProofThunk,
	fetchUserThunk,
} from '../store/actions';

export default function AdminManageUser() {
	const [activity, setActivity] = useState('');

	const dispatch = useDispatch();
	let listUser = useSelector((state) => state.userActivity.value);

	useEffect(async () => {
		dispatch(fetchUserThunk()).catch((error) => console.log(error.message));
	}, []);

	const handleConfirm = (index, isConfirm) => {
		let ac = listUser[index];
		if (isConfirm)
			dispatch(confirmProofThunk({ uid: ac.userId, acId: ac.id }));
		else dispatch(cancelConfirmProofThunk({ uid: ac.userId, acId: ac.id }));
	};

	const handleSeeProof = (index) => {
		setActivity(listUser[index]);
	};
	const loadTable = (listUser = []) => (
		<table className="table table-bordered table-hover mt-3">
			<thead>
				<tr className="bg-info">
					<th scope="col">Tên</th>
					<th scope="col">Email</th>
					<th scope="col">Thao tác</th>
				</tr>
			</thead>
			<tbody>
				{listUser.map((c, i) => (
					<NewsRowTable
						email={c.email}
						name={c.name}
						images={c.images}
						id={c.id}
						index={i}
						key={i}
						handleConfirm={handleConfirm}
						handleProof={handleSeeProof}
					/>
				))}
			</tbody>
		</table>
	);
	return (
		<div>
			{listUser?.length ? loadTable(listUser) : <Loading />}
			<ModelBrowseFile activity={activity} />
		</div>
	);
}
