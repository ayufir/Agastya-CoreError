import { useDispatch, useSelector } from "react-redux";
import { fetchNotes, addNote } from "../redux/features/Note/notesSlice";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const CaseNotes = ({ caseId, onSuccess }) => {
  const dispatch = useDispatch();
  const { notes, loading } = useSelector((state) => state?.notes || {});

  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [audioPreview, setAudioPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef();
  const audioRef = useRef();

  useEffect(() => {
    if (caseId) dispatch(fetchNotes(caseId));
  }, [caseId, dispatch]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setAudioFile(null);
    setAudioPreview(null);
    if (audioRef.current) audioRef.current.value = "";
  };

  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAudioFile(file);
    setAudioPreview(URL.createObjectURL(file));
    setImageFile(null);
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const removeAudio = () => {
    setAudioFile(null);
    setAudioPreview(null);
    if (audioRef.current) audioRef.current.value = "";
  };

  const isAudioUrl = (url) => {
    if (!url) return false;
    const lower = url.toLowerCase();
    return (
      lower.endsWith(".mp3") ||
      lower.endsWith(".wav") ||
      lower.endsWith(".ogg") ||
      lower.endsWith(".m4a") ||
      lower.endsWith(".aac") ||
      lower.includes("audio") ||
      lower.includes("recording")
    );
  };

  const submitNote = async (noteMessage, noteType = "note") => {
    if (!noteMessage.trim()) {
      toast.error("Please enter a message");
      return;
    }
    setSubmitting(true);
    try {
      await dispatch(
        addNote({
          caseId,
          message: noteMessage,
          type: noteType,
          image: noteType === "note" ? (imageFile || audioFile) : null,
        })
      ).unwrap();

      setMessage("");
      removeImage();
      removeAudio();
      toast.success(
        noteType === "call_not_attended"
          ? "Call log added!"
          : "Note added successfully"
      );
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Failed to add note:", err);
      toast.error("Failed to add note");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitNote(message, "note");
  };

  const handleCallNotAttended = () => {
    submitNote("📵 Call Not Attended — No response from customer.", "call_not_attended");
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const notesList = Array.isArray(notes) ? notes : [];
  const callLogs = notesList.filter((n) => n.type === "call_not_attended");
  const regularNotes = notesList.filter((n) => n.type !== "call_not_attended");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* ── Add Note Form ── */}
      <div style={cardStyle}>
        <h4 style={sectionTitle}>📝 Add Note / Mark Query</h4>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your note or query here..."
            rows={3}
            style={textareaStyle}
          />

          {/* Image preview */}
          {imagePreview && (
            <div style={{ position: "relative", display: "inline-block", width: "fit-content" }}>
              <img
                src={imagePreview}
                alt="preview"
                style={{ maxHeight: "140px", borderRadius: "8px", border: "1px solid #e2e8f0" }}
              />
              <button
                type="button"
                onClick={removeImage}
                style={removeImgBtn}
                title="Remove image"
              >✕</button>
            </div>
          )}

          {/* Audio preview */}
          {audioPreview && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px", background: "#f0f5ff", borderRadius: "8px", border: "1px solid #adc6ff", width: "100%", maxWidth: "340px", boxSizing: "border-box" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "10px", fontWeight: 700, color: "#1d39c4", marginBottom: "4px" }}>🎙️ Call Recording Selected</div>
                <audio src={audioPreview} controls style={{ width: "100%", height: "30px" }} />
              </div>
              <button
                type="button"
                onClick={removeAudio}
                style={{
                  background: "#fff1f0",
                  border: "1px solid #ffa39e",
                  color: "#cf1322",
                  borderRadius: "50%",
                  width: "24px",
                  height: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: "12px",
                  flexShrink: 0,
                }}
                title="Remove call recording"
              >
                ✕
              </button>
            </div>
          )}

          {/* Action row */}
          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
            {/* Upload photo button */}
            <label style={uploadLabelStyle} title="Attach photo">
              📸 Photo Upload
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </label>

            {/* Upload Call Recording button */}
            <label style={audioUploadLabelStyle} title="Attach call recording">
              🎙️ Call Recording Upload
              <input
                ref={audioRef}
                type="file"
                accept="audio/*"
                onChange={handleAudioChange}
                style={{ display: "none" }}
              />
            </label>

            {/* Call Not Attended quick button */}
            <button
              type="button"
              onClick={handleCallNotAttended}
              disabled={submitting}
              style={callBtnStyle}
              title="Log that call was not attended"
            >
              📵 Call Not Attended
            </button>

            <div style={{ flex: 1 }} />

            {/* Submit note */}
            <button
              type="submit"
              disabled={submitting || !message.trim()}
              style={{
                ...submitBtnStyle,
                opacity: !message.trim() ? 0.5 : 1,
              }}
            >
              {submitting ? "Saving..." : "Submit Note"}
            </button>
          </div>
        </form>
      </div>

      {/* ── Call Log History ── */}
      {callLogs.length > 0 && (
        <div style={cardStyle}>
          <h4 style={{ ...sectionTitle, color: "#c0392b" }}>📵 Call Attempts ({callLogs.length})</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {callLogs.map((log, i) => (
              <div key={log._id || i} style={callLogItemStyle}>
                <span style={{ fontSize: "13px", color: "#c0392b", fontWeight: 600 }}>
                  📵 Call Not Attended
                </span>
                <span style={{ fontSize: "12px", color: "#888", marginLeft: "auto" }}>
                  {formatTime(log.createdAt)}
                </span>
                {log.addedBy?.name && (
                  <span style={{ fontSize: "11px", color: "#aaa" }}>
                    by {log.addedBy.name}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Notes History ── */}
      {regularNotes.length > 0 && (
        <div style={cardStyle}>
          <h4 style={sectionTitle}>🗒️ Notes History ({regularNotes.length})</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {regularNotes.map((note, i) => (
              <div key={note._id || i} style={noteItemStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                  <p style={{ margin: 0, fontSize: "14px", color: "#2d3748", flex: 1 }}>
                    {note.message}
                  </p>
                  <span style={roleBadgeStyle(note.role)}>{note.role}</span>
                </div>

                {/* Note attachment (Image or Audio Call Recording) */}
                {note.image?.url && (
                  isAudioUrl(note.image.url) ? (
                    <div style={{ marginTop: "10px", padding: "10px", background: "#fff6f6", borderRadius: "10px", border: "1px solid #ffe3e3", display: "inline-block", width: "100%", maxWidth: "320px", boxSizing: "border-box" }}>
                      <div style={{ fontSize: "10px", fontWeight: 700, color: "#c53030", marginBottom: "4px" }}>🎙️ Call Recording Attachment</div>
                      <audio src={note.image.url} controls style={{ width: "100%", height: "32px" }} />
                    </div>
                  ) : (
                    <a href={note.image.url} target="_blank" rel="noreferrer">
                      <img
                        src={note.image.url}
                        alt="note attachment"
                        style={{
                          maxHeight: "160px",
                          borderRadius: "8px",
                          marginTop: "8px",
                          border: "1px solid #e2e8f0",
                          cursor: "pointer",
                        }}
                      />
                    </a>
                  )
                )}

                <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
                  <span style={{ fontSize: "11px", color: "#a0aec0" }}>{formatTime(note.createdAt)}</span>
                  {note.addedBy?.name && (
                    <span style={{ fontSize: "11px", color: "#718096" }}>by {note.addedBy.name}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <p style={{ textAlign: "center", color: "#a0aec0", fontSize: "13px" }}>Loading notes…</p>
      )}
    </div>
  );
};

// ── Styles ──
const cardStyle = {
  background: "#fff",
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  padding: "16px",
  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
};

const sectionTitle = {
  margin: "0 0 12px 0",
  fontSize: "15px",
  fontWeight: 700,
  color: "#2d3748",
};

const textareaStyle = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #cbd5e0",
  borderRadius: "8px",
  fontSize: "14px",
  resize: "vertical",
  outline: "none",
  fontFamily: "inherit",
  boxSizing: "border-box",
};

const uploadLabelStyle = {
  display: "flex",
  alignItems: "center",
  gap: "4px",
  padding: "8px 14px",
  background: "#edf2f7",
  border: "1px solid #cbd5e0",
  borderRadius: "8px",
  fontSize: "13px",
  fontWeight: 600,
  cursor: "pointer",
  color: "#4a5568",
  whiteSpace: "nowrap",
};

const audioUploadLabelStyle = {
  display: "flex",
  alignItems: "center",
  gap: "4px",
  padding: "8px 14px",
  background: "#f0f5ff",
  border: "1px solid #adc6ff",
  borderRadius: "8px",
  fontSize: "13px",
  fontWeight: 600,
  cursor: "pointer",
  color: "#1d39c4",
  whiteSpace: "nowrap",
};

const callBtnStyle = {
  display: "flex",
  alignItems: "center",
  gap: "4px",
  padding: "8px 14px",
  background: "#fff5f5",
  border: "1px solid #fc8181",
  borderRadius: "8px",
  fontSize: "13px",
  fontWeight: 600,
  cursor: "pointer",
  color: "#c53030",
  whiteSpace: "nowrap",
};

const submitBtnStyle = {
  padding: "8px 20px",
  background: "linear-gradient(135deg, #667eea, #764ba2)",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: 600,
  cursor: "pointer",
  whiteSpace: "nowrap",
};

const removeImgBtn = {
  position: "absolute",
  top: "4px",
  right: "4px",
  background: "rgba(0,0,0,0.6)",
  color: "#fff",
  border: "none",
  borderRadius: "50%",
  width: "22px",
  height: "22px",
  cursor: "pointer",
  fontSize: "11px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const noteItemStyle = {
  background: "#f7fafc",
  borderRadius: "8px",
  padding: "12px",
  border: "1px solid #e2e8f0",
};

const callLogItemStyle = {
  background: "#fff5f5",
  borderRadius: "8px",
  padding: "10px 12px",
  border: "1px solid #fed7d7",
  display: "flex",
  gap: "8px",
  alignItems: "center",
  flexWrap: "wrap",
};

const roleBadgeStyle = (role) => ({
  fontSize: "10px",
  fontWeight: 700,
  padding: "2px 8px",
  borderRadius: "20px",
  background:
    role === "FieldOfficer"
      ? "#ebf4ff"
      : role === "Admin"
      ? "#faf5ff"
      : "#f0fff4",
  color:
    role === "FieldOfficer"
      ? "#2b6cb0"
      : role === "Admin"
      ? "#553c9a"
      : "#276749",
  whiteSpace: "nowrap",
});

export default CaseNotes;
