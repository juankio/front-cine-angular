import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null;

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
