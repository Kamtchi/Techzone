// Point d'entrée de l'application.
// Coordonne les appels API, la fusion des données, et l'affichage.

// On garde les données brutes en mémoire pour éviter de rappeler l'API à chaque filtre
let allProducts = [];
let allDetails = [];

async function init() {
    renderLoading();

    try {
        // Promise.all lance les 5 appels EN PARALLÈLE — bien plus rapide qu'un par un.
        // Sans Promise.all, on attendrait chaque réponse avant de lancer la suivante.
        const [products, details, categories, promotions, testimonials] = await Promise.all([
            fetchProducts(),
            fetchDetails(),
            fetchCategories(),
            fetchPromotions(),
            fetchTestimonials()
        ]);

        // On sauvegarde pour pouvoir filtrer sans rappeler l'API
        allProducts = products;
        allDetails = details;

        // Affichage initial : tous les produits fusionnés
        renderCategories(categories);
        renderProducts(mergeProductData(products, details));
        renderPromotions(promotions);
        renderTestimonials(testimonials);

        // Mise en place des boutons de filtrage
        setupCategoryFilters();
        setupTagFilters();

    } catch (error) {
        renderError('Impossible de charger les produits. Vérifiez votre connexion.');
        console.error(error);
    }
}

// Filtre par catégorie — utilise l'endpoint /products?category_id=xxx
function setupCategoryFilters() {
    document.getElementById('categories-list').addEventListener('click', async (e) => {
        if (!e.target.matches('.category-btn')) return;

        // On met à jour le bouton actif visuellement
        document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        // Aussi réinitialiser les filtres par tag
        document.querySelectorAll('#tag-filters button').forEach(btn => btn.classList.remove('active'));
        document.querySelector('#tag-filters button[data-tag=""]').classList.add('active');

        const categoryId = e.target.dataset.category;
        renderLoading();

        try {
            if (categoryId === '') {
                // Bouton "Tous" : on utilise les données déjà en mémoire, sans rappel API
                renderProducts(mergeProductData(allProducts, allDetails));
            } else {
                // On demande à l'API seulement les produits de cette catégorie
                const filtered = await fetchProductsByCategory(categoryId);
                renderProducts(mergeProductData(filtered, allDetails));
            }
        } catch {
            renderError('Erreur lors du filtrage par catégorie.');
        }
    });
}

// Filtre par tag — utilise l'endpoint /details?tag=sale ou /details?tag=new
function setupTagFilters() {
    document.getElementById('tag-filters').addEventListener('click', async (e) => {
        if (!e.target.matches('[data-tag]')) return;

        document.querySelectorAll('#tag-filters button').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        // Réinitialiser le filtre catégorie
        document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector('.category-btn[data-category=""]').classList.add('active');

        const tag = e.target.dataset.tag;
        renderLoading();

        try {
            if (tag === '') {
                renderProducts(mergeProductData(allProducts, allDetails));
            } else {
                // On récupère les détails filtrés par tag, puis on retrouve les produits correspondants
                const taggedDetails = await fetchDetailsByTag(tag);
                const taggedIds = taggedDetails.map(d => d.id);
                const taggedProducts = allProducts.filter(p => taggedIds.includes(p.id));
                renderProducts(mergeProductData(taggedProducts, taggedDetails));
            }
        } catch {
            renderError('Erreur lors du filtrage par tag.');
        }
    });
}

// DOMContentLoaded garantit que le HTML est prêt avant d'essayer de remplir les éléments
document.addEventListener('DOMContentLoaded', init);
