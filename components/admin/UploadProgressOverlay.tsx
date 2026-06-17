// components/admin/UploadProgressOverlay.tsx
'use client'

import { Loader2, HardDriveUpload, Clock, FileIcon, Zap } from 'lucide-react'

export interface UploadState {
  isUploading: boolean;
  isProcessingData: boolean;
  fileName: string;
  fileIndex: number;
  filesCount: number;
  progress: number;
  loadedMB: number;
  totalMB: number;
  speedMBps: number;
  etaSeconds: number;
}

export default function UploadProgressOverlay({ state }: { state: UploadState }) {
  if (!state.isUploading && !state.isProcessingData) return null;

  // تنسيق الوقت المتبقي
  const formatTime = (seconds: number) => {
    if (seconds === Infinity || isNaN(seconds) || seconds === 0) return 'جاري الحساب...';
    if (seconds < 60) return `${Math.round(seconds)} ثانية`;
    return `${Math.floor(seconds / 60)} دقيقة و ${Math.round(seconds % 60)} ثانية`;
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-5 font-sans" dir="rtl">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        
        {/* التوهج الخلفي */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-500/20 blur-[60px] rounded-full pointer-events-none"></div>

        {state.isProcessingData ? (
          <div className="text-center flex flex-col items-center justify-center py-8">
            <Loader2 size={64} className="animate-spin text-emerald-500 mb-6" />
            <h2 className="text-2xl font-bold text-white mb-2">جاري حفظ المشروع...</h2>
            <p className="text-zinc-400">اكتمل رفع الملفات بنجاح، يتم الآن تحديث قاعدة البيانات.</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 mb-4 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                <HardDriveUpload size={32} className="animate-bounce" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">جاري رفع الملفات</h2>
              <p className="text-zinc-400 text-sm flex items-center justify-center gap-2">
                <FileIcon size={16} /> ملف {state.fileIndex} من {state.filesCount}
              </p>
            </div>

            {/* شريط التقدم */}
            <div className="mb-8">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-zinc-300 font-medium truncate max-w-[200px]" dir="ltr">{state.fileName}</span>
                <span className="text-emerald-400 font-bold">{state.progress}%</span>
              </div>
              <div className="w-full bg-zinc-950 rounded-full h-3 border border-zinc-800 overflow-hidden relative">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-300 relative"
                  style={{ width: `${state.progress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]"></div>
                </div>
              </div>
            </div>

            {/* الإحصائيات */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-2xl flex flex-col gap-1">
                <span className="text-zinc-500 text-xs flex items-center gap-1"><HardDriveUpload size={14}/> الحجم</span>
                <span className="text-white font-mono text-sm" dir="ltr">
                  {state.loadedMB.toFixed(1)} / {state.totalMB.toFixed(1)} <span className="text-zinc-500 text-xs">MB</span>
                </span>
              </div>
              
              <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-2xl flex flex-col gap-1">
                <span className="text-zinc-500 text-xs flex items-center gap-1"><Zap size={14}/> السرعة</span>
                <span className="text-white font-mono text-sm" dir="ltr">
                  {state.speedMBps.toFixed(2)} <span className="text-zinc-500 text-xs">MB/s</span>
                </span>
              </div>

              <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-2xl flex flex-col gap-1 col-span-2">
                <span className="text-zinc-500 text-xs flex items-center gap-1"><Clock size={14}/> الوقت المتبقي للملف</span>
                <span className="text-emerald-400 font-medium text-sm">
                  {formatTime(state.etaSeconds)}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}