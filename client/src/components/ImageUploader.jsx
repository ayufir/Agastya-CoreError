import React, { useEffect, useState } from "react";
import { Upload, Button, Spin, Modal } from "antd";
import {
  UploadOutlined,
  CloudUploadOutlined,
  DownloadOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import toast from "react-hot-toast";
import axiosInstance from "../config/axios";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useParams } from "react-router-dom";
import { getCurrentLocation } from "../utils/getLocation";

const CPANEL = import.meta.env.VITE_CPANEL_DOMAIN;

const getAssetUrl = (asset) =>
  typeof asset === "string" ? asset : asset?.url || "";

const getAssetKey = (asset) => asset?.fileId || getAssetUrl(asset);

const ImageUploader = ({
  images,
  setImages,
  setUploadedUrls,
  uploadedUrls,
  caseId,
  bankName,
  deleteId,
  fetchData,
  uploadedImages,
  url,
  onCaptureLocation,
}) => {
  const [internalImages, setInternalImages] = useState([]);
  const [internalUploadedUrls, setInternalUploadedUrls] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewVisible, setPreviewVisible] = useState(false);
  const [stagedUploads, setStagedUploads] = useState([]);
  const { id } = useParams();

  const currentImages = Array.isArray(images) ? images : internalImages;
  const updateImages =
    typeof setImages === "function" ? setImages : setInternalImages;
  const currentUploadedUrls = Array.isArray(uploadedUrls)
    ? uploadedUrls
    : internalUploadedUrls;
  const updateUploadedUrls =
    typeof setUploadedUrls === "function"
      ? setUploadedUrls
      : setInternalUploadedUrls;

  useEffect(() => {
    if (!caseId) {
      setStagedUploads(Array.isArray(currentUploadedUrls) ? currentUploadedUrls : []);
    }
  }, [caseId, currentUploadedUrls]);

  const handleCapture = async (file) => {
    try {
      const location = await getCurrentLocation();
      const latitude = Number.parseFloat(location.latitude).toFixed(6);
      const longitude = Number.parseFloat(location.longitude).toFixed(6);

      onCaptureLocation?.(latitude, longitude, location);

      updateImages((prev) =>
        (Array.isArray(prev) ? prev : []).map((item) =>
          item.uid === file.uid
            ? {
                ...item,
                latitude,
                longitude,
                accuracy: location.accuracy,
                capturedAt: new Date().toISOString(),
              }
            : item
        )
      );
    } catch (error) {
      toast.error("Location not available");
      console.log(error);
    }
  };

  const handleRemoveImage = async (fileIdentifier, asset) => {
    const assetData =
      typeof asset === "object" && asset !== null
        ? asset
        : typeof fileIdentifier === "object"
          ? fileIdentifier
          : null;
    const targetAsset = assetData || {};
    const filePath = fileIdentifier || targetAsset?.fileId || getAssetUrl(targetAsset);

    try {
      if (id) {
        await removeImage(id, targetAsset);
        return;
      }

      const response = await fetch(`${CPANEL}/api/remove/delete-file`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filePath }),
        credentials: "include",
      });
      const data = await response.json();

      if (!data.success) {
        toast.error("Failed to remove image");
        return;
      }

      setStagedUploads((prev) =>
        (prev || []).filter((item) => getAssetKey(item) !== getAssetKey(targetAsset))
      );
      updateUploadedUrls((prev) =>
        (Array.isArray(prev) ? prev : []).filter(
          (item) => getAssetKey(item) !== getAssetKey(targetAsset)
        )
      );
      toast.success("Image removed");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to remove image");
    }
  };

  const removeImage = async (recordId, imageAsset) => {
    try {
      const response = await fetch(
        `${CPANEL}/api/${url ? url : "first-bank"}/remove-image/${recordId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ imageUrl: imageAsset }),
        }
      );
      const data = await response.json();

      if (data.success) {
        if (fetchData) {
          await fetchData();
        }
        toast.success("Image removed");
      } else {
        toast.error("Failed to remove image");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to remove image");
    }
  };

  const handleUploadToServer = async () => {
    const formData = new FormData();

    currentImages.forEach((file) => {
      if (file.originFileObj) {
        formData.append("files", file.originFileObj);
      }
    });

    if (!formData.has("files")) {
      toast.error("Please select at least one file to upload");
      return;
    }

    setUploading(true);
    try {
      const response = await fetch(`${CPANEL}/api/uploads`, {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (result?.urls?.length) {
        updateUploadedUrls((prev) => [
          ...(Array.isArray(prev) ? prev : []),
          ...result.urls,
        ]);
        setStagedUploads((prev) => [
          ...(Array.isArray(prev) ? prev : []),
          ...result.urls,
        ]);
        updateImages((prev) =>
          (Array.isArray(prev) ? prev : []).filter((item) => !item.originFileObj)
        );
        toast.success("Files uploaded successfully");
      } else {
        toast.error("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Server error during upload");
    } finally {
      setUploading(false);
    }
  };

  const handleAutoUpload = async (file) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("files", file);

      const response = await fetch(`${CPANEL}/api/uploads`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const result = await response.json();

      if (result?.urls?.length) {
        const asset = result.urls[0];
        await axiosInstance.post(`/uploads/upload-document`, {
          caseId,
          bankName,
          fileUrl: asset,
        });

        const uploadedFile = {
          uid: `uploaded-${Date.now()}`,
          name: file.name,
          status: "done",
          url: asset.url,
          fileId: asset.fileId,
        };

        updateImages((prev) => [
          ...(Array.isArray(prev) ? prev : []).filter((item) => item.uid !== file.uid),
          uploadedFile,
        ]);
        updateUploadedUrls((prev) => [
          ...(Array.isArray(prev) ? prev : []),
          asset,
        ]);

        if (fetchData) {
          await fetchData();
        }

        toast.success(`${file.name} uploaded successfully`);
      } else {
        toast.error("Upload failed");
      }
    } catch (error) {
      console.error(error);
      toast.error(`Failed to upload ${file.name}`);
    } finally {
      setUploading(false);
    }
  };

  const handlePreview = (file) => {
    setPreviewImage(file.url || file.thumbUrl || getAssetUrl(file));
    setPreviewVisible(true);
  };

  const handleDownloadAll = async () => {
    try {
      const zip = new JSZip();
      const availableImages =
        uploadedImages?.length > 0
          ? uploadedImages
          : stagedUploads?.length > 0
            ? stagedUploads
            : currentImages;

      const serverImages = availableImages.filter((item) => getAssetUrl(item));
      for (const imageItem of serverImages) {
        const imageUrl = getAssetUrl(imageItem);
        const response = await fetch(imageUrl);

        if (!response.ok) {
          continue;
        }

        const blob = await response.blob();
        const filename =
          imageItem?.name || imageUrl.split("/").pop() || `image-${Date.now()}.jpg`;
        zip.file(filename, blob);
      }

      const localImages = availableImages.filter((item) => item.originFileObj);
      for (const imageItem of localImages) {
        zip.file(
          imageItem.originFileObj.name || `local-image-${Date.now()}.jpg`,
          imageItem.originFileObj
        );
      }

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "all-images.zip");
    } catch (error) {
      console.error("Download all failed:", error);
      toast.error("Failed to download all images");
    }
  };

  if (uploading) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        <Spin size="large" tip="Uploading..." />
      </div>
    );
  }

  return (
    <div className="image-uploader-container p-4">
      {caseId ? (
        <div className="mb-4">
          <Upload
            beforeUpload={(file) => {
              updateImages((prev) => [
                ...(Array.isArray(prev) ? prev : []),
                {
                  uid: file.uid,
                  name: file.name,
                  originFileObj: file,
                },
              ]);
              handleAutoUpload(file);
              handleCapture(file);
              return false;
            }}
            fileList={currentImages.filter((item) => item.originFileObj)}
            onRemove={(file) => {
              updateImages((prev) =>
                (Array.isArray(prev) ? prev : []).filter((item) => item.uid !== file.uid)
              );
            }}
            listType="picture-card"
            multiple
            showUploadList={false}
            className="inline-block"
          >
            <Button icon={<UploadOutlined />} size="large">
              Upload Images
            </Button>
          </Upload>
        </div>
      ) : (
        <div className="w-full">
          <label className="block font-medium text-gray-700 mb-2">
            Upload Files
          </label>

          <div className="flex flex-col md:flex-row items-start gap-4">
            <Upload
              accept="image/*"
              capture="environment"
              multiple
              beforeUpload={(file) => {
                updateImages((prev) => [
                  ...(Array.isArray(prev) ? prev : []),
                  {
                    uid: file.uid,
                    name: file.name,
                    originFileObj: file,
                  },
                ]);
                handleCapture(file);
                return false;
              }}
              fileList={currentImages.filter((item) => item.originFileObj)}
              onRemove={async (file) => {
                const urlToDelete = file.url;

                if (urlToDelete && deleteId) {
                  try {
                    await axiosInstance.put(`/case/remove-image/${deleteId}`, {
                      imageUrl: urlToDelete,
                      route: window.location.pathname,
                    });
                    updateUploadedUrls((prev) =>
                      (Array.isArray(prev) ? prev : []).filter(
                        (item) => getAssetUrl(item) !== urlToDelete
                      )
                    );
                    toast.success("Image deleted successfully");
                  } catch (error) {
                    toast.error("Failed to delete image");
                    console.error("Delete image error:", error);
                  }
                }

                updateImages((prev) =>
                  (Array.isArray(prev) ? prev : []).filter((item) => item.uid !== file.uid)
                );
              }}
              onPreview={handlePreview}
              listType="picture-card"
              showUploadList={{
                showPreviewIcon: true,
                showRemoveIcon: true,
              }}
              className="flex-1"
            >
              <div className="flex flex-col items-center justify-center h-full">
                <UploadOutlined className="text-2xl" />
                <span className="mt-2 text-sm">Click or tap to select</span>
              </div>
            </Upload>

            <div className="flex flex-row md:flex-col gap-2 self-start mt-2 md:mt-0">
              <Button
                icon={<DownloadOutlined />}
                onClick={handleDownloadAll}
                type="dashed"
                block
              >
                Download All
              </Button>
              <Button
                icon={<CloudUploadOutlined />}
                onClick={handleUploadToServer}
                type="primary"
                block
              >
                Upload to Server
              </Button>
            </div>
          </div>

          <Modal
            open={previewVisible}
            footer={null}
            onCancel={() => setPreviewVisible(false)}
            closable
            centered
            width="auto"
            className="custom-preview-modal"
          >
            <img
              alt="Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "80vh",
                objectFit: "contain",
              }}
              src={previewImage}
            />
          </Modal>
        </div>
      )}

      {stagedUploads?.length > 0 && !id && (
        <div className="mt-4">
          <div className="flex flex-wrap gap-3">
            {stagedUploads.map((imageItem, index) => (
              <div
                key={getAssetKey(imageItem) || index}
                className="relative w-40 h-40 border rounded overflow-hidden flex items-center justify-center bg-black"
              >
                <img
                  src={getAssetUrl(imageItem)}
                  alt={`uploaded-${index}`}
                  className="max-w-full max-h-full object-contain"
                />

                <button
                  type="button"
                  onClick={() =>
                    handleRemoveImage(
                      imageItem?.fileId || getAssetUrl(imageItem),
                      imageItem
                    )
                  }
                  className="absolute top-1 right-1 bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {uploadedImages?.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">
            Uploaded Images
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {uploadedImages.map((imageItem, index) => (
              <div
                key={getAssetKey(imageItem) || index}
                className="relative group rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <img
                  src={getAssetUrl(imageItem)}
                  alt={`uploaded-${index}`}
                  className="w-full h-32 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<EyeOutlined />}
                    size="small"
                    onClick={() => handlePreview({ url: getAssetUrl(imageItem) })}
                  />
                  <Button
                    danger
                    shape="circle"
                    icon={<DeleteOutlined />}
                    size="small"
                    onClick={() =>
                      handleRemoveImage(
                        imageItem?.fileId || getAssetUrl(imageItem),
                        imageItem
                      )
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
