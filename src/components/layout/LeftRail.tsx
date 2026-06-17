import { GitBranch, Database, Box, LayoutDashboard, Network, Server } from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { icon: GitBranch, label: 'GitHub' },
  { icon: Database, label: 'Database' },
  { icon: Server, label: 'Redis' },
  { icon: Box, label: 'Storage' },
  { icon: LayoutDashboard, label: 'Dashboard' },
  { icon: Network, label: 'Network' },
];

export function LeftRail() {
  return (
    <aside className="w-11 bg-bg-secondary border-r border-border-subtle flex flex-col items-center py-3 gap-2 shrink-0 z-10">
      {navItems.map(({ icon: Icon, label }, i) => (
        <button
          key={label}
          className={cn(
            'w-8 h-8 rounded-lg flex items-center justify-center transition-all',
            i === 0
              ? 'bg-bg-hover text-text-primary'
              : 'text-text-muted hover:text-text-secondary hover:bg-bg-hover'
          )}
          title={label}
        >
          <Icon size={16} />
        </button>
      ))}
    </aside>
  );
}
