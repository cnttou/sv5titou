import { useState } from 'react';
import Input from './Input';
import Select from './Select';
import firebase from '../api/firebase';
import { addData, updateData } from '../api/firestore';
import { useRef } from 'react';
import { useEffect } from 'react';

const listSelect = [
    {
        value: 'hoc-tap',
        text: 'Học tập tốt',
    },
    {
        value: 'dao-duc',
        text: 'Đạo đức tốt',
    },
    {
        value: 'tinh-nguyen',
        text: 'Tình nguyện tốt',
    },
    {
        value: 'hoi-nhap',
        text: 'Hội nhập tốt',
    },
    {
        value: 'the-luc',
        text: 'Thể lực tốt',
    },
];

export default function ModelNews({ toast, item, setItem }) {
    const [name, setName] = useState('');
    const [target, setTarget] = useState('hoc-tap');
    const [numPeople, setNumPeople] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [summary, setSummary] = useState('');
    const [doc, setDoc] = useState('');
    const ref = useRef(null);
    

    const handleSubmit = () => {
        let data = { name, target, numPeople, date, location, summary };
        addData('news', data, doc)
            .then(() => {
                toast('Thêm thành công');
                setDoc('');
            })
            .catch(() => {
                toast('Thêm thất bại vui lòng thử lại');
            });
    };
    const resetData = (
        d = '',
        l = '',
        n = '',
        p = '',
        s = '',
        t = 'hoc-tap'
    ) => {
        setDate(d);
        setLocation(l);
        setName(n);
        setNumPeople(p);
        setSummary(s);
        setTarget(t);
    };
    useEffect(() => {
        if (ref != null && item?.name) {
            var myModal = new bootstrap.Modal(ref.current);
            resetData(
                item.date,
                item.location,
                item.name,
                item.numPeople,
                item.summary,
                item.target
            );
            setDoc(item.id);
            myModal.show();
            setItem({});
        }
    }, [ref, item]);
    return (
        <div
            ref={ref}
            className="modal fade"
            id="exampleModal"
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-xl modal-fullscreen-lg-down modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Edit news</h5>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body">
                        <Input
                            title="Tên chương trình"
                            placeholder="Nhập tên"
                            onChange={setName}
                            value={name}
                        />
                        <Select
                            placeholder="Chọn 1 tiêu chí"
                            title="Chọn tiêu chí"
                            list={listSelect}
                            value={target}
                            onChange={setTarget}
                        />
                        <Input
                            title="Thời gian tổ chức"
                            placeholder="Chọn ngày tổ chức"
                            type="date"
                            onChange={setDate}
                            value={date}
                        />
                        <Input
                            title="Địa điểm tổ chức"
                            placeholder="Nhập địa điểm"
                            onChange={setLocation}
                            value={location}
                        />
                        <Input
                            title="Số người"
                            placeholder="Nhập số người tối đa được tham gia"
                            onChange={setNumPeople}
                            value={numPeople}
                        />
                        <div className="input-group">
                            <span className="input-group-text">
                                Thông tin chi tiết <br /> chương trình
                            </span>
                            <textarea
                                className="form-control"
                                aria-label="With textarea"
                                placeholder="Chỉ nhập chữ"
                                value={summary}
                                onChange={(e) => setSummary(e.target.value)}
                            ></textarea>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={resetData}
                        >
                            Reset
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            data-bs-dismiss="modal"
                        >
                            Close
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleSubmit}
                            data-bs-dismiss="modal"
                        >
                            Save changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
