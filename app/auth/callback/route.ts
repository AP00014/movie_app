import { createClient } from '@/app/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';
  const type = searchParams.get('type');

  if (code) {
    const supabase = await createClient();
    
    if (!supabase) {
      return NextResponse.redirect(`${origin}/auth/error?message=Configuration error`);
    }

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Determine redirect based on the type of confirmation
      if (type === 'signup' || type === 'email') {
        // Email confirmed successfully - redirect to confirmation success page
        return NextResponse.redirect(`${origin}/auth/confirmed`);
      }
      if (type === 'recovery') {
        // Password recovery - redirect to password reset page
        return NextResponse.redirect(`${origin}/auth/reset-password`);
      }
      // Default redirect
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/error?message=Could not verify email`);
}
