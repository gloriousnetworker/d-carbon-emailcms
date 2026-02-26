// src/app/api/preview/route.ts
import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const secret = searchParams.get('secret');
  const templateKey = searchParams.get('templateKey');
  const status = searchParams.get('status');
  const documentId = searchParams.get('documentId');
  
  console.log('Preview API called with:', { secret, templateKey, status, documentId });
  
  if (secret !== process.env.PREVIEW_SECRET) {
    console.error('Invalid secret');
    return new Response('Invalid secret', { status: 401 });
  }
  
  if (!templateKey && !documentId) {
    console.error('Missing templateKey or documentId');
    return new Response('Missing template identifier', { status: 400 });
  }
  
  const draft = await draftMode();
  
  if (status === 'published') {
    draft.disable();
  } else {
    draft.enable();
  }
  
  const previewUrl = new URL('/preview', request.nextUrl.origin);
  
  if (templateKey) {
    previewUrl.searchParams.set('templateKey', templateKey);
  }
  
  previewUrl.searchParams.set('status', status || 'draft');
  
  console.log('Redirecting to:', previewUrl.toString());
  redirect(previewUrl.toString());
}