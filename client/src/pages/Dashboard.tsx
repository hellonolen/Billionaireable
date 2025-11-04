import React, { useState, useEffect } from "react";
import { COLORS } from "@/lib/constants";
import { Plus, Palette, GripVertical, Maximize2, Minimize2, Eye, EyeOff, RotateCcw, Settings } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { QuickAddWidget } from "@/components/QuickAddWidget";
import { AddDataModal } from "@/components/AddDataModal";
import { NetWorthDataEntry } from "@/components/NetWorthDataEntry";
import { BusinessKPIsDataEntry } from "@/components/BusinessKPIsDataEntry";
import { HealthGoalsDataEntry } from "@/components/HealthGoalsDataEntry";
import { CashLiquidityDataEntry } from "@/components/CashLiquidityDataEntry";
import { InvestmentPerformanceDataEntry } from "@/components/InvestmentPerformanceDataEntry";
import { PipelineDataEntry, KeyPeopleDataEntry, TimeAllocationDataEntry, HealthCognitiveDataEntry, ReputationLegalDataEntry, MacroMarketDataEntry, NetworkDealFlowDataEntry, RiskExposuresDataEntry, PhilanthropyESGDataEntry, NewsMarketDataEntry } from "@/components/AllDataEntryModals";
import { useDashboardData } from "@/hooks/useDashboardData";
import { EditableSection } from "@/components/EditableSection";
import { SectionErrorBoundary } from "@/components/SectionErrorBoundary";
import { ClickableTile } from "@/components/DashboardComponents";
import { SECTION_MAP } from "@/lib/sections";
import { trpc } from "@/lib/trpc";
import DetailView from "./DetailView";
import { DashboardHeader } from "@/components/DashboardHeader";
import { AICompanion } from "@/components/AICompanion";
import { ProactiveInsights } from "@/components/ProactiveInsights";

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export type SectionKey = keyof typeof SECTION_MAP;

const allSections: SectionKey[] = Object.keys(SECTION_MAP) as SectionKey[];

type CardSize = 'small' | 'medium' | 'large';

