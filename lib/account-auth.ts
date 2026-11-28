// Only Clerk test keys can enable accounts on the private pilot.
export function accountsConfigured() {
  return process.env.VERCEL_ENV !== 'production'
    && Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith('pk_test_'))
    && Boolean(process.env.CLERK_SECRET_KEY?.startsWith('sk_test_'));
}
