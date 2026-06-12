import React, { useState } from "react";
import { Upload, Button, Spin, List, Typography } from "antd";
import {
  UploadOutlined,
  CloudUploadOutlined,
  DeleteOutlined,
  FileOutlined,
} from "@ant-design/icons";
import toast from "react-hot-toast";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const { Text } = Typography;
const CPANEL = import.meta.env.VITE_CPANEL_DOMAIN;

const getAssetUrl = (asset) =>
  typeof asset === "string" ? asset : asset?.url || "";

const getAssetKey = (asset) => asset?.fileId || getAssetUrl(asset);

const DocumentUploader = ({
  caseId,
  bankName,
  docUrls,
  setDocUrls,
  fetchData,
}) => {
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleBeforeUpload = (file) => {
    setFileList((prev) => [...prev, file]);
    return false;
  };

  const handleRemoveLocalFile = (file) => {
    setFileList((prev) => prev.filter((currentFile) => currentFile.uid !== file.uid));
  };

  const handleUploadToServer = async () => {
    if (fileList.length === 0) {
      toast.error("Please select files to upload");
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

      const newDocuments = data.urls.map((item) => ({
        url: item.url,
        fileId: item.fileId,
        name: item.name,
      }));

      setDocUrls((prev) => [
        ...(Array.isArray(prev) ? prev : []),
        ...newDocuments,
      ]);

      setFileList([]);
      toast.success("Documents uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload documents");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = async (documentItem) => {
    try {
      if (caseId) {
        const response = await fetch(
          `${CPANEL}/api/${bankName}/remove-document/${caseId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ documentUrl: documentItem }),
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
            filePath: documentItem?.fileId || getAssetUrl(documentItem),
          }),
        });
      }

      setDocUrls((prev) =>
        (Array.isArray(prev) ? prev : []).filter(
          (currentItem) => getAssetKey(currentItem) !== getAssetKey(documentItem)
        )
      );

      toast.success("Document removed");

      if (fetchData && caseId) {
        fetchData();
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Error deleting document");
    }
  };

  const handleDownloadAll = async () => {
    if (!docUrls?.length) return;

    try {
      const zip = new JSZip();

      for (const documentItem of docUrls) {
        const fileUrl = getAssetUrl(documentItem);
        const response = await fetch(fileUrl);

        if (!response.ok) {
          continue;
        }

        const blob = await response.blob();
        const filename = fileUrl.split("/").pop() || "document";
        zip.file(filename, blob);
      }

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "documents.zip");
    } catch (error) {
      console.error("Download all failed:", error);
      toast.error("Failed to download documents");
    }
  };

  return (
    <div className="document-uploader p-4 border rounded bg-white">
      <h3 className="text-lg font-medium mb-3">Attach Documents</h3>

      <Upload
        accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png"
        multiple
        beforeUpload={handleBeforeUpload}
        fileList={fileList}
        onRemove={handleRemoveLocalFile}
        showUploadList={{ showRemoveIcon: true }}
      >
        <Button icon={<UploadOutlined />}>Select Documents</Button>
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

      {docUrls?.length > 0 && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Uploaded Documents</span>
            <Button size="small" onClick={handleDownloadAll}>
              Download All
            </Button>
          </div>
          <List
            size="small"
            bordered
            dataSource={docUrls}
            renderItem={(documentItem) => {
              const fileUrl = getAssetUrl(documentItem);
              const fileName = fileUrl.split("/").pop();

              return (
                <List.Item
                  actions={[
                    <Button
                      key="view"
                      type="link"
                      href={fileUrl}
                      target="_blank"
                      icon={<FileOutlined />}
                    >
                      View
                    </Button>,
                    <Button
                      key="delete"
                      danger
                      icon={<DeleteOutlined />}
                      size="small"
                      onClick={() => handleDeleteDocument(documentItem)}
                    />,
                  ]}
                >
                  <Text ellipsis style={{ maxWidth: 300 }}>
                    {fileName}
                  </Text>
                </List.Item>
              );
            }}
          />
        </div>
      )}

      {uploading && <Spin tip="Uploading..." className="mt-4" />}
    </div>
  );
};

export default DocumentUploader;
