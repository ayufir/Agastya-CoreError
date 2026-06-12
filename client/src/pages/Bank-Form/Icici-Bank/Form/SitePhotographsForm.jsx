import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid"; // Import uuid to generate a unique formId

const SitePhotographsForm = ({ onNext }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [formId, setFormId] = useState(""); // State to store formId

  // Generate a unique formId using uuid
  useEffect(() => {
    const generatedFormId = uuidv4();  // Generate unique ID for the form
    setFormId(generatedFormId);  // Set it in the state
  }, []);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setPhotos(prev => [...prev, ...files]);
  };

  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if formId is available
    if (!formId) {
      alert("Form ID is required.");
      return;
    }

    // Prepare the data to be passed to onNext
    const formData = {
      formId,
      photos: photos.map(photo => ({
        name: photo.name,
        size: photo.size,
        type: photo.type
      }))
    };

    // Call the onNext function to pass the form data to the next step
    onNext(formData);
    // alert('Form submitted successfully!');
    setPhotos([]); // Clear the photos after submission
    setIsEditOpen(false); // Close edit mode
  };

  const toggleEdit = () => {
    setIsEditOpen(!isEditOpen);
  };

  return (
    <div className="container mx-auto mt-4 max-w-6xl">
      <div
        className="p-3 border rounded cursor-pointer"
        style={{ backgroundColor: "#98291E" }}
        onClick={toggleEdit}
      >
        <div className="flex justify-between items-center text-white">
          <h4 className="m-0 text-lg font-semibold">Site Photographs</h4>
          <button
            type="button"
            className="bg-white text-gray-800 px-3 py-1 rounded text-sm"
            onClick={(e) => {
              e.stopPropagation();
              toggleEdit();
            }}
          >
            {isEditOpen ? "Close" : "Edit"}
          </button>
        </div>
      </div>

      {isEditOpen && (
        <div className="border rounded p-3 mt-2 bg-white">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2 font-semibold">
                Please upload site photographs (interior and exterior) *
              </label>

              {/* Single Photo Upload Input */}
              <div className="mb-3">
                <input
                  type="file"
                  className="w-full p-2 border border-gray-300 rounded"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                />
              </div>

              {/* Photo Thumbnails */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {photos.map((file, index) => (
                  <div key={index} className="mb-3">
                    <div className="h-32 overflow-hidden rounded-lg">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Photo ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="mt-2">
                      <small className="text-gray-500 block truncate">{file.name}</small>
                      <button
                        type="button"
                        className="bg-red-500 text-white px-2 py-1 rounded text-xs mt-2 w-full"
                        onClick={() => removePhoto(index)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-blue-100 text-blue-700 p-2 rounded mb-4">
                <small>
                  * Please upload clear photographs of all sides of the property and interior spaces.
                </small>
              </div>
            </div>

            <div className="flex justify-end">
              <button 
                style={{ background: "#98291E" }} 
                type="submit" 
                className="text-white px-4 py-2 rounded"
              >
                Save & Next
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default SitePhotographsForm;