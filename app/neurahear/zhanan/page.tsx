'use client';

import { useState, useEffect, useRef } from 'react';

interface MealRecord {
  id: string;
  date: string;
  food: string;
  image?: string;
  note?: string;
}

const FOOD_OPTIONS = [
  '海底捞',
  '铁锅炖',
  '烧烤',
  '烤肉',
  '串串',
  '大别山'
];

export default function ZhananPage() {
  // --- Random Picker State ---
  const [selectedFood, setSelectedFood] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  // --- Journal State ---
  const [records, setRecords] = useState<MealRecord[]>([]);
  const [newRecord, setNewRecord] = useState<{ food: string; note: string; image: string | null; date: string }>({
    food: '',
    note: '',
    image: null,
    date: new Date().toISOString().split('T')[0]
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load records from server on mount
  useEffect(() => {
    fetch('/api/zhanan/records')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRecords(data);
        }
      })
      .catch(err => console.error('Failed to load records:', err));
  }, []);

  // (Removed localStorage effect)

  const handleRandomPick = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    
    let speed = 50;
    let counter = 0;
    const totalSpins = 20; // Fast spins before slowing down
    
    const spin = () => {
      const randomIndex = Math.floor(Math.random() * FOOD_OPTIONS.length);
      setSelectedFood(FOOD_OPTIONS[randomIndex]);
      counter++;
      
      if (counter < totalSpins) {
        setTimeout(spin, speed);
      } else if (speed < 300) {
        // Decelerate
        speed += 30;
        setTimeout(spin, speed);
      } else {
        setIsSpinning(false);
      }
    };
    
    spin();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewRecord(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddRecord = async () => {
    if (!newRecord.food) return;

    const record: MealRecord = {
      id: Date.now().toString(),
      date: newRecord.date,
      food: newRecord.food,
      note: newRecord.note,
      image: newRecord.image || undefined
    };

    // Optimistic update
    const tempRecords = [record, ...records];
    setRecords(tempRecords);
    
    // Reset form
    setNewRecord({ food: '', note: '', image: null, date: new Date().toISOString().split('T')[0] });
    if (fileInputRef.current) fileInputRef.current.value = '';

    try {
        const res = await fetch('/api/zhanan/records', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(record)
        });
        
        if (res.ok) {
            const savedData = await res.json();
            // Update with the server version (which has the correct image URL)
            if (savedData.success && savedData.record) {
                setRecords(prev => [savedData.record, ...prev.filter(r => r.id !== record.id)]);
            }
        } else {
            console.error('Server save failed');
            // Revert on failure
            setRecords(records);
            alert('保存失败，请重试');
        }
    } catch (err) {
        console.error('Network error', err);
        setRecords(records);
        alert('网络错误，保存失败');
    }
  };

  const handleDeleteRecord = async (id: string) => {
    // Optimistic update
    const oldRecords = [...records];
    setRecords(prev => prev.filter(r => r.id !== id));

    try {
        const res = await fetch(`/api/zhanan/records/${id}`, { method: 'DELETE' });
        if (!res.ok) {
            throw new Error('Delete failed');
        }
    } catch (err) {
        console.error(err);
        setRecords(oldRecords);
        alert('删除失败');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            🍲 渣男们额度小助手
          </h1>
          <p className="mt-3 text-lg text-slate-500">
            记录渣男们的美好额度
          </p>
        </div>

        {/* Feature 1: Random Picker */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">今天吃什么？</h2>
            
            <div className="mb-8 h-40 flex items-center justify-center relative overflow-visible">
              {/* Background Glow Effect */}
              {isSpinning && (
                 <div className="absolute w-full h-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 blur-3xl opacity-30 animate-pulse rounded-full"></div>
              )}
              
              {selectedFood ? (
                <div className={`relative z-10 text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 transition-all duration-75 ${isSpinning ? 'scale-110 blur-[2px]' : 'scale-125 blur-none drop-shadow-2xl animate-bounce'}`}>
                  {selectedFood}
                </div>
              ) : (
                <div className="text-slate-300 text-xl font-medium">点击下方按钮开始选择</div>
              )}
            </div>

            <button
              onClick={handleRandomPick}
              disabled={isSpinning}
              className={`px-8 py-4 rounded-full text-lg font-bold text-white shadow-lg transition-all transform hover:scale-105 active:scale-95 ${
                isSpinning 
                  ? 'bg-slate-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:shadow-blue-500/30'
              }`}
            >
              {isSpinning ? '正在纠结...' : '🎲 帮我选一个！'}
            </button>

            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {FOOD_OPTIONS.map(opt => (
                <span key={opt} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm">
                  {opt}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Feature 2: Meal Journal */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-800">📸 聚餐打卡墙</h2>
            <span className="text-sm text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
              已记录 {records.length} 次聚会
            </span>
          </div>

          {/* Input Form */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">日期</label>
                <input
                  type="date"
                  value={newRecord.date}
                  onChange={e => setNewRecord(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">吃了什么</label>
                <input
                  type="text"
                  value={newRecord.food}
                  onChange={e => setNewRecord(prev => ({ ...prev, food: e.target.value }))}
                  placeholder="例如：海底捞"
                  className="w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">备注/心情</label>
                <input
                  type="text"
                  value={newRecord.note}
                  onChange={e => setNewRecord(prev => ({ ...prev, note: e.target.value }))}
                  placeholder="好吃！下次还来！"
                  className="w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">上传照片</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full text-sm text-slate-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100
                  "
                />
              </div>
            </div>
            
            {newRecord.image && (
              <div className="mt-4 relative w-32 h-32 rounded-lg overflow-hidden border border-slate-200">
                <img src={newRecord.image} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <button
                onClick={handleAddRecord}
                disabled={!newRecord.food}
                className="px-6 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                打卡记录
              </button>
            </div>
          </div>

          {/* Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {records.map(record => (
              <div key={record.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
                {record.image ? (
                  <div className="h-48 overflow-hidden bg-slate-100">
                    <img src={record.image} alt={record.food} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-slate-300">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-slate-800">{record.food}</h3>
                      <p className="text-xs text-slate-500 mt-1">{record.date}</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteRecord(record.id)}
                      className="text-slate-300 hover:text-red-500 transition-colors"
                      title="删除记录"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  {record.note && (
                    <p className="mt-2 text-sm text-slate-600 bg-slate-50 p-2 rounded-lg">
                      {record.note}
                    </p>
                  )}
                </div>
              </div>
            ))}
            
            {records.length === 0 && (
              <div className="col-span-full text-center py-12 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <p>还没有记录哦，快去吃顿好的吧！😋</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
