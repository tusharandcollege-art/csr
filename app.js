// ════════════════════════════════════════════════════════════════
// TRIDENT GROUP — CSR DASHBOARD APP LOGIC
// ════════════════════════════════════════════════════════════════

// Ongoing Initiatives Data (Matches exact design)
const initiatives = [
  {
    id: 1,
    title: "Smart Classroom Initiative",
    location: "Mandsaur, MP",
    category: "Education",
    categoryClass: "education",
    progress: 75,
    barColor: "#3b82f6",
    img: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&q=80",
    lat: 24.0725,
    lng: 75.0699,
    village: "Sakarwara Village",
    thumbs: [
      "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=150&q=80",
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=150&q=80",
      "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=150&q=80"
    ]
  },
  {
    id: 2,
    title: "Mobile Health Check-up Camp",
    location: "Neemuch, MP",
    category: "Healthcare",
    categoryClass: "healthcare",
    progress: 60,
    barColor: "#2563eb",
    img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80",
    lat: 24.4716,
    lng: 74.8711,
    village: "Khor Village",
    thumbs: [
      "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=150&q=80",
      "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=150&q=80"
    ]
  },
  {
    id: 3,
    title: "Tree Plantation Drive",
    location: "Budhni, MP",
    category: "Environment",
    categoryClass: "environment",
    progress: 80,
    barColor: "#10b981",
    img: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&q=80",
    lat: 22.7758,
    lng: 77.6749,
    village: "Khawaspur Village",
    thumbs: [
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=150&q=80",
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=150&q=80"
    ]
  },
  {
    id: 4,
    title: "Women Empowerment Program",
    location: "Ratlam, MP",
    category: "Community Development",
    categoryClass: "community",
    progress: 65,
    barColor: "#7c3aed",
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
    lat: 23.3315,
    lng: 75.0367,
    village: "Namli Village",
    thumbs: [
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&q=80"
    ]
  }
];

let map;

document.addEventListener('DOMContentLoaded', () => {
  renderInitiatives();
  initMap();
  setupModalEvents();
});

// Render Ongoing Initiatives Grid Cards
function renderInitiatives() {
  const container = document.getElementById('initiativesGrid');
  if (!container) return;

  container.innerHTML = initiatives.map(item => `
    <div class="init-card">
      <div class="init-card-img-wrap">
        <img src="${item.img}" alt="${item.title}" class="init-card-img">
        <span class="init-card-badge ${item.categoryClass}">${item.category}</span>
      </div>
      <div class="init-card-body">
        <h4 class="init-card-title">${item.title}</h4>
        <p class="init-card-loc">${item.location}</p>
        <div class="init-prog-bar">
          <div class="init-prog-fill" style="width: ${item.progress}%; background: ${item.barColor};"></div>
        </div>
        <div class="init-prog-row">
          <span style="font-size:0.65rem;color:#64748b;font-weight:600;">Prog</span>
          <span class="init-prog-pct">${item.progress}%</span>
        </div>
      </div>
    </div>
  `).join('');
}

