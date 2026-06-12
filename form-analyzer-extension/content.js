// Cache for tracking field visibility states during monitoring
const fieldStateCache = new WeakMap();
let isMonitoring = false;
let observer = null;
let detectedEvents = [];
let lastClickedElementInfo = null;

// Track clicks to associate with dynamic field changes
document.addEventListener('click', (e) => {
  const target = e.target;
  if (target) {
    // Traverse up to find buttons, radios, checkboxes, or labels
    let interactiveEl = target.closest('button, input, select, textarea, a, [role="button"]');
    if (!interactiveEl) interactiveEl = target;

    let textVal = interactiveEl.innerText || interactiveEl.value || interactiveEl.placeholder || '';
    if (!textVal && interactiveEl.tagName === 'INPUT') {
      // Try label
      const parentLabel = interactiveEl.closest('label');
      if (parentLabel) textVal = parentLabel.innerText;
    }
    
    let description = textVal.trim().substring(0, 40);
    if (!description && interactiveEl.id) description = `#${interactiveEl.id}`;
    if (!description && interactiveEl.name) description = `name=${interactiveEl.name}`;

    lastClickedElementInfo = {
      tagName: interactiveEl.tagName.toLowerCase(),
      type: interactiveEl.type || '',
      label: description || 'Unnamed element',
      id: interactiveEl.id || '',
      className: interactiveEl.className || '',
      timestamp: Date.now()
    };
  }
}, true);

// Track select changes as well
document.addEventListener('change', (e) => {
  const target = e.target;
  if (target && (target.tagName === 'SELECT' || target.type === 'radio' || target.type === 'checkbox')) {
    let textVal = '';
    if (target.tagName === 'SELECT') {
      const selectedOption = target.options[target.selectedIndex];
      textVal = selectedOption ? selectedOption.text : target.value;
    } else {
      textVal = target.value;
    }
    
    let description = textVal.trim().substring(0, 40);
    lastClickedElementInfo = {
      tagName: target.tagName.toLowerCase(),
      type: target.type || '',
      label: description || 'changed option',
      id: target.id || '',
      className: target.className || '',
      timestamp: Date.now()
    };
  }
}, true);

// Helper: Format field names from camelCase, snake_case or hyphens to Title Case
function formatToTitleCase(str) {
  if (!str) return '';
  return str
    .replace(/[-_]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b[a-z]/g, (letter) => letter.toUpperCase())
    .trim();
}

// Helper: Extract correct label text for a field
function getLabelText(el) {
  // 1. Explicit <label for="id">
  if (el.id) {
    const label = document.querySelector(`label[for="${el.id}"]`);
    if (label && label.innerText.trim()) {
      return label.innerText.trim();
    }
  }

  // 2. Implicit wrapping <label>
  let parent = el.parentElement;
  while (parent) {
    if (parent.tagName === 'LABEL') {
      // Extract label text content and remove the field's own contribution if nested
      let labelText = '';
      parent.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          labelText += node.nodeValue;
        } else if (node.nodeType === Node.ELEMENT_NODE && node !== el && node.tagName !== 'INPUT' && node.tagName !== 'SELECT' && node.tagName !== 'TEXTAREA') {
          labelText += node.innerText;
        }
      });
      labelText = labelText.trim();
      if (labelText) return labelText;
      
      // Fallback to plain innerText if node traversing was too restrictive
      if (parent.innerText.trim()) {
        return parent.innerText.replace(el.innerText || '', '').trim();
      }
    }
    parent = parent.parentElement;
  }

  // 3. ARIA attributes
  if (el.getAttribute('aria-label')) {
    return el.getAttribute('aria-label').trim();
  }
  if (el.getAttribute('aria-labelledby')) {
    const ids = el.getAttribute('aria-labelledby').split(/\s+/);
    const labels = ids.map(id => {
      const target = document.getElementById(id);
      return target ? target.innerText.trim() : '';
    }).filter(Boolean);
    if (labels.length) return labels.join(' ');
  }

  // 4. Preceding sibling label or text
  let prev = el.previousElementSibling;
  if (prev && (prev.tagName === 'LABEL' || prev.tagName === 'SPAN') && prev.innerText.trim()) {
    return prev.innerText.trim();
  }

  // 5. Placeholder fallback
  if (el.placeholder && el.placeholder.trim()) {
    return `Placeholder: "${el.placeholder.trim()}"`;
  }

  // 6. Name / ID fallback
  if (el.name) {
    return formatToTitleCase(el.name);
  }
  if (el.id) {
    return formatToTitleCase(el.id);
  }

  return 'Unlabeled Field';
}

// Helper: Determine data type
function getFieldDataType(el) {
  const tagName = el.tagName.toLowerCase();
  if (tagName === 'textarea') return 'textarea';
  if (tagName === 'select') return el.multiple ? 'select-multiple' : 'select';
  if (tagName === 'input') {
    return el.getAttribute('type') || 'text'; // default to text if no type
  }
  return 'unknown';
}

