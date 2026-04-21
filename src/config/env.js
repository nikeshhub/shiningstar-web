const trimTrailingSlash = (value) => String(value || '').replace(/\/+$/, '');

export const API_BASE_URL = trimTrailingSlash(
  process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api',
);

export const ASSET_BASE_URL = trimTrailingSlash(
  process.env.REACT_APP_ASSET_BASE_URL
  || API_BASE_URL.replace(/\/api$/, '')
  || 'http://localhost:8000',
);

export const resolveAssetUrl = (url) => {
  if (!url) return url;
  if (/^https?:\/\//i.test(url)) return url;

  const normalizedPath = String(url).startsWith('/') ? url : `/${url}`;
  return `${ASSET_BASE_URL}${normalizedPath}`;
};
