import React from "react";

const Modal = ({ isOpen, closeModal, content }) => {
  if (!isOpen) return null;

  return (
    <div className="overlay">
      <div className="modalsss">
        <div className="modal-content">
          <h2>Details View </h2>
          <div><p className="modalsss-txt">{content}</p></div>

          <div className="modal_footer">
            <button  className="button_appearance_none modal_button_submit" onClick={closeModal}>
                close
            </button>
          </div>
          
        </div>
        
      </div>
    </div>
  );
};
export default Modal;