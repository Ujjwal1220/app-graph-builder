import { http, HttpResponse } from 'msw';
import type { App, GraphData } from '../types';

const apps: App[] = [
  { id: 'app-1', name: 'supertokens-golang', color: '#a855f7', icon: '⚡' },
  { id: 'app-2', name: 'supertokens-java', color: '#6366f1', icon: '☕' },
  { id: 'app-3', name: 'supertokens-python', color: '#ef4444', icon: '🐍' },
  { id: 'app-4', name: 'supertokens-ruby', color: '#8b5cf6', icon: '💎' },
  { id: 'app-5', name: 'supertokens-go', color: '#ec4899', icon: '🔵' },
];

const graphsByApp: Record<string, GraphData> = {
  'app-1': {
    nodes: [
      { id: 'n1', type: 'serviceNode', position: { x: 80, y: 80 }, data: { label: 'API Gateway', description: 'Main entry point', status: 'Healthy', cpuValue: 35, icon: '🌐', cost: '$0.03/HR', cpu: '0.02', memory: '0.05 GB', disk: '10.00 GB', region: '1', activeTab: 'Config', provider: 'aws' } },
      { id: 'n2', type: 'serviceNode', position: { x: 480, y: 60 }, data: { label: 'Postgres', description: 'Primary database', status: 'Healthy', cpuValue: 62, icon: '🐘', cost: '$0.03/HR', cpu: '0.02', memory: '0.05 GB', disk: '10.00 GB', region: '1', activeTab: 'Config', provider: 'aws' } },
      { id: 'n3', type: 'serviceNode', position: { x: 80, y: 380 }, data: { label: 'Redis', description: 'Session cache', status: 'Down', cpuValue: 78, icon: '🔴', cost: '$0.03/HR', cpu: '0.02', memory: '0.05 GB', disk: '10.00 GB', region: '1', activeTab: 'Config', provider: 'aws' } },
      { id: 'n4', type: 'serviceNode', position: { x: 480, y: 380 }, data: { label: 'Mongodb', description: 'Document store', status: 'Degraded', cpuValue: 91, icon: '🍃', cost: '$0.03/HR', cpu: '0.02', memory: '0.05 GB', disk: '10.00 GB', region: '1', activeTab: 'Config', provider: 'aws' } },
    ],
    edges: [
      { id: 'e1-2', source: 'n1', target: 'n2', animated: true },
      { id: 'e1-3', source: 'n1', target: 'n3', animated: false },
      { id: 'e2-4', source: 'n2', target: 'n4', animated: false },
    ],
  },
  'app-2': {
    nodes: [
      { id: 'n1', type: 'serviceNode', position: { x: 100, y: 100 }, data: { label: 'Auth Service', description: 'Java auth microservice', status: 'Healthy', cpuValue: 45, icon: '☕', cost: '$0.05/HR', cpu: '0.04', memory: '0.08 GB', disk: '5.00 GB', region: '2', activeTab: 'Config', provider: 'aws' } },
      { id: 'n2', type: 'serviceNode', position: { x: 450, y: 100 }, data: { label: 'MySQL', description: 'Java app database', status: 'Healthy', cpuValue: 30, icon: '🐬', cost: '$0.04/HR', cpu: '0.02', memory: '0.06 GB', disk: '20.00 GB', region: '2', activeTab: 'Config', provider: 'aws' } },
      { id: 'n3', type: 'serviceNode', position: { x: 270, y: 350 }, data: { label: 'Kafka', description: 'Event streaming', status: 'Degraded', cpuValue: 60, icon: '📨', cost: '$0.08/HR', cpu: '0.05', memory: '0.12 GB', disk: '50.00 GB', region: '2', activeTab: 'Config', provider: 'aws' } },
    ],
    edges: [{ id: 'e1', source: 'n1', target: 'n2', animated: true }, { id: 'e2', source: 'n1', target: 'n3', animated: false }],
  },
  'app-3': {
    nodes: [
      { id: 'n1', type: 'serviceNode', position: { x: 120, y: 120 }, data: { label: 'FastAPI', description: 'Python REST API', status: 'Healthy', cpuValue: 25, icon: '🐍', cost: '$0.02/HR', cpu: '0.01', memory: '0.04 GB', disk: '8.00 GB', region: '1', activeTab: 'Config', provider: 'gcp' } },
      { id: 'n2', type: 'serviceNode', position: { x: 460, y: 120 }, data: { label: 'Celery', description: 'Task queue', status: 'Healthy', cpuValue: 40, icon: '🌿', cost: '$0.03/HR', cpu: '0.02', memory: '0.05 GB', disk: '3.00 GB', region: '1', activeTab: 'Config', provider: 'gcp' } },
      { id: 'n3', type: 'serviceNode', position: { x: 290, y: 360 }, data: { label: 'ElasticSearch', description: 'Full-text search', status: 'Down', cpuValue: 0, icon: '🔍', cost: '$0.10/HR', cpu: '0.00', memory: '0.00 GB', disk: '100.00 GB', region: '1', activeTab: 'Config', provider: 'gcp' } },
    ],
    edges: [{ id: 'e1', source: 'n1', target: 'n2', animated: true }, { id: 'e2', source: 'n1', target: 'n3', animated: false }],
  },
};

const defaultGraph: GraphData = {
  nodes: [
    { id: 'n1', type: 'serviceNode', position: { x: 100, y: 100 }, data: { label: 'Service A', description: 'Main service', status: 'Healthy', cpuValue: 50, icon: '⚡', cost: '$0.03/HR', cpu: '0.02', memory: '0.05 GB', disk: '10.00 GB', region: '1', activeTab: 'Config', provider: 'aws' } },
    { id: 'n2', type: 'serviceNode', position: { x: 450, y: 100 }, data: { label: 'Service B', description: 'Secondary service', status: 'Healthy', cpuValue: 30, icon: '🔧', cost: '$0.03/HR', cpu: '0.02', memory: '0.05 GB', disk: '10.00 GB', region: '1', activeTab: 'Config', provider: 'aws' } },
    { id: 'n3', type: 'serviceNode', position: { x: 270, y: 350 }, data: { label: 'Database', description: 'Data layer', status: 'Degraded', cpuValue: 70, icon: '🗄️', cost: '$0.05/HR', cpu: '0.04', memory: '0.08 GB', disk: '50.00 GB', region: '1', activeTab: 'Config', provider: 'aws' } },
  ],
  edges: [{ id: 'e1', source: 'n1', target: 'n2', animated: true }, { id: 'e2', source: 'n1', target: 'n3', animated: false }],
};

// Read simulateError flag set by the UI
function shouldFail(): boolean {
  try {
    return sessionStorage.getItem('simulateError') === 'true';
  } catch {
    return false;
  }
}

export const handlers = [
  http.get('/api/apps', async () => {
    await delay(400);
    return HttpResponse.json({ data: apps });
  }),

  http.get('/api/apps/:appId/graph', async ({ params }) => {
    await delay(600);
    if (shouldFail()) {
      return new HttpResponse(null, { status: 500 });
    }
    const graph = graphsByApp[params.appId as string] ?? defaultGraph;
    return HttpResponse.json({ data: graph });
  }),
];

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
