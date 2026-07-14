'use client';

import { useState } from 'react';
import { useScreens, ScreenListItem } from '@/hooks/useSocket';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose,
} from '@/components/ui/dialog';
import {
  Monitor, Plus, Trash2, QrCode, Wifi, WifiOff,
  Smartphone, Tv, Edit2, Check, X,
} from 'lucide-react';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

const STATUS_LABELS: Record<string, string> = {
  waiting: 'Sin Iniciar',
  live: 'En Vivo',
  halftime: 'Medio Tiempo',
  finished: 'Finalizado',
};

const STATUS_COLORS: Record<string, string> = {
  waiting: 'text-zinc-400',
  live: 'text-emerald-400',
  halftime: 'text-yellow-400',
  finished: 'text-red-400',
};

function ScreenCard({
  screen,
  onDelete,
  onRename,
  onOpenDisplay,
  onOpenRemote,
  onSelect,
  isSelected,
  connected,
}: {
  screen: ScreenListItem;
  onDelete: () => void;
  onRename: (name: string) => void;
  onOpenDisplay: () => void;
  onOpenRemote: () => void;
  onSelect: () => void;
  isSelected: boolean;
  connected: boolean;
}) {
  const [showQR, setShowQR] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(screen.name);

  const qrUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}control-remoto?screen=${screen.id}`
    : '';

  return (
    <>
      <Card
        className={`cursor-pointer transition-all duration-200 ${
          isSelected
            ? 'border-emerald-500/50 bg-emerald-500/5 shadow-lg shadow-emerald-500/10'
            : 'border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]'
        }`}
        onClick={onSelect}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isSelected ? 'bg-emerald-500/20' : 'bg-white/5'
                }`}
              >
                <Monitor className={`w-5 h-5 ${isSelected ? 'text-emerald-400' : 'text-zinc-400'}`} />
              </div>
              <div className="min-w-0 flex-1">
                {editing ? (
                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="h-7 text-sm bg-white/5 border-white/10"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') { onRename(editName); setEditing(false); }
                        if (e.key === 'Escape') setEditing(false);
                      }}
                    />
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { onRename(editName); setEditing(false); }}>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditing(false)}>
                      <X className="w-3.5 h-3.5 text-zinc-400" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-sm font-bold text-white truncate">{screen.name}</CardTitle>
                    <button
                      onClick={(e) => { e.stopPropagation(); setEditing(true); setEditName(screen.name); }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity hover:opacity-100"
                    >
                      <Edit2 className="w-3 h-3 text-zinc-500 hover:text-zinc-300" />
                    </button>
                  </div>
                )}
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${STATUS_COLORS[screen.status] || ''}`}>
                    {STATUS_LABELS[screen.status] || screen.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={(e) => { e.stopPropagation(); setShowQR(true); }}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                title="Código QR"
              >
                <QrCode className="w-4 h-4 text-zinc-400 hover:text-white" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onOpenDisplay(); }}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                title="Abrir Pantalla"
              >
                <Tv className="w-4 h-4 text-zinc-400 hover:text-emerald-400" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onOpenRemote(); }}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                title="Control Remoto"
              >
                <Smartphone className="w-4 h-4 text-zinc-400 hover:text-violet-400" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                title="Eliminar"
              >
                <Trash2 className="w-4 h-4 text-zinc-400 hover:text-red-400" />
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {/* Score display */}
          <div className="flex items-center justify-center gap-4 py-3">
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">{screen.homeTeam}</p>
              <span className="text-3xl font-black text-white tabular-nums">{screen.homeScore}</span>
            </div>
            <span className="text-xl font-light text-zinc-600">-</span>
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">{screen.awayTeam}</p>
              <span className="text-3xl font-black text-white tabular-nums">{screen.awayScore}</span>
            </div>
          </div>

          {/* Connection indicators */}
          <div className="flex items-center justify-center gap-4 pt-2 border-t border-white/5">
            <div className="flex items-center gap-1.5">
              <Tv className="w-3.5 h-3.5 text-zinc-500" />
              <span className="text-[11px] text-zinc-400">
                {screen.displays > 0 ? (
                  <span className="text-emerald-400 font-semibold">{screen.displays} pantalla{screen.displays > 1 ? 's' : ''}</span>
                ) : (
                  <span className="text-zinc-600">Sin pantalla</span>
                )}
              </span>
            </div>
            <div className="w-px h-3 bg-white/10" />
            <div className="flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-zinc-500" />
              <span className="text-[11px] text-zinc-400">
                {screen.remotes > 0 ? (
                  <span className="text-violet-400 font-semibold">{screen.remotes} remoto{screen.remotes > 1 ? 's' : ''}</span>
                ) : (
                  <span className="text-zinc-600">Sin remoto</span>
                )}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* QR Code Dialog */}
      <Dialog open={showQR} onOpenChange={setShowQR}>
        <DialogContent className="bg-zinc-900 border-white/10 text-white max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-emerald-400" />
              Control Remoto — {screen.name}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="bg-white rounded-2xl p-4">
              <QRCodeSVG
                value={qrUrl}
                size={200}
                level="M"
                includeMargin={false}
                bgColor="#ffffff"
                fgColor="#0c1220"
              />
            </div>
            <p className="text-xs text-zinc-400 text-center">
              Escanea este código con tu celular para acceder al control remoto de esta pantalla
            </p>
            <div className="w-full bg-white/5 rounded-lg p-3">
              <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">URL de Control Remoto</p>
              <p className="text-xs text-zinc-300 font-mono break-all">{qrUrl}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function ScreensTab({
  activeScreenId,
  onSelectScreen,
}: {
  activeScreenId: string | null;
  onSelectScreen: (screenId: string) => void;
}) {
  const { connected, screens, createScreen, deleteScreen, renameScreen } = useScreens();
  const [newName, setNewName] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  const handleCreate = () => {
    if (!newName.trim()) return;
    createScreen(newName.trim());
    setNewName('');
    setShowCreate(false);
  };

  const handleOpenDisplay = (screenId: string) => {
    const url = `marcador?screen=${screenId}`;
    window.open(url, '_blank');
  };

  const handleOpenRemote = (screenId: string) => {
    const url = `control-remoto?screen=${screenId}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {connected ? (
            <>
              <Wifi className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-emerald-400 font-medium">Servidor Conectado</span>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4 text-red-400" />
              <span className="text-sm text-red-400 font-medium">Desconectado</span>
            </>
          )}
        </div>

        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2">
              <Plus className="w-4 h-4" />
              Nueva Pantalla
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-white/10 text-white max-w-sm mx-auto">
            <DialogHeader>
              <DialogTitle>Crear Nueva Pantalla</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <label className="text-xs text-zinc-400 uppercase tracking-wider mb-1.5 block">
                  Nombre de la Pantalla
                </label>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ej: Cancha 1, Cancha 2..."
                  className="bg-white/5 border-white/10"
                  onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                  autoFocus
                />
              </div>
              <p className="text-xs text-zinc-500">
                Cada pantalla es un marcador independiente que se puede mostrar en un monitor/TV diferente.
              </p>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost" className="text-zinc-400">Cancelar</Button>
              </DialogClose>
              <Button onClick={handleCreate} className="bg-emerald-600 hover:bg-emerald-500 text-white">
                Crear
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Screens Grid */}
      {screens.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
            <Monitor className="w-8 h-8 text-zinc-600" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-400 mb-2">Sin Pantallas</h3>
          <p className="text-sm text-zinc-600 max-w-xs">
            Crea una nueva pantalla para empezar a controlar un marcador. Cada pantalla se puede mostrar en un monitor diferente.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {screens.map((screen) => (
            <ScreenCard
              key={screen.id}
              screen={screen}
              onDelete={() => deleteScreen(screen.id)}
              onRename={(name) => renameScreen(screen.id, name)}
              onOpenDisplay={() => handleOpenDisplay(screen.id)}
              onOpenRemote={() => handleOpenRemote(screen.id)}
              onSelect={() => onSelectScreen(screen.id)}
              isSelected={screen.id === activeScreenId}
              connected={connected}
            />
          ))}
        </div>
      )}

      {/* Summary */}
      {screens.length > 0 && (
        <div className="flex items-center justify-center gap-6 py-3 text-xs text-zinc-500">
          <span>{screens.length} pantalla{screens.length > 1 ? 's' : ''}</span>
          <span className="w-1 h-1 rounded-full bg-zinc-700" />
          <span>{screens.filter(s => s.displays > 0).length} conectada{screens.filter(s => s.displays > 0).length !== 1 ? 's' : ''}</span>
          <span className="w-1 h-1 rounded-full bg-zinc-700" />
          <span>{screens.filter(s => s.remotes > 0).length} con remoto</span>
          <span className="w-1 h-1 rounded-full bg-zinc-700" />
          <span>{screens.filter(s => s.status === 'live').length} en vivo</span>
        </div>
      )}
    </div>
  );
}