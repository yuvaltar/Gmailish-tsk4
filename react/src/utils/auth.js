function getTokenFromCookies() {
  const match = document.cookie.match(/(?:^|;\s*)token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function isTokenValid() {
  try {
    const token = getTokenFromCookies();
    if (!token) return false;

    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp && payload.exp > now;
  } catch {
    return false;
  }
}

export function getUserIdFromToken() {
  try {
    const token = getTokenFromCookies();
    if (!token) return null;

    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId;
  } catch {
    return null;
  }
}
