import React from 'react';
import { Home, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="text-8xl font-black text-white/5 mb-4">404</div>
        <h1 className="text-2xl font-bold text-white/80 mb-2">Página no encontrada</h1>
        <p className="text-sm text-white/30 mb-6">
          El recurso que buscas no existe o fue movido
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button variant="secondary" icon={<ArrowLeft size={16} />} onClick={() => navigate(-1)}>
            Volver
          </Button>
          <Button variant="primary" icon={<Home size={16} />} onClick={() => navigate('/')}>
            Inicio
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;