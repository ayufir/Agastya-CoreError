(function() {
  if (window.__autofill_script_loaded__) {
    return;
  }
  window.__autofill_script_loaded__ = true;

  // Global tracking for filled inputs in the current DOM instance
  const filledElements = new WeakSet();

// ─── AUTOFILL FUNCTION ────────────────────────────────────────────────────────
async function autofillFormInCurrentFrame(data, uploadedPhotos) {
  const getAllInteractiveElements = (root = document) => {
    let elements = [];
    try {
      const interactive = root.querySelectorAll('input, textarea, select, [contenteditable="true"]');
      elements.push(...Array.from(interactive));
      const allElements = root.querySelectorAll('*');
      for (const el of allElements) {
        if (el.shadowRoot) {
          elements.push(...getAllInteractiveElements(el.shadowRoot));
        }
      }
    } catch(e) {}
    return elements;
  };

  console.log("🚀 autofillFormInCurrentFrame starting with data:", data);
  const allInteractive = getAllInteractiveElements();
  console.log(`🔍 Found ${allInteractive.length} interactive elements on the page.`);
  if (allInteractive.length === 0) {
    console.warn("⚠️ No interactive elements found in this frame.");
    return 0;
  }

  const flattenedData = flattenObject(data);
  console.log("📋 Flattened data to autofill:", flattenedData);
  let fillCount = 0;
  const promises = [];

  const cleanWord = (w) => {
    if (w === 'nfsa' || w === 'nfas') return 'nfa';
    if (w === 'rale') return 'rate';
    if (w === 'tenanats' || w === 'tenants' || w === 'tenant') return 'tenant';
    if (w === 'baathrooms' || w === 'bathrooms' || w === 'bathroom') return 'bathroom';
    if (w === 'usages' || w === 'usage') return 'usage';
    if (w === 'contact' || w === 'mobile' || w === 'phone' || w === 'contactno' || w === 'mobileno') return 'phone';
    if (w === 'visited' || w === 'verified' || w === 'verification') return 'verify';
    const wLower = w.toLowerCase();
    if (['applicant', 'customer', 'borrower', 'client', 'visitedpersonname', 'borrowername', 'applicantname', 'customername'].includes(wLower)) return 'customer';
    if (['lan', 'loan', 'account', 'lanno', 'loanno'].includes(wLower)) return 'lan';
    if (['brq', 'request', 'case', 'brqno', 'caserefno', 'casereferencenumber'].includes(wLower)) return 'request';
    if (['no', 'number', 'code'].includes(wLower)) return 'number';
    if (['val', 'value', 'rate', 'price', 'valuation'].includes(wLower)) return 'value';
    if (['valuer', 'appraiser', 'engineer', 'surveyor'].includes(wLower)) return 'valuer';
    if (['site', 'actual', 'physical', 'visit'].includes(wLower)) return 'site';
    if (['legal', 'document', 'deed'].includes(wLower)) return 'document';
    if (['plan', 'blueprint', 'map', 'sanctioned', 'sanction'].includes(wLower)) return 'plan';
    if (['met', 'during', 'contacted', 'personmet'].includes(wLower)) return 'met';
    if (['road', 'approach', 'way', 'street', 'passage'].includes(wLower)) return 'road';
    if (['floor', 'floors', 'floorno', 'floornumber', 'numberoffloors', 'totalfloors'].includes(wLower)) return 'floor';
    if (['authority', 'approving', 'approvingauthority'].includes(wLower)) return 'authority';
    if (['usage', 'use', 'purpose'].includes(wLower)) return 'usage';
    if (['remarks', 'remark', 'comments', 'comment', 'observation', 'observations'].includes(wLower)) return 'remarks';
    return w;
  };

  const getWords = (str) => {
    return str
      .replace(/([A-Z])/g, ' $1')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 0)
      .map(cleanWord);
  };

  const getRadioLabelText = (element) => {
    if (element.id) {
      const label = document.querySelector(`label[for="${element.id}"]`);
      if (label) return label.innerText.trim();
    }
    const parentLabel = element.closest('label');
    if (parentLabel) return parentLabel.innerText.trim();
    let sibling = element.nextSibling;
    while (sibling) {
      if (sibling.nodeType === 3 && sibling.textContent.trim()) return sibling.textContent.trim();
      if (sibling.nodeType === 1 && sibling.innerText.trim()) return sibling.innerText.trim();
      sibling = sibling.nextSibling;
    }
    return element.value || "";
  };

  const findBestMatchingElement = async (key, value) => {
    const arrayMatch = key.match(/(?:\.|\[)(\d+)(?:\.|\])/);
    let arrayIndex = null;
    let baseKey = key;
    if (arrayMatch) {
      arrayIndex = parseInt(arrayMatch[1], 10);
      baseKey = key.replace(/(?:\.|\[)\d+(?:\.|\])/g, '.');
    }

    const keyWords = getWords(baseKey);
    console.log(`  Matching key: "${key}" (baseKey: "${baseKey}", keywords: ${JSON.stringify(keyWords)})`);
    if (keyWords.length === 0) return null;

    const candidates = [];

    for (const element of allInteractive) {
      if (element.type === 'file') {
        const isImageUrl = typeof value === 'string' && (value.startsWith('http') || value.startsWith('data:image/') || value.startsWith('data:application/'));
        if (!isFileObject(value) && !isFileArray(value) && !isImageUrl) continue;
      }
      if (element.type !== 'file' && (isFileObject(value) || isFileArray(value))) continue;

      const isBoolVal = (typeof value === 'boolean');
      if (isBoolVal && element.type !== 'checkbox' && element.type !== 'radio') continue;

      if (!isBoolVal && (element.type === 'checkbox' || element.type === 'radio')) {
        const radioLabel = getRadioLabelText(element);
        const cleanRadioLabel = radioLabel.toLowerCase().replace(/[^a-z0-9]/g, ' ');
        const cleanVal = String(value).toLowerCase().replace(/[^a-z0-9]/g, ' ');
        if (cleanRadioLabel !== cleanVal && element.value.toLowerCase() !== cleanVal && cleanVal !== 'yes' && cleanVal !== 'no' && cleanVal !== 'true' && cleanVal !== 'false') {
          continue;
        }
      }

      let score = 0;
      const id = (element.id || "").toLowerCase();
      const name = (element.name || "").toLowerCase();
      const placeholder = (element.placeholder || "").toLowerCase();
      const ariaLabel = (element.getAttribute('aria-label') || "").toLowerCase();
      const directText = `${id} ${name} ${placeholder} ${ariaLabel}`;
      const cleanKey = baseKey.toLowerCase().replace(/[^a-z0-9]/g, '');
      const keyParts = baseKey.split('.');
      const lastSegment = keyParts[keyParts.length - 1];
      const cleanLastKey = lastSegment.toLowerCase().replace(/[^a-z0-9]/g, '');

      if (id === cleanKey || name === cleanKey) score += 50;
      else if (cleanLastKey && (id === cleanLastKey || name === cleanLastKey)) score += 45;
      else if (cleanLastKey && (id.includes(cleanLastKey) || name.includes(cleanLastKey))) score += 15;

      let contextText = "";
      if (element.id) {
        const labels = document.querySelectorAll(`label[for="${element.id}"]`);
        labels.forEach(l => contextText += " " + l.innerText);
      }
      const parentLabel = element.closest('label');
      if (parentLabel) contextText += " " + parentLabel.innerText;
      if (element.parentElement) {
        contextText += " " + element.parentElement.innerText.slice(0, 300);
        if (element.parentElement.parentElement) {
          contextText += " " + element.parentElement.parentElement.innerText.slice(0, 600);
        }
      }

      const cleanContext = (directText + " " + contextText).toLowerCase().replace(/[^a-z0-9]/g, ' ');
      const contextWords = new Set(cleanContext.split(/\s+/).filter(Boolean).map(cleanWord));

      let matchedWordsCount = 0;
      keyWords.forEach(word => {
        let isMatch = false;
        if (contextWords.has(word)) {
          isMatch = true;
          score += 5;
        } else if (word.length > 3) {
          for (const cWord of contextWords) {
            if (cWord.includes(word) || word.includes(cWord)) {
              isMatch = true;
              score += 2.5;
              break;
            }
          }
        }
        if (isMatch) {
          matchedWordsCount++;
          if (directText.includes(word)) score += 6;
        }
      });

      if (element.type === 'radio' || element.type === 'checkbox') {
        const radioLabel = getRadioLabelText(element);
        const cleanRadioLabel = radioLabel.toLowerCase().replace(/[^a-z0-9]/g, ' ');
        const cleanVal = (typeof value === 'object') ? "" : String(value).toLowerCase().replace(/[^a-z0-9]/g, ' ');
        if (element.type === 'radio') {
          const isExactMatch = cleanRadioLabel === cleanVal || element.value.toLowerCase() === cleanVal;
          const isBoolYesMatch = (value === true && (cleanRadioLabel === 'yes' || element.value.toLowerCase() === 'yes'));
          const isBoolNoMatch = (value === false && (cleanRadioLabel === 'no' || element.value.toLowerCase() === 'no'));
          if (isExactMatch || isBoolYesMatch || isBoolNoMatch) score += 25;
          else if (cleanVal.length > 2 && (cleanRadioLabel.includes(cleanVal) || cleanVal.includes(cleanRadioLabel))) score += 15;
          else score -= 20;
        } else if (element.type === 'checkbox') {
          const isExactMatch = cleanRadioLabel === cleanVal || element.value.toLowerCase() === cleanVal;
          const isBoolYesMatch = (value === true && (cleanRadioLabel === 'yes' || element.value.toLowerCase() === 'yes'));
          const isBoolNoMatch = (value === false && (cleanRadioLabel === 'no' || element.value.toLowerCase() === 'no'));
          if (isExactMatch || isBoolYesMatch || isBoolNoMatch || cleanVal === 'yes' || cleanVal === 'true') score += 25;
        }
      }

      if (matchedWordsCount === keyWords.length) score += 20;
      else if (matchedWordsCount > 0) score += (matchedWordsCount / keyWords.length) * 10;
      else score -= 10;

      if (score > 1) candidates.push({ element, score });
    }

    if (candidates.length === 0) return null;

    if (arrayIndex !== null) {
      const maxScore = Math.max(...candidates.map(c => c.score));
      const threshold = Math.max(15, maxScore * 0.7);
      let filteredCandidates = candidates.filter(c => c.score >= threshold);

      if (filteredCandidates.length <= arrayIndex && filteredCandidates.length > 0) {
        const firstElem = filteredCandidates[0].element;
        let container = firstElem.parentElement;
        let clicked = false;
        for (let depth = 0; depth < 5; depth++) {
          if (!container) break;
          const buttons = Array.from(container.querySelectorAll('button, a, [role="button"]'));
          const addButton = buttons.find(btn => {
            const text = btn.innerText.trim().toLowerCase();
            return text.includes('add') || text.includes('more') || text === '+';
          });
          if (addButton) {
            console.log("➕ Clicking 'Add More' button dynamically:", addButton);
            addButton.click();
            clicked = true;
            break;
          }
          container = container.parentElement;
        }
        if (clicked) {
          await new Promise(r => setTimeout(r, 150));
          allInteractive.length = 0;
          allInteractive.push(...getAllInteractiveElements());
          return await findBestMatchingElement(key, value);
        }
      }

      if (filteredCandidates.length > arrayIndex) {
        const best = filteredCandidates[arrayIndex].element;
        console.log(`🎯 Match for "${key}" (Index ${arrayIndex}):`, best, `Score: ${filteredCandidates[arrayIndex].score}`);
        return best;
      }
      console.warn(`    ❌ Out of bounds or no matching array element for key "${key}" (Index: ${arrayIndex}, found candidates: ${filteredCandidates.length})`);
      return null;
    } else {
      candidates.sort((a, b) => b.score - a.score);
      if (candidates.length > 0) {
        console.log(`🎯 Match for "${key}":`, candidates[0].element, `Score: ${candidates[0].score}`);
        return candidates[0].element;
      }
      console.warn(`    ❌ No candidates matching criteria for key "${key}"`);
      return null;
    }
  };

  const fillCustomDropdown = async (element, val) => {
    try {
      element.focus();
      element.click();
      element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      let parent = element.parentElement;
      for (let i = 0; i < 3; i++) {
        if (!parent) break;
        const className = (parent.className || "").toString().toLowerCase();
        if (className.includes('select') || className.includes('dropdown') || className.includes('selector') || className.includes('container')) {
          parent.click();
          parent.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
          break;
        }
        parent = parent.parentElement;
      }
      await new Promise(r => setTimeout(r, 150));
      const cleanVal = String(val).toLowerCase().replace(/[^a-z0-9]/g, '');
      const optionSelectors = [
        'option', '[role="option"]', '.ant-select-item-option', '.ant-select-item-option-content',
        '.mat-option', '.mat-option-text', '.ng-option', '.ng-option-label',
        '.dropdown-item', '.dropdown-menu li', 'li', 'div'
      ];
      let options = [];
      for (const selector of optionSelectors) {
        const found = Array.from(document.querySelectorAll(selector));
        if (found.length > 0) {
          options = found;
          if (selector !== 'div' && selector !== 'li') break;
        }
      }
      const bestOption = options.find(opt => {
        const text = opt.innerText || opt.textContent || "";
        const cleanText = text.toLowerCase().replace(/[^a-z0-9]/g, '');
        return cleanText === cleanVal || cleanText.includes(cleanVal) || cleanVal.includes(cleanText);
      });
      if (bestOption) {
        console.log("🎯 Found and clicking custom dropdown option:", bestOption);
        bestOption.click();
        bestOption.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.dispatchEvent(new Event('blur', { bubbles: true }));
        return true;
      }
    } catch (e) {
      console.warn("Custom dropdown selection failed:", e);
    }
    return false;
  };

  const fillElement = async (element, val) => {
    console.log(`    ✍️ Filling element:`, element, `with value:`, val);
    if (element.type === 'file') return;
    if (typeof val === 'object' && val !== null) {
      console.warn(`    ⚠️ Skipping object/array value for text field:`, val);
      return;
    }
    if (element.type === 'date') {
      const d = new Date(val);
      if (!isNaN(d.getTime())) {
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        val = `${year}-${month}-${day}`;
      } else {
        console.warn(`Skipping date fill: value "${val}" is not a valid date.`);
        return;
      }
    } else {
      const isDateStr = typeof val === 'string' && /^\d{4}-\d{2}-\d{2}/.test(val);
      if (isDateStr) {
        const isDateField = (element.placeholder && /dd|mm|yyyy|date/i.test(element.placeholder)) ||
                             (element.id && /date/i.test(element.id)) ||
                             (element.name && /date/i.test(element.name)) ||
                             (element.className && /datepicker|calendar|date/i.test(element.className));
        if (isDateField) {
          const d = new Date(val);
          if (!isNaN(d.getTime())) {
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = d.getFullYear();
            val = `${day}/${month}/${year}`;
          }
        }
      }
    }

    if (element.isContentEditable || element.getAttribute('contenteditable') === 'true') {
      element.innerHTML = val;
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
      element.dispatchEvent(new Event('blur', { bubbles: true }));
      element.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Process' }));
      element.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: 'Process' }));
      return;
    }

    if (element.tagName === 'SELECT') {
      const options = Array.from(element.options);
      const cleanVal = String(val).toLowerCase().replace(/[^a-z0-9]/g, '');
      let matchedOption = options.find(opt => {
        const optText = opt.text.toLowerCase().replace(/[^a-z0-9]/g, '');
        const optVal = opt.value.toLowerCase().replace(/[^a-z0-9]/g, '');
        return optText === cleanVal || optVal === cleanVal;
      });
      if (matchedOption) {
        element.value = matchedOption.value;
        element.dispatchEvent(new Event('change', { bubbles: true }));
      }
      return;
    }

    const isCustomSelect = element.getAttribute('role') === 'combobox' ||
                           element.getAttribute('aria-haspopup') === 'true' ||
                           (element.className && (element.className.toLowerCase().includes('select') || element.className.toLowerCase().includes('dropdown'))) ||
                           element.readOnly;

    if (isCustomSelect && element.type !== 'checkbox' && element.type !== 'radio') {
      const filledCustom = await fillCustomDropdown(element, val);
      if (filledCustom) return;
    }

    if (element.type === 'checkbox') {
      const shouldCheck = (val === true || String(val).toLowerCase() === 'yes' || String(val).toLowerCase() === 'true' || val === 1);
      if (element.checked !== shouldCheck) {
        element.click();
        if (element.checked !== shouldCheck) {
          const parentLabel = element.closest('label') || element.parentElement;
          if (parentLabel) parentLabel.click();
        }
        if (element.checked !== shouldCheck) {
          element.checked = shouldCheck;
          element.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
    } else if (element.type === 'radio') {
      if (!element.checked) {
        element.click();
        if (!element.checked) {
          const parentLabel = element.closest('label') || element.parentElement;
          if (parentLabel) parentLabel.click();
        }
        if (!element.checked) {
          element.checked = true;
          element.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
    } else {
      const nativeSetter = Object.getOwnPropertyDescriptor(
        element.tagName === 'TEXTAREA' ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype,
        "value"
      )?.set;
      if (nativeSetter) nativeSetter.call(element, val);
      else element.value = val;
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
      element.dispatchEvent(new Event('blur', { bubbles: true }));
      element.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Process' }));
      element.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: 'Process' }));
    }
  };

  for (const key in flattenedData) {
    const value = flattenedData[key];
    if (value === null || value === undefined) continue;

    const element = await findBestMatchingElement(key, value);
    if (element) {
      if (filledElements.has(element)) continue;
      if (element.getAttribute('data-user-edited') === 'true') continue;

      if (isFileObject(value) || isFileArray(value)) {
        if (element.type === 'file') {
          promises.push(fillFileInputWithData(element, value));
          filledElements.add(element);
          fillCount++;
        }
      } else {
        const isImageUrl = typeof value === 'string' && (
          value.startsWith('data:image/') ||
          value.startsWith('data:application/') ||
          (value.startsWith('http') && (value.match(/\.(jpeg|jpg|gif|png|pdf)$/i) || value.includes('cloudinary') || value.includes('aws')))
        );
        if (element.type === 'file' && isImageUrl) {
          promises.push(fillFileInputWithData(element, value));
          filledElements.add(element);
          fillCount++;
        } else {
          await fillElement(element, value);
          filledElements.add(element);
          fillCount++;
        }
      }
    }
  }

  if (uploadedPhotos.length > 0) {
    const fileInputs = allInteractive.filter(el => el.type === 'file');
    if (fileInputs.length > 0) {
      const dataTransfer = new DataTransfer();
      uploadedPhotos.forEach(photo => {
        const arr = photo.dataUrl.split(',');
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while(n--) u8arr[n] = bstr.charCodeAt(n);
        const file = new File([u8arr], photo.name, {type: photo.type});
        dataTransfer.items.add(file);
      });

      const getAllDomElements = (root = document) => {
        let elements = [];
        try {
          const all = root.querySelectorAll('*');
          for (const el of all) {
            elements.push(el);
            if (el.shadowRoot) elements.push(...getAllDomElements(el.shadowRoot));
          }
        } catch(e) {}
        return elements;
      };

      let targetInput = null;
      const allElements = getAllDomElements();
      for (const el of allElements) {
        if (el.children.length === 0 && el.textContent) {
          const text = el.textContent.trim().toLowerCase();
          if (text.includes('site photograph') || text.includes('subject property') || text.includes('interior') || text.includes('exterior') || text.includes('upload photo')) {
            let current = el;
            for (let i = 0; i < 5; i++) {
              if (current && current.parentElement) {
                current = current.parentElement;
                const input = current.querySelector('input[type="file"]');
                if (input) { targetInput = input; break; }
              }
            }
          }
        }
        if (targetInput) break;
      }

      if (targetInput) {
        targetInput.files = dataTransfer.files;
        targetInput.dispatchEvent(new Event('change', { bubbles: true }));
      } else {
        fileInputs.forEach(input => {
          input.files = dataTransfer.files;
          input.dispatchEvent(new Event('change', { bubbles: true }));
        });
      }
      fillCount += uploadedPhotos.length;
    }
  }

  try {
    await Promise.all(promises);
  } catch (err) {
    console.error("Error processing file inputs:", err);
  }

  return fillCount;
}

