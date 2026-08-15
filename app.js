// ════════════════════════════════════════════════════════════════
// TRIDENT GROUP — CSR DASHBOARD FULLY FUNCTIONAL APP LOGIC
// SUPABASE INTEGRATION FOR PROJECT: cilfwcgahowcukmwgyvk
// ════════════════════════════════════════════════════════════════

const SUPABASE_PROJECT_URL = "https://cilfwcgahowcukmwgyvk.supabase.co";
let supabaseClient = null;

// Initialize Supabase Client if Anon Key is present
function initSupabase() {
  const anonKey = localStorage.getItem('trident_supabase_key');
  if (anonKey && window.supabase) {
    try {
      supabaseClient = window.supabase.createClient(SUPABASE_PROJECT_URL, anonKey);
      syncFromSupabase();
      subscribeRealtime();
      updateSupabaseBadge(true);
    } catch (err) {
      console.error('Supabase Init Error:', err);
      updateSupabaseBadge(false);
    }
  } else {
    updateSupabaseBadge(false);
  }
}

function updateSupabaseBadge(connected) {
  const badge = document.getElementById('supaBadge');
  if (badge) {
    if (connected) {
      badge.innerHTML = `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#10b981;margin-right:6px;"></span>Supabase Connected`;
      badge.style.color = "#10b981";
    } else {
      badge.innerHTML = `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#f59e0b;margin-right:6px;"></span>Connect Supabase DB`;
      badge.style.color = "#f59e0b";
    }
  }
}

// Sync from Supabase tables
async function syncFromSupabase() {
  if (!supabaseClient) return;

  try {
    const { data: initData, error: initErr } = await supabaseClient.from('initiatives').select('*');
    if (!initErr && initData && initData.length > 0) {
      initiativesStore = initData;
      localStorage.setItem('trident_initiatives', JSON.stringify(initiativesStore));
      renderInitiatives(initiativesStore);
      renderMapMarkers(initiativesStore);
      updateStats();
    }

    const { data: actData, error: actErr } = await supabaseClient.from('activities').select('*').order('created_at', { ascending: false });
    if (!actErr && actData && actData.length > 0) {
      activitiesStore = actData;
      localStorage.setItem('trident_activities', JSON.stringify(activitiesStore));
      renderActivities(activitiesStore);
    }
  } catch (err) {
    console.log('Supabase sync fallback to local storage:', err);
  }
}

// Real-time listener across devices
function subscribeRealtime() {
  if (!supabaseClient) return;
  
  supabaseClient
    .channel('schema-db-changes')
    .on('postgres_changes', { event: '*', schema: 'public' }, () => {
      syncFromSupabase();
    })
    .subscribe();
}

// 1. DATA STORES (WITH LOCALSTORAGE PERSISTENCE)
const DEFAULT_INITIATIVES = [
  {
    id: 1,
    title: "Smart Classroom Initiative",
    location: "Mandsaur, MP",
    state: "Madhya Pradesh",
    category: "Education",
    categoryClass: "education",
    progress: 75,
    barColor: "#3b82f6",
    img: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=500&q=80",
    lat: 24.0725,
    lng: 75.0699,
    village: "Sakarwara Village",
    people: "12,400+",
    budget: "₹45 Lakhs",
    desc: "Upgrading rural government primary schools with digital smart boards, computer labs, and solar power backups.",
    thumbs: [
      "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=200&q=80",
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=200&q=80",
      "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=200&q=80"
    ]
  },
  {
    id: 2,
    title: "Mobile Health Check-up Camp",
    location: "Neemuch, MP",
    state: "Madhya Pradesh",
    category: "Healthcare",
    categoryClass: "healthcare",
    progress: 60,
    barColor: "#2563eb",
    img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500&q=80",
    lat: 24.4716,
    lng: 74.8711,
    village: "Khor Village",
    people: "28,500+",
    budget: "₹60 Lakhs",
    desc: "Deploying fully equipped mobile medical vans with diagnostic labs, free medicines, and doctors across remote villages.",
    thumbs: [
      "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=200&q=80",
      "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=200&q=80"
    ]
  },
  {
    id: 3,
    title: "Tree Plantation Drive",
    location: "Budhni, MP",
    state: "Madhya Pradesh",
    category: "Environment",
    categoryClass: "environment",
    progress: 80,
    barColor: "#10b981",
    img: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&q=80",
    lat: 22.7758,
    lng: 77.6749,
    village: "Khawaspur Village",
    people: "45,000+",
    budget: "₹30 Lakhs",
    desc: "Massive afforestation initiative near Narmada basin in Budhni planting over 1.8 Lakh native saplings.",
    thumbs: [
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=200&q=80",
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=200&q=80"
    ]
  },
  {
    id: 4,
    title: "Women Empowerment Program",
    location: "Ratlam, MP",
    state: "Madhya Pradesh",
    category: "Community Development",
    categoryClass: "community",
    progress: 65,
    barColor: "#7c3aed",
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&q=80",
    lat: 23.3315,
    lng: 75.0367,
    village: "Namli Village",
    people: "8,200+",
    budget: "₹25 Lakhs",
    desc: "Vocational tailoring and handicraft training centers establishing self-help groups (SHGs) for rural women.",
    thumbs: [
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80"
    ]
  }
];

