import React, { useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw } from 'draft-js';
import { convertToHTML } from 'draft-convert';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { FaSave } from 'react-icons/fa';
import BioButton from '../button/BioButton';
import i18n from '../../i18n';

const WysiwygEditor = () => {
    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    const onEditorStateChange = (editorState) => {
        setEditorState(editorState);
    };

    const handleSaveDescription = async () => {
        const rawContentState = convertToRaw(editorState.getCurrentContent());
        const htmlContent = convertToHTML(editorState.getCurrentContent());
        console.log('rawContentState : ', rawContentState, htmlContent);
        
        // Enregistrez les données
        // await saveDataToServer({ rawContentState, htmlContent });
    };

    const saveDataToServer = async (data) => {
        await fetch('https://votre-api.com/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
    };

    return (
        <div className='flex-1 w-full h-500'>
            <Editor
                editorState={editorState}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={onEditorStateChange}
            />
            {/* <div className="flex justify-between items-center mt-4 float-right"> */}
                <BioButton onClick={handleSaveDescription} color="success" type="submit" className="flex justify-between items-center mt-4 float-right">
                    <FaSave className="mt-0.5 mr-2"/> {i18n.t('save')}
                </BioButton>
            {/* </div> */}
        </div>
    );
};

export default WysiwygEditor;