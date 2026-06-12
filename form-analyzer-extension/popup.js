let allFields = [];
let currentFilter = 'all';
let isMonitoring = false;
let monitorLogs = [];
let unreadMonitorLogsCount = 0;

document.addEventListener('DOMContentLoaded', async () => {
  // Query active tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) {
    updateStatus('No Active Tab', 'danger');
    showErrorState('Cannot scan empty or system tabs.');
    return;
  }

  // Setup tabs and filters
  setupTabs();
  setupFilters();

  // Bind actions
  document.getElementById('btnRescan').addEventListener('click', () => triggerScan(tab.id));
  document.getElementById('btnToggleMonitor').addEventListener('click', () => toggleMonitor(tab.id));
  document.getElementById('btnCopyJson').addEventListener('click', copyJsonToClipboard);
  document.getElementById('btnDownloadJson').addEventListener('click', downloadJsonFile);
  document.getElementById('btnExportTrackedUnique').addEventListener('click', downloadTrackedUniqueJson);
  document.getElementById('btnExportTrackedAll').addEventListener('click', downloadTrackedAllJson);

  // Trigger initial scan
  triggerScan(tab.id);

  // Start checking if monitor was already running
  checkMonitorStatus(tab.id);

  // Listen for real-time logs from content script
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'MONITOR_EVENT') {
      addMonitorLog(message.event);
    }
  });
});

// Setup tab switches
function setupTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(targetTab).classList.add('active');

      if (targetTab === 'tab-monitor') {
        updateMonitorBadge(0);
        unreadMonitorLogsCount = 0; // reset the unread count only
      }
    });
  });
}

// Setup visibility list filter buttons
function setupFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter');
      renderFields();
    });
  });
}

// Update Header status indicators
function updateStatus(text, pulseClass = 'active') {
  const pulse = document.getElementById('statusPulse');
  const label = document.getElementById('statusLabel');

  pulse.className = 'status-pulse ' + pulseClass;
  label.textContent = text;
}

// Show friendly error in list area if tab blocked
function showErrorState(message) {
  const container = document.getElementById('fieldsListContainer');
  container.innerHTML = `
    <div class="empty-state">
      <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="var(--color-danger)" stroke-width="2" style="margin-bottom: 10px;">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <p>${escapeHtml(message)}</p>
    </div>
  `;
  
  document.getElementById('statTotal').textContent = '0';
  document.getElementById('statVisible').textContent = '0';
  document.getElementById('statHidden').textContent = '0';
  document.getElementById('jsonPreviewCode').textContent = '// No scan details available.';
}

// Primary scan driver
async function triggerScan(tabId) {
  updateStatus('Scanning...', 'active');
  try {
    chrome.tabs.sendMessage(tabId, { action: 'scan' }, (response) => {
      if (chrome.runtime.lastError) {
        // Content script might not be injected yet, attempt dynamic injection
        injectAndScan(tabId);
      } else if (response && response.success) {
        handleScanResults(response.fields);
      } else {
        updateStatus('Scan Failed', 'danger');
        showErrorState('Failed to extract form fields from this page.');
      }
    });
  } catch (err) {
    updateStatus('Error', 'danger');
    showErrorState('An unexpected error occurred: ' + err.message);
  }
}

// Inject content.js on-demand and perform scan
function injectAndScan(tabId) {
  updateStatus('Injecting Agent...', 'active');
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    files: ['content.js']
  }, () => {
    if (chrome.runtime.lastError) {
      updateStatus('Blocked', 'warning');
      showErrorState('Cannot scan this page. Chrome extension security rules restrict accessing system settings (chrome://), webstores, or internal directories.');
      return;
    }
    // Scan after injecting script
    chrome.tabs.sendMessage(tabId, { action: 'scan' }, (response) => {
      if (response && response.success) {
        handleScanResults(response.fields);
      } else {
        updateStatus('Scan Failed', 'danger');
        showErrorState('Script injected but failed to scan DOM elements.');
      }
    });
  });
}

