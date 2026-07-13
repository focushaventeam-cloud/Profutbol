'use client';

import { useState, useEffect, useCallback } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Settings, Trophy, Moon, Sun, Bell, Volume2, Sparkles, Monitor, Smartphone, Globe, Database, Cloud, Github } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.4, ease: 'easeOut' as const },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.06 } },
};

const staggerItem = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

const SETTINGS_KEY = 'profutbol-settings';

interface AppSettings {
  darkTheme: boolean;
  notifications: boolean;
  sounds: boolean;
  animations: boolean;
}

function loadSettings(): AppSettings {
  if (typeof window === 'undefined') {
    return { darkTheme: true, notifications: false, sounds: true, animations: true };
  }
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return { darkTheme: true, notifications: false, sounds: true, animations: true };
}

function saveSettings(settings: AppSettings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {}
}

export default function SettingsView() {
  const [settings, setSettings] = useState<AppSettings>(loadSettings);

  // Apply dark theme to HTML element
  useEffect(() => {
    const html = document.documentElement;
    if (settings.darkTheme) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [settings.darkTheme]);

  // Apply animations toggle
  useEffect(() => {
    const html = document.documentElement;
    if (settings.animations) {
      html.style.setProperty('--motion-duration', '');
    } else {
      html.style.setProperty('--motion-duration', '0s');
    }
  }, [settings.animations]);

  const updateSetting = useCallback((key: keyof AppSettings) => {
    setSettings(prev => {
      const next = { ...prev, [key]: !prev[key] };
      saveSettings(next);
      return next;
    });
  }, []);

  const settingGroups = [
    {
      title: 'Apariencia',
      items: [
        {
          label: 'Tema Oscuro',
          description: 'Cambiar entre modo oscuro y claro',
          value: settings.darkTheme,
          onToggle: () => updateSetting('darkTheme'),
          icon: settings.darkTheme ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-400" />,
        },
        {
          label: 'Animaciones',
          description: 'Efectos de movimiento y transiciones',
          value: settings.animations,
          onToggle: () => updateSetting('animations'),
          icon: <Sparkles className="w-4 h-4 text-blue-400" />,
        },
      ],
    },
    {
      title: 'Notificaciones y Sonidos',
      items: [
        {
          label: 'Notificaciones',
          description: 'Alertas de goles y eventos en vivo',
          value: settings.notifications,
          onToggle: () => updateSetting('notifications'),
          icon: <Bell className="w-4 h-4 text-red-400" />,
        },
        {
          label: 'Sonidos',
          description: 'Efectos de sonido para eventos del partido',
          value: settings.sounds,
          onToggle: () => updateSetting('sounds'),
          icon: <Volume2 className="w-4 h-4 text-blue-400" />,
        },
      ],
    },
  ];

  return (
    <motion.div
      {...fadeUp}
      className="space-y-6 max-w-2xl mx-auto"
    >
      {/* Title */}
      <div className="flex items-center gap-3">
        <Settings className="w-6 h-6 text-blue-400" />
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Ajustes</h1>
      </div>

      {/* Settings Groups */}
      {settingGroups.map((group) => (
        <motion.div
          key={group.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-2"
        >
          <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider px-1">
            {group.title}
          </h2>
          <div className="glass-card p-1 space-y-0.5">
            {group.items.map((setting) => (
              <div
                key={setting.label}
                className="flex items-center justify-between p-3.5 rounded-xl hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/5 shrink-0">
                    {setting.icon}
                  </div>
                  <div>
                    <Label
                      className="text-sm font-medium text-white/85 cursor-pointer"
                      htmlFor={setting.label}
                    >
                      {setting.label}
                    </Label>
                    <p className="text-[11px] text-white/30 mt-0.5">{setting.description}</p>
                  </div>
                </div>
                <Switch
                  id={setting.label}
                  checked={setting.value}
                  onCheckedChange={setting.onToggle}
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Platform Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="space-y-2"
      >
        <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider px-1">
          Plataforma
        </h2>
        <div className="glass-card p-1">
          <div className="grid grid-cols-3 gap-0.5">
            <PlatformCard
              icon={<Monitor className="w-4 h-4 text-blue-400" />}
              label="Escritorio"
              status="Optimizado"
            />
            <PlatformCard
              icon={<Smartphone className="w-4 h-4 text-blue-400" />}
              label="Móvil"
              status="Responsive"
            />
            <PlatformCard
              icon={<Globe className="w-4 h-4 text-amber-400" />}
              label="Despliegue"
              status="Multi-cloud"
            />
          </div>
        </div>
      </motion.div>

      {/* Deployment Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="space-y-2"
      >
        <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider px-1">
          Infraestructura
        </h2>
        <div className="glass-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Github className="w-4 h-4 text-white/40" />
              <span className="text-sm text-white/60">GitHub Pages</span>
            </div>
            <Badge variant="outline" className="border-blue-500/20 bg-blue-500/10 text-blue-400 text-[10px]">
              Configurado
            </Badge>
          </div>
          <div className="divider-glow" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Cloud className="w-4 h-4 text-white/40" />
              <span className="text-sm text-white/60">Cloudflare Workers</span>
            </div>
            <Badge variant="outline" className="border-blue-500/20 bg-blue-500/10 text-blue-400 text-[10px]">
              Preparado
            </Badge>
          </div>
          <div className="divider-glow" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Database className="w-4 h-4 text-white/40" />
              <span className="text-sm text-white/60">Base de Datos</span>
            </div>
            <Badge variant="outline" className="border-blue-500/20 bg-blue-500/10 text-blue-400 text-[10px]">
              SQLite / D1
            </Badge>
          </div>
        </div>
      </motion.div>

      {/* About Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
      >
        <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider px-1 mb-2">
          Acerca de
        </h2>

        <div className="glass-card p-6 space-y-4 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-blue-500/[0.04] blur-[40px] pointer-events-none" />
          <p className="text-sm text-white/60 leading-relaxed">
            Profutbol es tu marcador de fútbol en tiempo real. Sigue todos los
            partidos de La Liga EA Sports con estadísticas detalladas,
            alineaciones, goleadores y mucho más. Actualizado al instante
            con las mejores herramientas de análisis.
          </p>

          <Separator className="bg-white/10" />

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/40 uppercase tracking-wider font-medium">
                Versión
              </span>
              <Badge
                variant="outline"
                className="border-white/10 bg-white/5 text-white/60 text-xs font-mono"
              >
                v3.0.0
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/40 uppercase tracking-wider font-medium">
                Stack
              </span>
              <Badge
                variant="outline"
                className="border-white/10 bg-white/5 text-white/60 text-xs font-mono"
              >
                Next.js 16
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-white/40 uppercase tracking-wider font-medium">
              Desarrollado con
            </span>
            <span className="text-sm font-semibold text-blue-400">
              Z.ai
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function PlatformCard({ icon, label, status }: { icon: React.ReactNode; label: string; status: string }) {
  return (
    <div className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/[0.02] transition-colors">
      {icon}
      <span className="text-xs font-medium text-white/60">{label}</span>
      <span className="text-[10px] text-blue-400/70 font-medium">{status}</span>
    </div>
  );
}