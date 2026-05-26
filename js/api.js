// ============================================================
//  api.js — Toutes les communications avec l'API TechZone
//  Règle : ce fichier est le SEUL à faire des fetch()
// ============================================================

const BASE_URL = 'https://my-json-server.typicode.com/visiontechft/techzone-api';

/**
 * Récupère tous les produits fusionnés avec leurs détails
 */
async function getProduits() {
  const [products, details] = await Promise.all([
    fetch(`${BASE_URL}/products`).then(r => r.json()),
    fetch(`${BASE_URL}/details`).then(r => r.json())
  ]);

  // Fusion des deux tableaux via le champ id
  return products.map(produit => {
    const detail = details.find(d => d.id === produit.id) || {};
    return { ...produit, ...detail };
  });
}

/**
 * Récupère toutes les catégories
 */
async function getCategories() {
  const response = await fetch(`${BASE_URL}/categories`);
  return response.json();
}

/**
 * Récupère les promotions
 */
async function getPromotions() {
  const response = await fetch(`${BASE_URL}/promotions`);
  return response.json();
}

/**
 * Récupère les témoignages clients
 */
async function getTestimonials() {
  const response = await fetch(`${BASE_URL}/testimonials`);
  return response.json();
}

/**
 * Récupère un seul produit par son id
 */
async function getProduitById(id) {
  const response = await fetch(`${BASE_URL}/products/${id}`);
  return response.json();
}

/**
 * Récupère les produits en promotion (tag=sale)
 */
async function getProduitsEnSolde() {
  const [products, details] = await Promise.all([
    fetch(`${BASE_URL}/products`).then(r => r.json()),
    fetch(`${BASE_URL}/details?tag=sale`).then(r => r.json())
  ]);

  return details.map(detail => {
    const produit = products.find(p => p.id === detail.id) || {};
    return { ...produit, ...detail };
  });
}

/**
 * Récupère les nouveaux produits (tag=new)
 */
async function getNouveauProduits() {
  const [products, details] = await Promise.all([
    fetch(`${BASE_URL}/products`).then(r => r.json()),
    fetch(`${BASE_URL}/details?tag=new`).then(r => r.json())
  ]);

  return details.map(detail => {
    const produit = products.find(p => p.id === detail.id) || {};
    return { ...produit, ...detail };
  });
}
