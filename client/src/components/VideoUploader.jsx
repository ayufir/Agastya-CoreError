import React, { useState } from "react";
import { Upload, Button, Spin, List, Typography, Card, Modal } from "antd";
import {
  UploadOutlined,
  CloudUploadOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import toast from "react-hot-toast";

const { Text } = Typography;
const CPANEL = import.meta.env.VITE_CPANEL_DOMAIN;

const getAssetUrl = (asset) =>
  typeof asset === "string" ? asset : asset?.url || "";

const getAssetKey = (asset) => asset?.fileId || getAssetUrl(asset);

const VideoUploader = ({
  caseId,
  bankName,
  videoUrls = [],
  setVideoUrls,
  fetchData,
}) => {
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewVideoUrl, setPreviewVideoUrl] = useState("");

  const handleBeforeUpload = (file) => {
    const isVideo = file.type.startsWith("video/");
    if (!isVideo) {
      toast.error("You can only upload video files!");
      return Upload.LIST_IGNORE;
    }
    setFileList((prev) => [...prev, file]);
    return false;
  };

  const handleRemoveLocalFile = (file) => {
    setFileList((prev) => prev.filter((currentFile) => currentFile.uid !== file.uid));
  };

  const handleUploadToServer = async () => {
    if (fileList.length === 0) {
      toast.error("Please select videos to upload");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await fetch(`${CPANEL}/api/uploads`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!data.success || !data.urls?.length) {
        throw new Error("Upload failed");
      }

      const newVideos = data.urls.map((item) => ({
        url: item.url,
        fileId: item.fileId,
        name: item.name,
      }));

      setVideoUrls((prev) => [
        ...(Array.isArray(prev) ? prev : []),
        ...newVideos,
      ]);

      setFileList([]);
      toast.success("Videos uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload videos");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteVideo = async (videoItem) => {
    try {
      if (caseId) {
        const response = await fetch(
          `${CPANEL}/api/${bankName}/remove-image/${caseId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ 
              imageUrl: videoItem, 
              fieldName: "siteVisitVideo" 
            }),
          }
        );
        const data = await response.json();

        if (!data.success) {
          toast.error("Failed to remove from case");
          return;
        }
      } else {
        await fetch(`${CPANEL}/api/remove/delete-file`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filePath: videoItem?.fileId || getAssetUrl(videoItem),
          }),
        });
      }

      setVideoUrls((prev) =>
        (Array.isArray(prev) ? prev : []).filter(
          (currentItem) => getAssetKey(currentItem) !== getAssetKey(videoItem)
        )
      );

      toast.success("Video removed successfully");

      if (fetchData && caseId) {
        fetchData();
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Error deleting video");
    }
  };

  const showPreview = (videoUrl) => {
    setPreviewVideoUrl(videoUrl);
    setPreviewVisible(true);
  };

  return (
    <div className="video-uploader p-4 border rounded bg-white">
      <h3 className="text-lg font-medium mb-3">Attach Site Visit Video</h3>

      <div className="mb-4">
        <Upload
          accept="video/*"
          multiple
          beforeUpload={handleBeforeUpload}
          fileList={fileList}
          onRemove={handleRemoveLocalFile}
          showUploadList={{ showRemoveIcon: true }}
        >
          <Button icon={<UploadOutlined />} size="large">Select Site Visit Videos</Button>
        </Upload>

        {fileList.length > 0 && (
          <div className="mt-3">
            <Button
              type="primary"
              icon={<CloudUploadOutlined />}
              onClick={handleUploadToServer}
              loading={uploading}
            >
              Upload to Server
            </Button>
          </div>
        )}
      </div>

      {videoUrls?.length > 0 && (
        <div className="mt-6">
          <div className="font-semibold text-slate-800 mb-3">Uploaded Videos ({videoUrls.length})</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {videoUrls.map((videoItem, index) => {
              const fileUrl = getAssetUrl(videoItem);
              const fileName = videoItem?.name || fileUrl.split("/").pop();

              return (
                <Card
                  key={getAssetKey(videoItem) || index}
                  hoverable
                  className="overflow-hidden border border-slate-200"
                  bodyStyle={{ padding: "8px 12px" }}
                  cover={
                    <div className="relative group h-40 bg-black flex items-center justify-center">
                      <video
                        src={fileUrl}
                        className="w-full h-full object-cover"
                        preload="metadata"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                          type="primary"
                          shape="circle"
                          icon={<PlayCircleOutlined />}
                          onClick={() => showPreview(fileUrl)}
                        />
                        <Button
                          danger
                          shape="circle"
                          icon={<DeleteOutlined />}
                          onClick={() => handleDeleteVideo(videoItem)}
                        />
                      </div>
                    </div>
                  }
                >
                  <Text className="block text-xs truncate font-medium text-slate-700" title={fileName}>
                    {fileName}
                  </Text>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      <Modal
        open={previewVisible}
        footer={null}
        onCancel={() => {
          setPreviewVisible(false);
          setPreviewVideoUrl("");
        }}
        destroyOnClose
        centered
        width={720}
        title="Video Preview"
      >
        <div className="aspect-video w-full bg-black flex items-center justify-center rounded overflow-hidden">
          <video
            src={previewVideoUrl}
            controls
            autoPlay
            className="w-full h-full max-h-[70vh]"
          />
        </div>
      </Modal>

      {uploading && <Spin tip="Uploading..." className="mt-4" />}
    </div>
  );
};

export default VideoUploader;
