import React from 'react';
import {Modal} from "flowbite-react";
import {HiOutlineExclamationCircle} from "react-icons/hi";
import BioButton from "../button/BioButton";
import {FaCheck} from "react-icons/fa";
import i18n from "../../i18n";

const WarningModal = ({isOpen, message, onClose}) => {
    if (!isOpen) return null;

    return (
        <Modal show={isOpen} size="md" onClose={onClose} popup dismissible>
            <Modal.Header/>
            <Modal.Body>
                <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200"/>
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400 w-full text-center">
                    {i18n.t("warning")}
                </h3>
                <p>{message}</p>
            </Modal.Body>
            <Modal.Footer>
                <div className="flex justify-center items-center w-full gap-4">
                    <BioButton color="gray" onClick={onClose}>
                        <FaCheck size={15} className="mt-0.5 mr-3"/> {i18n.t("close")}
                    </BioButton>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default WarningModal;
