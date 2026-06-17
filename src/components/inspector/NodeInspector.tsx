import { useCallback } from 'react';
import { Settings, Activity, Cpu, HardDrive, MemoryStick } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { StatusBadge } from '../ui/StatusBadge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Slider } from '../ui/slider';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import type { ServiceNodeData } from '../../types';

interface NodeInspectorProps {
  nodeId: string | null;
  nodeData: ServiceNodeData | null;
}

export function NodeInspector({ nodeId, nodeData }: NodeInspectorProps) {
  const { activeInspectorTab, setActiveInspectorTab, updateNodeData } = useAppStore();

  // cpuValue comes directly from nodeData (driven by Zustand nodeEdits merged into ReactFlow)
  // No local state needed — no stale value bug possible
  const cpuValue = nodeData?.cpuValue ?? 0;

  const handleSlider = useCallback((val: number[]) => {
    if (nodeId) updateNodeData(nodeId, { cpuValue: val[0] });
  }, [nodeId, updateNodeData]);

  const handleCpuInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Math.min(100, Math.max(0, Number(e.target.value)));
    if (nodeId) updateNodeData(nodeId, { cpuValue: v });
  }, [nodeId, updateNodeData]);

  const handleName = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (nodeId) updateNodeData(nodeId, { label: e.target.value });
  }, [nodeId, updateNodeData]);

  const handleDesc = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (nodeId) updateNodeData(nodeId, { description: e.target.value });
  }, [nodeId, updateNodeData]);

  if (!nodeId || !nodeData) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-xl bg-bg-hover flex items-center justify-center mb-3">
          <Settings size={20} className="text-text-muted" />
        </div>
        <p className="text-xs text-text-muted">Select a node to inspect</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Node header */}
      <div className="px-3 py-3 border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-bg-hover flex items-center justify-center text-base shrink-0">
            {nodeData.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-text-primary truncate">{nodeData.label}</p>
            <p className="text-xs text-text-muted">Service Node</p>
          </div>
        </div>
        <div className="mt-2"><StatusBadge status={nodeData.status} /></div>
      </div>

      {/* shadcn Tabs */}
      <Tabs
        value={activeInspectorTab}
        onValueChange={(v) => setActiveInspectorTab(v as 'Config' | 'Runtime')}
      >
        <TabsList>
          <TabsTrigger value="Config"><Settings size={11} /> Config</TabsTrigger>
          <TabsTrigger value="Runtime"><Activity size={11} /> Runtime</TabsTrigger>
        </TabsList>

        <TabsContent value="Config">
          <div>
            <label className="block text-xs text-text-muted mb-1">Node Name</label>
            <Input value={nodeData.label} onChange={handleName} placeholder="Service name" />
          </div>
          <div>
            <label className="block text-xs text-text-muted mb-1">Description</label>
            <Textarea value={nodeData.description ?? ''} onChange={handleDesc} placeholder="Describe this service..." rows={2} />
          </div>
          <div>
            <label className="block text-xs text-text-muted mb-1">Status</label>
            <StatusBadge status={nodeData.status} />
          </div>
          {/* Synced CPU slider + numeric input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-text-muted flex items-center gap-1">
                <Cpu size={11} /> CPU Allocation
              </label>
              <Input
                type="number"
                min={0}
                max={100}
                value={cpuValue}
                onChange={handleCpuInput}
                className="w-14 text-center px-1"
              />
            </div>
            <Slider min={0} max={100} step={1} value={[cpuValue]} onValueChange={handleSlider} />
            <div className="flex justify-between text-xs text-text-muted mt-1">
              <span>0%</span>
              <span className="font-medium text-text-primary">{cpuValue}%</span>
              <span>100%</span>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="Runtime">
          {[
            { label: 'CPU Usage', value: nodeData.cpu, icon: Cpu, color: '#3b82f6', pct: nodeData.cpuValue },
            { label: 'Memory', value: nodeData.memory, icon: MemoryStick, color: '#22c55e', pct: 45 },
            { label: 'Disk', value: nodeData.disk, icon: HardDrive, color: '#a855f7', pct: 30 },
          ].map(({ label, value, icon: Icon, color, pct }) => (
            <div key={label} className="bg-bg-primary rounded-lg p-2.5 border border-border-subtle">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-text-muted flex items-center gap-1">
                  <Icon size={11} style={{ color }} /> {label}
                </span>
                <span className="text-xs font-mono font-medium text-text-primary">{value}</span>
              </div>
              <div className="h-1 bg-border-subtle rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
              </div>
            </div>
          ))}
          <div className="bg-bg-primary rounded-lg p-2.5 border border-border-subtle">
            <p className="text-xs text-text-muted mb-1">Cost</p>
            <p className="text-sm font-semibold text-accent-green">{nodeData.cost}</p>
          </div>
          <div className="bg-bg-primary rounded-lg p-2.5 border border-border-subtle">
            <p className="text-xs text-text-muted mb-1">Region</p>
            <p className="text-xs font-medium text-text-primary">us-east-{nodeData.region}</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
