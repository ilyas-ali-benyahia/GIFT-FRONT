import axios from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (for adding auth tokens, etc.)
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor (for error handling)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      // You can redirect to login page here
    }
    
    // Enhanced error handling
    const errorMessage = error.response?.data?.message 
      || error.response?.data?.error 
      || error.message 
      || 'حدث خطأ غير متوقع / An unexpected error occurred';
    
    return Promise.reject(new Error(errorMessage));
  }
);

// Real API functions matching backend endpoints
export const createGiftRequest = (data) => {
  return api.post('/gift-requests', data);
};

export const getGiftRequests = (params = {}) => {
  // Clean up parameters to match backend expectations
  const cleanParams = {};
  if (params.search) cleanParams.search = params.search;
  if (params.status) cleanParams.status = params.status;
  if (params.occasion) cleanParams.occasion = params.occasion;
  if (params.page) cleanParams.page = params.page;
  if (params.limit) cleanParams.limit = params.limit;
  if (params.sort) cleanParams.sort = params.sort;
  
  return api.get('/gift-requests', { params: cleanParams });
};

export const getGiftRequest = (id) => {
  return api.get(`/gift-requests/${id}`);
};

export const updateGiftStatus = (id, statusData) => {
  return api.patch(`/gift-requests/${id}/status`, statusData);
};

export const updateGiftRequest = (id, data) => {
  return api.put(`/gift-requests/${id}`, data);
};

export const deleteGiftRequest = (id) => {
  return api.delete(`/gift-requests/${id}`);
};

export const getStats = () => {
  return api.get('/gift-requests/stats/overview');
};

// Export axios instance for direct use if needed
export { api };

// Utility functions with Arabic support
export const formatCurrency = (amount, locale = 'ar-DZ') => {
  try {
    if (locale === 'ar-DZ') {
      return new Intl.NumberFormat('ar-DZ', {
        style: 'currency',
        currency: 'DZD',
        currencyDisplay: 'symbol'
      }).format(amount);
    } else {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount);
    }
  } catch (error) {
    // Fallback formatting
    return `${amount} دج`;
  }
};

export const formatDate = (dateString, locale = 'ar-DZ') => {
  try {
    const date = new Date(dateString);
    if (locale === 'ar-DZ') {
      return new Intl.DateTimeFormat('ar-DZ', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date);
    } else {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(date);
    }
  } catch (error) {
    // Fallback formatting
    return new Date(dateString).toLocaleDateString();
  }
};

// Translation helpers
export const translations = {
  ar: {
    // Status translations
    pending: 'قيد الانتظار',
    reviewing: 'قيد المراجعة',
    'in-progress': 'قيد التنفيذ',
    ready: 'جاهز',
    delivered: 'تم التسليم',
    completed: 'مكتمل',
    cancelled: 'ملغي',
    
    // Occasion translations
    Birthday: 'عيد ميلاد',
    Wedding: 'زفاف',
    Anniversary: 'ذكرى سنوية',
    Graduation: 'تخرج',
    Holiday: 'عطلة',
    "Valentine's Day": 'عيد الحب',
    "Mother's Day": 'عيد الأم',
    "Father's Day": 'عيد الأب',
    Christmas: 'عيد الميلاد',
    Eid: 'العيد',
    Other: 'أخرى',
    
    // Relationship translations
    spouse: 'زوج/زوجة',
    parent: 'والد/والدة',
    child: 'طفل',
    sibling: 'شقيق/شقيقة',
    friend: 'صديق',
    colleague: 'زميل',
    relative: 'قريب',
    other: 'أخرى'
  },
  en: {
    // English values (same as keys)
    pending: 'Pending',
    reviewing: 'Reviewing',
    'in-progress': 'In Progress',
    ready: 'Ready',
    delivered: 'Delivered',
    completed: 'Completed',
    cancelled: 'Cancelled'
  }
};

export const translate = (key, locale = 'ar') => {
  return translations[locale]?.[key] || key;
};

export default api;