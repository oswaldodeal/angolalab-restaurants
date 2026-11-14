import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse, type NextFetchEvent, type NextRequest } from 'next/server';
import { accountsConfigured } from './lib/account-auth';

const authenticate = clerkMiddleware();

export default function proxy(request: NextRequest, event: NextFetchEvent) {
  return accountsConfigured() ? authenticate(request, event) : NextResponse.next();
}

export const config = {
  matcher: ['/en/signin', '/en/signup', '/en/account', '/pt/entrar', '/pt/registar', '/pt/conta'],
};