// Initialize Leaflet Map matching the screenshot
function initMap() {
  const mapElement = document.getElementById('map');
  if (!mapElement) return;

  // Center on MP region (Mandsaur / Budhni)
  map = L.map('map', {
    zoomControl: true,
    attributionControl: false
  }).setView([23.50, 76.20], 7);

  // CartoDB Positron Light Tiles
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 18,
    subdomains: 'abcd'
  }).addTo(map);

  // Add custom map pins
  const pins = [
    {
      lat: 24.0725, lng: 75.0699,
      color: '#10b981', icon: 'fa-graduation-cap',
      village: 'Sakarwara Village', state: 'Mandsaur, Madhya Pradesh',
      category: 'Education', title: 'Smart Class Room Initiative', progress: 75,
      thumbs: initiatives[0].thumbs, isOpen: true
    },
    {
      lat: 24.4716, lng: 74.8711,
      color: '#3b82f6', icon: 'fa-kit-medical',
      village: 'Khor Village', state: 'Neemuch, Madhya Pradesh',
      category: 'Healthcare', title: 'Mobile Health Check-up Camp', progress: 60,
      thumbs: initiatives[1].thumbs
    },
    {
      lat: 22.7758, lng: 77.6749,
      color: '#10b981', icon: 'fa-tree',
      village: 'Khawaspur Village', state: 'Budhni, Madhya Pradesh',
      category: 'Environment', title: 'Tree Plantation Drive', progress: 80,
      thumbs: initiatives[2].thumbs
    },
    {
      lat: 23.3315, lng: 75.0367,
      color: '#8b5cf6', icon: 'fa-people-roof',
      village: 'Namli Village', state: 'Ratlam, Madhya Pradesh',
      category: 'Community Development', title: 'Women Empowerment Program', progress: 65,
      thumbs: initiatives[3].thumbs
    },
    {
      lat: 22.9734, lng: 78.6569,
      color: '#f59e0b', icon: 'fa-wheat-awn',
      village: 'Hoshangabad Village', state: 'Hoshangabad, Madhya Pradesh',
      category: 'Rural Development', title: 'Agricultural Water Harvesting', progress: 90,
      thumbs: []
    }
  ];

  pins.forEach(pin => {
    const customIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div style="
          width: 32px; height: 32px; border-radius: 50%;
          background: ${pin.color}; color: #fff;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 10px rgba(0,0,0,0.2); border: 2.5px solid #ffffff;
          font-size: 0.85rem;
        ">
          <i class="fa-solid ${pin.icon}"></i>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const popupHtml = `
      <div class="popup-card">
        <h4 class="popup-header-title">${pin.village}</h4>
        <p class="popup-header-sub">${pin.state}</p>
        <span class="popup-badge">${pin.category}</span>
        <h5 class="popup-init-title">${pin.title}</h5>
        <div class="popup-prog-row">
          <span>Progress</span>
          <span>${pin.progress}%</span>
        </div>
        <div class="popup-prog-bar">
          <div class="popup-prog-fill" style="width: ${pin.progress}%;"></div>
        </div>
        ${pin.thumbs && pin.thumbs.length > 0 ? `
          <div class="popup-thumbs">
            ${pin.thumbs.map(t => `<img src="${t}" class="popup-thumb">`).join('')}
            <div class="popup-thumb-more">+8</div>
          </div>
        ` : ''}
        <a href="#" class="popup-link" onclick="showToast('Loading initiative details...'); return false;">View Details →</a>
      </div>
    `;

    const marker = L.marker([pin.lat, pin.lng], { icon: customIcon }).addTo(map);
    marker.bindPopup(popupHtml, { className: 'custom-map-popup', maxWidth: 260 });

    if (pin.isOpen) {
      setTimeout(() => marker.openPopup(), 400);
    }
  });
}

// Modal and Quick Actions Event Listeners
function setupModalEvents() {
  const uploadModal = document.getElementById('uploadModal');
  const uploadPhotoBtn = document.getElementById('uploadPhotoBtn');
  const closeUploadModal = document.getElementById('closeUploadModal');
  const uploadZone = document.getElementById('uploadZone');
  const fileInput = document.getElementById('fileInput');
  const previewImg = document.getElementById('previewImg');
  const uploadPlaceholder = document.getElementById('uploadPlaceholder');
  const submitUploadBtn = document.getElementById('submitUploadBtn');

  // Open Modal
  if (uploadPhotoBtn && uploadModal) {
    uploadPhotoBtn.addEventListener('click', () => {
      uploadModal.classList.add('open');
    });
  }

  // Close Modal
  if (closeUploadModal && uploadModal) {
    closeUploadModal.addEventListener('click', () => {
      uploadModal.classList.remove('open');
    });
  }

  // Upload Zone Click
  if (uploadZone && fileInput) {
    uploadZone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          previewImg.src = evt.target.result;
          previewImg.style.display = 'block';
          uploadPlaceholder.style.display = 'none';
        };
        reader.readAsDataURL(e.target.files[0]);
      }
    });
  }

  // Submit Upload
  if (submitUploadBtn) {
    submitUploadBtn.addEventListener('click', () => {
      uploadModal.classList.remove('open');
      showToast('Photo uploaded successfully! Added to Recent Activity.');
    });
  }

  // Sidebar navigation active state toggle
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      item.classList.add('active');
    });
  });
}

// Global Toast Message
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