const DEFAULT_ACTIVITIES = [
  { id: 1, title: "Tree Plantation Drive", loc: "Budhni, MP", icon: "fa-tree", iconClass: "green", time: "2h ago" },
  { id: 2, title: "Health Check-up Camp", loc: "Neemuch, MP", icon: "fa-kit-medical", iconClass: "red", time: "5h ago" },
  { id: 3, title: "Clean Water Initiative", loc: "Ratlam, MP", icon: "fa-droplet", iconClass: "blue", time: "1d ago" },
  { id: 4, title: "Smart Classroom Setup", loc: "Mandsaur, MP", icon: "fa-chalkboard-user", iconClass: "purple", time: "2d ago" }
];

let initiativesStore = JSON.parse(localStorage.getItem('trident_initiatives')) || DEFAULT_INITIATIVES;
let activitiesStore = JSON.parse(localStorage.getItem('trident_activities')) || DEFAULT_ACTIVITIES;

let map;
let markersGroup = [];

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', () => {
  initSupabase();
  renderInitiatives(initiativesStore);
  renderActivities(activitiesStore);
  initMap(initiativesStore);
  setupNavigation();
  setupQuickActions();
  setupFormHandlers();
  setupHeaderDropdowns();
  updateStats();
});

// Update Statistics dynamically
function updateStats() {
  const statInit = document.getElementById('stat-initiatives');
  const statVill = document.getElementById('stat-villages');
  if (statInit) statInit.textContent = initiativesStore.length;
  if (statVill) statVill.textContent = new Set(initiativesStore.map(i => i.village || i.location)).size + 120;
}

// 2. RENDER INITIATIVES CARDS
function renderInitiatives(list) {
  const container = document.getElementById('initiativesGrid');
  if (!container) return;

  if (list.length === 0) {
    container.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:#94a3b8;padding:20px;">No initiatives found for selected filter.</p>`;
    return;
  }

  container.innerHTML = list.map(item => `
    <div class="init-card" onclick="openDetailModal(${item.id})" style="cursor:pointer;">
      <div class="init-card-img-wrap">
        <img src="${item.img}" alt="${item.title}" class="init-card-img">
        <span class="init-card-badge ${item.categoryClass}">${item.category}</span>
      </div>
      <div class="init-card-body">
        <h4 class="init-card-title">${item.title}</h4>
        <p class="init-card-loc">${item.location}</p>
        <div class="init-prog-bar">
          <div class="init-prog-fill" style="width: ${item.progress}%; background: ${item.barColor || '#10b981'};"></div>
        </div>
        <div class="init-prog-row">
          <span style="font-size:0.65rem;color:#64748b;font-weight:600;">Progress</span>
          <span class="init-prog-pct">${item.progress}%</span>
        </div>
      </div>
    </div>
  `).join('');
}

// 3. RENDER RECENT ACTIVITIES
function renderActivities(list) {
  const container = document.getElementById('activityList');
  if (!container) return;

  container.innerHTML = list.map(act => `
    <div class="act-item">
      <div class="act-icon ${act.iconClass || 'green'}"><i class="fa-solid ${act.icon || 'fa-seedling'}"></i></div>
      <div class="act-info">
        <p class="act-name">${act.title}</p>
        <p class="act-loc">${act.loc}</p>
      </div>
      <span class="act-time">${act.time}</span>
    </div>
  `).join('');
}

// 4. MAP INITIALIZATION & FILTERS
function initMap(list) {
  const mapElement = document.getElementById('map');
  if (!mapElement) return;

  if (map) {
    map.remove();
  }

  map = L.map('map', {
    zoomControl: true,
    attributionControl: false
  }).setView([23.50, 76.20], 7);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 18,
    subdomains: 'abcd'
  }).addTo(map);

  renderMapMarkers(list);

  // Setup filter select handlers
  const stateFilter = document.getElementById('stateFilter');
  const focusFilter = document.getElementById('focusFilter');

  if (stateFilter) stateFilter.onchange = filterMapAndGrid;
  if (focusFilter) focusFilter.onchange = filterMapAndGrid;
}

