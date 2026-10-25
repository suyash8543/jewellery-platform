// Base API configuration (supports Vercel environment variable or local proxy)
const RAW_BASE = import.meta.env.VITE_API_BASE_URL ? import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '') : '';
const API_BASE = RAW_BASE ? `${RAW_BASE}/api` : '/api';

function getAuthHeader() {
  const token = localStorage.getItem('swarna_admin_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const res = await fetch(url, config);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(errorData.message || `Request failed with status ${res.status}`);
    }
    if (res.status === 204) return null;
    return await res.json();
  } catch (err) {
    console.error(`API Error on ${url}:`, err);
    throw err;
  }
}

export const api = {
  // Products
  async getProducts(params = {}) {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.featured) query.append('featured', 'true');
    if (params.diwali) query.append('diwali', 'true');
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request(`/products${queryString}`);
  },

  async getProduct(identifier) {
    return request(`/products/${identifier}`);
  },

  async createProduct(productData) {
    return request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  async updateProduct(id, productData) {
    return request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  async deleteProduct(id) {
    return request(`/products/${id}`, {
      method: 'DELETE',
    });
  },

  async clearDemoProducts() {
    return request('/products/clear-demo', {
      method: 'POST',
    });
  },

  // Gold & Bullion Rates
  async getGoldRates() {
    return request('/goldrates');
  },

  async updateGoldRates(rates) {
    return request('/goldrates', {
      method: 'PUT',
      body: JSON.stringify(rates),
    });
  },

  async calculateGoldValue(purity, weightGrams, makingChargePercent = 0) {
    return request('/goldrates/calculate', {
      method: 'POST',
      body: JSON.stringify({ purity, weightGrams, makingChargePercent }),
    });
  },

  // Custom Sample Upload & Bespoke Orders
  async submitCustomSample(sampleData) {
    return request('/customsamples', {
      method: 'POST',
      body: JSON.stringify(sampleData),
    });
  },

  async uploadSampleImage(file) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/customsamples/upload`, {
      method: 'POST',
      headers: {
        ...getAuthHeader(),
      },
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Image upload failed' }));
      throw new Error(err.message || 'Image upload failed');
    }
    return await res.json();
  },

  async getCustomSamples(status) {
    const q = status ? `?status=${status}` : '';
    return request(`/customsamples${q}`);
  },

  async updateSampleStatus(id, status, adminNotes) {
    return request(`/customsamples/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, adminNotes }),
    });
  },

  // Settings & Campaigns
  async getSettings() {
    return request('/settings');
  },

  async updateSettings(settings) {
    return request('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  },

  // Enquiries
  async submitEnquiry(enquiry) {
    return request('/enquiries', {
      method: 'POST',
      body: JSON.stringify(enquiry),
    });
  },

  async getEnquiries(status) {
    const q = status ? `?status=${status}` : '';
    return request(`/enquiries${q}`);
  },

  async updateEnquiryStatus(id, status) {
    return request(`/enquiries/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(status),
    });
  },

  // Admin Auth
  async login(username, password) {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },
};
