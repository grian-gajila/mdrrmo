import { ApplicationStep1Input } from '@/lib/validation/schema';
import { UploadedDocs } from '@/types';

export type SubmitApplicationPayload = ApplicationStep1Input & UploadedDocs;

export async function submitVolunteerApplicationServices(
  payLoad: SubmitApplicationPayload,
) {
  const res = await fetch('/api/volunteer/application', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payLoad),
  });

  return res;
}

export async function getVolunteerApplication() {
  const res = await fetch('/api/volunteer/application');
  return res;
}
