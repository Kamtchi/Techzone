const BASE_URL = 'https://my-json-server.typicode.com/visiontechft/techzone-api';

async function getProduits() {
  const [products, details] = await Promise.all([
    fetch(`${BASE_URL}/products`).then(r => r.json()),
    fetch(`${BASE_URL}/details`).then(r => r.json())
  ]);
  return products.map(produit => {
    const detail = details.find(d => d.id === produit.id) || {};
    return { ...produit, ...detail };
  });
}

async function getCategories() {
  const response = await fetch(`${BASE_URL}/categories`);
  return response.json();
}

async function getPromotions() {
  const response = await fetch(`${BASE_URL}/promotions`);
  return response.json();
}

async function getTestimonials() {
  const response = await fetch(`${BASE_URL}/testimonials`);
  return response.json();
}

async function getProduitById(id) {
  const response = await fetch(`${BASE_URL}/products/${id}`);
  return response.json();
}

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