// Forward action to all nested iframes inside the current frame
function forwardToIframes(data, photos) {
  const iframes = Array.from(document.querySelectorAll('iframe'));
  iframes.forEach(iframe => {
    try {
      iframe.contentWindow.postMessage({
        action: 'FILL_FORM_FORWARD',
        data: data,
        photos: photos
      }, '*');
    } catch (e) {
      console.warn("Could not postMessage to iframe:", e);
    }
  });
}

// 1. Listen for messages directly from the extension popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'FILL_FORM') {
    const data = request.data;
    const uploadedPhotos = request.photos || [];
    try {
      sessionStorage.setItem('__pending_autofill_data__', JSON.stringify({ data, photos: uploadedPhotos }));
    } catch (e) {
      console.warn("Could not save pending autofill data to sessionStorage:", e);
    }
    window.postMessage({ type: 'EXTENSION_AUTOFILL', data: data, photos: uploadedPhotos }, '*');
    autofillFormInCurrentFrame(data, uploadedPhotos).then((fillCount) => {
      forwardToIframes(data, uploadedPhotos);
      sendResponse({ fillCount: fillCount, status: `Filled ${fillCount} fields in this frame.` });
    }).catch(err => {
      sendResponse({ fillCount: 0, status: `Error filling: ${err.message}` });
    });
    return true;
  } else if (request.action === 'EXTRACT_FORM') {
    extractFormDataFromCurrentFrame().then((extracted) => {
      sendResponse({ success: true, data: extracted });
    }).catch(err => {
      sendResponse({ success: false, error: err.message });
    });
    return true;
  }
});

