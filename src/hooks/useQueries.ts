import { useQuery } from '@tanstack/react-query';
import type { App, GraphData } from '../types';

async function fetchApps(): Promise<App[]> {
  const res = await fetch('/api/apps');
  if (!res.ok) throw new Error('Failed to fetch apps');
  const json = await res.json() as { data: App[] };
  return json.data;
}

async function fetchGraph(appId: string): Promise<GraphData> {
  const res = await fetch(`/api/apps/${appId}/graph`);
  if (!res.ok) throw new Error('Failed to fetch graph');
  const json = await res.json() as { data: GraphData };
  return json.data;
}

export function useApps() {
  return useQuery({ queryKey: ['apps'], queryFn: fetchApps, staleTime: 5 * 60 * 1000 });
}

export function useGraph(appId: string) {
  return useQuery({
    queryKey: ['graph', appId],
    queryFn: () => fetchGraph(appId),
    enabled: !!appId,
    staleTime: 30 * 1000,
    retry: 1,
  });
}
