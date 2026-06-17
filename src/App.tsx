import { useCallback, useRef, useState } from 'react';
import { type Node } from '@xyflow/react';
import { TopBar } from './components/layout/TopBar';
import { LeftRail } from './components/layout/LeftRail';
import { RightPanel } from './components/layout/RightPanel';
import { Canvas } from './components/canvas/Canvas';
import { useAppStore } from './store/useAppStore';
import type { ServiceNodeData } from './types';

export default function App() {
  const { selectedNodeId } = useAppStore();
  const fitViewRef = useRef<(() => void) | null>(null);
  const [flowNodes, setFlowNodes] = useState<Node[]>([]);

  const handleNodesChange = useCallback((nodes: Node[]) => {
    setFlowNodes(nodes);
  }, []);

  // Derive selected node data from ReactFlow state
  const selectedNodeData = selectedNodeId
    ? (flowNodes.find((n) => n.id === selectedNodeId)?.data as ServiceNodeData | undefined) ?? null
    : null;

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-bg-primary">
      <TopBar onFitView={() => fitViewRef.current?.()} />
      <div className="flex flex-1 overflow-hidden">
        <LeftRail />
        <Canvas onFitViewRef={fitViewRef} onNodesChange={handleNodesChange} />
        <RightPanel selectedNodeData={selectedNodeData} />
      </div>
    </div>
  );
}
