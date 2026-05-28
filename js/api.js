// Toutes les fonctions qui parlent à l'API TechZone sont ici.
// Un seul fichier = un seul endroit à modifier si l'URL change un jour.

const BASE_URL = 'https://my-json-server.typicode.com/visiontechft/techzone-api';

 // Fonction interne : évite de répéter fetch + .json() dans chaque fonction
async function fetchData(endpoint) {
    const response = await fetch(BASE_URL + endpoint);
    if (!response.ok) throw new Error(`Erreur API ${response.status} sur ${endpoint}`);
    return response.json();
}

// ─── Endpoints principaux ──────────────────────────────────────────────────

async function fetchProducts() {
    return fetchData('/products ');
}
async function fetchDetails() {
    return fetchData('/details');
}

async function fetchCategories() {
    return fetchData('/categories');
}

async function fetchPromotions() {
    return fetchData('/promotions');
}

async function fetchTestimonials() {
    return fetchData('/testimonials');
}

// ─── Endpoint avec paramètre de route : /products/5 ──────────────────────

async function fetchProductById(id) {
    return fetchData(`/products/${id}`);
}

// // ─── Filtres via paramètres d'URL ─────────────────────────────────────────

// // On demande à l'API uniquement les produits d'une catégorie.
// // Beaucoup plus rapide que tout récupérer et filtrer en JavaScript.
async function fetchProductsByCategory(categoryId) {
    return fetchData(`/products?category_id=${categoryId}`);
}

// // tag peut être "sale" ou "new"
async function fetchDetailsByTag(tag) {
    return fetchData(`/details?tag=${tag}`);
}

