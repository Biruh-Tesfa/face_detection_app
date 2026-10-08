import React from "react";

function ImageLinkForm({imageUrlError, onInputeChange, onbuttonclick,onKeyDown }) {
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
            onKeyDown={onKeyDown}
          />
          <button
            className="ph0 br2 ba b--purple pa2 grow link  white bg-light-purple w-15 pointer ml2"
            onClick={onbuttonclick}
          >
            Detect
          </button>
          {imageUrlError && (
            <p id="image-url-error" className="b red f4 mt4 " role="alert">
              {imageUrlError}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ImageLinkForm;