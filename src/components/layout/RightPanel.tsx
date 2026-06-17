import { useAppStore } from '../../store/useAppStore';
import { AppSelector } from './AppSelector';
import { NodeInspector } from '../inspector/NodeInspector';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';

interface RightPanelProps {
  selectedNodeData: import('../../types').ServiceNodeData | null;
}

export function RightPanel({ selectedNodeData }: RightPanelProps) {
  const { selectedNodeId, isMobilePanelOpen, setMobilePanelOpen } = useAppStore();

  const content = (
    <>
      <AppSelector />
      <NodeInspector nodeId={selectedNodeId} nodeData={selectedNodeData} />
    </>
  );

  return (
    <>
      {/* Desktop: static sidebar */}
      <aside className="hidden md:flex w-64 bg-bg-secondary border-l border-border-subtle flex-col shrink-0">
        {content}
      </aside>

      {/* Mobile: shadcn Sheet (slide-over drawer) */}
      <Sheet open={isMobilePanelOpen} onOpenChange={setMobilePanelOpen}>
        <SheetContent side="right" className="flex flex-col w-72 p-0">
          <SheetHeader>
            <SheetTitle>Panel</SheetTitle>
          </SheetHeader>
          {content}
        </SheetContent>
      </Sheet>
    </>
  );
}
