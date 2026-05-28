// Ce fichier gère la logique sur les données produits.
// Il ne touche pas au DOM (c'est le rôle de ui.js).

// Fusionne /products et /details en utilisant id comme clé commune.
// Résultat : un tableau d'objets complets avec toutes les infos.
//
// Exemple :
//   /products → { id: 1, name: "iPhone", price: 450000, image: "..." }
//   /details  → { id: 1, brand: "Apple", rating: 4.8, tag: "new", old_price: 0 }
//   Résultat  → { id: 1, name: "iPhone", price: 450000, image: "...", brand: "Apple", ... }
function mergeProductData(products, details) {
    return products.map(product => {
        // find() cherche le détail dont l'id correspond au produit
        const detail = details.find(d => d.id === product.id) || {};
        // Le spread operator fusionne les deux objets en un seul
        return { ...product, ...detail };
    });
}