// 2. Listen for forwarded autofill messages AND photo injection from frontend
window.addEventListener('message', async (event) => {
  // ── FILL_FORM_FORWARD (iframe chain forwarding) ──────────────────────────
  if (event.data && event.data.action === 'FILL_FORM_FORWARD') {
    const data = event.data.data;
    const uploadedPhotos = event.data.photos || [];
    try {
      sessionStorage.setItem('__pending_autofill_data__', JSON.stringify({ data, photos: uploadedPhotos }));
    } catch (e) {
      console.warn("Could not save pending autofill data to sessionStorage:", e);
    }
    autofillFormInCurrentFrame(data, uploadedPhotos).then(() => {
      forwardToIframes(data, uploadedPhotos);
    }).catch(err => {
      console.error("Error in iframe autofill:", err);
    });
  }

  // ── EXTENSION_INJECT_PHOTOS — inject ImageKit URLs into file inputs ──────
  if (event.data && event.data.type === 'EXTENSION_INJECT_PHOTOS') {
    const photoUrls = event.data.photoUrls || [];
    if (photoUrls.length === 0) return;

    console.log(`📸 EXTENSION_INJECT_PHOTOS: Injecting ${photoUrls.length} photos into file inputs...`);

    try {
      // Convert all ImageKit URLs to File objects
      const fileObjects = [];
      for (let i = 0; i < photoUrls.length; i++) {
        const url = photoUrls[i];
        try {
          const resp = await fetch(url);
          const blob = await resp.blob();
          const ext  = url.split('.').pop().split('?')[0] || 'jpg';
          const name = `site_visit_photo_${i + 1}.${ext}`;
          const file = new File([blob], name, { type: blob.type || 'image/jpeg' });
          fileObjects.push(file);
        } catch (fetchErr) {
          console.warn(`Could not fetch photo ${i + 1}:`, fetchErr);
        }
      }

      if (fileObjects.length === 0) {
        console.warn("No photos could be fetched from ImageKit.");
        return;
      }

      // Find all file inputs on page — prioritize ones labeled as "photo" / "site" / "property"
      const getAllFileInputs = (root = document) => {
        const inputs = [];
        try {
          root.querySelectorAll('input[type="file"]').forEach(el => inputs.push(el));
          root.querySelectorAll('*').forEach(el => {
            if (el.shadowRoot) inputs.push(...getAllFileInputs(el.shadowRoot));
          });
        } catch (e) {}
        return inputs;
      };

      const photoKeywords = ['photo', 'image', 'picture', 'site', 'property', 'subject', 'interior', 'exterior', 'upload'];

      const scoreInput = (input) => {
        const ctx = [
          input.id || '',
          input.name || '',
          input.placeholder || '',
          input.getAttribute('aria-label') || '',
          input.parentElement?.innerText?.slice(0, 300) || '',
          input.parentElement?.parentElement?.innerText?.slice(0, 300) || '',
        ].join(' ').toLowerCase();

        return photoKeywords.reduce((score, kw) => ctx.includes(kw) ? score + 5 : score, 0);
      };

      const allFileInputs = getAllFileInputs();
      if (allFileInputs.length === 0) {
        console.warn("No file inputs found on page.");
        return;
      }

      // Sort by photo relevance score
      const scoredInputs = allFileInputs
        .map(input => ({ input, score: scoreInput(input) }))
        .sort((a, b) => b.score - a.score);

      // Distribute photos — try to put one photo per input or all in best input
      const dataTransferAll = new DataTransfer();
      fileObjects.forEach(f => dataTransferAll.items.add(f));

      if (scoredInputs[0].score > 0) {
        // Best match input: inject all photos
        const bestInput = scoredInputs[0].input;
        bestInput.files = dataTransferAll.files;
        bestInput.dispatchEvent(new Event('change', { bubbles: true }));
        bestInput.dispatchEvent(new Event('input', { bubbles: true }));
        console.log(`✅ Injected ${fileObjects.length} photos into best-match file input:`, bestInput);

        // Also inject individual photos into subsequent photo inputs
        for (let i = 1; i < Math.min(scoredInputs.length, fileObjects.length); i++) {
          const dt = new DataTransfer();
          dt.items.add(fileObjects[i] || fileObjects[0]);
          scoredInputs[i].input.files = dt.files;
          scoredInputs[i].input.dispatchEvent(new Event('change', { bubbles: true }));
        }
      } else {
        // No specific photo input found — inject into first file input
        const firstInput = allFileInputs[0];
        firstInput.files = dataTransferAll.files;
        firstInput.dispatchEvent(new Event('change', { bubbles: true }));
        console.log(`✅ Injected ${fileObjects.length} photos into first file input:`, firstInput);
      }
    } catch (err) {
      console.error("Error injecting photos from ImageKit:", err);
    }
  }
});

// Mark extension as available so frontend can send postMessages
window.__BANKER_EXTENSION_AVAILABLE__ = true;



// Helper to check if an object is a file/image representation in JSON
function isFileObject(obj) {
  if (!obj || typeof obj !== 'object') return false;
  const hasImageString = (str) => typeof str === 'string' && (str.startsWith('data:image/') || str.startsWith('http'));
  return hasImageString(obj.base64) || hasImageString(obj.url) || hasImageString(obj.dataUrl);
}

// Helper to check if value is an array of file/image representations
function isFileArray(arr) {
  return Array.isArray(arr) && arr.length > 0 && arr.every(item => isFileObject(item) || (typeof item === 'string' && (item.startsWith('data:image/') || item.startsWith('http'))));
}

// Helper to flatten nested JSON objects while keeping files/images intact
function flattenObject(ob) {
  var toReturn = {};
  for (var i in ob) {
    if (!ob.hasOwnProperty(i)) continue;
    const val = ob[i];
    if (isFileObject(val) || isFileArray(val)) {
      toReturn[i] = val;
    } else if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
      var flatObject = flattenObject(val);
      for (var x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue;
        toReturn[i + '.' + x] = flatObject[x];
      }
    } else {
      toReturn[i] = val;
    }
  }
  return toReturn;
}

