import { Share2, Moon, Sun, PanelRight, Maximize2, AlertTriangle } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useApps } from '../../hooks/useQueries';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { cn } from '../../lib/utils';
import { useQueryClient } from '@tanstack/react-query';

interface TopBarProps {
  onFitView?: () => void;
}

export function TopBar({ onFitView }: TopBarProps) {
  const { selectedAppId, toggleMobilePanel, simulateError, toggleSimulateError } = useAppStore();
  const { data: apps } = useApps();
  const selectedApp = apps?.find((a) => a.id === selectedAppId);
  const queryClient = useQueryClient();

  const handleToggleError = () => {
    // Write to sessionStorage so MSW handler can read it
    sessionStorage.setItem('simulateError', String(!simulateError));
    toggleSimulateError();
    // Invalidate graph so it refetches immediately with new error state
    void queryClient.invalidateQueries({ queryKey: ['graph', selectedAppId] });
  };

  return (
    <header className="h-12 bg-bg-secondary border-b border-border-subtle flex items-center justify-between px-3 shrink-0 z-20">
      {/* Left */}
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 bg-bg-card rounded-md flex items-center justify-center border border-border-subtle">
          <span className="text-sm font-bold text-accent-purple">G</span>
        </div>

        {selectedApp && (
          <div className="flex items-center gap-2 bg-bg-card rounded-lg px-3 py-1.5 border border-border-subtle">
            <div
              className="w-5 h-5 rounded-md flex items-center justify-center text-xs"
              style={{ background: selectedApp.color }}
            >
              {selectedApp.icon}
            </div>
            <span className="text-sm font-medium text-text-primary">{selectedApp.name}</span>
            <span className="text-text-muted text-xs">▲ ···</span>
          </div>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-1.5">
        {/* Error simulation toggle */}
        <button
          onClick={handleToggleError}
          title="Toggle simulated API error"
          className={cn(
            'flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border transition-colors',
            simulateError
              ? 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20'
              : 'bg-bg-hover text-text-muted border-border-subtle hover:text-text-secondary'
          )}
        >
          <AlertTriangle size={11} />
          {simulateError ? (
            <Badge variant="down" className="text-xs px-1 py-0">Fail ON</Badge>
          ) : (
            <span>Fail</span>
          )}
        </button>

        <Button variant="ghost" size="icon" onClick={onFitView} title="Fit View">
          <Maximize2 size={14} />
        </Button>
        <Button variant="ghost" size="icon" title="Share">
          <Share2 size={14} />
        </Button>
        <Button variant="ghost" size="icon" title="Dark mode">
          <Moon size={14} />
        </Button>
        <Button variant="ghost" size="icon" title="Light mode">
          <Sun size={14} />
        </Button>

        {/* Mobile panel toggle */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMobilePanel}>
          <PanelRight size={14} />
        </Button>

        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center text-xs font-bold text-white">
          R
        </div>
      </div>
    </header>
  );
}
