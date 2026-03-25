'use client';

import { useParams } from 'next/navigation';
import PresetEditor from '@/components/preset/PresetEditor';

export default function PresetEditPage() {
  const params = useParams();
  const presetId = Number(params.id);

  if (!presetId) {
    return <div>잘못된 접근입니다.</div>;
  }

  return <PresetEditor mode='edit' presetId={presetId} />;
}