// Utility functions for authentication and CSRF handling

export const getCsrfToken = (): string => {
  // Method 1: Try to get from meta tag
  const metaToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  if (metaToken) return metaToken;

  // Method 2: Try to get from hidden form field
  const formToken = (document.querySelector('input[name="csrf_token"]') as HTMLInputElement)?.value;
  if (formToken) return formToken;

  // Method 3: Generate a demo token for development
  return 'demo-csrf-token-' + Date.now();
};

export const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
  const defaultOptions: RequestInit = {
    credentials: 'include', // Include session cookies
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  return fetch(url, defaultOptions);
};

export const makeFormRequest = async (url: string, formData: FormData) => {
  // Add CSRF token to form data
  formData.append('csrf_token', getCsrfToken());

  return fetch(url, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });
};

export const isAuthenticated = (): boolean => {
  // In a real app, this would check the session/token validity
  return localStorage.getItem('demo_user') !== null;
};

export const getUserRole = (): string | null => {
  const user = localStorage.getItem('demo_user');
  if (user) {
    try {
      const parsedUser = JSON.parse(user);
      return parsedUser.role;
    } catch {
      return null;
    }
  }
  return null;
};

export const redirectAfterAuth = (role: string) => {
  // Simulate the redirect behavior described in the API docs
  if (role === 'business') {
    window.location.href = '/business/dashboard';
  } else {
    window.location.href = '/client/dashboard';
  }
};