import { useCallback, useRef, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type OnConnect,
  type Node,
  type Edge,
  type OnNodesDelete,
  type NodeMouseHandler,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ServiceNode } from './ServiceNode';
import { useAppStore } from '../../store/useAppStore';
import { useGraph } from '../../hooks/useQueries';
import type { FlowNode, FlowEdge, ServiceNodeData } from '../../types';
import { Button } from '../ui/button';
import { Plus, RefreshCw } from 'lucide-react';

const nodeTypes = { serviceNode: ServiceNode };

type AnyNode = Node<Record<string, unknown>>;

function toFlowNodes(raw: FlowNode[], edits: Record<string, Partial<ServiceNodeData>>): AnyNode[] {
  return raw.map((n) => ({
    ...n,
    // Merge any saved inspector edits so they survive graph refetches
    data: { ...(n.data as unknown as Record<string, unknown>), ...(edits[n.id] ?? {}) },
  }));
}
function toFlowEdges(raw: FlowEdge[]): Edge[] {
  return raw.map((e) => ({ ...e }));
}

interface CanvasProps {
  onFitViewRef?: React.MutableRefObject<(() => void) | null>;
  onNodesChange: (nodes: AnyNode[]) => void;
}

export function Canvas({ onFitViewRef, onNodesChange }: CanvasProps) {
  const { selectedAppId, selectedNodeId, setSelectedNodeId, nodeEdits, updateNodeData } = useAppStore();
  const { data: graphData, isLoading, isError, refetch } = useGraph(selectedAppId);
  const [nodes, setNodes, handleNodesChange] = useNodesState<AnyNode>([]);
  const [edges, setEdges, handleEdgesChange] = useEdgesState<Edge>([]);
  const fitViewFn = useRef<(() => void) | null>(null);

  // Load graph → merge persisted edits from Zustand
  useEffect(() => {
    if (graphData) {
      setNodes(toFlowNodes(graphData.nodes, nodeEdits));
      setEdges(toFlowEdges(graphData.edges));
    }
  // nodeEdits intentionally omitted — only re-run on fresh graph data
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graphData, setNodes, setEdges]);

  // Keep node edits in sync with ReactFlow state (from inspector via Zustand)
  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) =>
        nodeEdits[n.id]
          ? { ...n, data: { ...n.data, ...(nodeEdits[n.id] as Record<string, unknown>) } }
          : n
      )
    );
  }, [nodeEdits, setNodes]);

  // Expose nodes to parent for inspector
  useEffect(() => { onNodesChange(nodes); }, [nodes, onNodesChange]);

  // Expose fitView
  useEffect(() => {
    if (onFitViewRef) onFitViewRef.current = () => fitViewFn.current?.();
  }, [onFitViewRef]);

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  const onNodeClick: NodeMouseHandler = useCallback((_e, node) => {
    setSelectedNodeId(node.id);
  }, [setSelectedNodeId]);

  const onPaneClick = useCallback(() => setSelectedNodeId(null), [setSelectedNodeId]);

  const onNodesDelete: OnNodesDelete = useCallback((deleted) => {
    const ids = new Set(deleted.map((n) => n.id));
    if (selectedNodeId && ids.has(selectedNodeId)) setSelectedNodeId(null);
  }, [selectedNodeId, setSelectedNodeId]);

  const addNode = useCallback(() => {
    const id = `node-${Date.now()}`;
    const newData: ServiceNodeData = {
      label: 'New Service',
      description: 'A new service node',
      status: 'Healthy',
      cpuValue: 20,
      icon: '⚡',
      cost: '$0.03/HR',
      cpu: '0.02',
      memory: '0.05 GB',
      disk: '10.00 GB',
      region: '1',
      activeTab: 'Config',
      provider: 'aws',
    };
    // Persist to store so edits survive refetch
    updateNodeData(id, newData);
    setNodes((nds) => [
      ...nds,
      { id, type: 'serviceNode', position: { x: 200 + Math.random() * 200, y: 200 + Math.random() * 100 }, data: (newData as unknown) as Record<string, unknown> },
    ]);
  }, [setNodes, updateNodeData]);

  return (
    <div className="flex-1 relative overflow-hidden">
      {/* Canvas toolbar */}
      <div className="absolute top-3 left-3 z-10 flex gap-2">
        <Button variant="secondary" size="sm" onClick={addNode}>
          <Plus size={12} /> Add Node
        </Button>
        <Button variant="secondary" size="sm" onClick={() => void refetch()}>
          <RefreshCw size={12} /> Refresh
        </Button>
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-bg-primary/80 z-20">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-accent-purple border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-text-muted">Loading graph…</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {isError && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="bg-bg-card border border-border-subtle rounded-xl p-6 flex flex-col items-center gap-3 max-w-xs text-center">
            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-xl">⚠</div>
            <p className="text-sm font-medium text-text-primary">Failed to load graph</p>
            <p className="text-xs text-text-muted">Toggle the Fail button in the top bar to simulate errors.</p>
            <Button onClick={() => void refetch()}>Retry</Button>
          </div>
        </div>
      )}

      <ReactFlow
        nodes={nodes.map((n) => ({ ...n, selected: n.id === selectedNodeId }))}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onNodesDelete={onNodesDelete}
        nodeTypes={nodeTypes}
        onInit={(inst) => {
          fitViewFn.current = () => inst.fitView({ padding: 0.15 });
          setTimeout(() => inst.fitView({ padding: 0.15 }), 100);
        }}
        deleteKeyCode={['Delete', 'Backspace']}
        fitView
        className="canvas-dotted"
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#2a2d3e" />
        <Controls />
        <MiniMap nodeColor={() => '#353850'} maskColor="rgba(15,17,23,0.6)" />
      </ReactFlow>
    </div>
  );
}
