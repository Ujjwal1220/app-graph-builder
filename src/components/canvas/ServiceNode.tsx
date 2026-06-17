import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Settings } from 'lucide-react';
import type { ServiceNodeData } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';
import { Badge } from '../ui/badge';
import { cn } from '../../lib/utils';

const AwsLogo = () => (
  <div className="flex flex-col items-end opacity-80">
    <span className="text-[#ff9900] font-bold text-sm leading-none">aws</span>
    <div className="w-5 h-0.5 mt-0.5 rounded" style={{ background: '#ff9900' }} />
  </div>
);

export const ServiceNode = memo(({ data, selected }: NodeProps & { data: ServiceNodeData }) => {
  const cpuPct = data.cpuValue ?? 0;

  return (
    <div className={cn(
      'bg-bg-card rounded-xl border w-[310px] transition-all duration-150',
      selected
        ? 'border-accent-purple shadow-lg shadow-accent-purple/20'
        : 'border-border-subtle hover:border-border',
    )}>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      <Handle type="source" position={Position.Right} id="right" />
      <Handle type="target" position={Position.Left} id="left" />

      {/* Header */}
      <div className="flex items-center justify-between px-3 pt-3 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-bg-hover flex items-center justify-center text-base">{data.icon}</div>
          <span className="text-sm font-semibold text-text-primary">{data.label}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Badge variant="cost">{data.cost}</Badge>
          <button className="w-6 h-6 rounded-md flex items-center justify-center text-text-muted hover:text-text-secondary hover:bg-bg-hover transition-colors">
            <Settings size={13} />
          </button>
        </div>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-4 px-3 pb-1.5 text-center gap-1">
        {[
          { label: 'CPU', value: data.cpu },
          { label: 'Memory', value: data.memory },
          { label: 'Disk', value: data.disk },
          { label: 'Region', value: data.region },
        ].map(({ label, value }) => (
          <div key={label}>
            <p className="text-xs text-text-muted truncate" title={value}>{value}</p>
          </div>
        ))}
      </div>

      {/* Resource tabs */}
      <div className="flex gap-0.5 mx-3 mb-2 bg-bg-hover rounded-lg p-0.5">
        {[
          { label: '⚙ CPU', active: true },
          { label: '💾 Mem', active: false },
          { label: '💿 Disk', active: false },
          { label: '🌐 Rgn', active: false },
        ].map(({ label, active }) => (
          <div
            key={label}
            className={cn(
              'flex-1 py-1 rounded-md text-xs text-center cursor-pointer select-none transition-colors',
              active ? 'bg-bg-primary text-text-primary' : 'text-text-muted hover:text-text-secondary'
            )}
          >
            {label}
          </div>
        ))}
      </div>

      {/* Slider */}
      <div className="px-3 pb-2 flex items-center gap-2">
        <div className="flex-1 relative h-4 flex items-center">
          <div className="w-full h-1.5 rounded-full" style={{ background: '#252840' }}>
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${cpuPct}%`,
                background: cpuPct > 80
                  ? 'linear-gradient(90deg,#3b82f6,#ef4444)'
                  : 'linear-gradient(90deg,#3b82f6,#22c55e)',
              }}
            />
          </div>
          <div
            className="absolute w-3 h-3 rounded-full bg-white shadow border border-gray-300 -translate-x-1/2 pointer-events-none"
            style={{ left: `${cpuPct}%` }}
          />
        </div>
        <span className="text-xs font-mono text-text-secondary w-8 text-right">{data.cpu}</span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-3 pb-3">
        <StatusBadge status={data.status} />
        <AwsLogo />
      </div>
    </div>
  );
});
ServiceNode.displayName = 'ServiceNode';
