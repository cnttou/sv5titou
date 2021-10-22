import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteActivityAction, fetchActivityAction } from '../store/actions';
import Loading from '../components/Loading';
import { Table, Space, Button } from 'antd';
import { compareStringDate, compareStringName } from '../utils/compareFunction';
import useCreateEditActivityModel from '../hooks/useCreateEditActivityModel';
import { nameTarget } from '../components/ActivityFeed';

const initActivity = {
	name: '',
	date: null,
	location: '',
	summary: '',
	numPeople: null,
	target: null,
};

export default function AdminManageNews() {
	const listNews = useSelector((state) => state.activity.value);
	const dispatch = useDispatch();

	useEffect(() => {
		if (listNews.length === 0) {
			dispatch(fetchActivityAction(10));
		}
	}, []);

	const handleShowModelToEdit = (item) => {
		setDataModel(item);
		setVisible(true);
	};

	const handleShowModelToAddNew = () => {
		setDataModel(initActivity);
		setVisible(true);
	};

	const handleDelete = (item) => {
		dispatch(deleteActivityAction(item.id));
	};

	const { ui, visible, setVisible, dataModel, setDataModel } =
		useCreateEditActivityModel({
			title: 'Tạo và chỉnh sửa hoạt động',
		});

	const columns = [
		{
			title: 'Tên',
			dataIndex: 'name',
			key: 'name',
			defaultSortOrder: 'descend',
			sorter: (a, b) => compareStringName(a.name, b.name),
			render: (text) => <a>{text}</a>,
		},
		{
			title: 'Tiêu chí',
			dataIndex: 'target',
			key: 'target',
			filters: [
				{
					text: 'Hội nhập',
					value: 'hoi-nhap',
				},
				{
					text: 'Đạo đức',
					value: 'dao-duc',
				},
				{
					text: 'Học Tập',
					value: 'hoc-tap',
				},
				{
					text: 'Tình Nguyện',
					value: 'tinh-nguyen',
				},
				{
					text: 'Sức khỏe',
					value: 'suc-khoe',
				},
			],
			onFilter: (value, record) => record.target === value,
			render: (text) => nameTarget[text],
		},
		{
			title: 'Thời gian',
			dataIndex: 'date',
			key: 'date',
			defaultSortOrder: 'descend',
			sorter: (a, b) => compareStringDate(a.date, b.date),
		},
		{
			title: 'Địa điểm',
			dataIndex: 'location',
			key: 'location',
		},
		{
			title: 'Số người',
			dataIndex: 'numPeople',
			key: 'numPeople',
		},
		{
			title: 'Thao tác',
			key: 'action',
			render: (text, record) => (
				<Space size="middle">
					<Button onClick={() => handleShowModelToEdit(record)}>
						Sửa
					</Button>
					<Button danger onClick={() => handleDelete(record)}>
						Xóa
					</Button>
				</Space>
			),
		},
	];
	const loadTable = (listNews = []) => (
		<Table columns={columns} dataSource={listNews} />
	);
	return (
		<div>
			{listNews?.length ? loadTable(listNews) : <Loading />}
			<Button type="primary" block onClick={handleShowModelToAddNew}>
				Hoạt động mới
			</Button>
			{visible === true ? ui() : null}
		</div>
	);
}
