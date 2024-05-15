import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const WrongCode = ({ isOpen, onRequestClose, message }) => (
  <Modal
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    contentLabel="Alert"
    style={{
      content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
      },
    }}
  >
    <h2>Alert</h2>
    <div>{message}</div>
    <button onClick={onRequestClose}>Close</button>
  </Modal>
);

export default WrongCode;