// Helper to load base64/url files into input[type=file]
async function fillFileInputWithData(element, fileData) {
  try {
    const dataTransfer = new DataTransfer();
    const processItem = async (item) => {
      let base64OrUrl = "";
      let name = "image.png";
      let type = "image/png";
      if (typeof item === 'string') {
        base64OrUrl = item;
      } else if (item && typeof item === 'object') {
        base64OrUrl = item.base64 || item.url || item.dataUrl || "";
        name = item.name || "image.png";
        type = item.type || "image/png";
      }
      if (!base64OrUrl) return;
      let blob;
      if (base64OrUrl.startsWith('data:')) {
        const arr = base64OrUrl.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) u8arr[n] = bstr.charCodeAt(n);
        blob = new Blob([u8arr], { type: mime });
        type = mime;
      } else {
        const response = await fetch(base64OrUrl);
        blob = await response.blob();
        type = blob.type || type;
      }
      const mimeToExt = {
        'image/jpeg': '.jpg', 'image/jpg': '.jpg', 'image/png': '.png',
        'image/gif': '.gif', 'image/webp': '.webp', 'application/pdf': '.pdf'
      };
      const originalExt = name.match(/\.[^/.]+$/)?.[0];
      const ext = mimeToExt[type] || originalExt || '.png';
      const baseName = name.replace(/\.[^/.]+$/, "");
      name = baseName + ext;
      const file = new File([blob], name, { type: type });
      dataTransfer.items.add(file);
    };
    if (Array.isArray(fileData)) {
      for (const item of fileData) await processItem(item);
    } else {
      await processItem(fileData);
    }
    element.files = dataTransfer.files;
    element.dispatchEvent(new Event('change', { bubbles: true }));
  } catch (error) {
    console.error('Error filling file input:', error);
  }
}

// Check and fill elements using pending autofill data in sessionStorage
async function checkAndAutofillFromSessionStorage() {
  try {
    const pendingDataStr = sessionStorage.getItem('__pending_autofill_data__');
    if (!pendingDataStr) return;
    const { data, photos } = JSON.parse(pendingDataStr);
    if (!data) return;
    console.log("⚡ Auto-filling tab fields using stored session data...");
    await autofillFormInCurrentFrame(data, photos);
  } catch (e) {
    console.error("Error in sessionStorage autofill:", e);
  }
}

// Track manual user edits to prevent programmatic overrides
document.addEventListener('input', (e) => {
  if (e.isTrusted && e.target) e.target.setAttribute('data-user-edited', 'true');
}, { capture: true, passive: true });

document.addEventListener('change', (e) => {
  if (e.isTrusted && e.target) e.target.setAttribute('data-user-edited', 'true');
}, { capture: true, passive: true });

// Mutation observer to trigger autofill dynamically on tab changes
let autofillDebounceTimeout = null;
const runAutofillDebounced = () => {
  clearTimeout(autofillDebounceTimeout);
  autofillDebounceTimeout = setTimeout(() => {
    checkAndAutofillFromSessionStorage();
  }, 300);
};

const observedShadowRoots = new WeakSet();

const observeShadowRootsRecursively = (root) => {
  if (!root) return;
  try {
    const all = root.querySelectorAll('*');
    for (const el of all) {
      if (el.shadowRoot && !observedShadowRoots.has(el.shadowRoot)) {
        observedShadowRoots.add(el.shadowRoot);
        try { domObserver.observe(el.shadowRoot, { childList: true, subtree: true }); } catch (e) {}
        observeShadowRootsRecursively(el.shadowRoot);
      }
    }
  } catch(e) {}
};

const domObserver = new MutationObserver((mutations) => {
  let hasNewInputs = false;
  for (const mutation of mutations) {
    if (mutation.addedNodes.length > 0) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === 1) {
          if (['INPUT', 'TEXTAREA', 'SELECT'].includes(node.tagName) ||
              node.getAttribute('contenteditable') === 'true' ||
              node.querySelector('input, textarea, select, [contenteditable="true"]')) {
            hasNewInputs = true;
          }
          if (node.shadowRoot || node.querySelector('*')) {
            observeShadowRootsRecursively(node);
          }
        }
      }
    }
  }
  if (hasNewInputs) runAutofillDebounced();
});

