import { HttpInterceptorFn } from '@angular/common/http';
import { getMemoryToken } from '../state/auth.store';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Leemos de memoria para evitar XSS y dependencias circulares
  const token = getMemoryToken();

  // Aseguramos que se envíen las cookies HttpOnly (si el backend las envía)
  let reqConfig: any = {
    withCredentials: true,
  };

  if (token) {
    reqConfig.setHeaders = {
      Authorization: `Bearer ${token}`,
    };
  }

  const clonedReq = req.clone(reqConfig);
  return next(clonedReq);
};
