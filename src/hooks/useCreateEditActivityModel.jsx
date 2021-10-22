import { useState } from 'react';
import moment from 'moment';
import {
	Modal,
	Form,
	Input,
	Button,
	Select,
	InputNumber,
	DatePicker,
    message,
} from 'antd';
import { nameTarget } from '../components/ActivityFeed';
import { useRef } from 'react';
import { useEffect } from 'react';
import InputRichText from '../components/InputRichText';
import { useDispatch } from 'react-redux';
import { addActivityAction } from '../store/actions';

const { Option } = Select;

const layout = {
	labelCol: { span: 5 },
	wrapperCol: { span: 19 },
};
const tailLayout = {
	wrapperCol: { span: 24 },
};

const initActivity = {
	name: '',
	date: null,
	location: '',
	summary: '',
	numPeople: null,
	target: null,
};

function useCreateEditActivityModel({ title, action }) {
	const [visible, setVisible] = useState(false);
	const [dataModel, setDataModel] = useState(initActivity);
    const dispatch = useDispatch()

	const formRef = useRef();
	const [form] = Form.useForm();

	useEffect(() => {
		let date = moment(dataModel.date, 'DD-MM-YYYY');
		form.setFieldsValue({ ...dataModel, date });
	}, [dataModel]);

	const onFinish = () => {
		const data = Object.assign(form.getFieldsValue());
		let date = moment(form.getFieldsValue().date).format('DD-MM-YYYY');
		data.date = date;
        data.id = dataModel.id || null;
        console.log(data);

        dispatch(addActivityAction({ data, docId: data.id })).then(()=>{
            message.success("Thêm thành công.")
            setVisible(false)
        }).catch((err)=>{
            message.error("Thêm thất bại, vui lòng thử lại.")
            console.log(err.message);
        });
	};

	const onReset = () => {
		if (formRef.current) formRef.current.resetFields();
	};

	const ui = () => (
		<Modal
			width={770}
			visible={visible}
			title={title || 'Chi tiết'}
			footer={action || null}
			centered={true}
			onCancel={() => setVisible(false)}
		>
			<Form
				initialValues={initActivity}
				{...layout}
				ref={formRef}
				form={form}
				name="addActivity"
				onFinish={onFinish}
				validateMessages={{ required: "Bạn chưa điền '${name}'" }}
			>
				<Form.Item
					name="name"
					label="Tên chương trình"
					rules={[{ required: true }]}
				>
					<Input placeholder="Nhập tên chương trình" />
				</Form.Item>
				<Form.Item
					name="target"
					label="Tiêu chí"
					rules={[{ required: true }]}
				>
					<Select
						placeholder="Nhập tiêu chí xét SV5T"
						onChange={(value) =>
							form.setFieldsValue({ target: value })
						}
						allowClear
					>
						{Object.entries(nameTarget).map((c, index) => (
							<Option key={index} value={c[0]}>
								{c[1]}
							</Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item
					name="date"
					label="Thời gian bắt đầu"
					rules={[{ required: true }]}
				>
					<DatePicker
						format="DD-MM-YYYY"
						style={{ width: '100%' }}
						onChange={(value, dateStr) => {
							form.setFieldsValue({
								date: moment(dateStr, 'DD-MM-YYYY'),
							});
						}}
					/>
				</Form.Item>
				<Form.Item
					name="location"
					label="Địa điểm"
					rules={[{ required: true }]}
				>
					<Input placeholder="Nhập địa điểm tổ chức" />
				</Form.Item>
				<Form.Item
					name="numPeople"
					label="Số người tối đa"
					rules={[{ required: false }]}
				>
					<InputNumber
						placeholder="Số người tham gia tối đa"
						style={{ width: '100%' }}
					/>
				</Form.Item>

				{/* <p>{convertToRaw(inputSummary)}</p> */}
				<Form.Item
					name="summary"
					label="Nội dung"
					rules={[{ required: true }]}
				>
					<InputRichText />
				</Form.Item>
				<Form.Item
					{...tailLayout}
					style={{ display: 'flex', justifyContent: 'center' }}
				>
					<Button
						htmlType="button"
						type="link"
						block
						onClick={onReset}
					>
						Reset
					</Button>
					<Button type="primary" block htmlType="submit">
						Submit
					</Button>
				</Form.Item>
			</Form>
		</Modal>
	);
	return {
		ui,
		visible,
		setVisible,
		dataModel,
		setDataModel,
	};
}

export default useCreateEditActivityModel;
