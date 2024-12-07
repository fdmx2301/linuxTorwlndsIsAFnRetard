/* eslint-disable react/prop-types */
import "../styles/Modal.css";

function Modal({ 
    isOpen, 
    onClose, 
    title, 
    children 
}) {
    if (!isOpen) return null;

    return (
        <div className="modal__overlay" onClick={onClose}>
            <div className="modal__content" onClick={(e) => e.stopPropagation()}>
                <h2 className="modal__title">{title}</h2>
                <div className="modal__body">{children}</div>
                <div className="modal__footer">
                    <button className="modal__button" onClick={onClose}>Отмена</button>
                </div>
            </div>
        </div>
    );
}

export default Modal;
