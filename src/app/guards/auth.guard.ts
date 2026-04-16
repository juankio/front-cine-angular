import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../state/auth.store';

export const authGuard: CanActivateFn = async (route, state) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  // If there's a token but no user, fetch the user
  if (authStore.token() && !authStore.user()) {
    await authStore.fetchUser();
  }

  if (!authStore.isAuthenticated()) {
    return router.parseUrl('/');
  }

  return true;
};