// Helper: Determine if element is visible
function isElementVisible(el) {
  // Input type hidden is always hidden
  if (el.type === 'hidden') return false;

  // Check display, visibility, opacity via computed style
  let currentEl = el;
  while (currentEl && currentEl.tagName !== 'BODY') {
    const style = window.getComputedStyle(currentEl);
    if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity) === 0) {
      return false;
    }
    currentEl = currentEl.parentElement;
  }

  // Check bounding dimensions
  const rect = el.getBoundingClientRect();
  if (rect.width === 0 && rect.height === 0) {
    return false;
  }

  return true;
}

// Helper: Scan all fields in current DOM
function scanFields() {
  const elements = document.querySelectorAll('input, select, textarea');
  const results = [];

  elements.forEach((el, index) => {
    // Generate simple selector path
    let selector = el.tagName.toLowerCase();
    if (el.id) {
      selector += `#${el.id}`;
    } else if (el.name) {
      selector += `[name="${el.name}"]`;
    }
    if (el.className) {
      selector += `.${Array.from(el.classList).join('.')}`;
    }

    const type = getFieldDataType(el);
    const label = getLabelText(el);
    const placeholder = el.placeholder || '';
    const visible = isElementVisible(el);

    // Save select options if applicable
    let options = null;
    if (el.tagName.toLowerCase() === 'select') {
      options = Array.from(el.options).map(opt => ({
        value: opt.value,
        text: opt.text
      }));
    }

    results.push({
      index: index + 1,
      id: el.id || '',
      name: el.name || '',
      tagName: el.tagName.toLowerCase(),
      type: type,
      label: label,
      placeholder: placeholder,
      visible: visible,
      required: el.required || false,
      disabled: el.disabled || false,
      value: el.value || '',
      selector: selector,
      options: options
    });
  });

  return results;
}

// Initialize visibility cache
function updateFieldCache() {
  const elements = document.querySelectorAll('input, select, textarea');
  elements.forEach((el) => {
    fieldStateCache.set(el, isElementVisible(el));
  });
}

// Log field visibility change
function logTriggeredField(el, actionType) {
  const label = getLabelText(el);
  const type = getFieldDataType(el);
  const placeholder = el.placeholder || '';

  // Determine potential trigger
  let triggerMsg = "System/Direct action";
  if (lastClickedElementInfo && (Date.now() - lastClickedElementInfo.timestamp < 1000)) {
    const info = lastClickedElementInfo;
    triggerMsg = `Click on <${info.tagName}> "${info.label}"`;
    if (info.type) triggerMsg += ` [type=${info.type}]`;
    if (info.id) triggerMsg += ` id=#${info.id}`;
  }

  const eventLog = {
    time: new Date().toLocaleTimeString(),
    label: label,
    type: type,
    placeholder: placeholder,
    action: actionType,
    trigger: triggerMsg
  };

  detectedEvents.push(eventLog);

  // Send real-time event updates to popup
  try {
    chrome.runtime.sendMessage({
      type: 'MONITOR_EVENT',
      event: eventLog
    });
  } catch (e) {
    // Popup might be closed, which is fine
  }
}

// Start watching DOM changes
function startMonitoring() {
  if (isMonitoring) return;
  isMonitoring = true;
  detectedEvents = [];
  updateFieldCache();

  observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      // 1. Added Nodes
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const fields = [];
            if (['INPUT', 'SELECT', 'TEXTAREA'].includes(node.tagName)) {
              fields.push(node);
            }
            fields.push(...node.querySelectorAll('input, select, textarea'));

            fields.forEach(field => {
              const visibleNow = isElementVisible(field);
              fieldStateCache.set(field, visibleNow);
              if (visibleNow) {
                logTriggeredField(field, 'Added to page');
              }
            });
          }
        });
      }
      
      // 2. Class/Style attribute changes (often controls show/hide)
      else if (mutation.type === 'attributes' && (mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
        const target = mutation.target;
        if (target.nodeType === Node.ELEMENT_NODE) {
          const fields = [];
          if (['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName)) {
            fields.push(target);
          }
          fields.push(...target.querySelectorAll('input, select, textarea'));

          fields.forEach(field => {
            const currentlyVisible = isElementVisible(field);
            const wasVisible = fieldStateCache.get(field);

            if (currentlyVisible !== wasVisible) {
              fieldStateCache.set(field, currentlyVisible);
              if (currentlyVisible) {
                logTriggeredField(field, 'Made Visible');
              } else {
                logTriggeredField(field, 'Hidden');
              }
            }
          });
        }
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'class']
  });
}

// Stop watching DOM changes
function stopMonitoring() {
  if (!isMonitoring) return;
  isMonitoring = false;
  if (observer) {
    observer.disconnect();
    observer = null;
  }
}

// Message listener from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'scan') {
    const fields = scanFields();
    sendResponse({ success: true, fields: fields });
  } 
  else if (request.action === 'start_monitor') {
    startMonitoring();
    sendResponse({ success: true, isMonitoring: isMonitoring, events: detectedEvents });
  } 
  else if (request.action === 'stop_monitor') {
    stopMonitoring();
    sendResponse({ success: true, isMonitoring: isMonitoring, events: detectedEvents });
  }
  else if (request.action === 'get_monitor_status') {
    sendResponse({ success: true, isMonitoring: isMonitoring, events: detectedEvents });
  }
  return true; // Keep message channel open for asynchronous responses
});
