'use client';

import { useMatchStore } from '@/stores/matchStore';
import LiveScoreboard from '@/components/scoreboard/LiveScoreboard';
import MatchControlPanel from '@/components/scoreboard/MatchControlPanel';
import EventTimeline from '@/components/events/EventTimeline';
import StatsComparison from '@/components/stats/StatsComparison';
import PlayerRatings from '@/components/stats/PlayerRatings';
import LineupsComparison from '@/components/lineups/LineupsComparison';
import MatchCommentary from '@/components/commentary/MatchCommentary';
import HeadToHead from '@/components/matchdetail/HeadToHead';
import MomentumBar from '@/components/matchdetail/MomentumBar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageSquare, Waves, Swords, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.4, ease: 'easeOut' as const },
};

export default function MatchDetailView() {
  const goBack = useMatchStore((s) => s.goBack);
  const getSelectedMatch = useMatchStore((s) => s.getSelectedMatch);

  const match = getSelectedMatch();

  if (!match) {
    return (
      <motion.div
        {...fadeUp}
        className="flex flex-col items-center justify-center py-20 gap-4"
      >
        <p className="text-white/40 text-lg">Partido no encontrado</p>
        <Button
          onClick={goBack}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
      </motion.div>
    );
  }

  const homePlayerData = match.homeLineup.map((lp) => ({
    player: lp.player,
    isSubstitute: lp.isSubstitute,
  }));
  const awayPlayerData = match.awayLineup.map((lp) => ({
    player: lp.player,
    isSubstitute: lp.isSubstitute,
  }));

  return (
    <motion.div
      {...fadeUp}
      className="space-y-4"
    >
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          variant="ghost"
          onClick={goBack}
          className="text-white/60 hover:text-white hover:bg-white/10 -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
      </motion.div>

      {/* Live Scoreboard */}
      <LiveScoreboard match={match} />

      {/* Match Control Panel (admin) */}
      <MatchControlPanel match={match} />

      {/* Detail Tabs */}
      <Tabs defaultValue="eventos" className="w-full">
        <TabsList className="bg-white/5 border border-white/10 h-10 w-full flex overflow-x-auto hide-scrollbar">
          <TabsTrigger
            value="eventos"
            className="flex-1 text-white/60 data-[state=active]:bg-blue-500/15 data-[state=active]:text-blue-400 text-xs sm:text-sm whitespace-nowrap"
          >
            <MessageSquare className="w-3.5 h-3.5 mr-1 hidden sm:inline" />
            Eventos
          </TabsTrigger>
          <TabsTrigger
            value="comentario"
            className="flex-1 text-white/60 data-[state=active]:bg-blue-500/15 data-[state=active]:text-blue-400 text-xs sm:text-sm whitespace-nowrap"
          >
            <Waves className="w-3.5 h-3.5 mr-1 hidden sm:inline" />
            En Vivo
          </TabsTrigger>
          <TabsTrigger
            value="estadisticas"
            className="flex-1 text-white/60 data-[state=active]:bg-blue-500/15 data-[state=active]:text-blue-400 text-xs sm:text-sm whitespace-nowrap"
          >
            Estadísticas
          </TabsTrigger>
          <TabsTrigger
            value="alineaciones"
            className="flex-1 text-white/60 data-[state=active]:bg-blue-500/15 data-[state=active]:text-blue-400 text-xs sm:text-sm whitespace-nowrap"
          >
            Alineaciones
          </TabsTrigger>
          <TabsTrigger
            value="jugadores"
            className="flex-1 text-white/60 data-[state=active]:bg-blue-500/15 data-[state=active]:text-blue-400 text-xs sm:text-sm whitespace-nowrap"
          >
            Jugadores
          </TabsTrigger>
          <TabsTrigger
            value="historial"
            className="flex-1 text-white/60 data-[state=active]:bg-blue-500/15 data-[state=active]:text-blue-400 text-xs sm:text-sm whitespace-nowrap"
          >
            <Swords className="w-3.5 h-3.5 mr-1 hidden sm:inline" />
            H2H
          </TabsTrigger>
        </TabsList>

        <TabsContent value="eventos" className="mt-4">
          <EventTimeline
            events={match.events}
            homeTeamName={match.homeTeam.name}
            awayTeamName={match.awayTeam.name}
          />
        </TabsContent>

        <TabsContent value="comentario" className="mt-4">
          <MatchCommentary match={match} />
        </TabsContent>

        <TabsContent value="estadisticas" className="mt-4 space-y-4">
          <MomentumBar match={match} />
          <StatsComparison
            homeStats={match.homeStats}
            awayStats={match.awayStats}
            homeTeamName={match.homeTeam.name}
            awayTeamName={match.awayTeam.name}
          />
        </TabsContent>

        <TabsContent value="alineaciones" className="mt-4">
          <LineupsComparison match={match} />
        </TabsContent>

        <TabsContent value="jugadores" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {homePlayerData.length > 0 ? (
              <PlayerRatings
                players={homePlayerData}
                teamName={match.homeTeam.name}
                teamColor={match.homeTeam.primaryColor}
              />
            ) : (
              <EmptyRatingsCard teamName={match.homeTeam.name} />
            )}
            {awayPlayerData.length > 0 ? (
              <PlayerRatings
                players={awayPlayerData}
                teamName={match.awayTeam.name}
                teamColor={match.awayTeam.primaryColor}
              />
            ) : (
              <EmptyRatingsCard teamName={match.awayTeam.name} />
            )}
          </div>
        </TabsContent>

        <TabsContent value="historial" className="mt-4">
          <HeadToHead match={match} />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

function EmptyRatingsCard({ teamName }: { teamName: string }) {
  return (
    <div className="glass-card p-6 flex flex-col items-center justify-center gap-3 min-h-[200px]">
      <Users className="w-8 h-8 text-white/20" />
      <p className="text-sm text-white/40">
        Alineación no disponible para {teamName}
      </p>
    </div>
  );
}