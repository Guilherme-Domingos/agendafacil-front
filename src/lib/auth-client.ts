import { createAuthClient } from 'better-auth/react';
import { organizationClient, adminClient } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3333',
  plugins: [organizationClient(), adminClient()],
});


export const {
    signIn,
    signOut,
    signUp,
    useSession,
    
} = authClient;