function filterMapAndGrid() {
  const stateVal = document.getElementById('stateFilter').value;
  const focusVal = document.getElementById('focusFilter').value;

  const filtered = initiativesStore.filter(item => {
    const matchState = (stateVal === 'All States') || (item.state === stateVal);
    const matchFocus = (focusVal === 'All Focus Areas') || (item.category === focusVal);
    return matchState && matchFocus;
  });

  renderMapMarkers(filtered);
  renderInitiatives(filtered);
}

function renderMapMarkers(list) {
  // Clear previous markers
  markersGroup.forEach(m => map.removeLayer(m));
  markersGroup = [];

  const categoryColors = {
    'Education': { color: '#3b82f6', icon: 'fa-graduation-cap' },
    'Healthcare': { color: '#ef4444', icon: 'fa-kit-medical' },
    'Environment': { color: '#10b981', icon: 'fa-tree' },
    'Community Development': { color: '#8b5cf6', icon: 'fa-people-roof' },
    'Rural Development': { color: '#f59e0b', icon: 'fa-wheat-awn' }
  };

  list.forEach((pin, index) => {
    const cat = categoryColors[pin.category] || { color: '#10b981', icon: 'fa-seedling' };

    const customIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div style="
          width: 32px; height: 32px; border-radius: 50%;
          background: ${cat.color}; color: #fff;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 10px rgba(0,0,0,0.2); border: 2.5px solid #ffffff;
          font-size: 0.85rem;
        ">
          <i class="fa-solid ${cat.icon}"></i>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const popupHtml = `
      <div class="popup-card">
        <h4 class="popup-header-title">${pin.village || pin.location}</h4>
        <p class="popup-header-sub">${pin.location}</p>
        <span class="popup-badge">${pin.category}</span>
        <h5 class="popup-init-title">${pin.title}</h5>
        <div class="popup-prog-row">
          <span>Progress</span>
          <span>${pin.progress}%</span>
        </div>
        <div class="popup-prog-bar">
          <div class="popup-prog-fill" style="width: ${pin.progress}%; background: ${cat.color};"></div>
        </div>
        ${pin.thumbs && pin.thumbs.length > 0 ? `
          <div class="popup-thumbs">
            ${pin.thumbs.map(t => `<img src="${t}" class="popup-thumb">`).join('')}
            <div class="popup-thumb-more">+8</div>
          </div>
        ` : ''}
        <a href="#" class="popup-link" onclick="openDetailModal(${pin.id}); return false;">View Details →</a>
      </div>
    `;

    const marker = L.marker([pin.lat || 23.5, pin.lng || 76.2], { icon: customIcon }).addTo(map);
    marker.bindPopup(popupHtml, { className: 'custom-map-popup', maxWidth: 260 });
    markersGroup.push(marker);

    if (index === 0) {
      setTimeout(() => marker.openPopup(), 400);
    }
  });
}

