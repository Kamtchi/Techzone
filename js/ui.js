// Ce fichier s'occupe uniquement d'afficher les données dans le HTML.
// Il ne fait aucun appel API — il reçoit des données et les met dans le DOM.

function renderProducts(products) {
    const grid = document.getElementById('products-grid');

    if (products.length === 0) {
        grid.innerHTML = '<p class="empty">Aucun produit trouvé.</p>';
        return;
    }

    grid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            ${product.tag === 'new' ? '<span class="badge badge-new">Nouveau</span>' : ''}
            ${product.tag === 'sale' ? '<span class="badge badge-sale">Promo</span>' : ''}
            <h3>${product.name}</h3>
            <p class="brand">${product.brand || ''}</p>
            <div class="rating">${renderStars(product.rating)}</div>
            <div class="price">
                ${product.old_price > 0
                    ? `<span class="old-price">${product.old_price.toLocaleString('fr-FR')} FCFA</span>`
                    : ''
                }
                <span class="current-price">${product.price.toLocaleString('fr-FR')} FCFA</span>
            </div>
        </div>
    `).join('');
}

function renderStars(rating) {
    if (!rating) return '';
    const full = Math.floor(rating);
    return `<span>${'★'.repeat(full)}${'☆'.repeat(5 - full)} ${rating}/5</span>`;
}

// Les catégories sont affichées dans la sidebar à gauche.
// L'API retourne un champ "icon" (emoji) pour chaque catégorie — on l'utilise directement.
function renderCategories(categories) {
    const list = document.getElementById('categories-list');
    list.innerHTML = `
        <button class="category-btn active" data-category="">
            <span class="cat-icon">🏠</span>
            <span>Tous</span>
        </button>
        ${categories.map(cat => `
            <button class="category-btn" data-category="${cat.id}">
                <span class="cat-icon">${cat.icon}</span>
                <span>${cat.name}</span>
            </button>
        `).join('')}
    `;
}

function renderPromotions(promotions) {
    const list = document.getElementById('promotions-list');
    list.innerHTML = promotions.map(promo => `
        <div class="promo-card">
            ${promo.discount ? `<span class="discount">-${promo.discount}%</span>` : ''}
            <h3>${promo.title}</h3>
            <p>${promo.description || ''}</p>
        </div>
    `).join('');
}

function renderTestimonials(testimonials) {
    const list = document.getElementById('testimonials-list');
    list.innerHTML = testimonials.map(t => `
        <div class="testimonial-card">
            <p class="testimonial-text">"${t.comment || t.text || t.body || ''}"</p>
            <p class="testimonial-author">— ${t.name || t.author || 'Anonyme'}</p>
            ${t.rating ? `<div class="rating">${renderStars(t.rating)}</div>` : ''}
        </div>
    `).join('');
}

function renderLoading() {
    document.getElementById('products-grid').innerHTML =
        '<p class="loading">Chargement des produits...</p>';
}

function renderError(message) {
    document.getElementById('products-grid').innerHTML =
        `<p class="error">${message}</p>`;
}
