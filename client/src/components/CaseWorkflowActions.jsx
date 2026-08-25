import React from "react";
import { Button } from "antd";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const CaseWorkflowActions = ({
  caseId,
  bankName = "",
  onSave,        // Callback for FO save / Admin save (async)
  onSubmit,      // Callback for FO submit / Admin final submit (async)
  loading = false,
  isReportSubmitted = false,
  status = "",   // Case status from DB
}) => {
  const user = useSelector((state) => state.auth.user);
  const roleNormalized = (user?.role || "").toLowerCase().replace(/[\s_]+/g, "");
  const isFieldOfficer = roleNormalized === "fieldofficer";

  const handleGenerateCase = async () => {
    if (onSubmit) {
      try {
        await onSubmit("Generated");
        toast.success("Case Generated Successfully.");
      } catch (err) {
        console.error("Generate Case error:", err);
        toast.error(err?.message || err?.error || "Failed to generate case");
      }
    }
  };

  const handleSave = async () => {
    if (onSave) {
      try {
        await onSave();
        toast.success("Changes Saved Successfully.");
      } catch (err) {
        console.error("Save error:", err);
        toast.error(err?.message || err?.error || "Failed to save changes");
      }
    }
  };

  const handleFOOrAdminSubmit = async () => {
    if (onSubmit) {
      try {
        if (isFieldOfficer) {
          await onSubmit("Submitted");
          toast.success("Case Submitted Successfully.");
        } else {
          await onSubmit("FinalSubmitted");
          toast.success("Case Finalized Successfully.");
        }
      } catch (err) {
        console.error("Submit error:", err);
        toast.error(err?.message || err?.error || "Failed to submit case");
      }
    }
  };

  const showSaveAndSubmit = isFieldOfficer || (status && status !== "Pending" && status !== "Draft");

  const isWIP = status?.toLowerCase() === "work in progress" || status?.toLowerCase() === "pending" || status?.toLowerCase() === "draft";
  const isButtonDisabled = isFieldOfficer && isReportSubmitted && !isWIP;

  return (
    <div
      style={{
        marginTop: 32,
        paddingTop: 20,
        borderTop: "1px solid #e2e8f0",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: 16,
        flexWrap: "wrap",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {showSaveAndSubmit ? (
        <>
          <Button
            onClick={handleSave}
            loading={loading}
            disabled={isButtonDisabled}
            style={{
              height: 44,
              padding: "0 28px",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              color: isButtonDisabled ? "#9ca3af" : "#3b82f6",
              borderColor: isButtonDisabled ? "#e5e7eb" : "#3b82f6",
              boxShadow: "0 2px 4px rgba(59, 130, 246, 0.05)",
            }}
          >
            Save
          </Button>

          <Button
            type="primary"
            onClick={handleFOOrAdminSubmit}
            loading={loading}
            disabled={isButtonDisabled}
            style={{
              height: 44,
              padding: "0 28px",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              background: isButtonDisabled ? "#9ca3af" : "#2563eb",
              borderColor: isButtonDisabled ? "#9ca3af" : "#2563eb",
              boxShadow: "0 4px 10px rgba(37, 99, 235, 0.15)",
            }}
          >
            {isFieldOfficer
              ? (isButtonDisabled ? "Case Submitted ✓" : "Submit")
              : "Final Submit"
            }
          </Button>
        </>
      ) : (
        <Button
          type="primary"
          onClick={handleGenerateCase}
          loading={loading}
          style={{
            height: 44,
            padding: "0 32px",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 700,
            background: "linear-gradient(135deg, #4f46e5, #4338ca)",
            borderColor: "#4f46e5",
            boxShadow: "0 4px 12px rgba(79, 70, 229, 0.2)",
          }}
        >
          Generate Case
        </Button>
      )}
    </div>
  );
};

export default React.memo(CaseWorkflowActions);
