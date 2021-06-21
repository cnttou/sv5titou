import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getUrlImage } from '../api/firebaseStorage';
import {
    addImageThunk,
    deleteImageThunk,
} from '../store/reducers/ActivitySlide';

export default function ModelBrowseFile({ activity }) {
    const dispatch = useDispatch();
    const [listImage, setListImage] = useState([]);

    useEffect(async () => {
        let arr = [];
        activity?.images?.forEach((imageName) =>
            getUrlImage(activity.id, imageName, activity?.userId)
                .then((url) => {
                    arr.push(url);
                    setListImage(arr);
                })
                .catch((err) => {
                    console.log('ERROR BROWSE FILE: ', err);
                })
        );
    }, [activity]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const files = Array.from(e.target.files.files);
        if (files.length === 0) return;

        files.forEach((c) => {
            dispatch(addImageThunk({ file: c, acId: activity.id }));
        });
        handleHide();
    };
    const handleRemoveImage = (index) => {
        let fileName = activity.images[index];
        dispatch(deleteImageThunk({ fileName, acId: activity.id }));
        let images = [...listImage];
        images.splice(index, 1);
        setListImage(images);
    };
    const handleHide = () => {
        // setShow(false);
        setListImage([]);
    };
    return (
        <div>
            <div className="modal fade" id="dialog-browse-file">
                <div className="modal-dialog modal-xl modal-fullscreen-lg-down modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5
                                className="modal-title"
                                id="staticBackdropLabel"
                            >
                                Browse file
                            </h5>
                        </div>
                        <div className="modal-body">
                            <form
                                id="form-browse-file"
                                onSubmit={(e) => handleSubmit(e)}
                            >
                                <div className="input-group mb-3">
                                    <label
                                        className="input-group-text"
                                        htmlFor="inputGroupFile01"
                                    >
                                        Chọn file
                                    </label>
                                    <input
                                        name="files"
                                        accept="image/*"
                                        multiple={true}
                                        type="file"
                                        className="form-control"
                                        id="inputGroupFile01"
                                    />
                                </div>
                            </form>
                            <h5>Những ảnh đã chọn:</h5>
                            {listImage?.map((c, i) => (
                                <div className="image-proof__content" key={i}>
                                    <button
                                        data-index={i}
                                        type="button"
                                        className="btn-close"
                                        aria-label="Close"
                                        onClick={() => handleRemoveImage(i)}
                                    ></button>
                                    <img
                                        src={c}
                                        alt={i}
                                        className="image-proof"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                                onClick={handleHide}
                            >
                                Hủy
                            </button>
                            <input
                                type="submit"
                                className="btn btn-primary"
                                form="form-browse-file"
                                value={'Lưu'}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
