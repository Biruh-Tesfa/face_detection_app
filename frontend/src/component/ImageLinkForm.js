import React from "react";

function ImageLinkForm({detecting, imageUrlError, onInputeChange, onbuttonclick,onKeyDown }) {
  const isDetecting = detecting === "detecting";
  const isDetected = detecting === "detected";
  const isDisabled = isDetecting || isDetected;
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
            className="f5 ph0 br2 ba b--purple pa2 grow link white bg-light-purple w-15 pointer ml2"
            onClick={onbuttonclick}
            disabled={isDisabled}
            style={{
              opacity: isDisabled ? 0.7 : 1,
              cursor: isDisabled ? "not-allowed" : "pointer"
            }}
          >
            {isDetecting ? "Detecting" : "Detect"}
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