function afficherCategories(categories) {
  const sidebarList = document.querySelector('#sidebar-categories');
  const filterBar = document.querySelector('#filter-categories');

  if (sidebarList) {
    sidebarList.innerHTML = `
      <li>
        <button class="cat-btn active" data-cat="all" onclick="filtrerParCategorie('all', this)">
          <span class="cat-icon">🏪</span> Tous les produits
        </button>
      </li>
      ${categories.map(cat => `
        <li>
          <button class="cat-btn" data-cat="${cat.id}" onclick="filtrerParCategorie('${cat.id}', this)">
            <span class="cat-icon">${cat.icon || '📦'}</span> ${cat.name}
          </button>
        </li>
      `).join('')}
    `;
  }

  if (filterBar) {
    filterBar.innerHTML = `
      <button class="chip active" data-cat="all" onclick="filtrerParCategorie('all', this)">Tous</button>
      ${categories.map(cat => `
        <button class="chip" data-cat="${cat.id}" onclick="filtrerParCategorie('${cat.id}', this)">
          ${cat.icon || ''} ${cat.name}
        </button>
      `).join('')}
    `;
  }
}

function afficherPromotions(promotions) {
  const container = document.querySelector('#promotions-section');
  if (!container || !promotions.length) return;

  container.innerHTML = `
    <div class="section-header">
      <h2 class="section-title">🔥 Offres Spéciales</h2>
      <span class="section-subtitle">Durée limitée — profitez-en !</span>
    </div>
    <div class="promo-grid">
      ${promotions.map((promo, i) => `
        <div class="promo-card promo-${i + 1}">
          <div class="promo-content">
            <span class="promo-label">${promo.label || 'PROMOTION'}</span>
            <h3 class="promo-title">${promo.title || ''}</h3>
            <p class="promo-desc">${promo.description || ''}</p>
            <div class="promo-discount">${promo.discount || ''}</div>
            <button class="promo-cta" onclick="filtrerParCategorie('${promo.category_id || 'all'}', null)">
              Voir les offres →
            </button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function afficherTemoignages(temoignages) {
  const container = document.querySelector('#testimonials-section');
  if (!container || !temoignages.length) return;

  container.innerHTML = `
    <div class="section-header">
      <h2 class="section-title">💬 Avis Clients</h2>
      <span class="section-subtitle">Ce que nos clients disent de nous</span>
    </div>
    <div class="testimonials-grid">
      ${temoignages.map(t => `
        <div class="testimonial-card">
          <div class="testimonial-stars">
            ${'★'.repeat(t.rating || 5)}${'☆'.repeat(5 - (t.rating || 5))}
          </div>
          <p class="testimonial-text">"${t.comment || t.text || ''}"</p>
          <div class="testimonial-author">
            <div class="author-avatar">${(t.name || 'A')[0].toUpperCase()}</div>
            <div>
              <strong>${t.name || 'Anonyme'}</strong>
              <span>${t.date || ''}</span>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function afficherErreur(message) {
  const container = document.querySelector('#products-grid');
  if (!container) return;
  container.innerHTML = `
    <div class="error-state">
      <svg width="64" height="64" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <h3>Oops ! Une erreur est survenue</h3>
      <p>${message}</p>
      <button onclick="location.reload()">🔄 Réessayer</button>
    </div>
  `;
}

function setApiStatus(etat) {
  const dot = document.querySelector('#api-status');
  if (!dot) return;
  dot.className = 'api-dot ' + etat;
  const labels = { loading: 'Connexion…', ok: 'API connectée', error: 'API hors ligne' };
  dot.title = labels[etat] || '';
}

/* ── Dark / Light theme ── */
function initTheme() {
  const saved = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
}

function updateThemeIcon(theme) {
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
}

function setupThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeIcon(next);
  });
}
