import { Link } from 'react-router-dom';

export default function AlertLogin({ show = 'flase', setShow }) {
    return (
        <div>
            <div style={{ display: show ? 'block' : 'none' }} tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Thông báo</h5>
                        </div>
                        <div className="modal-body">
                            <p>
                                Không phải email trường cấp!
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setShow(false)}
                            >
                                Hủy
                            </button>
                            <Link
                                type="button"
                                className="btn btn-primary"
                                to={'/login'}
                            >
                                Đi đến đăng nhập
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
