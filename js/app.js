// ============================================================
//  app.js — Chef d'orchestre : point d'entrée de l'application
//  Ce fichier connaît tout le monde. Les autres fichiers
//  ne se connaissent pas entre eux.
// ============================================================

// Variable globale : tous les produits chargés depuis l'API
let tousLesProduits = [];

/**
 * Fonction principale — lancée au démarrage de la page
 */
async function init() {
  setApiStatus('loading');
  afficherSkeleton(8);

  try {
    // Chargement en parallèle de toutes les données (Promise.all)
    const [produits, categories, promotions, temoignages] = await Promise.all([
      getProduits(),
      getCategories(),
      getPromotions(),
      getTestimonials()
    ]);

    // Stockage global pour les filtres sans rappel API
    tousLesProduits = produits;
    window._tousLesProduits = produits; // accessible par products.js (modal)

    // Mise à jour du statut API
    setApiStatus('ok');

    // Affichage de chaque section
    afficherCategories(categories);
    afficherPromotions(promotions);
    afficherProduits(tousLesProduits);
    afficherTemoignages(temoignages);

    // Initialisation des contrôles (recherche, tri)
    initControles();

    console.log(`✅ TechZone chargé : ${produits.length} produits, ${categories.length} catégories`);

  } catch (erreur) {
    setApiStatus('error');
    afficherErreur('Impossible de joindre l\'API TechZone. Vérifiez votre connexion et réessayez.');
    console.error('Erreur init() :', erreur);
  }
}

// ============================================================
//  Filtres et recherche (travaillent sur les données en mémoire)
// ============================================================

let categorieActive = 'all';

/**
 * Filtre les produits par catégorie
 */
function filtrerParCategorie(categoryId, btnClique) {
  categorieActive = categoryId;

  // Mise à jour de l'état actif des boutons
  document.querySelectorAll('.cat-btn, .chip').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.cat === categoryId);
  });

  let filtres = categoryId === 'all'
    ? tousLesProduits
    : tousLesProduits.filter(p => p.category_id === categoryId);

  // Si une recherche est en cours, on l'applique aussi
  const query = document.querySelector('#search')?.value.toLowerCase().trim();
  if (query) {
    filtres = filtres.filter(p =>
      p.name.toLowerCase().includes(query) ||
      (p.brand || '').toLowerCase().includes(query)
    );
  }

  afficherProduits(filtres);

  // Scroll vers les produits sur mobile
  document.querySelector('#products-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Réinitialise tous les filtres
 */
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

/**
 * Initialise les contrôles de recherche et de tri
 */
function initControles() {
  // --- Recherche en temps réel ---
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

  // --- Tri ---
  const selectTri = document.querySelector('#tri');
  if (selectTri) {
    selectTri.addEventListener('change', () => {
      let base = categorieActive === 'all'
        ? [...tousLesProduits]
        : tousLesProduits.filter(p => p.category_id === categorieActive);

      // Copie du tableau pour ne pas modifier l'original
      let tries = [...base];

      switch (selectTri.value) {
        case 'prix-asc':
          tries.sort((a, b) => a.price - b.price);
          break;
        case 'prix-desc':
          tries.sort((a, b) => b.price - a.price);
          break;
        case 'note':
          tries.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        case 'nom':
          tries.sort((a, b) => a.name.localeCompare(b.name));
          break;
        default:
          // ordre par défaut = ordre de l'API
          break;
      }

      afficherProduits(tries);
    });
  }

  // --- Fermer modal sur clic extérieur ---
  const modal = document.querySelector('#modal');
  if (modal) {
    modal.addEventListener('click', e => {
      if (e.target === modal) fermerModal();
    });
  }

  // --- Fermer modal avec Escape ---
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') fermerModal();
  });

  // --- Panier : recharge le compteur depuis localStorage ---
  const panier = JSON.parse(localStorage.getItem('panier') || '[]');
  const count = document.querySelector('#cart-count');
  if (count && panier.length) count.textContent = panier.length;
}

// ============================================================
//  Démarrage quand le DOM est prêt
// ============================================================
document.addEventListener('DOMContentLoaded', init);