function SortableCard({ 
  id, 
  title, 
  onClick, 
  children, 
  size, 
  onResize, 
  onHide 
}: { 
  id: string; 
  title: string; 
  onClick: () => void; 
  children: React.ReactNode;
  size: CardSize;
  onResize: (size: CardSize) => void;
  onHide: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const sizeClasses = {
    small: 'col-span-12 sm:col-span-6 lg:col-span-3',
    medium: 'col-span-12 sm:col-span-6 lg:col-span-4',
    large: 'col-span-12 sm:col-span-12 lg:col-span-6',
  };

  return (
    <div ref={setNodeRef} style={style} className={`${sizeClasses[size]} relative group`}>
      {/* Drag handle */}
      <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing" {...attributes} {...listeners}>
        <div className="bg-white rounded p-1 shadow-sm" style={{ borderColor: COLORS.border }}>
          <GripVertical className="h-4 w-4" style={{ color: COLORS.text }} />
        </div>
      </div>
      
      {/* Card controls */}
      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        {/* Resize buttons */}
        <button
          onClick={(e) => { e.stopPropagation(); onResize(size === 'small' ? 'medium' : size === 'medium' ? 'large' : 'small'); }}
          className="bg-white rounded p-1 shadow-sm hover:bg-gray-50"
          style={{ borderColor: COLORS.border }}
          title="Resize card"
        >
          {size === 'large' ? <Minimize2 className="h-3 w-3" style={{ color: COLORS.text }} /> : <Maximize2 className="h-3 w-3" style={{ color: COLORS.text }} />}
        </button>
        {/* Hide button */}
        <button
          onClick={(e) => { e.stopPropagation(); onHide(); }}
          className="bg-white rounded p-1 shadow-sm hover:bg-gray-50"
          style={{ borderColor: COLORS.border }}
          title="Hide card"
        >
          <EyeOff className="h-3 w-3" style={{ color: COLORS.text }} />
        </button>
      </div>
      
      <ClickableTile title={title} onClick={onClick}>
        {children}
      </ClickableTile>
    </div>
  );
}

export default function Dashboard() {
  const [detail, setDetail] = useState<null | SectionKey>(null);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const dashboardData = useDashboardData();
  const [showAddData, setShowAddData] = useState(false);
  const [addDataSection, setAddDataSection] = useState<{ key: string; title: string } | null>(null);
  const { theme, toggleTheme } = useTheme();
  const [sections, setSections] = useState<SectionKey[]>(allSections);
  const [cardSizes, setCardSizes] = useState<Record<string, CardSize>>({});
  const [hiddenCards, setHiddenCards] = useState<Set<string>>(new Set());
  const [showCustomizePanel, setShowCustomizePanel] = useState(false);


  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Load saved order, sizes, and hidden cards from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('dashboardOrder');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === allSections.length) {
          setSections(parsed);
        }
      } catch (e) {
        console.error('Failed to load dashboard order', e);
      }
    }

    const savedSizes = localStorage.getItem('cardSizes');
    if (savedSizes) {
      try {
        setCardSizes(JSON.parse(savedSizes));
      } catch (e) {
        console.error('Failed to load card sizes', e);
      }
    }

    const savedHidden = localStorage.getItem('hiddenCards');
    if (savedHidden) {
      try {
        setHiddenCards(new Set(JSON.parse(savedHidden)));
      } catch (e) {
        console.error('Failed to load hidden cards', e);
      }
    }
  }, []);

  const handleResize = (cardId: string, newSize: CardSize) => {
    const newSizes = { ...cardSizes, [cardId]: newSize };
    setCardSizes(newSizes);
    localStorage.setItem('cardSizes', JSON.stringify(newSizes));
  };

  const handleHide = (cardId: string) => {
    const newHidden = new Set(hiddenCards);
    newHidden.add(cardId);
    setHiddenCards(newHidden);
    localStorage.setItem('hiddenCards', JSON.stringify(Array.from(newHidden)));
  };

  const handleShow = (cardId: string) => {
    const newHidden = new Set(hiddenCards);
    newHidden.delete(cardId);
    setHiddenCards(newHidden);
    localStorage.setItem('hiddenCards', JSON.stringify(Array.from(newHidden)));
  };

  const resetLayout = () => {
    setSections(allSections);
    setCardSizes({});
    setHiddenCards(new Set());
    localStorage.removeItem('dashboardOrder');
    localStorage.removeItem('cardSizes');
    localStorage.removeItem('hiddenCards');
  };

  const visibleSections = sections.filter(s => !hiddenCards.has(s));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSections((items) => {
        const oldIndex = items.indexOf(active.id as SectionKey);
        const newIndex = items.indexOf(over.id as SectionKey);
        const newOrder = arrayMove(items, oldIndex, newIndex);
        
        // Save to localStorage
        localStorage.setItem('dashboardOrder', JSON.stringify(newOrder));
        
        return newOrder;
      });
    }
  };

  if (detail) {
    return (
      <DetailView
        sectionKey={detail}
        onBack={() => setDetail(null)}
      />
    );
  }

  return (
    <>
      <AICompanion />
      <div style={{ background: COLORS.bg }} className="min-h-screen">
      <DashboardHeader 
        onQuickAdd={() => setShowQuickAdd(true)}
        onToggleTheme={toggleTheme}
        onOpenCustomize={() => setShowCustomizePanel(true)}
      />

      {/* Scrollable dashboard with all 14 sections */}
      <section className="mx-auto max-w-7xl px-4 py-4">
        <ProactiveInsights />
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sections} strategy={rectSortingStrategy}>
            <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(12, minmax(0, 1fr))" }}>
              {visibleSections.map((k) => (
                <SortableCard 
                  key={k} 
                  id={k} 
                  title={k} 
                  onClick={() => setDetail(k)}
                  size={cardSizes[k] || 'medium'}
                  onResize={(size) => handleResize(k, size)}
                  onHide={() => handleHide(k)}
                >
                  <SectionErrorBoundary>
                    <EditableSection
                      onEdit={() => setEditingSection(k)}
                      hasRealData={dashboardData.hasRealData(k)}
                    >
                      {SECTION_MAP[k].preview}
                    </EditableSection>
                  </SectionErrorBoundary>
                </SortableCard>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </section>

      {/* Customize Panel */}
      {showCustomizePanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center" onClick={() => setShowCustomizePanel(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6" onClick={(e) => e.stopPropagation()} style={{ borderColor: COLORS.border }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold" style={{ color: COLORS.text }}>Customize Dashboard</h2>
              <button onClick={() => setShowCustomizePanel(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Reset button */}
              <button
                onClick={() => { resetLayout(); setShowCustomizePanel(false); }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border hover:bg-gray-50"
                style={{ borderColor: COLORS.border, color: COLORS.text }}
              >
                <RotateCcw className="h-4 w-4" />
                Reset to Default Layout
              </button>

              {/* Hidden cards list */}
              {hiddenCards.size > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2" style={{ color: COLORS.text }}>Hidden Cards ({hiddenCards.size})</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {Array.from(hiddenCards).map((cardId) => (
                      <div key={cardId} className="flex items-center justify-between p-2 rounded border" style={{ borderColor: COLORS.border }}>
                        <span className="text-sm" style={{ color: COLORS.text }}>{cardId}</span>
                        <button
                          onClick={() => handleShow(cardId)}
                          className="flex items-center gap-1 text-xs px-2 py-1 rounded hover:bg-gray-100"
                          style={{ color: COLORS.primary }}
                        >
                          <Eye className="h-3 w-3" />
                          Show
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {hiddenCards.size === 0 && (
                <p className="text-sm text-center py-4" style={{ color: COLORS.subt }}>All cards are visible</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick Add Widget */}
      {showQuickAdd && (
        <QuickAddWidget onClose={() => setShowQuickAdd(false)} />
      )}

      {/* Add Data Modal */}
      {showAddData && addDataSection && (
        <AddDataModal
          isOpen={showAddData}
          onClose={() => {
            setShowAddData(false);
            setAddDataSection(null);
          }}
          sectionKey={addDataSection.key}
          sectionTitle={addDataSection.title}
        />
      )}

      {/* Net Worth Edit Modal */}
      {editingSection === "Net Worth & Asset Allocation" && (
        <NetWorthDataEntry
          onClose={() => setEditingSection(null)}
          onSave={() => setEditingSection(null)}
        />
      )}

      {/* Business KPIs Edit Modal */}
      {editingSection === "Business KPIs" && (
        <BusinessKPIsDataEntry
          onClose={() => setEditingSection(null)}
          onSave={() => setEditingSection(null)}
        />
      )}

      {/* Personal Goals Edit Modal */}
      {editingSection === "Personal Goals & Legacy" && (
        <HealthGoalsDataEntry
          onClose={() => setEditingSection(null)}
          onSave={() => setEditingSection(null)}
        />
      )}

      {/* All Other Modals */}
      {editingSection === "Cash & Liquidity Runway" && <CashLiquidityDataEntry onClose={() => setEditingSection(null)} onSave={() => setEditingSection(null)} />}
      {editingSection === "Investment Performance" && <InvestmentPerformanceDataEntry onClose={() => setEditingSection(null)} onSave={() => setEditingSection(null)} />}
      {editingSection === "Pipeline of Opportunities & Exits" && <PipelineDataEntry onClose={() => setEditingSection(null)} onSave={() => setEditingSection(null)} />}
      {editingSection === "Key People / Talent" && <KeyPeopleDataEntry onClose={() => setEditingSection(null)} onSave={() => setEditingSection(null)} />}
      {editingSection === "Time Allocation & Productivity" && <TimeAllocationDataEntry onClose={() => setEditingSection(null)} onSave={() => setEditingSection(null)} />}
      {editingSection === "Personal Health & Cognitive Performance" && <HealthCognitiveDataEntry onClose={() => setEditingSection(null)} onSave={() => setEditingSection(null)} />}
      {editingSection === "Reputation, Brand & Legal/Regulatory" && <ReputationLegalDataEntry onClose={() => setEditingSection(null)} onSave={() => setEditingSection(null)} />}
      {editingSection === "Macroeconomic & Market" && <MacroMarketDataEntry onClose={() => setEditingSection(null)} onSave={() => setEditingSection(null)} />}
      {editingSection === "Network & Deal Flow Quality" && <NetworkDealFlowDataEntry onClose={() => setEditingSection(null)} onSave={() => setEditingSection(null)} />}
      {editingSection === "Risk Exposures & Hedging" && <RiskExposuresDataEntry onClose={() => setEditingSection(null)} onSave={() => setEditingSection(null)} />}
      {editingSection === "Philanthropy, ESG & Impact" && <PhilanthropyESGDataEntry onClose={() => setEditingSection(null)} onSave={() => setEditingSection(null)} />}
      {editingSection === "News & Market Intelligence" && <NewsMarketDataEntry onClose={() => setEditingSection(null)} onSave={() => setEditingSection(null)} />}





      {/* Footer */}
      <footer className="border-t" style={{ borderColor: COLORS.border }}>
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs" style={{ color: COLORS.subt }}>
              © {new Date().getFullYear()} Billionaireable LLC. All rights reserved.
            </div>
            <div className="flex items-center gap-6">
              <a href="https://discord.gg/billionaireable" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm hover:opacity-70 transition-opacity" style={{ color: COLORS.subt }}>
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                Support
              </a>
              <a href="/privacy" className="text-sm hover:opacity-70 transition-opacity" style={{ color: COLORS.subt }}>Privacy</a>
              <a href="/terms" className="text-sm hover:opacity-70 transition-opacity" style={{ color: COLORS.subt }}>Terms</a>
              <a href="/disclosures" className="text-sm hover:opacity-70 transition-opacity" style={{ color: COLORS.subt }}>Disclosures</a>
              <a href="/preferences" className="text-sm hover:opacity-70 transition-opacity" style={{ color: COLORS.subt }}>Preferences</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}
