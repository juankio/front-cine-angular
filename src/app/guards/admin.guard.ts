import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../state/auth.store';

export const adminGuard: CanActivateFn = async (route, state) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  // If there's a token but no user, fetch the user (same check as Vue router before validating admin)
  if (authStore.token() && !authStore.user()) {
    await authStore.fetchUser();
  }

  if (!authStore.isAdmin()) {
    return router.parseUrl('/');
  }

  return true;
};