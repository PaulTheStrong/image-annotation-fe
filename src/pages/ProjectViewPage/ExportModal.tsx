import React, { useState } from 'react';
import cross from '../../assets/cross.png';
import ImageIdName from "./ImageIdName";
import axios from "axios";
import {useParams} from "react-router-dom";
import {HOST} from "../../util/constants";
const FileDownload = require('js-file-download');

interface ModalProps {
    imageIds: ImageIdName[];
    onExit: () => void;
}

const Modal: React.FC<ModalProps> = ({ imageIds, onExit }) => {
    const [selectedOption, setSelectedOption] = useState('');
    let projectId = Number(useParams<{ projectId: string }>().projectId);

    const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedOption(e.target.value);
    };

    const handleCrossClick = () => {
        onExit();
    };

    const handleExportClick = async () => {
        let response = await axios.post(`${HOST}/projects/${projectId}/export/${selectedOption.toLowerCase()}`, imageIds.map(id => id.id), {responseType: "blob"});
        FileDownload(response.data, selectedOption.toLowerCase() + ".zip")

        onExit();
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <img
                    className="modal-exit-cross"
                    src={cross}
                    alt="Cross"
                    onClick={handleCrossClick}
                />
                <h2>Export your data</h2>
                <div className="image-names-list">
                    <ul>
                        {imageIds.map((imageData) => (
                            <li key={imageData.id}>{imageData.name}</li>
                        ))}
                    </ul>
                </div>
                <hr/>
                <h3>Choose output data format</h3>
                <div className="modal-radio-buttons">
                    <label>
                        <input
                            type="radio"
                            value="CSV"
                            checked={selectedOption === 'CSV'}
                            onChange={handleOptionChange}
                        />
                        CSV
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="JSON"
                            checked={selectedOption === 'JSON'}
                            onChange={handleOptionChange}
                        />
                        JSON
                    </label>
                </div>
                <button disabled={selectedOption === ''} className="btn" onClick={handleExportClick}>
                    Export Data
                </button>
            </div>
        </div>
    );
};

export default Modal;