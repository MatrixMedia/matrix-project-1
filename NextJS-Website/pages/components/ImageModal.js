import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ImageModal = ({ show, onHide, imageUrl }) => {
  return (
    <Modal className='img_modal' show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Image Modal</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='modal_pop_img_block'>
          <img src={imageUrl} alt="Modal Image" className="img-fluid modal_pop_img" />
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ImageModal;