// Render values inside lists and JSON panels
function handleScanResults(fields) {
  allFields = fields;
  
  // Update indicators
  const total = fields.length;
  const visible = fields.filter(f => f.visible).length;
  const hidden = fields.filter(f => !f.visible).length;
  
  document.getElementById('statTotal').textContent = total;
  document.getElementById('statVisible').textContent = visible;
  document.getElementById('statHidden').textContent = hidden;

  if (isMonitoring) {
    updateStatus('Live Tracking...', 'warning');
  } else {
    updateStatus('Active', 'success');
  }

  // Populate layout
  renderFields();
  
  // Format clean schema JSON
  const schema = allFields.map(f => ({
    fieldIndex: f.index,
    label: f.label,
    dataType: f.type,
    placeholder: f.placeholder || null,
    status: f.visible ? 'Visible' : 'Hidden',
    required: f.required,
    disabled: f.disabled,
    html: {
      id: f.id || null,
      name: f.name || null,
      tag: f.tagName,
      selector: f.selector
    },
    ...(f.options ? { dropdownOptions: f.options } : {})
  }));

  document.getElementById('jsonPreviewCode').textContent = JSON.stringify(schema, null, 2);
}

// Escape tags for rendering
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Populate HTML representation of scanned fields
function renderFields() {
  const container = document.getElementById('fieldsListContainer');
  container.innerHTML = '';

  const filtered = allFields.filter(f => {
    if (currentFilter === 'visible') return f.visible;
    if (currentFilter === 'hidden') return !f.visible;
    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <p>No ${currentFilter === 'all' ? '' : currentFilter} fields detected on this web page.</p>
      </div>
    `;
    return;
  }

  filtered.forEach(f => {
    const card = document.createElement('div');
    card.className = 'field-card';

    const visibilityBadge = f.visible
      ? '<span class="badge-tag visible-tag">Visible</span>'
      : '<span class="badge-tag hidden-tag">Hidden</span>';

    const attributes = [];
    if (f.required) attributes.push('Required');
    if (f.disabled) attributes.push('Disabled');
    if (f.name) attributes.push(`name="${f.name}"`);
    if (f.id) attributes.push(`id="${f.id}"`);

    card.innerHTML = `
      <div class="field-card-header">
        <span class="field-label">${escapeHtml(f.label)}</span>
        <div class="field-badges">
          <span class="badge-tag type-tag">${escapeHtml(f.type)}</span>
          ${visibilityBadge}
        </div>
      </div>
      
      <div class="field-detail-row">
        <span class="detail-label">Placeholder:</span>
        <span class="detail-value">${f.placeholder ? `"${escapeHtml(f.placeholder)}"` : '<em>None</em>'}</span>
      </div>
      
      <div class="field-detail-row">
        <span class="detail-label">CSS Path:</span>
        <span class="detail-value code-font">${escapeHtml(f.selector)}</span>
      </div>
      
      <div class="field-detail-row">
        <span class="detail-label">Attributes:</span>
        <span class="detail-value">${attributes.length ? escapeHtml(attributes.join(', ')) : '<em>None</em>'}</span>
      </div>
      
      ${f.options ? `
      <div class="field-detail-row">
        <span class="detail-label">Options:</span>
        <span class="detail-value scrollbar-custom" style="max-height: 50px; overflow-y: auto; display: block; border-top: 1px solid rgba(255,255,255,0.03); padding-top: 3px;">
          ${f.options.map(opt => `<span style="display:inline-block; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.05); padding:1px 4px; border-radius:3px; margin: 1px 2px; font-size:10px;">${escapeHtml(opt.text)}: ${escapeHtml(opt.value)}</span>`).join('')}
        </span>
      </div>
      ` : ''}
    `;
    container.appendChild(card);
  });
}

// Read status of MutationObserver in content.js
function checkMonitorStatus(tabId) {
  chrome.tabs.sendMessage(tabId, { action: 'get_monitor_status' }, (response) => {
    if (response && response.success) {
      isMonitoring = response.isMonitoring;
      updateMonitorButtonState();

      if (response.events && response.events.length > 0) {
        document.getElementById('monitorLogsContainer').innerHTML = '';
        monitorLogs = []; // reset array to reload cleanly
        response.events.forEach(addMonitorLog);
      }
    }
  });
}

// Toggle Live Tracking starts / stops
function toggleMonitor(tabId) {
  const action = isMonitoring ? 'stop_monitor' : 'start_monitor';
  chrome.tabs.sendMessage(tabId, { action: action }, (response) => {
    if (response && response.success) {
      isMonitoring = response.isMonitoring;
      updateMonitorButtonState();

      if (isMonitoring) {
        // Clear previous monitor log interface
        document.getElementById('monitorLogsContainer').innerHTML = '';
        monitorLogs = [];
        unreadMonitorLogsCount = 0;
        updateMonitorBadge(0);
        document.getElementById('monitorActionsBar').style.display = 'none';
      }
    } else {
      updateStatus('Action Failed', 'danger');
    }
  });
}

// Adjust live monitor buttons based on current state
function updateMonitorButtonState() {
  const btn = document.getElementById('btnToggleMonitor');
  const textSpan = btn.querySelector('.btn-text');

  if (isMonitoring) {
    btn.className = 'toggle-monitor-btn btn-running';
    textSpan.textContent = 'Stop Tracker';
    updateStatus('Live Tracking...', 'warning');
  } else {
    btn.className = 'toggle-monitor-btn btn-stopped';
    textSpan.textContent = 'Start Tracker';
    updateStatus('Active', 'success');
  }
}

// Add logs during observing state
function addMonitorLog(event) {
  const container = document.getElementById('monitorLogsContainer');

  const emptyState = container.querySelector('.empty-state-logs');
  if (emptyState) {
    container.innerHTML = '';
  }

  const log = document.createElement('div');
  const actionClass = event.action.toLowerCase().includes('visible') ? 'visible-action' : 'hidden-action';
  log.className = `log-entry ${actionClass}`;

  log.innerHTML = `
    <div class="log-header">
      <span class="log-action-badge">${escapeHtml(event.action)}</span>
      <span class="log-time">${escapeHtml(event.time)}</span>
    </div>
    <div class="log-body">
      Field <span class="log-field-name">"${escapeHtml(event.label)}"</span>
      <span class="log-field-type">${escapeHtml(event.type)}</span>
      ${event.placeholder ? `(Placeholder: "${escapeHtml(event.placeholder)}")` : ''}
    </div>
    <div class="log-trigger">
      ${escapeHtml(event.trigger)}
    </div>
  `;

  container.insertBefore(log, container.firstChild);

  // Keep all logged events
  monitorLogs.push(event);
  
  // Show monitor actions bar
  if (monitorLogs.length > 0) {
    document.getElementById('monitorActionsBar').style.display = 'flex';
  }

  const activeTab = document.querySelector('.tab-btn.active').getAttribute('data-tab');
  if (activeTab !== 'tab-monitor') {
    unreadMonitorLogsCount++;
    updateMonitorBadge(unreadMonitorLogsCount);
  }
}

// Tab updates notification badges
function updateMonitorBadge(count) {
  const badge = document.getElementById('monitorBadge');
  if (count > 0) {
    badge.textContent = count;
    badge.style.display = 'inline-block';
  } else {
    badge.style.display = 'none';
  }
}

// Copy JSON block data
function copyJsonToClipboard() {
  const code = document.getElementById('jsonPreviewCode').textContent;
  navigator.clipboard.writeText(code).then(() => {
    const origBtnText = document.getElementById('btnCopyJson').innerHTML;
    document.getElementById('btnCopyJson').innerHTML = `
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--color-success)" stroke-width="2">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      Copied!
    `;
    setTimeout(() => {
      document.getElementById('btnCopyJson').innerHTML = origBtnText;
    }, 2000);
  });
}

// Download JSON files local schemas
function downloadJsonFile() {
  const code = document.getElementById('jsonPreviewCode').textContent;
  const blob = new Blob([code], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'form_schema_analysis.json';
  document.body.appendChild(a);
  a.click();
  
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Export all tracked transition events (includes duplicates)
function downloadTrackedAllJson() {
  if (monitorLogs.length === 0) return;
  const content = JSON.stringify(monitorLogs, null, 2);
  downloadJsonBlob(content, 'tracked_events_all.json');
}

// Export only unique tracked fields with their latest status and details
function downloadTrackedUniqueJson() {
  if (monitorLogs.length === 0) return;
  
  // Deduplicate by grouping by field label + type
  const unique = {};
  monitorLogs.forEach(event => {
    const key = `${event.label}_${event.type}`;
    unique[key] = {
      label: event.label,
      dataType: event.type,
      placeholder: event.placeholder || null,
      latestAction: event.action,
      latestTrigger: event.trigger,
      timestamp: event.time
    };
  });
  
  const content = JSON.stringify(Object.values(unique), null, 2);
  downloadJsonBlob(content, 'tracked_fields_unique.json');
}

// General blob downloader
function downloadJsonBlob(content, filename) {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