// ─── EXTRACTION FUNCTION ──────────────────────────────────────────────────────
async function extractFormDataFromCurrentFrame() {
  const getAllInteractiveElements = (root = document) => {
    let elements = [];
    try {
      const interactive = root.querySelectorAll('input, textarea, select, [contenteditable="true"]');
      elements.push(...Array.from(interactive));
      const allElements = root.querySelectorAll('*');
      for (const el of allElements) {
        if (el.shadowRoot) elements.push(...getAllInteractiveElements(el.shadowRoot));
      }
    } catch(e) {}
    return elements;
  };

  // Local helper to get label text for radio/checkbox (scoped to avoid conflicts)
  const getRadioLabelTextLocal = (element) => {
    if (element.id) {
      const label = document.querySelector(`label[for="${element.id}"]`);
      if (label) return label.innerText.trim();
    }
    const parentLabel = element.closest('label');
    if (parentLabel) return parentLabel.innerText.trim();
    let sibling = element.nextSibling;
    while (sibling) {
      if (sibling.nodeType === 3 && sibling.textContent.trim()) return sibling.textContent.trim();
      if (sibling.nodeType === 1 && sibling.innerText && sibling.innerText.trim()) return sibling.innerText.trim();
      sibling = sibling.nextSibling;
    }
    return element.value || "";
  };

  const cleanWordLocal = (w) => {
    const wLower = w.toLowerCase();
    if (['applicant', 'customer', 'borrower', 'client'].includes(wLower)) return 'customer';
    if (['lan', 'loan', 'account', 'lanno', 'loanno'].includes(wLower)) return 'lan';
    if (['no', 'number', 'code'].includes(wLower)) return 'number';
    if (['val', 'value', 'rate', 'price'].includes(wLower)) return 'value';
    if (['valuer', 'appraiser', 'engineer', 'surveyor'].includes(wLower)) return 'valuer';
    if (['site', 'actual', 'physical', 'visit'].includes(wLower)) return 'site';
    if (['legal', 'document', 'deed'].includes(wLower)) return 'document';
    if (['plan', 'blueprint', 'sanctioned', 'sanction'].includes(wLower)) return 'plan';
    if (['floor', 'floors', 'floorno'].includes(wLower)) return 'floor';
    if (['remarks', 'remark', 'comments', 'comment'].includes(wLower)) return 'remarks';
    return wLower;
  };

  const getWordsLocal = (str) => {
    return str.replace(/([A-Z])/g, ' $1').toLowerCase()
      .replace(/[^a-z0-9]/g, ' ').split(/\s+/)
      .filter(w => w.length > 0).map(cleanWordLocal);
  };

  const allInteractive = getAllInteractiveElements();
  const extractedData = {};
  const arrayKeyCounters = {};

  const schemaKeys = [
    "applicantDetails.lan", "applicantDetails.collateral", "applicantDetails.customerName",
    "applicantDetails.branch", "applicantDetails.requestCode", "applicantDetails.dateOfReport",
    "applicantDetails.typeOfLoan", "applicantDetails.productType", "applicantDetails.contactName",
    "applicantDetails.contactNo", "applicantDetails.developerName", "applicantDetails.valuerName",
    "applicantDetails.personMetAtSite", "applicantDetails.relationshipMetAtSite",
    "applicantDetails.personMetAtSiteContact", "applicantDetails.numberOfTenants",
    "applicantDetails.tenantVintageYears", "applicantDetails.documentsProvided",
    "locationDetails.pinCode", "locationDetails.areaLocality", "locationDetails.city",
    "locationDetails.state", "locationDetails.addressLine1", "locationDetails.addressLine2",
    "locationDetails.addressLine3", "locationDetails.legalAddressLine1", "locationDetails.legalAddressLine2",
    "locationDetails.legalAddressLine3", "locationDetails.latitudeLongitude",
    "locationDetails.addressMatching", "locationDetails.noOfFloor", "locationDetails.propertyHoldingType",
    "locationDetails.marketability", "locationDetails.propertyOccupiedBy", "locationDetails.propertyType",
    "locationDetails.occupancyStatus", "locationDetails.developmentOfSurroundingAreas",
    "locationDetails.localityStatus", "locationDetails.marketRate", "locationDetails.propertyOwners",
    "locationDetails.percentOwner", "locationDetails.propertyIdentifiedThrough",
    "locationDetails.societyBuildingMaintenanceStatus", "locationDetails.accessRoadCondition",
    "locationDetails.propertyConnectivity", "locationDetails.neighborhoodType",
    "locationDetails.propertyIdentified", "locationDetails.ownerNameAsPerLegalDocument",
    "locationDetails.remarksForAddressMismatch", "locationDetails.mapView",
    "boundariesOnSite.east_asPerLegalDocuments", "boundariesOnSite.west_asPerLegalDocuments",
    "boundariesOnSite.north_asPerLegalDocuments", "boundariesOnSite.south_asPerLegalDocuments",
    "boundariesOnSite.east_asPerSiteVisit", "boundariesOnSite.west_asPerSiteVisit",
    "boundariesOnSite.north_asPerSiteVisit", "boundariesOnSite.south_asPerSiteVisit",
    "boundariesOnSite.boundaryMatching", "boundariesOnSite.approachRoadSize",
    "boundariesOnSite.approachRoadToProperty", "boundariesOnSite.typeOfRoad",
    "boundariesOnSite.remarksForSiteBoundariesMatch",
    "ndmaParameters.natureOfBuildingWing", "ndmaParameters.planAspectRatio",
    "ndmaParameters.structureType", "ndmaParameters.projectedPartsAvailable",
    "ndmaParameters.typeOfMasonry", "ndmaParameters.expansionJointsAvailable",
    "ndmaParameters.roofType", "ndmaParameters.steelGrade", "ndmaParameters.mortarType",
    "ndmaParameters.concreteGrade", "ndmaParameters.environmentExposureCondition",
    "ndmaParameters.footingType", "ndmaParameters.seismicZone", "ndmaParameters.soilLiquefiable",
    "ndmaParameters.coastalRegulatoryZone", "ndmaParameters.coastalRegulatoryZoneCategory",
    "ndmaParameters.soilSlopeVulnerableToLandslide", "ndmaParameters.floodProneArea",
    "ndmaParameters.groundSlopeMoreThan20Percent", "ndmaParameters.fireExit",
    "approvedPlanDetails.sanctionedPlanProvided", "approvedPlanDetails.layoutPlanDetails",
    "approvedPlanDetails.constructionPlanDetails", "approvedPlanDetails.dateOfSanction",
    "approvedPlanDetails.planValidity", "approvedPlanDetails.approvingAuthority",
    "approvedPlanDetails.propertyUsagesAsPerPlan", "approvedPlanDetails.propertyUsageAsPerSiteVisit",
    "approvedPlanDetails.numberOfFloorInBuilding",
    "technicalDetails.constructionQuality", "technicalDetails.liftAvailable",
    "technicalDetails.noOfLifts", "technicalDetails.separateIndependentAccess",
    "technicalDetails.plotAreaDetails.eastToWest.asPerPlan",
    "technicalDetails.plotAreaDetails.eastToWest.asPerDocuments",
    "technicalDetails.plotAreaDetails.eastToWest.asPerSiteVisit",
    "technicalDetails.plotAreaDetails.northToSouth.asPerPlan",
    "technicalDetails.plotAreaDetails.northToSouth.asPerDocuments",
    "technicalDetails.plotAreaDetails.northToSouth.asPerSiteVisit",
    "technicalDetails.plotAreaDetails.areaOfLandSqFt.asPerPlan",
    "technicalDetails.plotAreaDetails.areaOfLandSqFt.asPerDocuments",
    "technicalDetails.plotAreaDetails.areaOfLandSqFt.asPerSiteVisit",
    "technicalDetails.permissibleAreaAsPerPlan", "technicalDetails.landComponentSqFt",
    "technicalDetails.permissibleFSIAsPerByelaws", "technicalDetails.permissibleConstructionAsPerFSI",
    "technicalDetails.carpetAreaAsPerDocument", "technicalDetails.actualConstructionSBUA",
    "technicalDetails.riskOfDemolition", "technicalDetails.statusOfProperty",
    "technicalDetails.percentCompleted", "technicalDetails.percentRecommended",
    "technicalDetails.currentAgeOfPropertyInYear", "technicalDetails.residualAge",
    "technicalDetails.currentOccupantOfProperty",
    "technicalDetails.bauAreaDetails.basementStiltFloor.noOfRooms",
    "technicalDetails.bauAreaDetails.basementStiltFloor.noOfKitchen",
    "technicalDetails.bauAreaDetails.basementStiltFloor.noOfBathrooms",
    "technicalDetails.bauAreaDetails.basementStiltFloor.sanctionedUsages",
    "technicalDetails.bauAreaDetails.basementStiltFloor.actualUsage",
    "technicalDetails.bauAreaDetails.groundFloor.noOfRooms",
    "technicalDetails.bauAreaDetails.groundFloor.noOfKitchen",
    "technicalDetails.bauAreaDetails.groundFloor.noOfBathrooms",
    "technicalDetails.bauAreaDetails.groundFloor.sanctionedUsages",
    "technicalDetails.bauAreaDetails.groundFloor.actualUsage",
    "technicalDetails.bauAreaDetails.firstFloor.noOfRooms",
    "technicalDetails.bauAreaDetails.firstFloor.noOfKitchen",
    "technicalDetails.bauAreaDetails.firstFloor.noOfBathrooms",
    "technicalDetails.bauAreaDetails.firstFloor.sanctionedUsages",
    "technicalDetails.bauAreaDetails.firstFloor.actualUsage",
    "technicalDetails.bauAreaDetails.secondFloor.noOfRooms",
    "technicalDetails.bauAreaDetails.secondFloor.noOfKitchen",
    "technicalDetails.bauAreaDetails.secondFloor.noOfBathrooms",
    "technicalDetails.bauAreaDetails.secondFloor.sanctionedUsages",
    "technicalDetails.bauAreaDetails.secondFloor.actualUsage",
    "valuation.unitOfMeasurement", "valuation.constructionAreaType", "valuation.landArea",
    "valuation.landRate", "valuation.landTotalValue", "valuation.constructionArea",
    "valuation.constructionRate", "valuation.constructionTotalValue",
    "valuation.depreciationPercent", "valuation.depreciationValue",
    "valuation.carParkingCharges.numberOfCars", "valuation.carParkingCharges.charges",
    "valuation.carParkingCharges.total", "valuation.amenitiesOtherChargesLumpsum",
    "valuation.realizableValueAsOnDate", "valuation.governmentValue",
    "valuation.distressedForceValue", "valuation.valuationDoneEarlier",
    "valuation.valuationMethodology", "valuation.inMunicipalDemolitionList",
    "valuation.isPropertyInNegativeArea", "valuation.municipalCompliance",
    "valuation.detailsOfLegalDocuments", "valuation.basicAgreementValue",
    "valuation.costOfProperty", "valuation.electricityWaterDeposit",
    "valuation.oneTimeMaintenanceDeposit", "valuation.floorRiseAmt",
    "valuation.percentGST", "valuation.legalCharges", "valuation.clubMembership", "valuation.lodWaiver",
    "additionalChecksForPanchayatProperties.approachRoadToProperty",
    "additionalChecksForPanchayatProperties.distanceFromCityCentreInKms",
    "additionalChecksForPanchayatProperties.distanceFromCorporationLimitsInKms",
    "additionalChecksForPanchayatProperties.electricity",
    "additionalChecksForPanchayatProperties.electricityDistributor",
    "additionalChecksForPanchayatProperties.waterSupply",
    "additionalChecksForPanchayatProperties.waterDistributor",
    "additionalChecksForPanchayatProperties.sewerProvision",
    "additionalChecksForPanchayatProperties.sewerLineConnectedToMainSewer",
    "additionalChecksForPanchayatProperties.anyDemolitionThreatInFutureDevelopment",
    "additionalChecksForPanchayatProperties.ifAnyOtherVisitObservations",
    "additionalChecksForPanchayatProperties.remarks"
  ];

  // Extract from interactive elements (text inputs, selects, etc.)
  for (const element of allInteractive) {
    if (element.type === 'file') continue;

    let val = "";
    if (element.type === 'checkbox') {
      val = element.checked ? "YES" : "NO";
    } else if (element.type === 'radio') {
      if (!element.checked) continue;
      val = element.value || getRadioLabelTextLocal(element);
    } else {
      val = element.value || "";
    }

    if (val === null || val === undefined) continue;
    val = val.trim();
    if (!val) continue;

    let contextText = "";
    if (element.id) {
      const labels = document.querySelectorAll(`label[for="${element.id}"]`);
      labels.forEach(l => contextText += " " + l.innerText);
    }
    const parentLabel = element.closest('label');
    if (parentLabel) contextText += " " + parentLabel.innerText;
    if (element.parentElement) {
      contextText += " " + element.parentElement.innerText.slice(0, 200);
    }

    const cleanContext = contextText.toLowerCase().replace(/[^a-z0-9]/g, ' ');
    const contextWords = new Set(cleanContext.split(/\s+/).filter(Boolean).map(cleanWordLocal));

    let bestKey = null;
    let maxScore = 0;

    for (const key of schemaKeys) {
      const keyWords = getWordsLocal(key);
      let score = 0;
      let matchedWords = 0;

      const cleanKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
      const keyParts = key.split('.');
      const lastSegment = keyParts[keyParts.length - 1].toLowerCase().replace(/[^a-z0-9]/g, '');

      const id = (element.id || "").toLowerCase();
      const name = (element.name || "").toLowerCase();
      if (id === cleanKey || name === cleanKey) score += 50;
      else if (id === lastSegment || name === lastSegment) score += 40;
      else if (id.includes(lastSegment) || name.includes(lastSegment)) score += 15;

      keyWords.forEach(w => {
        if (contextWords.has(w)) { score += 5; matchedWords++; }
      });

      if (matchedWords === keyWords.length) score += 20;

      if (score > maxScore && score > 5) { maxScore = score; bestKey = key; }
    }

    if (bestKey) {
      extractedData[bestKey] = val;
    }
  }

  // ─── IMAGE EXTRACTION ─────────────────────────────────────────────────────────
  const images = {
    frontElevationImages: [],
    kitchenImages: [],
    selfieImages: [],
    otherImages: [],
    AttachDocuments: []
  };

  const allImgs = Array.from(document.querySelectorAll('img'));
  allImgs.forEach(img => {
    const src = img.src || "";
    if (!src || (!src.startsWith('data:') && !src.startsWith('http'))) return;
    const srcLower = src.toLowerCase();
    if (srcLower.includes('logo') || srcLower.includes('icon') || srcLower.includes('avatar') || srcLower.includes('spinner') || srcLower.includes('loader')) return;
    if (img.naturalWidth > 0 && img.naturalWidth < 32) return;
    if (img.naturalHeight > 0 && img.naturalHeight < 32) return;
    let parent = img.parentElement;
    let contextText = "";
    for (let i = 0; i < 5; i++) {
      if (!parent) break;
      contextText += " " + (parent.innerText || parent.textContent || "");
      parent = parent.parentElement;
    }
    const cleanCtx = contextText.toLowerCase();
    const imgObj = { url: src, name: 'image.png' };
    if (cleanCtx.includes('front') || cleanCtx.includes('elevation')) images.frontElevationImages.push(imgObj);
    else if (cleanCtx.includes('kitchen')) images.kitchenImages.push(imgObj);
    else if (cleanCtx.includes('selfie') || cleanCtx.includes('valuer photo')) images.selfieImages.push(imgObj);
    else if (cleanCtx.includes('document') || cleanCtx.includes('deed') || cleanCtx.includes('plan') || cleanCtx.includes('layout')) images.AttachDocuments.push(imgObj);
    else images.otherImages.push(imgObj);
  });

  const fileReadPromises = [];
  const fileInputs = allInteractive.filter(el => el.type === 'file');
  fileInputs.forEach(input => {
    if (input.files && input.files.length > 0) {
      let inputCtx = "";
      let parent = input.parentElement;
      for (let i = 0; i < 5; i++) {
        if (!parent) break;
        inputCtx += " " + (parent.innerText || parent.textContent || "");
        parent = parent.parentElement;
      }
      const cleanInputCtx = (inputCtx + " " + (input.id || "") + " " + (input.name || "")).toLowerCase();
      Array.from(input.files).forEach(file => {
        const promise = new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const base64 = e.target.result;
            const imgObj = { url: base64, base64: base64, name: file.name };
            if (cleanInputCtx.includes('front') || cleanInputCtx.includes('elevation')) images.frontElevationImages.push(imgObj);
            else if (cleanInputCtx.includes('kitchen')) images.kitchenImages.push(imgObj);
            else if (cleanInputCtx.includes('selfie') || cleanInputCtx.includes('valuer photo')) images.selfieImages.push(imgObj);
            else if (cleanInputCtx.includes('document') || cleanInputCtx.includes('deed') || cleanInputCtx.includes('plan') || cleanInputCtx.includes('layout')) images.AttachDocuments.push(imgObj);
            else images.otherImages.push(imgObj);
            resolve();
          };
          reader.onerror = () => resolve();
          reader.readAsDataURL(file);
        });
        fileReadPromises.push(promise);
      });
    }
  });

  await Promise.all(fileReadPromises);

  // ─── STATIC LABEL+VALUE SCRAPER ───────────────────────────────────────────────
  // This is the main extraction mechanism for Bajaj portal and similar read-only pages
  // where data is displayed as static text (not inside input fields).
  try {
    const staticMappings = [
      // applicantDetails
      { lp: /^\s*LAN\s*$/i, key: "applicantDetails.lan" },
      { lp: /^\s*Collateral\s*$/i, key: "applicantDetails.collateral" },
      { lp: /^\s*Customer\s*Name\s*$/i, key: "applicantDetails.customerName" },
      { lp: /^\s*Branch\s*$/i, key: "applicantDetails.branch" },
      { lp: /^\s*Request\s*Code\s*$/i, key: "applicantDetails.requestCode" },
      { lp: /^\s*Date\s*Of\s*Report\s*$/i, key: "applicantDetails.dateOfReport" },
      { lp: /^\s*Type\s*Of\s*Loan\s*$/i, key: "applicantDetails.typeOfLoan" },
      { lp: /^\s*Product\s*Type\s*$/i, key: "applicantDetails.productType" },
      { lp: /^\s*Contact\s*Name\s*$/i, key: "applicantDetails.contactName" },
      { lp: /^\s*Contact\s*No\s*$/i, key: "applicantDetails.contactNo" },
      { lp: /^\s*Developer\s*Name\s*$/i, key: "applicantDetails.developerName" },
      { lp: /^\s*Valuer\s*Name\s*$/i, key: "applicantDetails.valuerName" },
      { lp: /^\s*Person\s*Met\s*at\s*Site\s*$/i, key: "applicantDetails.personMetAtSite" },
      { lp: /^\s*Relationship\s*Met\s*at\s*Site\s*$/i, key: "applicantDetails.relationshipMetAtSite" },
      { lp: /^\s*Person\s*Met\s*at\s*Site\s*Contact\s*$/i, key: "applicantDetails.personMetAtSiteContact" },
      { lp: /^\s*Number\s*of\s*Tenants\s*$/i, key: "applicantDetails.numberOfTenants" },
      { lp: /^\s*Tenant\s*Vintage\s*(?:Years?)?\s*$/i, key: "applicantDetails.tenantVintageYears" },
      { lp: /^\s*Documents\s*Provided\s*$/i, key: "applicantDetails.documentsProvided" },
      // locationDetails
      { lp: /^\s*Pin\s*Code\s*$/i, key: "locationDetails.pinCode" },
      { lp: /^\s*Area\s*(?:\/\s*)?Locality\s*$/i, key: "locationDetails.areaLocality" },
      { lp: /^\s*City\s*$/i, key: "locationDetails.city" },
      { lp: /^\s*State\s*$/i, key: "locationDetails.state" },
      { lp: /^\s*Address\s*Line\s*1\s*$/i, key: "locationDetails.addressLine1" },
      { lp: /^\s*Address\s*Line\s*2\s*$/i, key: "locationDetails.addressLine2" },
      { lp: /^\s*Address\s*Line\s*3\s*$/i, key: "locationDetails.addressLine3" },
      { lp: /^\s*Legal\s*Address\s*Line\s*1\s*$/i, key: "locationDetails.legalAddressLine1" },
      { lp: /^\s*Legal\s*Address\s*Line\s*2\s*$/i, key: "locationDetails.legalAddressLine2" },
      { lp: /^\s*Legal\s*Address\s*Line\s*3\s*$/i, key: "locationDetails.legalAddressLine3" },
      { lp: /^\s*Lat(?:itude)?\s*(?:\/|,|&)?\s*Long(?:itude)?\s*$/i, key: "locationDetails.latitudeLongitude" },
      { lp: /^\s*Address\s*Matching\s*$/i, key: "locationDetails.addressMatching" },
      { lp: /^\s*No\.?\s*of\s*Floor(?:s)?\s*$/i, key: "locationDetails.noOfFloor" },
      { lp: /^\s*Property\s*Holding\s*Type\s*$/i, key: "locationDetails.propertyHoldingType" },
      { lp: /^\s*Marketability\s*$/i, key: "locationDetails.marketability" },
      { lp: /^\s*Property\s*Occupied\s*By\s*$/i, key: "locationDetails.propertyOccupiedBy" },
      { lp: /^\s*Property\s*Type\s*$/i, key: "locationDetails.propertyType" },
      { lp: /^\s*Occupancy\s*Status\s*$/i, key: "locationDetails.occupancyStatus" },
      { lp: /^\s*Development\s*of\s*Surrounding\s*Areas?\s*$/i, key: "locationDetails.developmentOfSurroundingAreas" },
      { lp: /^\s*Locality\s*Status\s*$/i, key: "locationDetails.localityStatus" },
      { lp: /^\s*Market\s*Rate\s*$/i, key: "locationDetails.marketRate" },
      { lp: /^\s*Property\s*Owners?\s*$/i, key: "locationDetails.propertyOwners" },
      { lp: /^\s*(?:%|Percent(?:age)?)\s*Owner\s*$/i, key: "locationDetails.percentOwner" },
      { lp: /^\s*Property\s*Identified\s*Through\s*$/i, key: "locationDetails.propertyIdentifiedThrough" },
      { lp: /^\s*Society\s*\/\s*Building\s*Maintenance\s*Status\s*$/i, key: "locationDetails.societyBuildingMaintenanceStatus" },
      { lp: /^\s*Access\s*Road\s*Condition\s*$/i, key: "locationDetails.accessRoadCondition" },
      { lp: /^\s*Property\s*Connectivity\s*$/i, key: "locationDetails.propertyConnectivity" },
      { lp: /^\s*Neighborhood\s*Type\s*$/i, key: "locationDetails.neighborhoodType" },
      { lp: /^\s*Property\s*Identified\s*$/i, key: "locationDetails.propertyIdentified" },
      { lp: /^\s*Owner\s*Name\s*As\s*Per\s*Legal\s*Document\s*$/i, key: "locationDetails.ownerNameAsPerLegalDocument" },
      { lp: /^\s*Remarks\s*for\s*Address\s*Mismatch\s*$/i, key: "locationDetails.remarksForAddressMismatch" },
      { lp: /^\s*Map\s*View\s*$/i, key: "locationDetails.mapView" },
      // boundariesOnSite
      { lp: /^\s*East\s*(?:as\s*per\s*Legal\s*Doc(?:ument)?s?)?\s*$/i, key: "boundariesOnSite.east_asPerLegalDocuments" },
      { lp: /^\s*West\s*(?:as\s*per\s*Legal\s*Doc(?:ument)?s?)?\s*$/i, key: "boundariesOnSite.west_asPerLegalDocuments" },
      { lp: /^\s*North\s*(?:as\s*per\s*Legal\s*Doc(?:ument)?s?)?\s*$/i, key: "boundariesOnSite.north_asPerLegalDocuments" },
      { lp: /^\s*South\s*(?:as\s*per\s*Legal\s*Doc(?:ument)?s?)?\s*$/i, key: "boundariesOnSite.south_asPerLegalDocuments" },
      { lp: /^\s*East\s*(?:as\s*per\s*Site\s*Visit)?\s*$/i, key: "boundariesOnSite.east_asPerSiteVisit" },
      { lp: /^\s*West\s*(?:as\s*per\s*Site\s*Visit)?\s*$/i, key: "boundariesOnSite.west_asPerSiteVisit" },
      { lp: /^\s*North\s*(?:as\s*per\s*Site\s*Visit)?\s*$/i, key: "boundariesOnSite.north_asPerSiteVisit" },
      { lp: /^\s*South\s*(?:as\s*per\s*Site\s*Visit)?\s*$/i, key: "boundariesOnSite.south_asPerSiteVisit" },
      { lp: /^\s*Boundary\s*Matching\s*$/i, key: "boundariesOnSite.boundaryMatching" },
      { lp: /^\s*Approach\s*Road\s*Size\s*$/i, key: "boundariesOnSite.approachRoadSize" },
      { lp: /^\s*Approach\s*Road\s*to\s*Property\s*$/i, key: "boundariesOnSite.approachRoadToProperty" },
      { lp: /^\s*Type\s*of\s*Road\s*$/i, key: "boundariesOnSite.typeOfRoad" },
      { lp: /^\s*Remarks\s*for\s*(?:Site\s*)?Boundaries?\s*Match\s*$/i, key: "boundariesOnSite.remarksForSiteBoundariesMatch" },
      // ndmaParameters
      { lp: /^\s*Nature\s*of\s*Building\s*(?:Wing)?\s*$/i, key: "ndmaParameters.natureOfBuildingWing" },
      { lp: /^\s*Plan\s*Aspect\s*Ratio\s*$/i, key: "ndmaParameters.planAspectRatio" },
      { lp: /^\s*Structure\s*Type\s*$/i, key: "ndmaParameters.structureType" },
      { lp: /^\s*Projected\s*Parts\s*Available\s*$/i, key: "ndmaParameters.projectedPartsAvailable" },
      { lp: /^\s*Type\s*of\s*Masonry\s*$/i, key: "ndmaParameters.typeOfMasonry" },
      { lp: /^\s*Expansion\s*Joints\s*Available\s*$/i, key: "ndmaParameters.expansionJointsAvailable" },
      { lp: /^\s*Roof\s*Type\s*$/i, key: "ndmaParameters.roofType" },
      { lp: /^\s*Steel\s*Grade\s*$/i, key: "ndmaParameters.steelGrade" },
      { lp: /^\s*Mortar\s*Type\s*$/i, key: "ndmaParameters.mortarType" },
      { lp: /^\s*Concrete\s*Grade\s*$/i, key: "ndmaParameters.concreteGrade" },
      { lp: /^\s*Environment(?:al)?\s*Exposure\s*Condition\s*$/i, key: "ndmaParameters.environmentExposureCondition" },
      { lp: /^\s*Footing\s*Type\s*$/i, key: "ndmaParameters.footingType" },
      { lp: /^\s*Seismic\s*Zone\s*$/i, key: "ndmaParameters.seismicZone" },
      { lp: /^\s*Soil\s*Liquefiable\s*$/i, key: "ndmaParameters.soilLiquefiable" },
      { lp: /^\s*Coastal\s*Regulatory\s*Zone\s*$/i, key: "ndmaParameters.coastalRegulatoryZone" },
      { lp: /^\s*Coastal\s*Regulatory\s*Zone\s*Category\s*$/i, key: "ndmaParameters.coastalRegulatoryZoneCategory" },
      { lp: /^\s*Soil\s*Slope\s*Vulnerable\s*to\s*Landslide\s*$/i, key: "ndmaParameters.soilSlopeVulnerableToLandslide" },
      { lp: /^\s*Flood\s*Prone\s*Area\s*$/i, key: "ndmaParameters.floodProneArea" },
      { lp: /^\s*Ground\s*Slope\s*(?:More\s*Than\s*20%?)?\s*$/i, key: "ndmaParameters.groundSlopeMoreThan20Percent" },
      { lp: /^\s*Fire\s*Exit\s*$/i, key: "ndmaParameters.fireExit" },
      // approvedPlanDetails
      { lp: /^\s*Sanctioned\s*Plan\s*Provided\s*$/i, key: "approvedPlanDetails.sanctionedPlanProvided" },
      { lp: /^\s*Layout\s*Plan\s*Details?\s*$/i, key: "approvedPlanDetails.layoutPlanDetails" },
      { lp: /^\s*Construction\s*Plan\s*Details?\s*$/i, key: "approvedPlanDetails.constructionPlanDetails" },
      { lp: /^\s*Date\s*of\s*Sanction\s*$/i, key: "approvedPlanDetails.dateOfSanction" },
      { lp: /^\s*Plan\s*Validity\s*$/i, key: "approvedPlanDetails.planValidity" },
      { lp: /^\s*Approving\s*Authority\s*$/i, key: "approvedPlanDetails.approvingAuthority" },
      { lp: /^\s*Property\s*Usages?\s*As\s*Per\s*Plan\s*$/i, key: "approvedPlanDetails.propertyUsagesAsPerPlan" },
      { lp: /^\s*Property\s*Usage\s*As\s*Per\s*Site\s*Visit\s*$/i, key: "approvedPlanDetails.propertyUsageAsPerSiteVisit" },
      { lp: /^\s*Number\s*of\s*Floors?\s*in\s*Building\s*$/i, key: "approvedPlanDetails.numberOfFloorInBuilding" },
      // technicalDetails
      { lp: /^\s*Construction\s*Quality\s*$/i, key: "technicalDetails.constructionQuality" },
      { lp: /^\s*Lift\s*Available\s*$/i, key: "technicalDetails.liftAvailable" },
      { lp: /^\s*No\.?\s*of\s*Lifts?\s*$/i, key: "technicalDetails.noOfLifts" },
      { lp: /^\s*Separate\s*(?:Independent\s*)?Access\s*$/i, key: "technicalDetails.separateIndependentAccess" },
      { lp: /^\s*Permissible\s*Area\s*As\s*Per\s*Plan\s*$/i, key: "technicalDetails.permissibleAreaAsPerPlan" },
      { lp: /^\s*Land\s*Component\s*(?:Sq\.?\s*Ft\.?)?\s*$/i, key: "technicalDetails.landComponentSqFt" },
      { lp: /^\s*Permissible\s*FSI\s*As\s*Per\s*(?:Bye)?\s*Laws?\s*$/i, key: "technicalDetails.permissibleFSIAsPerByelaws" },
      { lp: /^\s*Permissible\s*Construction\s*As\s*Per\s*FSI\s*$/i, key: "technicalDetails.permissibleConstructionAsPerFSI" },
      { lp: /^\s*Carpet\s*Area\s*As\s*Per\s*Document\s*$/i, key: "technicalDetails.carpetAreaAsPerDocument" },
      { lp: /^\s*Actual\s*Construction\s*(?:SBUA)?\s*$/i, key: "technicalDetails.actualConstructionSBUA" },
      { lp: /^\s*Risk\s*of\s*Demolition\s*$/i, key: "technicalDetails.riskOfDemolition" },
      { lp: /^\s*Status\s*of\s*Property\s*$/i, key: "technicalDetails.statusOfProperty" },
      { lp: /^\s*%?\s*Completed\s*$/i, key: "technicalDetails.percentCompleted" },
      { lp: /^\s*%?\s*Recommended\s*$/i, key: "technicalDetails.percentRecommended" },
      { lp: /^\s*Current\s*Age\s*(?:of\s*Property)?\s*(?:in\s*Years?)?\s*$/i, key: "technicalDetails.currentAgeOfPropertyInYear" },
      { lp: /^\s*Residual\s*Age\s*$/i, key: "technicalDetails.residualAge" },
      { lp: /^\s*Current\s*Occupant\s*of\s*Property\s*$/i, key: "technicalDetails.currentOccupantOfProperty" },
      // valuation
      { lp: /^\s*Unit\s*of\s*Measurement\s*$/i, key: "valuation.unitOfMeasurement" },
      { lp: /^\s*Construction\s*Area\s*Type\s*$/i, key: "valuation.constructionAreaType" },
      { lp: /^\s*Land\s*Area\s*$/i, key: "valuation.landArea" },
      { lp: /^\s*Land\s*Rate\s*$/i, key: "valuation.landRate" },
      { lp: /^\s*Land\s*Total\s*Value\s*$/i, key: "valuation.landTotalValue" },
      { lp: /^\s*Construction\s*Area\s*$/i, key: "valuation.constructionArea" },
      { lp: /^\s*Construction\s*Rate\s*$/i, key: "valuation.constructionRate" },
      { lp: /^\s*Construction\s*Total\s*Value\s*$/i, key: "valuation.constructionTotalValue" },
      { lp: /^\s*Depreciation\s*(?:%|Percent(?:age)?)?\s*$/i, key: "valuation.depreciationPercent" },
      { lp: /^\s*Depreciation\s*Value\s*$/i, key: "valuation.depreciationValue" },
      { lp: /^\s*Amenities\s*(?:\/\s*Other\s*Charges\s*(?:Lumpsum)?)?\s*$/i, key: "valuation.amenitiesOtherChargesLumpsum" },
      { lp: /^\s*Realizable?\s*Value\s*(?:As\s*On\s*Date)?\s*$/i, key: "valuation.realizableValueAsOnDate" },
      { lp: /^\s*Government\s*Value\s*$/i, key: "valuation.governmentValue" },
      { lp: /^\s*Distressed\s*(?:Force)?\s*Value\s*$/i, key: "valuation.distressedForceValue" },
      { lp: /^\s*Valuation\s*Done\s*Earlier\s*$/i, key: "valuation.valuationDoneEarlier" },
      { lp: /^\s*Valuation\s*Methodology\s*$/i, key: "valuation.valuationMethodology" },
      { lp: /^\s*In\s*Municipal\s*Demolition\s*List\s*$/i, key: "valuation.inMunicipalDemolitionList" },
      { lp: /^\s*(?:Is\s*)?Property\s*(?:in)?\s*Negative\s*Area\s*$/i, key: "valuation.isPropertyInNegativeArea" },
      { lp: /^\s*Municipal\s*Compliance\s*$/i, key: "valuation.municipalCompliance" },
      { lp: /^\s*Details\s*of\s*Legal\s*Documents?\s*$/i, key: "valuation.detailsOfLegalDocuments" },
      { lp: /^\s*Basic\s*Agreement\s*Value\s*$/i, key: "valuation.basicAgreementValue" },
      { lp: /^\s*Cost\s*of\s*Property\s*$/i, key: "valuation.costOfProperty" },
      { lp: /^\s*Electricity\s*(?:&|and|\/)\s*Water\s*Deposit\s*$/i, key: "valuation.electricityWaterDeposit" },
      { lp: /^\s*One\s*Time\s*Maintenance\s*Deposit\s*$/i, key: "valuation.oneTimeMaintenanceDeposit" },
      { lp: /^\s*Floor\s*Rise\s*(?:Amount|Amt)?\s*$/i, key: "valuation.floorRiseAmt" },
      { lp: /^\s*(?:%|Percent(?:age)?)\s*GST\s*$/i, key: "valuation.percentGST" },
      { lp: /^\s*Legal\s*Charges?\s*$/i, key: "valuation.legalCharges" },
      { lp: /^\s*Club\s*Membership\s*$/i, key: "valuation.clubMembership" },
      { lp: /^\s*LOD\s*Waiver\s*$/i, key: "valuation.lodWaiver" },
      // additionalChecks
      { lp: /^\s*Distance\s*from\s*City\s*Cent(?:re|er)\s*(?:in\s*Kms?)?\s*$/i, key: "additionalChecksForPanchayatProperties.distanceFromCityCentreInKms" },
      { lp: /^\s*Distance\s*from\s*Corporation\s*Limits?\s*(?:in\s*Kms?)?\s*$/i, key: "additionalChecksForPanchayatProperties.distanceFromCorporationLimitsInKms" },
      { lp: /^\s*Electricity\s*$/i, key: "additionalChecksForPanchayatProperties.electricity" },
      { lp: /^\s*Electricity\s*Distributor\s*$/i, key: "additionalChecksForPanchayatProperties.electricityDistributor" },
      { lp: /^\s*Water\s*Supply\s*$/i, key: "additionalChecksForPanchayatProperties.waterSupply" },
      { lp: /^\s*Water\s*Distributor\s*$/i, key: "additionalChecksForPanchayatProperties.waterDistributor" },
      { lp: /^\s*Sewer\s*(?:Line\s*)?Provision\s*$/i, key: "additionalChecksForPanchayatProperties.sewerProvision" },
      { lp: /^\s*Sewer\s*Line\s*Connected\s*(?:to\s*Main\s*Sewer)?\s*$/i, key: "additionalChecksForPanchayatProperties.sewerLineConnectedToMainSewer" },
      { lp: /^\s*Any\s*Demolition\s*Threat\s*(?:in\s*Future\s*Development)?\s*$/i, key: "additionalChecksForPanchayatProperties.anyDemolitionThreatInFutureDevelopment" },
      { lp: /^\s*(?:If\s*Any\s*Other\s*)?Visit\s*Observations?\s*$/i, key: "additionalChecksForPanchayatProperties.ifAnyOtherVisitObservations" },
      { lp: /^\s*Remarks\s*$/i, key: "additionalChecksForPanchayatProperties.remarks" }
    ];

    // Walk every visible leaf-text element for label+value matching
    const allTextEls = Array.from(document.querySelectorAll(
      'div, span, td, th, label, p, b, strong, h1, h2, h3, h4, h5, li'
    ));

    const leafTexts = [];
    allTextEls.forEach(el => {
      try {
        const text = (el.innerText || "").trim();
        if (!text || text.length > 80) return;
        if (el.children.length > 0) {
          const childHasSame = Array.from(el.children).some(c => (c.innerText || "").trim() === text);
          if (childHasSame) return;
        }
        leafTexts.push({ el, text });
      } catch(e) {}
    });

    leafTexts.forEach(({ el, text }) => {
      const match = staticMappings.find(m => m.lp.test(text));
      if (!match) return;
      if (extractedData[match.key]) return; // don't overwrite existing data

      let valueText = "";

      // Strategy 1: next element sibling
      let sibling = el.nextElementSibling;
      while (sibling) {
        const sibText = (sibling.innerText || "").trim();
        if (sibText && sibText.length < 200) {
          const isLabel = staticMappings.some(m => m.lp.test(sibText));
          if (!isLabel) { valueText = sibText; break; }
        }
        sibling = sibling.nextElementSibling;
      }

      // Strategy 2: next sibling of parent (table cell: <td>Label</td><td>Value</td>)
      if (!valueText && el.parentElement) {
        const parentSib = el.parentElement.nextElementSibling;
        if (parentSib) {
          const psText = (parentSib.innerText || "").trim();
          if (psText && psText.length < 200) {
            const isLabel = staticMappings.some(m => m.lp.test(psText));
            if (!isLabel) valueText = psText;
          }
        }
      }

      // Strategy 3: forward scan through leaf elements
      if (!valueText) {
        const idx = leafTexts.findIndex(lt => lt.el === el);
        if (idx !== -1) {
          for (let i = idx + 1; i < Math.min(idx + 12, leafTexts.length); i++) {
            const nextText = leafTexts[i].text;
            if (nextText && nextText.length < 200) {
              const isLabel = staticMappings.some(m => m.lp.test(nextText));
              const isAncestor = el.contains(leafTexts[i].el) || leafTexts[i].el.contains(el);
              if (!isLabel && !isAncestor) { valueText = nextText; break; }
            }
          }
        }
      }

      if (valueText) {
        valueText = valueText.replace(/\r?\n|\r/g, ' ').trim();
        extractedData[match.key] = valueText;
        console.log(`ℹ️ Scraped: "${text}" ➔ "${valueText}" (${match.key})`);
      }
    });

    // Strategy: table rows (tr > td/th)
    try {
      Array.from(document.querySelectorAll('tr')).forEach(row => {
        const cells = Array.from(row.querySelectorAll('td, th'));
        if (cells.length < 2) return;
        const labelText = (cells[0].innerText || "").trim();
        const valueText = (cells[1].innerText || "").trim();
        if (!labelText || !valueText || labelText.length > 80 || valueText.length > 300) return;
        const match = staticMappings.find(m => m.lp.test(labelText));
        if (match && !extractedData[match.key]) {
          const isLabel = staticMappings.some(m => m.lp.test(valueText));
          if (!isLabel) {
            extractedData[match.key] = valueText.replace(/\r?\n|\r/g, ' ').trim();
            console.log(`📋 Table: "${labelText}" ➔ "${valueText}" (${match.key})`);
          }
        }
      });
    } catch(e) { console.warn('Table scraping error:', e); }

    // Strategy: definition lists (dl/dt/dd)
    try {
      Array.from(document.querySelectorAll('dt')).forEach(dt => {
        const dd = dt.nextElementSibling;
        if (!dd || dd.tagName !== 'DD') return;
        const labelText = (dt.innerText || "").trim();
        const valueText = (dd.innerText || "").trim();
        if (!labelText || !valueText) return;
        const match = staticMappings.find(m => m.lp.test(labelText));
        if (match && !extractedData[match.key]) {
          extractedData[match.key] = valueText.replace(/\r?\n|\r/g, ' ').trim();
          console.log(`📋 DL: "${labelText}" ➔ "${valueText}" (${match.key})`);
        }
      });
    } catch(e) {}

  } catch (e) {
    console.warn("Static text scraping failed:", e);
  }

  return { fields: extractedData, images };
}

  // Start observer
  domObserver.observe(document.documentElement, { childList: true, subtree: true });
  observeShadowRootsRecursively(document);

  // Run immediately on script injection/reload
  checkAndAutofillFromSessionStorage();
})();
