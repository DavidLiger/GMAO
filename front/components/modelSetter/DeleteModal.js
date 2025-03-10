import React from 'react';
import PropTypes from 'prop-types';
import {Modal} from "flowbite-react";
import {HiOutlineExclamationCircle} from "react-icons/hi";
import BioButton from "../button/BioButton";
import {FaTimes, FaTrashAlt} from "react-icons/fa";
import i18n from "../../i18n";

const DeleteModal = ({isOpen, title, message, onConfirm, onCancel}) => {
    if (!isOpen) return null;

    return (
        <Modal show={isOpen} size={"xl"} onClose={onCancel} popup>
            <Modal.Header/>
            <Modal.Body>
                <HiOutlineExclamationCircle
                    className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200"/>
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400 w-full text-center">{title}</h3>
                <p className="text-center">{message}</p>
            </Modal.Body>
            <Modal.Footer>
                <div className="flex justify-center gap-4 items-center w-full">
                    <BioButton color="failure" onClick={onConfirm}>
                        <FaTrashAlt size={15} className="mt-0.5 mr-2"/> {i18n.t("delete")}
                    </BioButton>
                    <BioButton color="gray" onClick={onCancel}>
                        <FaTimes size={15} className="mt-0.5 mr-2"/> {i18n.t("cancel")}
                    </BioButton>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

DeleteModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export default DeleteModal;
