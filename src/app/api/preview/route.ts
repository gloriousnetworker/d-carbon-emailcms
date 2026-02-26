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
  
  if (secret !== process.env.PREVIEW_SECRET) {
    return new Response('Invalid secret', { status: 401 });
  }
  
  if (!templateKey && !documentId) {
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
  } else if (documentId) {
    previewUrl.searchParams.set('documentId', documentId);
  }
  
  previewUrl.searchParams.set('status', status || 'draft');
  
  redirect(previewUrl.toString());
}