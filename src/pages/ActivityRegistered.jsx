import { Layout } from 'antd';
import styles from '../styles/PageActivityRegistered.module.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	fetchRegisteredActivityAction,
} from '../store/actions';
import { getOtherActivitiesApi } from '../api/firestore';
import { addMoreMyActivityAction } from '../store/reducers/myActivitySlice';
import ListActivityUser from '../components/ListActivityUser';

const { Content } = Layout;

function ActivityRegistered() {
	const dispatch = useDispatch();
	let { value: data } = useSelector((s) => s.myActivity);

	const user = useSelector((state) => state.user.value);

	// useEffect(() => {
	// 	if (user.uid !== undefined && data.length === 0) {
	// 		dispatch(fetchRegisteredActivityAction()).then((res) => {
	// 			let listId = res.payload.map((c) => c.id);
	// 			getOtherActivitiesApi().then((data) => {
	// 				const addData = data.filter(
	// 					(d) => listId.includes(d.id) === false
	// 				);
	// 				dispatch(addMoreMyActivityAction(addData));
	// 			});
	// 		});
	// 	}
	// }, [user]);

	return (
		<Content className={styles.content}>
            <ListActivityUser />
		</Content>
	);
}

export default ActivityRegistered;
