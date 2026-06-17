import { useState } from 'react';
import { Search, Plus, ChevronRight } from 'lucide-react';
import { useApps } from '../../hooks/useQueries';
import { useAppStore } from '../../store/useAppStore';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

export function AppSelector() {
  const [search, setSearch] = useState('');
  const { data: apps, isLoading, isError } = useApps();
  const { selectedAppId, setSelectedAppId } = useAppStore();

  const filtered = apps?.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  return (
    <div className="border-b border-border-subtle">
      <div className="px-3 pt-3 pb-2">
        <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
          Application
        </h2>
        <div className="flex gap-1.5">
          <div className="flex-1 relative">
            <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="pl-7"
            />
          </div>
          <Button variant="default" size="icon" title="New app">
            <Plus size={13} />
          </Button>
        </div>
      </div>

      <div className="max-h-52 overflow-y-auto">
        {isLoading && (
          <div className="px-3 py-2 space-y-1.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 bg-bg-hover rounded-lg animate-pulse" />
            ))}
          </div>
        )}
        {isError && (
          <p className="px-3 py-2 text-xs text-red-400">Failed to load apps</p>
        )}
        {filtered.map((app) => (
          <button
            key={app.id}
            onClick={() => setSelectedAppId(app.id)}
            className={cn(
              'w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors',
              selectedAppId === app.id
                ? 'bg-bg-hover text-text-primary'
                : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary'
            )}
          >
            <div className="w-6 h-6 rounded-md flex items-center justify-center text-xs shrink-0" style={{ background: app.color }}>
              {app.icon}
            </div>
            <span className="text-xs font-medium truncate flex-1">{app.name}</span>
            <ChevronRight size={12} className="text-text-muted shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}
