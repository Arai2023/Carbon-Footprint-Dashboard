import { useState } from 'react';
import { exportAsPNG, exportAsPDF } from '../utils/exportUtils';

interface Props {
  targetId: string;
  filename: string;
}

export default function ExportButton({ targetId, filename }: Props) {
  const [loading, setLoading] = useState<'png' | 'pdf' | null>(null);
  const [open, setOpen] = useState(false);

  const handle = async (type: 'png' | 'pdf') => {
    setLoading(type);
    setOpen(false);
    try {
      if (type === 'png') await exportAsPNG(targetId, filename);
      else await exportAsPDF(targetId, filename);
    } catch {
      alert('Ошибка при экспорте. Попробуйте ещё раз.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setOpen(o => !o)}
        disabled={!!loading}
        style={{
          padding: '8px 16px',
          borderRadius: 8,
          border: '1px solid #dce8f0',
          fontSize: 12,
          fontWeight: 600,
          background: loading ? '#f0f4f8' : '#fff',
          color: loading ? '#aac' : '#5aabb0',
          cursor: loading ? 'wait' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontFamily: 'Inter, system-ui, sans-serif',
          boxShadow: '0 2px 8px rgba(126,200,200,0.1)',
          transition: 'all 0.15s',
        }}
      >
        {loading ? `⏳ Экспорт...` : `⬇️ Экспорт`}
        {!loading && <span style={{ fontSize: 10, color: '#a0b8c8' }}>▼</span>}
      </button>

      {open && !loading && (
        <>
          {/* backdrop */}
          <div
            onClick={() => setOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 99 }}
          />
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            right: 0,
            background: '#fff',
            border: '1px solid #dce8f0',
            borderRadius: 10,
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
            zIndex: 100,
            overflow: 'hidden',
            minWidth: 160,
          }}>
            {[
              { type: 'png' as const, icon: '🖼️', label: 'Скачать PNG' },
              { type: 'pdf' as const, icon: '📄', label: 'Скачать PDF' },
            ].map(item => (
              <button
                key={item.type}
                onClick={() => handle(item.type)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  width: '100%',
                  padding: '10px 16px',
                  border: 'none',
                  background: 'transparent',
                  fontSize: 13,
                  color: '#1a2332',
                  cursor: 'pointer',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  transition: 'background 0.1s',
                  textAlign: 'left',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#f0f9f9')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
