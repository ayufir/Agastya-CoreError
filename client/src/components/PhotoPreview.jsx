import React from "react";

const PhotoPreview = ({ photos }) => {
    if (!photos) return null;

    return (
        <div className="grid grid-cols-2 gap-4 mt-6">
            {Object.entries(photos).map(([side, url]) => (
                <div key={side}>
                    <p className="font-semibold capitalize">{side}</p>
                    <img
                        src={url}
                        alt={side}
                        className="rounded shadow h-40 w-full object-cover"
                    />
                </div>
            ))}
        </div>
    );
};

export default PhotoPreview;
