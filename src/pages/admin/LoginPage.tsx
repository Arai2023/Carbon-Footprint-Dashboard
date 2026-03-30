import { useState } from 'react';
import { useAuth } from "../../context/AuthContext.tsx";

export default function LoginPage({ onSuccess }: { onSuccess: () => void }) {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!username || !password) { setError('Заполните все поля'); return; }
    setLoading(true);
    setTimeout(() => {
      const ok = login(username, password);
      if (ok) { onSuccess(); }
      else { setError('Неверный логин или пароль'); }
      setLoading(false);
    }, 400);
  };

  const inp = {
    width: '100%', padding: '10px 14px', fontSize: 14,
    border: '1px solid #dce8f0', borderRadius: 8,
    background: '#f8fbfc', color: '#1a2332',
    outline: 'none', boxSizing: 'border-box' as const,
  };

  return (
    <div style={{ minHeight: '100vh', background: '#eef2f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: '40px 36px', width: 360, boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 48, height: 48, background: '#1A7F4B', borderRadius: '50% 0 50% 0', margin: '0 auto 12px' }} />
          <div style={{ fontSize: 18, fontWeight: 600, color: '#1a2332' }}>Админ панель</div>
          <div style={{ fontSize: 12, color: '#7a9ab0', marginTop: 4 }}>Carbon Footprint Dashboard · КБТУ</div>
        </div>

        {/* Form */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, color: '#7a9ab0', marginBottom: 6 }}>Логин</div>
          <input
            style={inp}
            value={username}
            onChange={e => { setUsername(e.target.value); setError(''); }}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="admin"
            autoComplete="username"
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: '#7a9ab0', marginBottom: 6 }}>Пароль</div>
          <input
            style={inp}
            type="password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError(''); }}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </div>

        {error && (
          <div style={{ background: '#fdecea', color: '#c0392b', fontSize: 12, padding: '8px 12px', borderRadius: 8, marginBottom: 16 }}>
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%', padding: '11px', fontSize: 14, fontWeight: 600,
            background: loading ? '#a8d5bc' : '#1A7F4B', color: '#fff',
            border: 'none', borderRadius: 8, cursor: loading ? 'default' : 'pointer',
            transition: 'background 0.2s',
          }}
        >
          {loading ? 'Входим...' : 'Войти'}
        </button>

        <div style={{ textAlign: 'center', marginTop: 16, fontSize: 11, color: '#b0bec5' }}>
          Доступ только для авторизованных сотрудников
        </div>
      </div>
    </div>
  );
}
