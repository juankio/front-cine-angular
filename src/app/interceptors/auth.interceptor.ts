import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Leemos de localStorage para evitar dependencias circulares con AuthStore
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null;

  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedReq);
  }

  return next(req);
};