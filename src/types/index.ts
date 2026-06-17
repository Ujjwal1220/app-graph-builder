// Status values as specified in the assignment
export type NodeStatus = 'Healthy' | 'Degraded' | 'Down';

export interface ServiceNodeData {
  label: string;
  description?: string;
  status: NodeStatus;
  cpuValue: number;
  icon: string;
  cost: string;
  cpu: string;
  memory: string;
  disk: string;
  region: string;
  activeTab: 'Config' | 'Runtime';
  provider: 'aws' | 'gcp' | 'azure';
}

export interface App {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface GraphData {
  nodes: FlowNode[];
  edges: FlowEdge[];
}

export interface FlowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: ServiceNodeData;
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
}