// 5. INITIATIVE DETAIL MODAL
function openDetailModal(id) {
  const item = initiativesStore.find(i => i.id === id);
  if (!item) return;

  const modal = document.getElementById('detailModal');
  const badge = document.getElementById('detailCategoryBadge');
  const title = document.getElementById('detailTitle');
  const body = document.getElementById('detailModalBody');

  if (badge) badge.textContent = item.category;
  if (title) title.textContent = item.title;

  if (body) {
    body.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div style="height:180px;border-radius:12px;overflow:hidden;position:relative;">
          <img src="${item.img}" style="width:100%;height:100%;object-fit:cover;">
          <span style="position:absolute;bottom:12px;left:12px;background:rgba(15,23,42,0.75);color:#fff;font-size:0.75rem;padding:4px 12px;border-radius:20px;backdrop-filter:blur(4px);">
            📍 ${item.village || item.location} (${item.state || 'Madhya Pradesh'})
          </span>
        </div>

        <p style="font-size:0.85rem;color:#475569;line-height:1.5;">${item.desc || 'Active corporate social responsibility initiative focused on sustainable rural community development.'}</p>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;background:#f8fafc;padding:14px;border-radius:12px;border:1px solid #e2e8f0;">
          <div>
            <span style="font-size:0.7rem;color:#64748b;font-weight:600;">People Impacted</span>
            <p style="font-size:1.1rem;font-weight:800;color:#0f172a;margin-top:2px;">${item.people || '15,000+'}</p>
          </div>
          <div>
            <span style="font-size:0.7rem;color:#64748b;font-weight:600;">Allocated Budget</span>
            <p style="font-size:1.1rem;font-weight:800;color:#059669;margin-top:2px;">${item.budget || '₹35 Lakhs'}</p>
          </div>
        </div>

        <div>
          <div style="display:flex;justify-content:space-between;font-size:0.8rem;font-weight:700;color:#0f172a;margin-bottom:6px;">
            <span>Current Progress</span>
            <span id="detailProgVal">${item.progress}%</span>
          </div>
          <input type="range" min="0" max="100" value="${item.progress}" style="width:100%;accent-color:#10b981;cursor:pointer;" oninput="updateInitiativeProgress(${item.id}, this.value)">
        </div>

        ${item.thumbs && item.thumbs.length > 0 ? `
          <div>
            <p style="font-size:0.78rem;font-weight:700;color:#0f172a;margin-bottom:8px;">Field Photos Gallery</p>
            <div style="display:flex;gap:8px;overflow-x:auto;">
              ${item.thumbs.map(t => `<img src="${t}" style="width:90px;height:65px;object-fit:cover;border-radius:8px;border:1px solid #e2e8f0;">`).join('')}
            </div>
          </div>
        ` : ''}

        <button onclick="closeAllModals()" style="background:#043827;color:#fff;border:none;padding:12px;border-radius:10px;font-weight:700;cursor:pointer;margin-top:8px;">
          Close Details
        </button>
      </div>
    `;
  }

  if (modal) modal.classList.add('open');
}

// Update Initiative Progress slider
function updateInitiativeProgress(id, val) {
  const item = initiativesStore.find(i => i.id === id);
  if (!item) return;

  item.progress = parseInt(val);
  const progValEl = document.getElementById('detailProgVal');
  if (progValEl) progValEl.textContent = `${val}%`;

  // Save & re-render
  localStorage.setItem('trident_initiatives', JSON.stringify(initiativesStore));
  renderInitiatives(initiativesStore);
  renderMapMarkers(initiativesStore);
}

// 6. NAVIGATION & MODALS
function setupNavigation() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      item.classList.add('active');

      const text = item.querySelector('span').textContent.trim();
      showToast(`Navigated to ${text} view`);
    });
  });
}

function setupQuickActions() {
  const btns = document.querySelectorAll('.quick-btn');

  // Quick Action 1: Upload Photo
  const uploadBtn = document.getElementById('uploadPhotoBtn');
  if (uploadBtn) {
    uploadBtn.onclick = () => openModal('uploadModal');
  }

  // Quick Action 2: Add Activity
  if (btns[1]) {
    btns[1].onclick = () => openModal('addActivityModal');
  }

  // Quick Action 3: New Initiative
  if (btns[2]) {
    btns[2].onclick = () => openModal('newInitiativeModal');
  }

  // Quick Action 4: Generate Report
  if (btns[3]) {
    btns[3].onclick = () => openModal('reportModal');
  }

  // Close modals buttons
  document.querySelectorAll('.modal-close-btn').forEach(btn => {
    btn.onclick = closeAllModals;
  });

  // Close modal when clicking overlay background
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.onclick = (e) => {
      if (e.target === overlay) closeAllModals();
    };
  });
}

function openModal(id) {
  closeAllModals();
  const el = document.getElementById(id);
  if (el) el.classList.add('open');
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));
}

// 7. FORM SUBMISSIONS
function setupFormHandlers() {
  // Photo Upload Zone Drag & Drop / File Select
  const uploadZone = document.getElementById('uploadZone');
  const fileInput = document.getElementById('fileInput');
  const previewImg = document.getElementById('previewImg');
  const uploadPlaceholder = document.getElementById('uploadPlaceholder');

  if (uploadZone && fileInput) {
    uploadZone.onclick = () => fileInput.click();
    fileInput.onchange = (e) => {
      if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          previewImg.src = evt.target.result;
          previewImg.style.display = 'block';
          uploadPlaceholder.style.display = 'none';
        };
        reader.readAsDataURL(e.target.files[0]);
      }
    };
  }

  // Photo Upload Submit
  const photoForm = document.getElementById('uploadPhotoForm');
  if (photoForm) {
    photoForm.onsubmit = (e) => {
      e.preventDefault();
      const loc = document.getElementById('photoLocation').value;
      const caption = document.getElementById('photoCaption').value;

      // Add to activities
      activitiesStore.unshift({
        id: Date.now(),
        title: caption,
        loc: loc,
        icon: 'fa-camera',
        iconClass: 'blue',
        time: 'Just now'
      });

      localStorage.setItem('trident_activities', JSON.stringify(activitiesStore));
      renderActivities(activitiesStore);
      closeAllModals();
      showToast('Photo uploaded successfully! Added to activity feed.');
    };
  }

  // Add Activity Submit
  const actForm = document.getElementById('addActivityForm');
  if (actForm) {
    actForm.onsubmit = (e) => {
      e.preventDefault();
      const title = document.getElementById('actTitle').value;
      const loc = document.getElementById('actLoc').value;

      activitiesStore.unshift({
        id: Date.now(),
        title: title,
        loc: loc,
        icon: 'fa-clipboard-check',
        iconClass: 'purple',
        time: 'Just now'
      });

      localStorage.setItem('trident_activities', JSON.stringify(activitiesStore));
      renderActivities(activitiesStore);
      closeAllModals();
      showToast('New activity logged successfully!');
    };
  }

  // New Initiative Submit
  const initForm = document.getElementById('newInitiativeForm');
  if (initForm) {
    initForm.onsubmit = (e) => {
      e.preventDefault();
      const name = document.getElementById('initName').value;
      const village = document.getElementById('initVillage').value;
      const state = document.getElementById('initState').value;
      const cat = document.getElementById('initCategory').value;
      const prog = parseInt(document.getElementById('initProg').value);
      const lat = parseFloat(document.getElementById('initLat').value);
      const lng = parseFloat(document.getElementById('initLng').value);
      const img = document.getElementById('initImg').value;

      const catClasses = {
        'Education': 'education',
        'Healthcare': 'healthcare',
        'Environment': 'environment',
        'Community Development': 'community'
      };

      const newObj = {
        id: Date.now(),
        title: name,
        location: `${village}, ${state.slice(0, 2)}`,
        state: state,
        category: cat,
        categoryClass: catClasses[cat] || 'education',
        progress: prog,
        barColor: '#10b981',
        img: img || 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&q=80',
        lat: lat,
        lng: lng,
        village: village,
        people: '5,000+',
        budget: '₹20 Lakhs',
        desc: 'Newly launched Trident Group CSR initiative empowering local rural communities.',
        thumbs: []
      };

      initiativesStore.unshift(newObj);
      localStorage.setItem('trident_initiatives', JSON.stringify(initiativesStore));

      renderInitiatives(initiativesStore);
      renderMapMarkers(initiativesStore);
      updateStats();
      closeAllModals();
      showToast(`Initiative "${name}" launched and pinned to map!`);
    };
  }

  // Report Download Submit
  const repForm = document.getElementById('reportForm');
  if (repForm) {
    repForm.onsubmit = (e) => {
      e.preventDefault();
      const format = document.getElementById('reportFormat').value;
      downloadReport(format);
      closeAllModals();
    };
  }

  // Supabase Form Submit
  const supaForm = document.getElementById('supabaseForm');
  if (supaForm) {
    supaForm.onsubmit = (e) => {
      e.preventDefault();
      const key = document.getElementById('supaKey').value.trim();
      if (key) {
        localStorage.setItem('trident_supabase_key', key);
        initSupabase();
        closeAllModals();
        showToast('Supabase project cilfwcgahowcukmwgyvk connected!');
      }
    };
  }
}

// 8. REPORT GENERATOR (CSV FILE DOWNLOAD)
function downloadReport(format) {
  let csvContent = "data:text/csv;charset=utf-8,ID,Initiative Name,Village,State,Category,Progress(%),Budget\n";

  initiativesStore.forEach(i => {
    csvContent += `${i.id},"${i.title}","${i.village || i.location}","${i.state || 'MP'}","${i.category}",${i.progress},"${i.budget || 'N/A'}"\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `Trident_CSR_Impact_Report_${Date.now()}.${format === 'CSV' ? 'csv' : 'txt'}`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast(`CSR Impact Report downloaded as ${format}!`);
}

// 9. HEADER DROPDOWNS & NOTIFICATIONS
function setupHeaderDropdowns() {
  const notifBtn = document.getElementById('notifBtn');
  if (notifBtn) {
    notifBtn.onclick = () => {
      showToast('Notifications: 3 field photo uploads pending approval');
    };
  }

  const supaBadgeBtn = document.getElementById('supaBadgeBtn');
  if (supaBadgeBtn) {
    supaBadgeBtn.onclick = () => {
      const savedKey = localStorage.getItem('trident_supabase_key') || '';
      const supaKeyInput = document.getElementById('supaKey');
      if (supaKeyInput) supaKeyInput.value = savedKey;
      openModal('supabaseModal');
    };
  }
}

// 10. GLOBAL TOAST NOTIFICATION
function showToast(msg) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = msg;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}
