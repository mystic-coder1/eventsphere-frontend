'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Search,
  X,
  ExternalLink,
  Sparkles,
  Info,
  Maximize2,
  Minimize2,
  Download,
} from 'lucide-react';
import { FLOOR_PLAN_BOOTHS, FloorBooth } from '@/data/floorPlanData';
import { useStore } from '@/lib/store';
import { findExhibitorBySlug, getCompanySlug } from '@/lib/exhibitorSlug';

export const DelegateMap: React.FC = () => {
  const router = useRouter();
  const { exhibitors, setSelectedCompanyId } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooth, setSelectedBooth] = useState<FloorBooth | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Filtered booths based on search query
  const filteredBooths = useMemo(() => {
    if (!searchQuery.trim()) return FLOOR_PLAN_BOOTHS;
    const q = searchQuery.toLowerCase().trim();
    return FLOOR_PLAN_BOOTHS.filter((b) => {
      const numStr = String(b.number).toLowerCase();
      const nameStr = b.name.toLowerCase();
      const descStr = (b.description || '').toLowerCase();
      const catStr = (b.category || '').toLowerCase();
      return numStr.includes(q) || nameStr.includes(q) || descStr.includes(q) || catStr.includes(q);
    });
  }, [searchQuery]);

  const matchingIds = useMemo(() => {
    return new Set(filteredBooths.map((b) => b.id));
  }, [filteredBooths]);

  const containerRef = useRef<HTMLDivElement>(null);
  const panRef = useRef(pan);
  const zoomRef = useRef(zoom);
  panRef.current = pan;
  zoomRef.current = zoom;

  const gestureRef = useRef<{
    isDragging: boolean;
    dragStart: { x: number; y: number };
    isPinching: boolean;
    initialDistance: number;
    initialZoom: number;
    initialPan: { x: number; y: number };
    initialMidpoint: { x: number; y: number };
    lastTapTime: number;
  }>({
    isDragging: false,
    dragStart: { x: 0, y: 0 },
    isPinching: false,
    initialDistance: 0,
    initialZoom: 1,
    initialPan: { x: 0, y: 0 },
    initialMidpoint: { x: 0, y: 0 },
    lastTapTime: 0,
  });

  // Handle zoom controls
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.35, 3.8));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.35, 0.5));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Download map image
  const handleDownloadMap = () => {
    const link = document.createElement('a');
    link.href = '/images/floorplan/official-blueprint.png';
    link.download = 'MPSS26-Floor-Plan-Map.png';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Drag-to-pan handlers (Mouse on desktop)
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Multi-touch gestures (Pinch-to-zoom with fingers + 1-finger pan + double-tap)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const now = Date.now();
        const touch = e.touches[0];

        // Double-tap zoom detection (<300ms)
        if (now - gestureRef.current.lastTapTime < 300) {
          e.preventDefault();
          setZoom((prev) => {
            if (prev > 1.3) {
              setPan({ x: 0, y: 0 });
              return 1.0;
            } else {
              return 2.2;
            }
          });
          gestureRef.current.lastTapTime = 0;
          return;
        }
        gestureRef.current.lastTapTime = now;

        gestureRef.current.isDragging = true;
        gestureRef.current.isPinching = false;
        gestureRef.current.dragStart = {
          x: touch.clientX - panRef.current.x,
          y: touch.clientY - panRef.current.y,
        };
      } else if (e.touches.length === 2) {
        // Two fingers -> Start Pinch-to-zoom
        e.preventDefault();
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
        const midX = (t1.clientX + t2.clientX) / 2;
        const midY = (t1.clientY + t2.clientY) / 2;

        gestureRef.current.isPinching = true;
        gestureRef.current.isDragging = false;
        gestureRef.current.initialDistance = dist;
        gestureRef.current.initialZoom = zoomRef.current;
        gestureRef.current.initialPan = { ...panRef.current };
        gestureRef.current.initialMidpoint = { x: midX, y: midY };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && gestureRef.current.isPinching) {
        // Pinching with two fingers to zoom in / out
        e.preventDefault();
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
        const midX = (t1.clientX + t2.clientX) / 2;
        const midY = (t1.clientY + t2.clientY) / 2;

        if (gestureRef.current.initialDistance > 0) {
          const factor = dist / gestureRef.current.initialDistance;
          const newZoom = Math.min(
            Math.max(gestureRef.current.initialZoom * factor, 0.5),
            3.8
          );
          const deltaX = midX - gestureRef.current.initialMidpoint.x;
          const deltaY = midY - gestureRef.current.initialMidpoint.y;

          setZoom(newZoom);
          setPan({
            x: gestureRef.current.initialPan.x + deltaX,
            y: gestureRef.current.initialPan.y + deltaY,
          });
        }
      } else if (e.touches.length === 1 && gestureRef.current.isDragging) {
        // Single finger panning
        const touch = e.touches[0];
        setPan({
          x: touch.clientX - gestureRef.current.dragStart.x,
          y: touch.clientY - gestureRef.current.dragStart.y,
        });
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        // Transition from 2 fingers to 1 finger smoothly
        const touch = e.touches[0];
        gestureRef.current.isPinching = false;
        gestureRef.current.isDragging = true;
        gestureRef.current.dragStart = {
          x: touch.clientX - panRef.current.x,
          y: touch.clientY - panRef.current.y,
        };
      } else if (e.touches.length === 0) {
        gestureRef.current.isDragging = false;
        gestureRef.current.isPinching = false;
      }
    };

    // Trackpad / Mouse Wheel Zoom
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.15 : 0.88;
      setZoom((prev) => Math.min(Math.max(prev * zoomFactor, 0.5), 3.8));
    };

    container.addEventListener('touchstart', onTouchStart, { passive: false });
    container.addEventListener('touchmove', onTouchMove, { passive: false });
    container.addEventListener('touchend', onTouchEnd, { passive: false });
    container.addEventListener('touchcancel', onTouchEnd, { passive: false });
    container.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onTouchEnd);
      container.removeEventListener('touchcancel', onTouchEnd);
      container.removeEventListener('wheel', onWheel);
    };
  }, []);

  // Center on a specific booth
  const handleSelectBooth = (booth: FloorBooth) => {
    setSelectedBooth(booth);
    // Smoothly pan towards booth center
    const svgCenterX = booth.x + booth.w / 2;
    const svgCenterY = booth.y + booth.h / 2;
    // Keep reasonable zoom
    if (zoom < 1.2) {
      setZoom(1.3);
    }
  };

  const handleNavigateToExhibitor = (booth: FloorBooth) => {
    const slug = booth.exhibitorSlug || getCompanySlug(booth.name);
    const matched = findExhibitorBySlug(exhibitors, slug) || findExhibitorBySlug(exhibitors, booth.name);
    if (matched) {
      setSelectedCompanyId(matched.id);
      router.push(`/delegate/exhibitors/${slug}`);
    } else {
      router.push('/delegate/exhibitors');
    }
  };

  return (
    <div className="flex-1 bg-[#F8F7F4] flex flex-col h-full overflow-hidden select-none">
      {/* Top Header */}
      <div className="pt-4 pb-3 px-4 bg-[#F8F7F4] flex-shrink-0 z-20">
        <div className="flex items-center justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => router.push('/delegate/home')}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#181818] transition-active active:scale-95 shadow-xs border border-gray-100 cursor-pointer shrink-0"
              aria-label="Back to Home"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
            <h1 className="text-[22px] font-bold text-[#181818] tracking-tight truncate">
              Floor Plan Map
            </h1>
          </div>

          {/* Download Map Button */}
          <button
            onClick={handleDownloadMap}
            className="h-10 px-3.5 rounded-xl bg-white border border-[#E5E7EB] hover:bg-[#FAF9F5] active:scale-95 text-[#181818] text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer shrink-0"
            title="Download Floor Plan Map"
          >
            <Download className="w-4 h-4 text-[#B51F32]" />
            <span>Download</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#6B6B6B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by booth number or exhibitor name..."
            className="w-full h-11 bg-white border border-[#E5E7EB] rounded-xl pl-10 pr-10 text-[13px] focus:ring-2 focus:ring-[#B51F32]/20 focus:border-[#B51F32] outline-none text-[#181818] placeholder-[#9CA3AF] shadow-xs transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-[#6B6B6B] hover:text-[#181818] cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area - Interactive Floor Plan Map */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ touchAction: 'none' }}
          className={`flex-1 relative overflow-hidden bg-[#ECE8E1] touch-none select-none cursor-${
            isDragging ? 'grabbing' : 'grab'
          }`}
        >
          {/* Subtle Grid Pattern Background */}
          <div
            className="absolute inset-0 opacity-[0.07] pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(#181818 1px, transparent 1px), linear-gradient(90deg, #181818 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Floating Zoom & Tool Controls */}
          <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 bg-white/95 backdrop-blur-xs p-1 rounded-xl shadow-md border border-[#DEDCD7]">
            <button
              onClick={handleZoomIn}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-[#181818] active:scale-90 transition-all cursor-pointer"
              title="Zoom In (+)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-[#181818] active:scale-90 transition-all cursor-pointer"
              title="Zoom Out (-)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <div className="h-px bg-gray-200 my-0.5" />
            <button
              onClick={handleResetZoom}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-[#181818] active:scale-90 transition-all cursor-pointer"
              title="Reset Zoom & Position"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Gate Waypoint Legend Tag */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full shadow-xs border border-[#DEDCD7] text-[10px] text-[#4B5563] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
            <span>Entry & Exit Gates Labeled</span>
          </div>

          {/* Interactive Scalable SVG Map Canvas */}
          <div
            className="w-full h-full flex items-center justify-center transition-transform duration-75"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: 'center center',
            }}
          >
            <div className="w-[480px] max-w-none p-3 select-none">
              <svg
                viewBox="0 0 460 1100"
                className="w-full h-auto drop-shadow-md"
                style={{ maxHeight: 'calc(100vh - 180px)' }}
              >
                <defs>
                  {/* Subtle Hatch Pattern for Walkways */}
                  <pattern
                    id="floorTilePattern"
                    width="20"
                    height="20"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 20 0 L 0 0 0 20"
                      fill="none"
                      stroke="#E5E0D5"
                      strokeWidth="0.8"
                    />
                  </pattern>
                </defs>

                {/* Outer Hall Boundary Wall */}
                <rect
                  x="8"
                  y="8"
                  width="444"
                  height="1084"
                  rx="6"
                  fill="#FAF9F6"
                  stroke="#181818"
                  strokeWidth="2.5"
                />

                {/* Floor Walkways pattern */}
                <rect
                  x="10"
                  y="10"
                  width="440"
                  height="1080"
                  fill="url(#floorTilePattern)"
                />

                {/* Architectural Scale Label (Matching official floor plan) */}
                <text
                  x="20"
                  y="42"
                  fill="#6B7280"
                  fontSize="8"
                  fontFamily="sans-serif"
                  fontWeight="700"
                  fontStyle="italic"
                  className="select-none"
                >
                  Booths 3m x 3m
                </text>

                {/* ================= GATES & MARKERS ================= */}
                {/* EXIT GATE (Top Right) */}
                <g className="select-none">
                  <rect
                    x="438"
                    y="55"
                    width="14"
                    height="45"
                    fill="#FEE2E2"
                    stroke="#DC2626"
                    strokeWidth="1.5"
                    rx="2"
                  />
                  <text
                    x="422"
                    y="72"
                    textAnchor="end"
                    fill="#DC2626"
                    fontWeight="800"
                    fontSize="11"
                    fontFamily="sans-serif"
                    letterSpacing="1"
                  >
                    EXIT GATE →
                  </text>
                  <text
                    x="422"
                    y="84"
                    textAnchor="end"
                    fill="#991B1B"
                    fontWeight="600"
                    fontSize="8"
                    fontFamily="sans-serif"
                  >
                    North Concourse
                  </text>
                </g>

                {/* ENTRY GATE (Bottom Right) */}
                <g className="select-none">
                  <rect
                    x="438"
                    y="910"
                    width="14"
                    height="55"
                    fill="#DCFCE7"
                    stroke="#16A34A"
                    strokeWidth="1.5"
                    rx="2"
                  />
                  <text
                    x="422"
                    y="935"
                    textAnchor="end"
                    fill="#15803D"
                    fontWeight="800"
                    fontSize="11"
                    fontFamily="sans-serif"
                    letterSpacing="1"
                  >
                    ← ENTRY GATE
                  </text>
                  <text
                    x="422"
                    y="948"
                    textAnchor="end"
                    fill="#166534"
                    fontWeight="600"
                    fontSize="8"
                    fontFamily="sans-serif"
                  >
                    Badge Scan & Registration
                  </text>
                </g>

                {/* Aisle Indicators */}
                <text
                  x="115"
                  y="500"
                  textAnchor="middle"
                  fill="#A8A29E"
                  fontWeight="700"
                  fontSize="8"
                  letterSpacing="3"
                  transform="rotate(-90, 115, 500)"
                >
                  WEST AISLE
                </text>
                <text
                  x="335"
                  y="500"
                  textAnchor="middle"
                  fill="#A8A29E"
                  fontWeight="700"
                  fontSize="8"
                  letterSpacing="3"
                  transform="rotate(90, 335, 500)"
                >
                  EAST AISLE
                </text>

                {/* ================= BOOTHS RENDERING ================= */}
                {FLOOR_PLAN_BOOTHS.map((b) => {
                  const isSelected = selectedBooth?.id === b.id;
                  const isMatch = matchingIds.has(b.id);
                  const isDimmed = Boolean(searchQuery.trim()) && !isMatch;

                  // Dynamic fill and stroke based on state & category
                  let fill = '#FFFFFF';
                  let stroke = '#181818';
                  let strokeWidth = isSelected ? 2.5 : 1.2;

                  if (isSelected) {
                    fill = '#FEF3C7'; // Highlight gold
                    stroke = '#B45309';
                  } else if (isDimmed) {
                    fill = '#F3F4F6';
                    stroke = '#D1D5DB';
                  } else if (b.isPavilion) {
                    fill = b.id === 'pavilion-mpsedc' ? '#EFF6FF' : '#FFF7ED';
                    stroke = b.id === 'pavilion-mpsedc' ? '#1D4ED8' : '#C2410C';
                    strokeWidth = 1.8;
                  }

                  // Split multi-word booth names for clean legible wrapping
                  const words = b.name.split(' ');
                  const lines: string[] = [];
                  let current = '';
                  words.forEach((w) => {
                    if ((current + ' ' + w).trim().length > 13) {
                      if (current) lines.push(current.trim());
                      current = w;
                    } else {
                      current = (current + ' ' + w).trim();
                    }
                  });
                  if (current) lines.push(current.trim());

                  // Split subtitle into two lines if it contains parentheses or is too long to fit
                  const subtitleLines: string[] = [];
                  if (b.subtitle) {
                    if (b.subtitle.includes('(')) {
                      const parts = b.subtitle.split('(');
                      subtitleLines.push(parts[0].trim());
                      subtitleLines.push(`(${parts.slice(1).join('(').trim()}`);
                    } else if (b.subtitle.length > 12) {
                      const subWords = b.subtitle.split(' ');
                      let curSub = '';
                      subWords.forEach((w) => {
                        if ((curSub + ' ' + w).trim().length > 12) {
                          if (curSub) subtitleLines.push(curSub.trim());
                          curSub = w;
                        } else {
                          curSub = (curSub + ' ' + w).trim();
                        }
                      });
                      if (curSub) subtitleLines.push(curSub.trim());
                    } else {
                      subtitleLines.push(b.subtitle);
                    }
                  }

                  return (
                    <g
                      key={b.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectBooth(b);
                      }}
                      className="cursor-pointer transition-opacity duration-150"
                      opacity={isDimmed ? 0.35 : 1}
                    >
                      {/* Booth Box */}
                      <rect
                        x={b.x}
                        y={b.y}
                        width={b.w}
                        height={b.h}
                        fill={fill}
                        stroke={stroke}
                        strokeWidth={strokeWidth}
                        rx={b.isPavilion ? 5 : 2}
                        className="transition-all hover:stroke-[#B51F32]"
                      />

                      {/* Accent Corner Bar for Category identity */}
                      {!b.isPavilion && !isDimmed && (
                        <rect
                          x={b.x + 1}
                          y={b.y + 1}
                          width={b.w - 2}
                          height={2.5}
                          fill={b.categoryColor}
                          rx={1}
                        />
                      )}

                      {/* Content rendering inside Booth */}
                      {b.isPavilion ? (
                        /* Pavilion content (Large font + subtext) */
                        <g textAnchor="middle">
                          <text
                            x={b.x + b.w / 2}
                            y={
                              b.y +
                              b.h / 2 -
                              (subtitleLines.length > 1 ? 12 : subtitleLines.length === 1 ? 8 : 0)
                            }
                            fill={isSelected ? '#B45309' : '#181818'}
                            fontWeight="900"
                            fontSize={b.id === 'pavilion-mpsedc' ? 15 : 10.5}
                            fontFamily="sans-serif"
                            letterSpacing="0.3"
                          >
                            {b.name}
                          </text>
                          {subtitleLines.map((subLine, sIdx) => (
                            <text
                              key={sIdx}
                              x={b.x + b.w / 2}
                              y={
                                b.y +
                                b.h / 2 +
                                (b.id === 'pavilion-mpsedc'
                                  ? 14
                                  : subtitleLines.length > 1
                                  ? 4 + sIdx * 9.5
                                  : 9)
                              }
                              fill="#4B5563"
                              fontWeight="700"
                              fontSize={
                                b.id === 'pavilion-mpsedc'
                                  ? '9.5'
                                  : subtitleLines.length > 1
                                  ? '6.5'
                                  : '7.5'
                              }
                              fontFamily="sans-serif"
                            >
                              {subLine}
                            </text>
                          ))}
                        </g>
                      ) : (
                        /* Standard Booth: Number on top, Name below */
                        <g textAnchor="middle">
                          {/* Booth Number */}
                          <text
                            x={b.x + b.w / 2}
                            y={b.y + 12}
                            fill={isSelected ? '#B45309' : '#111827'}
                            fontWeight="900"
                            fontSize="10"
                            fontFamily="sans-serif"
                          >
                            {b.number}
                          </text>

                          {/* Multi-line Company Name */}
                          {lines.slice(0, 3).map((line, idx) => (
                            <text
                              key={idx}
                              x={b.x + b.w / 2}
                              y={b.y + 22 + idx * 8.5}
                              fill={isSelected ? '#92400E' : '#374151'}
                              fontWeight="600"
                              fontSize={lines.length > 2 ? '6.8' : '7.5'}
                              fontFamily="sans-serif"
                            >
                              {line}
                            </text>
                          ))}
                        </g>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Selected Booth Bottom Sheet Card */}
          {selectedBooth && (
            <div className="absolute bottom-3 left-3 right-3 z-30 max-w-md mx-auto bg-white rounded-2xl p-3.5 shadow-xl border border-[#DEDCD7] animate-in fade-in slide-in-from-bottom-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="px-2 py-0.5 rounded-md bg-[#181818] text-white text-[10px] font-black">
                      {selectedBooth.isPavilion
                        ? selectedBooth.number
                        : `Booth ${selectedBooth.number}`}
                    </span>
                    <span
                      className="text-[9.5px] font-bold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${selectedBooth.categoryColor}15`,
                        color: selectedBooth.categoryColor,
                      }}
                    >
                      {selectedBooth.category}
                    </span>
                    <span className="text-[10px] text-[#6B6B6B] font-medium">
                      {selectedBooth.size || '3m x 3m'}
                    </span>
                  </div>

                  <h3 className="text-[16px] font-bold text-[#181818] leading-tight truncate">
                    {selectedBooth.name}
                  </h3>
                  {selectedBooth.subtitle && (
                    <p className="text-[11px] font-semibold text-[#6B7280]">
                      {selectedBooth.subtitle}
                    </p>
                  )}
                  {selectedBooth.description && (
                    <p className="text-[11.5px] text-[#4B5563] mt-1 leading-relaxed line-clamp-2">
                      {selectedBooth.description}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => setSelectedBooth(null)}
                  className="p-1.5 rounded-full hover:bg-gray-100 text-[#9CA3AF] shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="mt-3 pt-2.5 border-t border-gray-100">
                <button
                  onClick={() => handleNavigateToExhibitor(selectedBooth)}
                  className="w-full py-2 px-3 bg-[#B51F32] hover:bg-[#9C1A2B] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <span>View Profile & Products</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
    </div>
  );
};
