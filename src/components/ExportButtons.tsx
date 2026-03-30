import { useState } from 'react';
import { exportAsPNG, exportAsPDF } from '../utils/exportUtils';

interface ExportButtonsProps {
  targetId: string;   // id элемента который нужно экспортировать
  filename: string;   // имя файла без расширения
}

export default function ExportButtons({ targetId, filename }: ExportButtonsProps) {
  const [loading, setLoading] = useState<'png' | 'pdf' | null>(null);

  const handle = async (type: 'png' | 'pdf') => {
    setLoading(type);
    try {
      if (type === 'png') await exportAsPNG(targetId, filename);
      else await exportAsPDF(targetId, filename);
    } finally {
      setLoading(null);
    }
  };

  const btn = (type: 'png' | 'pdf', label: string) => (
    <button
      onClick={() => handle(type)}
      disabled={loading !== null}
      style={{
        display: 'flex', alignItems: 'center', gap: 5,
        padding: '7px 14px', fontSize: 12, fontWeight: 500,
        border: '1px solid #ddd', borderRadius: 8,
        background: loading === type ? '#f0f0f0' : '#fff',
        color: loading === type ? '#999' : '#444',
        cursor: loading !== null ? 'default' : 'pointer',
        transition: 'all 0.15s',
      }}
    >
      {loading === type ? '⏳' : type === 'png' ? '🖼' : '📄'} {loading === type ? 'Сохраняем...' : label}
    </button>
  );

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {btn('png', 'PNG')}
      {btn('pdf', 'PDF')}
    </div>
  );
}
