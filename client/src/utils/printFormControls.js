const HIDDEN_CONTROL_TYPES = new Set([
  "button",
  "file",
  "hidden",
  "image",
  "reset",
  "submit",
]);

const getControlText = (control) => {
  if (control.tagName === "SELECT") {
    return control.selectedOptions?.[0]?.textContent || control.value || "";
  }

  if (control.type === "checkbox" || control.type === "radio") {
    return control.checked ? "Yes" : "No";
  }

  return control.value || control.textContent || "";
};

export const replaceFormControlsWithPrintValues = (root) => {
  if (!root) return;

  root.querySelectorAll("input, textarea, select").forEach((control) => {
    if (HIDDEN_CONTROL_TYPES.has(control.type)) {
      control.remove();
      return;
    }

    const value = getControlText(control);
    const printable = document.createElement("div");
    printable.className = `${control.className || ""} print-control-value`;
    printable.textContent = value || "\u00a0";
    printable.style.cssText = [
      "display:block",
      "width:100%",
      "height:auto",
      "min-height:1.2em",
      "overflow:visible",
      "white-space:pre-wrap",
      "overflow-wrap:anywhere",
      "word-break:break-word",
      "line-height:1.35",
      "color:#000",
      "background:transparent",
      "border:0",
      "padding:1px 2px",
      "box-sizing:border-box",
    ].join(";");
    control.replaceWith(printable);
  });
};

const ensureClonePrintStyles = () => {
  if (document.getElementById("form-clone-print-styles")) return;

  const style = document.createElement("style");
  style.id = "form-clone-print-styles";
  style.textContent = `
    @media print {
      body.print-form-clone-active > *:not(#print-form-clone-root) {
        display: none !important;
      }
      #print-form-clone-root {
        display: block !important;
        position: absolute !important;
        inset: 0 auto auto 0 !important;
        width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        background: #fff !important;
      }
      #print-form-clone-root table {
        width: 100% !important;
        table-layout: fixed !important;
      }
      #print-form-clone-root td,
      #print-form-clone-root th,
      #print-form-clone-root .print-control-value {
        overflow: visible !important;
        white-space: pre-wrap !important;
        overflow-wrap: anywhere !important;
        word-break: break-word !important;
      }
      #print-form-clone-root button,
      #print-form-clone-root .no-print,
      #print-form-clone-root [class~="print:hidden"] {
        display: none !important;
      }
    }
  `;
  document.head.appendChild(style);
};

export const printFormSection = (source, cloneId = "printable-form-clone") => {
  if (!source) return false;

  ensureClonePrintStyles();

  const previousWrapper = document.getElementById("print-form-clone-root");
  previousWrapper?.remove();

  const clone = source.cloneNode(true);
  clone.id = cloneId;
  clone.querySelectorAll(".no-print, [class~='print:hidden'], button").forEach((element) => {
    element.remove();
  });
  replaceFormControlsWithPrintValues(clone);

  const wrapper = document.createElement("div");
  wrapper.id = "print-form-clone-root";
  wrapper.style.display = "none";
  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);
  document.body.classList.add("print-form-clone-active");

  const cleanup = () => {
    document.body.classList.remove("print-form-clone-active");
    wrapper.remove();
  };

  window.addEventListener("afterprint", cleanup, { once: true });
  window.setTimeout(cleanup, 60000);
  window.print();
  return true;
};
