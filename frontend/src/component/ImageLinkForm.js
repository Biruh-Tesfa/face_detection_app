import React from "react";

function ImageLinkForm({ onInputeChange, onbuttonclick }) {
  return (
    <div>
      <p className="tc f3">
        {'This Magic Brain will detect faces in your pictures. Paste a URL.'}
      </p>
      <div className="tc f4 box">
        <div className="mt3">
          <input
            className="br2 pa2 w-60 ba b--gray bg-white"
            type="text"
            placeholder="Paste image URL here..."
            onChange={onInputeChange}
          />
          <button
            className=" br2 ba b--purple pa2 grow link ph3 white bg-light-purple w-15 pointer ml2"
            onClick={onbuttonclick}
          >
            Detect
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImageLinkForm;