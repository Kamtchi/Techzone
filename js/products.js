function creerCarteHTML(produit) {
  const { id, name, price, old_price, image, rating, tag, brand, category_id } = produit;

  let badgeHTML = '';
  if (tag === 'sale') {
    badgeHTML = `<span class="badge badge-sale">SOLDE</span>`;
  } else if (tag === 'new') {
    badgeHTML = `<span class="badge badge-new">NOUVEAU</span>`;
  }

  const oldPriceHTML = (old_price && old_price > 0)
    ? `<span class="price-old">${formaterPrix(old_price)}</span>`
    : '';

  let reductionHTML = '';
  if (old_price && old_price > 0 && price < old_price) {
    const pct = Math.round((1 - price / old_price) * 100);
    reductionHTML = `<span class="discount-badge">-${pct}%</span>`;
  }

  const etoilesHTML = creerEtoiles(rating || 0);
  const imgSrc = image || 'https://via.placeholder.com/300x200?text=Produit';

  return `
    <article class="product-card" data-id="${id}" data-category="${category_id}">
      <div class="product-img-wrap">
        ${badgeHTML}
        ${reductionHTML}
        <img src="${imgSrc}" alt="${name}" class="product-img" loading="lazy"
             onerror="this.src='https://via.placeholder.com/300x200?text=Image+indisponible'">
        <div class="product-overlay">
          <button class="btn-quick-view" onclick="ouvrirModal(${id})" title="Aperçu rapide">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
            </svg>
          </button>
          <button class="btn-fav" onclick="toggleFavori(this, ${id})" title="Ajouter aux favoris">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </div>
      </div>
      <div class="product-body">
        <p class="product-brand">${brand || ''}</p>
        <h3 class="product-name" title="${name}">${name}</h3>
        <div class="product-rating">
          ${etoilesHTML}
          <span class="rating-value">${(rating || 0).toFixed(1)}</span>
        </div>
        <div class="product-pricing">
          <span class="price-current">${formaterPrix(price)}</span>
          ${oldPriceHTML}
        </div>
        <button class="btn-add-cart" onclick="ajouterAuPanier(${id})">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          Ajouter au panier
        </button>
      </div>
    </article>
  `;
}

function afficherProduits(produits) {
  const container = document.querySelector('#products-grid');
  const countEl = document.querySelector('#products-count');

  if (!container) return;

  if (produits.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg width="64" height="64" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <p>Aucun produit trouvé</p>
        <button onclick="reinitialiserFiltres()">Voir tous les produits</button>
      </div>
    `;
    if (countEl) countEl.textContent = '0 produit';
    return;
  }

  container.innerHTML = produits.map(p => creerCarteHTML(p)).join('');
  if (countEl) countEl.textContent = `${produits.length} produit${produits.length > 1 ? 's' : ''}`;

  const cartes = container.querySelectorAll('.product-card');
  cartes.forEach((carte, i) => {
    carte.style.animationDelay = `${i * 60}ms`;
    carte.classList.add('card-enter');
  });
}

function creerEtoiles(rating) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      html += `<svg class="star star-full" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
    } else if (i - 0.5 <= rating) {
      html += `<svg class="star star-half" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
    } else {
      html += `<svg class="star star-empty" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
    }
  }
  return html;
}

function formaterPrix(montant) {
  return new Intl.NumberFormat('fr-FR').format(montant) + ' FCFA';
}

function afficherSkeleton(n = 8) {
  const container = document.querySelector('#products-grid');
  if (!container) return;
  container.innerHTML = Array(n).fill(`
    <div class="product-card skeleton-card">
      <div class="skeleton skeleton-img"></div>
      <div class="product-body">
        <div class="skeleton skeleton-line short"></div>
        <div class="skeleton skeleton-line"></div>
        <div class="skeleton skeleton-line medium"></div>
        <div class="skeleton skeleton-line short"></div>
      </div>
    </div>
  `).join('');
}

function ouvrirModal(idProduit) {
  const produit = window._tousLesProduits?.find(p => p.id === idProduit);
  if (!produit) return;

  const modal = document.querySelector('#modal');
  const modalContent = document.querySelector('#modal-content');

  modalContent.innerHTML = `
    <button class="modal-close" onclick="fermerModal()">✕</button>
    <div class="modal-grid">
      <div class="modal-img-wrap">
        <img src="${produit.image || 'https://via.placeholder.com/400x300'}" alt="${produit.name}">
        ${produit.tag === 'sale' ? '<span class="badge badge-sale">SOLDE</span>' : ''}
        ${produit.tag === 'new' ? '<span class="badge badge-new">NOUVEAU</span>' : ''}
      </div>
      <div class="modal-info">
        <p class="product-brand">${produit.brand || ''}</p>
        <h2>${produit.name}</h2>
        <div class="product-rating">${creerEtoiles(produit.rating || 0)}<span>${(produit.rating||0).toFixed(1)}/5</span></div>
        <div class="modal-pricing">
          <span class="price-current">${formaterPrix(produit.price)}</span>
          ${produit.old_price > 0 ? `<span class="price-old">${formaterPrix(produit.old_price)}</span>` : ''}
        </div>
        <p class="modal-category">Catégorie : <strong>${produit.category_id || '—'}</strong></p>
        <button class="btn-add-cart" onclick="ajouterAuPanier(${produit.id}); fermerModal()">
          Ajouter au panier
        </button>
      </div>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function fermerModal() {
  document.querySelector('#modal')?.classList.remove('active');
  document.body.style.overflow = '';
}

function toggleFavori(btn, id) {
  btn.classList.toggle('active');
  let favs = JSON.parse(localStorage.getItem('favs') || '[]');
  if (favs.includes(id)) {
    favs = favs.filter(f => f !== id);
    afficherNotification('Retiré des favoris');
  } else {
    favs.push(id);
    afficherNotification('Ajouté aux favoris ❤️');
  }
  localStorage.setItem('favs', JSON.stringify(favs));
}

function ajouterAuPanier(id) {
  let panier = JSON.parse(localStorage.getItem('panier') || '[]');
  panier.push(id);
  localStorage.setItem('panier', JSON.stringify(panier));
  const count = document.querySelector('#cart-count');
  if (count) count.textContent = panier.length;
  afficherNotification('Produit ajouté au panier 🛒');
}

function afficherNotification(msg) {
  const notif = document.createElement('div');
  notif.className = 'toast';
  notif.textContent = msg;
  document.body.appendChild(notif);
  setTimeout(() => notif.classList.add('show'), 10);
  setTimeout(() => {
    notif.classList.remove('show');
    setTimeout(() => notif.remove(), 300);
  }, 2500);
}
