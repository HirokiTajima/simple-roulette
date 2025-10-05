import React, { useState } from 'react';
import { Volume2, VolumeX, Edit3, X, Plus, Minus } from 'lucide-react';

export default function SimpleRouletteApp() {
  const [items, setItems] = useState([
    { name: 'Option 1', color: '#FF6B6B', weight: 1 },
    { name: 'Option 2', color: '#FFD93D', weight: 1 },
    { name: 'Option 3', color: '#6BCB77', weight: 1 },
    { name: 'Option 4', color: '#FFB84D', weight: 1 },
    { name: 'Option 5', color: '#FF69B4', weight: 1 },
    { name: 'Option 6', color: '#A78BFA', weight: 1 },
    { name: 'Option 7', color: '#4ECDC4', weight: 1 },
    { name: 'Option 8', color: '#60A5FA', weight: 1 },
  ]);

  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const spinRoulette = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setSelectedIndex(null);
    setShowConfetti(false);

    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    const random = Math.random() * totalWeight;
    let cumulative = 0;
    let targetIndex = 0;

    for (let i = 0; i < items.length; i++) {
      cumulative += items[i].weight;
      if (random <= cumulative) {
        targetIndex = i;
        break;
      }
    }

    let targetAngle = 0;
    for (let i = 0; i < targetIndex; i++) {
      targetAngle += (items[i].weight / totalWeight) * 360;
    }
    targetAngle += ((items[targetIndex].weight / totalWeight) * 360) / 2;

    const spins = 5 + Math.random() * 3;
    const totalRotation = rotation + (360 * spins) + (360 - targetAngle);

    setRotation(totalRotation);

    setTimeout(() => {
      setSelectedIndex(targetIndex);
      setShowConfetti(true);
      setIsSpinning(false);

      setTimeout(() => setShowConfetti(false), 2000);
    }, 5500);
  };

  const addItem = () => {
    const colors = ['#FF6B6B', '#FFD93D', '#6BCB77', '#FFB84D', '#FF69B4', '#A78BFA', '#4ECDC4', '#60A5FA', '#F97316', '#10B981'];
    const newColor = colors[items.length % colors.length];
    setItems([...items, { name: `Option ${items.length + 1}`, color: newColor, weight: 1 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 2) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItemName = (index: number, name: string) => {
    const newItems = [...items];
    newItems[index].name = name;
    setItems(newItems);
  };

  const updateItemWeight = (index: number, delta: number) => {
    const newItems = [...items];
    newItems[index].weight = Math.max(1, Math.min(50, newItems[index].weight + delta));
    setItems(newItems);
  };

  if (isEditing) {
    return (
      <div className="min-h-screen bg-slate-800 text-white p-4">
        <div className="flex items-center justify-between mb-4 pt-2">
          <h2 className="text-xl font-bold">Edit Items</h2>
          <button
            onClick={() => setIsEditing(false)}
            className="bg-cyan-500 hover:bg-cyan-600 px-5 py-2 rounded-lg font-semibold transition-colors text-sm"
          >
            Done
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-20 pb-2">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-slate-700 rounded-xl p-3 shadow-lg hover:shadow-xl transition-shadow relative"
            >
              {items.length > 2 && (
                <button
                  onClick={() => removeItem(index)}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
                >
                  <X size={14} className="text-white" />
                </button>
              )}

              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-full shadow-md flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => updateItemName(index, e.target.value)}
                  className="flex-1 bg-slate-600 border-none rounded-lg px-2 py-1.5 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Enter name"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs text-slate-400">Weight</label>
                  <span className="text-sm font-bold text-cyan-400">{item.weight}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateItemWeight(index, -1)}
                    className="w-6 h-6 bg-slate-600 hover:bg-slate-500 rounded flex items-center justify-center transition-colors"
                  >
                    <Minus size={12} className="text-white" />
                  </button>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={item.weight}
                    onChange={(e) => {
                      const newItems = [...items];
                      newItems[index].weight = parseInt(e.target.value);
                      setItems(newItems);
                    }}
                    className="flex-1 h-1.5 bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <button
                    onClick={() => updateItemWeight(index, 1)}
                    className="w-6 h-6 bg-slate-600 hover:bg-slate-500 rounded flex items-center justify-center transition-colors"
                  >
                    <Plus size={12} className="text-white" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="fixed bottom-4 left-4 right-4">
          <button
            onClick={addItem}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-3 rounded-xl text-base transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Add New Item
          </button>
        </div>

        <style>{`
          .slider::-webkit-slider-thumb {
            appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #06b6d4;
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          }
          .slider::-moz-range-thumb {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #06b6d4;
            cursor: pointer;
            border: none;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-800 text-white flex flex-col items-center justify-center p-4 relative">
      <div className="relative mb-8">
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none overflow-visible z-30">
            {[...Array(30)].map((_, i) => {
              const angle = Math.random() * 360;
              const distance = 100 + Math.random() * 100;
              const x = Math.cos((angle * Math.PI) / 180) * distance;
              const y = Math.sin((angle * Math.PI) / 180) * distance;

              return (
                <div
                  key={i}
                  className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: items[i % items.length].color,
                    transform: `translate(${x}px, ${y}px)`,
                    animation: `fadeOut 1.5s ease-out forwards`,
                    animationDelay: `${Math.random() * 0.3}s`,
                  }}
                />
              );
            })}
          </div>
        )}

        <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-30">
          <svg width="60" height="70" viewBox="0 0 60 70" className="drop-shadow-2xl">
            <path d="M 30 70 L 10 10 L 30 10 L 50 10 Z" fill="white" />
          </svg>
        </div>

        <div className="relative w-96 h-96 rounded-full shadow-2xl overflow-hidden border-8 border-slate-700 bg-slate-900">
          <svg
            width="384"
            height="384"
            viewBox="0 0 384 384"
            className="transition-transform ease-in-out"
            style={{
              transform: `rotate(${rotation}deg)`,
              transitionDuration: isSpinning ? '6000ms' : '0ms',
              transitionTimingFunction: isSpinning
                ? 'cubic-bezier(0.17, 0.67, 0.12, 0.99)'
                : 'linear',
            }}
          >
            {items.map((item, index) => {
              const totalWeight = items.reduce((sum, it) => sum + it.weight, 0);

              let startAngle = -90;
              for (let i = 0; i < index; i++) {
                startAngle += (items[i].weight / totalWeight) * 360;
              }

              const segmentAngle = (item.weight / totalWeight) * 360;
              const endAngle = startAngle + segmentAngle;

              const startRad = (startAngle * Math.PI) / 180;
              const endRad = (endAngle * Math.PI) / 180;

              const x1 = 192 + 192 * Math.cos(startRad);
              const y1 = 192 + 192 * Math.sin(startRad);
              const x2 = 192 + 192 * Math.cos(endRad);
              const y2 = 192 + 192 * Math.sin(endRad);

              const largeArcFlag = segmentAngle > 180 ? 1 : 0;

              const pathData = [`M 192 192`, `L ${x1} ${y1}`, `A 192 192 0 ${largeArcFlag} 1 ${x2} ${y2}`, `Z`].join(' ');

              const midAngle = startAngle + segmentAngle / 2;
              const textRadius = 130;
              const textX = 192 + textRadius * Math.cos((midAngle * Math.PI) / 180);
              const textY = 192 + textRadius * Math.sin((midAngle * Math.PI) / 180);

              return (
                <g key={index}>
                  <path
                    d={pathData}
                    fill={item.color}
                    stroke="#374151"
                    strokeWidth="2"
                  />
                  <text
                    x={textX}
                    y={textY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize="16"
                    fontWeight="bold"
                    transform={`rotate(${midAngle + 90}, ${textX}, ${textY})`}
                    className="pointer-events-none"
                  >
                    {item.name.length > 10 ? item.name.slice(0, 10) + '...' : item.name}
                  </text>
                </g>
              );
            })}
          </svg>

          <button
            onClick={spinRoulette}
            disabled={isSpinning}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full
              ${isSpinning ? 'bg-slate-600' : 'bg-slate-700 hover:bg-slate-600'}
              text-cyan-400 font-bold text-2xl shadow-2xl transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed z-10
              border-4 border-slate-600`}
          >
            {isSpinning ? 'SPIN!' : 'START'}
          </button>
        </div>
      </div>

      {selectedIndex !== null && !isSpinning && (
        <div className="mb-6 text-center">
          <div className="relative inline-block">
            <div className="absolute -inset-3 bg-cyan-400 rounded-2xl opacity-30 blur-lg animate-pulse"></div>
            <div className="relative bg-cyan-500 rounded-xl px-10 py-5 shadow-2xl">
              <div className="relative">
                <p className="text-sm font-bold text-cyan-100 mb-1 uppercase tracking-wider">Result</p>
                <p className="text-3xl font-black text-white drop-shadow-lg">{items[selectedIndex].name}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-8 left-8 right-8 flex justify-between items-center">
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="w-16 h-16 bg-cyan-500 hover:bg-cyan-600 rounded-full flex items-center justify-center shadow-lg transition-colors"
        >
          {soundEnabled ? <Volume2 size={28} /> : <VolumeX size={28} />}
        </button>
        <button
          onClick={() => setIsEditing(true)}
          className="w-16 h-16 bg-cyan-500 hover:bg-cyan-600 rounded-full flex items-center justify-center shadow-lg transition-colors"
        >
          <Edit3 size={28} />
        </button>
      </div>

      <style>{`
        @keyframes fadeOut {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(var(--x, 0), var(--y, 0)) scale(0.5);
          }
        }
      `}</style>
    </div>
  );
}
