// components/admin/CaseStudyBuilder.tsx
'use client'

import { useState } from 'react'
import { Plus, GripVertical, Trash2, ChevronDown, ChevronUp, Image as ImageIcon, Video, Images, X, LayoutTemplate, ArrowUp, ArrowDown, ListChecks  } from 'lucide-react'
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core'
import { 
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// --- 1. واجهات البيانات الخاصة بالنموذج ---
export interface ProjectFormFeature {
  id: string;
  title: string;
  content: string;
  layout_type: 'default' | 'image_left' | 'image_right' | 'hero';
  videoFile: File | null;
  videoPreview: string | null;
  imageFiles: { id: string; file: File | null; url: string }[];
}

export interface ProjectFormChapter {
  id: string;
  title: string;
  description: string;
  features: ProjectFormFeature[];
}

interface CaseStudyBuilderProps {
  chapters: ProjectFormChapter[];
  setChapters: React.Dispatch<React.SetStateAction<ProjectFormChapter[]>>;
  isSubmitting: boolean;
}

// دالة لتوليد ID عشوائي
const generateId = () => Math.random().toString(36).substring(2, 15)

// --- 2. المكون الرئيسي ---
export default function CaseStudyBuilder({ chapters, setChapters, isSubmitting }: CaseStudyBuilderProps) {
  // حالة لتتبع الفصول المفتوحة (Collapsed/Expanded)
  const [expandedChapters, setExpandedChapters] = useState<string[]>([])

  // إعداد مستشعرات السحب (Pointer للماوس واللمس)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), // يجب السحب 5 بكسل لبدء الحركة لمنع التعارض مع النقر
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const toggleChapter = (id: string) => {
    setExpandedChapters(prev => 
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    )
  }

  // --- دوال الفصول ---
  const addChapter = () => {
    const newId = generateId()
    setChapters([...chapters, { id: newId, title: '', description: '', features: [] }])
    setExpandedChapters([...expandedChapters, newId]) // فتحه تلقائياً
  }

  const removeChapter = (id: string) => {
    if(window.confirm('هل أنت متأكد من حذف هذا الفصل بالكامل مع جميع نقاطه؟')) {
      setChapters(chapters.filter(c => c.id !== id))
    }
  }

  const updateChapter = (id: string, field: keyof ProjectFormChapter, value: any) => {
    setChapters(chapters.map(c => c.id === id ? { ...c, [field]: value } : c))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setChapters((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  // --- دوال النقاط (Features) ---
  const addFeature = (chapterId: string) => {
    setChapters(chapters.map(c => {
      if (c.id === chapterId) {
        return {
          ...c,
          features: [...c.features, { id: generateId(), title: '', content: '', layout_type: 'default', videoFile: null, videoPreview: null, imageFiles: [] }]
        }
      }
      return c
    }))
  }

  const removeFeature = (chapterId: string, featureId: string) => {
    setChapters(chapters.map(c => {
      if (c.id === chapterId) return { ...c, features: c.features.filter(f => f.id !== featureId) }
      return c
    }))
  }

  const updateFeature = (chapterId: string, featureId: string, field: keyof ProjectFormFeature, value: any) => {
    setChapters(chapters.map(c => {
      if (c.id === chapterId) {
        return { ...c, features: c.features.map(f => f.id === featureId ? { ...f, [field]: value } : f) }
      }
      return c
    }))
  }

  const moveFeature = (chapterId: string, featureIndex: number, direction: 'up' | 'down') => {
    setChapters(chapters.map(c => {
      if (c.id === chapterId) {
        const newFeatures = [...c.features]
        if (direction === 'up' && featureIndex > 0) {
          [newFeatures[featureIndex - 1], newFeatures[featureIndex]] = [newFeatures[featureIndex], newFeatures[featureIndex - 1]]
        } else if (direction === 'down' && featureIndex < newFeatures.length - 1) {
          [newFeatures[featureIndex + 1], newFeatures[featureIndex]] = [newFeatures[featureIndex], newFeatures[featureIndex + 1]]
        }
        return { ...c, features: newFeatures }
      }
      return c
    }))
  }

  // --- دوال الوسائط للنقاط ---
  const handleFeatureVideo = (chapterId: string, featureId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      updateFeature(chapterId, featureId, 'videoFile', file)
      updateFeature(chapterId, featureId, 'videoPreview', URL.createObjectURL(file))
    }
  }

  const handleFeatureImages = (chapterId: string, featureId: string, e: React.ChangeEvent<HTMLInputElement>, currentImages: any[]) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({ id: generateId(), file, url: URL.createObjectURL(file) }))
      updateFeature(chapterId, featureId, 'imageFiles', [...currentImages, ...newFiles])
    }
  }

  const removeFeatureImage = (chapterId: string, featureId: string, imageId: string, currentImages: any[]) => {
    updateFeature(chapterId, featureId, 'imageFiles', currentImages.filter(img => img.id !== imageId))
  }

  return (
    <div className="bg-zinc-900 border border-emerald-500/30 rounded-3xl p-6 md:p-8 space-y-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
      
      <div className="flex items-center justify-between mb-2 border-b border-zinc-800 pb-6 relative z-10">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-white"><ListChecks className="text-emerald-500" /> بناء دراسة الحالة (الفصول)</h2>
          <p className="text-zinc-400 text-sm mt-1">قسّم مشروعك لفصول (مثال: التحدي، الحل، الأداء) وضع نقاطك داخلها.</p>
        </div>
        <button 
          type="button" 
          onClick={addChapter}
          disabled={isSubmitting}
          className="bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-500 px-4 py-2 rounded-xl flex items-center gap-2 transition-colors border border-emerald-500/20 font-medium"
        >
          <Plus size={18} /> فصل جديد
        </button>
      </div>

      {chapters.length === 0 ? (
        <div className="text-center py-16 text-zinc-500 border-2 border-dashed border-zinc-800 rounded-2xl">
          لم تقم بإضافة أي فصول بعد. ابدأ بسرد قصة مشروعك!
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={chapters.map(c => c.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-6 relative z-10">
              {chapters.map((chapter) => (
                <SortableChapterItem 
                  key={chapter.id}
                  chapter={chapter}
                  isExpanded={expandedChapters.includes(chapter.id)}
                  toggleExpand={() => toggleChapter(chapter.id)}
                  updateChapter={updateChapter}
                  removeChapter={() => removeChapter(chapter.id)}
                  isSubmitting={isSubmitting}
                  // تمرير دوال النقاط
                  addFeature={() => addFeature(chapter.id)}
                  removeFeature={(fId: string) => removeFeature(chapter.id, fId)}
                  updateFeature={(fId: string, field: keyof ProjectFormFeature, value: any) => updateFeature(chapter.id, fId, field, value)}
                  moveFeature={(fIndex: number, dir: 'up' | 'down') => moveFeature(chapter.id, fIndex, dir)}
                  handleFeatureVideo={(fId: string, e: React.ChangeEvent<HTMLInputElement>) => handleFeatureVideo(chapter.id, fId, e)}
                  handleFeatureImages={(fId: string, e: React.ChangeEvent<HTMLInputElement>, current: any[]) => handleFeatureImages(chapter.id, fId, e, current)}
                  removeFeatureImage={(fId: string, imgId: string, current: any[]) => removeFeatureImage(chapter.id, fId, imgId, current)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  )
}

// --- 3. مكون الفصل الواحد (يدعم السحب) ---
function SortableChapterItem({ chapter, isExpanded, toggleExpand, updateChapter, removeChapter, isSubmitting, addFeature, removeFeature, updateFeature, moveFeature, handleFeatureVideo, handleFeatureImages, removeFeatureImage }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: chapter.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    position: 'relative' as const,
  }

  return (
    <div ref={setNodeRef} style={style} className={`bg-zinc-950 border ${isDragging ? 'border-emerald-500 shadow-2xl shadow-emerald-500/20' : 'border-zinc-800'} rounded-2xl overflow-hidden transition-colors`}>
      
      {/* 🔹 رأس الفصل (Header) */}
      <div className="bg-zinc-900/50 p-4 flex items-center gap-4">
        {/* مقبض السحب (Grip) */}
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-2 text-zinc-500 hover:text-emerald-500 transition-colors bg-zinc-900 rounded-lg">
          <GripVertical size={20} />
        </div>
        
        <div className="flex-1 flex items-center gap-4">
          <input 
            value={chapter.title} 
            onChange={(e) => updateChapter(chapter.id, 'title', e.target.value)} 
            placeholder="عنوان الفصل (مثال: تصميم قاعدة البيانات)" 
            className="flex-1 bg-transparent border-none text-white font-bold text-lg outline-none focus:ring-0 placeholder:text-zinc-600"
          />
          <span className="bg-zinc-800 text-zinc-400 text-xs px-2 py-1 rounded-md">{chapter.features.length} نقاط</span>
        </div>

        <button type="button" onClick={removeChapter} className="text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-colors"><Trash2 size={18} /></button>
        <button type="button" onClick={toggleExpand} className="text-zinc-400 hover:bg-zinc-800 p-2 rounded-lg transition-colors">
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {/* 🔹 محتوى الفصل (يظهر فقط إذا كان مفتوحاً) */}
      {isExpanded && (
        <div className="p-6 border-t border-zinc-800 space-y-6">
          <textarea 
            value={chapter.description} 
            onChange={(e) => updateChapter(chapter.id, 'description', e.target.value)} 
            placeholder="مقدمة قصيرة عن هذا الفصل (اختياري)..." 
            rows={2}
            className="w-full bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-xl px-4 py-3 focus:border-emerald-500 outline-none resize-y text-sm"
          />

          <div className="space-y-8">
            {chapter.features.map((feature: any, fIndex: number) => (
              <div key={feature.id} className="relative bg-zinc-900/30 border border-zinc-800/80 rounded-xl p-5 group">
                
                {/* أدوات التحكم بالنقطة */}
                <div className="absolute -left-3 -top-3 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  <button type="button" onClick={() => removeFeature(feature.id)} className="bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:bg-red-400"><Trash2 size={14} /></button>
                  <button type="button" onClick={() => moveFeature(fIndex, 'up')} disabled={fIndex === 0} className="bg-zinc-700 text-white p-1.5 rounded-full shadow-lg hover:bg-zinc-600 disabled:opacity-30"><ArrowUp size={14} /></button>
                  <button type="button" onClick={() => moveFeature(fIndex, 'down')} disabled={fIndex === chapter.features.length - 1} className="bg-zinc-700 text-white p-1.5 rounded-full shadow-lg hover:bg-zinc-600 disabled:opacity-30"><ArrowDown size={14} /></button>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                  {/* قسم النصوص والتخطيط */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-500/20 text-emerald-500 w-6 h-6 rounded flex items-center justify-center font-bold text-xs shrink-0">{fIndex + 1}</div>
                      <input value={feature.title} onChange={(e) => updateFeature(feature.id, 'title', e.target.value)} placeholder="عنوان النقطة..." className="flex-1 bg-zinc-950 border border-zinc-800 text-white rounded-lg px-3 py-2 outline-none font-bold" />
                    </div>
                    
                    <textarea value={feature.content} onChange={(e) => updateFeature(feature.id, 'content', e.target.value)} placeholder="اشرح الميزة..." rows={3} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-lg px-3 py-2 outline-none resize-y text-sm" />
                    
                    <div className="flex items-center gap-3 bg-zinc-950 border border-zinc-800 p-2 rounded-lg">
                      <LayoutTemplate size={16} className="text-zinc-500 ml-1" />
                      <span className="text-xs text-zinc-400">شكل العرض:</span>
                      <select value={feature.layout_type} onChange={(e) => updateFeature(feature.id, 'layout_type', e.target.value)} className="bg-zinc-900 border-none text-white text-xs outline-none cursor-pointer">
                        <option value="default">افتراضي (نص وتحته وسائط)</option>
                        <option value="image_left">نص يمين، صورة يسار</option>
                        <option value="image_right">نص يسار، صورة يمين</option>
                        <option value="hero">شاشة كاملة (Hero)</option>
                      </select>
                    </div>
                  </div>

                  {/* قسم الوسائط */}
                  <div className="w-full lg:w-72 flex flex-col gap-4">
                    {/* رفع فيديو */}
                    <div className="border border-dashed border-zinc-700 rounded-xl p-3 flex flex-col items-center justify-center relative h-24 bg-zinc-950 group/vid overflow-hidden">
                      {feature.videoPreview ? (
                        <video src={feature.videoPreview} autoPlay loop muted className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <div className="text-center"><Video size={20} className="text-zinc-600 mx-auto mb-1" /><span className="text-zinc-500 text-[10px]">فيديو (اختياري)</span></div>
                      )}
                      <label className="absolute inset-0 bg-black/60 opacity-0 group-hover/vid:opacity-100 flex items-center justify-center cursor-pointer transition-opacity text-white text-xs font-medium">تغيير<input type="file" accept="video/mp4,video/webm" onChange={(e) => handleFeatureVideo(feature.id, e)} className="hidden" /></label>
                    </div>

                    {/* رفع صور */}
                    <div className="border border-dashed border-zinc-700 rounded-xl p-3 relative min-h-[6rem] bg-zinc-950">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-zinc-500 text-[10px]">صور متعددة</span>
                        <label className="cursor-pointer bg-zinc-800 hover:bg-zinc-700 text-white px-2 py-1 rounded text-[10px] flex items-center gap-1"><Images size={12} /> أضف<input type="file" accept="image/*" multiple onChange={(e) => handleFeatureImages(feature.id, e, feature.imageFiles)} className="hidden" /></label>
                      </div>
                      {feature.imageFiles.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
                          {feature.imageFiles.map((img: any) => (
                            <div key={img.id} className="relative group/img shrink-0 w-12 h-12 rounded overflow-hidden border border-zinc-800">
                              <img src={img.url} className="w-full h-full object-cover" />
                              <button type="button" onClick={() => removeFeatureImage(feature.id, img.id, feature.imageFiles)} className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover/img:opacity-100 text-white"><X size={14} /></button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button type="button" onClick={addFeature} className="w-full py-3 border-2 border-dashed border-zinc-800 rounded-xl text-zinc-400 hover:text-white hover:border-zinc-600 hover:bg-zinc-800/50 transition-all flex items-center justify-center gap-2 text-sm font-medium">
              <Plus size={16} /> إضافة نقطة جديدة في هذا الفصل
            </button>
          </div>
        </div>
      )}
    </div>
  )
}  