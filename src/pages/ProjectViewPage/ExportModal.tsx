import React, { useState } from 'react';
import cross from '../../assets/cross.png';
import ImageIdName from "./ImageIdName";

interface ModalProps {
    imageIds: ImageIdName[];
    onExit: () => void;
}

const Modal: React.FC<ModalProps> = ({ imageIds, onExit }) => {
    const [selectedOption, setSelectedOption] = useState('');

    const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedOption(e.target.value);
    };

    const handleCrossClick = () => {
        onExit();
    };

    const handleExportClick = () => {
        // Perform export logic here
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
                    <label>
                        <input
                            type="radio"
                            value="COCO"
                            checked={selectedOption === 'COCO'}
                            onChange={handleOptionChange}
                            className="input-radio"
                        />
                        COCO
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