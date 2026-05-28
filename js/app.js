let tousLesProduits = [];

async function init() {
  setApiStatus('loading');
  afficherSkeleton(8);

  try {
    const [produits, categories, promotions, temoignages] = await Promise.all([
      getProduits(),
      getCategories(),
      getPromotions(),
      getTestimonials()
    ]);

    tousLesProduits = produits;
    window._tousLesProduits = produits;

    setApiStatus('ok');

    afficherCategories(categories);
    afficherPromotions(promotions);
    afficherProduits(tousLesProduits);
    afficherTemoignages(temoignages);

    initControles();

    console.log(`✅ TechZone chargé : ${produits.length} produits, ${categories.length} catégories`);

  } catch (erreur) {
    setApiStatus('error');
    afficherErreur('Impossible de joindre l\'API TechZone. Vérifiez votre connexion et réessayez.');
    console.error('Erreur init() :', erreur);
  }
}

let categorieActive = 'all';

function filtrerParCategorie(categoryId, btnClique) {
  categorieActive = categoryId;

  document.querySelectorAll('.cat-btn, .chip').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.cat === categoryId);
  });

  let filtres = categoryId === 'all'
    ? tousLesProduits
    : tousLesProduits.filter(p => p.category_id === categoryId);

  const query = document.querySelector('#search')?.value.toLowerCase().trim();
  if (query) {
    filtres = filtres.filter(p =>
      p.name.toLowerCase().includes(query) ||
      (p.brand || '').toLowerCase().includes(query)
    );
  }

  afficherProduits(filtres);
  document.querySelector('#products-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function reinitialiserFiltres() {
  categorieActive = 'all';
  const search = document.querySelector('#search');
  if (search) search.value = '';
  const tri = document.querySelector('#tri');
  if (tri) tri.value = 'default';

  document.querySelectorAll('.cat-btn, .chip').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.cat === 'all');
  });

  afficherProduits(tousLesProduits);
}

function initControles() {
  const champRecherche = document.querySelector('#search');
  if (champRecherche) {
    champRecherche.addEventListener('input', () => {
      const query = champRecherche.value.toLowerCase().trim();

      let base = categorieActive === 'all'
        ? tousLesProduits
        : tousLesProduits.filter(p => p.category_id === categorieActive);

      const resultats = query
        ? base.filter(p =>
            p.name.toLowerCase().includes(query) ||
            (p.brand || '').toLowerCase().includes(query)
          )
        : base;

      afficherProduits(resultats);
    });
  }

  const selectTri = document.querySelector('#tri');
  if (selectTri) {
    selectTri.addEventListener('change', () => {
      let base = categorieActive === 'all'
        ? [...tousLesProduits]
        : tousLesProduits.filter(p => p.category_id === categorieActive);

      let tries = [...base];

      switch (selectTri.value) {
        case 'prix-asc':  tries.sort((a, b) => a.price - b.price); break;
        case 'prix-desc': tries.sort((a, b) => b.price - a.price); break;
        case 'note':      tries.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
        case 'nom':       tries.sort((a, b) => a.name.localeCompare(b.name)); break;
      }

      afficherProduits(tries);
    });
  }

  const modal = document.querySelector('#modal');
  if (modal) {
    modal.addEventListener('click', e => { if (e.target === modal) fermerModal(); });
  }

  document.addEventListener('keydown', e => { if (e.key === 'Escape') fermerModal(); });

  const panier = JSON.parse(localStorage.getItem('panier') || '[]');
  const count = document.querySelector('#cart-count');
  if (count && panier.length) count.textContent = panier.length;
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  setupThemeToggle();
  init();
});
