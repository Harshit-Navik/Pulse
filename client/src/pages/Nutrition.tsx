import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { 
  Utensils, 
  Flame, 
  Zap, 
  Plus, 
  Search,
  ChevronRight,
  Info,
  Coffee,
  Beef,
  Leaf,
  Scan,
  Loader2,
  Cookie
} from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { Footer } from '@/components/layout/Footer';
import { MacroBar } from '@/components/ui/MacroBar';
import { MealCard } from '@/components/ui/MealCard';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/lib/utils';
import { dietAPI, mealAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

// Icon mapping for meal types
const typeIcons: Record<string, any> = {
  Breakfast: Coffee,
  Lunch: Beef,
  Dinner: Utensils,
  Snack: Cookie,
};

// ── Fallback meal data ─────────────────────────────────────────────
const fallbackMeals = [
  {
    id: 'fb-1',
    time: '08:30 AM',
    type: 'Breakfast' as const,
    name: 'Breakfast Optimization',
    items: [
      { name: 'Avocado Toast with Poached Egg', cals: 340 },
      { name: 'Black Coffee', cals: 2 },
    ],
    totalCals: 342,
    calories: 342,
    protein: 22,
    carbs: 28,
    fats: 18,
  },
  {
    id: 'fb-2',
    time: '01:15 PM',
    type: 'Lunch' as const,
    name: 'Lunch Optimization',
    items: [
      { name: 'Grilled Chicken Quinoa Bowl', cals: 520 },
      { name: 'Roasted Broccoli', cals: 85 },
    ],
    totalCals: 605,
    calories: 605,
    protein: 52,
    carbs: 45,
    fats: 16,
  },
];

interface MealItem {
  id: string;
  _id?: string;
  time: string;
  type: string;
  name: string;
  items: { name: string; cals: number }[];
  totalCals: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

interface MacroSummary {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
  mealCount: number;
}

interface DietMeal {
  _id?: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  quantity: string;
  time: string;
  notes: string;
}

interface DietItem {
  id: string;
  _id?: string;
  title: string;
  description: string;
  createdBy?: string;
  meals: DietMeal[];
}

export default function Nutrition() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [fabModalOpen, setFabModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [meals, setMeals] = useState<MealItem[]>(fallbackMeals);
  const [summary, setSummary] = useState<MacroSummary>({
    totalCalories: 947, totalProtein: 74, totalCarbs: 73, totalFats: 34, mealCount: 2,
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dietSubmitting, setDietSubmitting] = useState(false);
  const [dietError, setDietError] = useState<string | null>(null);
  // Page-level fetch error (shown in the Diet Plans section, not just inside modals)
  const [dietFetchError, setDietFetchError] = useState<string | null>(null);

  // Diet state
  const [diets, setDiets] = useState<DietItem[]>([]);
  const [selectedDietId, setSelectedDietId] = useState<string | null>(null);
  const [dietModalOpen, setDietModalOpen] = useState(false);
  const [dietEditModalOpen, setDietEditModalOpen] = useState(false);
  const [dietDeleteModalOpen, setDietDeleteModalOpen] = useState(false);
  const [addDietMealModalOpen, setAddDietMealModalOpen] = useState(false);
  const [dietTarget, setDietTarget] = useState<DietItem | null>(null);
  const [dietTitle, setDietTitle] = useState('');
  const [dietDescription, setDietDescription] = useState('');
  const [dietMealName, setDietMealName] = useState('');
  const [dietMealCalories, setDietMealCalories] = useState('');
  const [dietMealProtein, setDietMealProtein] = useState('');
  const [dietMealCarbs, setDietMealCarbs] = useState('');
  const [dietMealFats, setDietMealFats] = useState('');
  const [dietMealQuantity, setDietMealQuantity] = useState('');
  const [dietMealTime, setDietMealTime] = useState('Breakfast');
  const [dietMealNotes, setDietMealNotes] = useState('');

  // Edit target
  const [editTarget, setEditTarget] = useState<MealItem | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formCalories, setFormCalories] = useState('');
  const [formProtein, setFormProtein] = useState('');
  const [formCarbs, setFormCarbs] = useState('');
  const [formFats, setFormFats] = useState('');
  const [formType, setFormType] = useState('Breakfast');

  const dailyTarget = 2400;
  const proteinTarget = 180;
  const carbsTarget = 220;
  const fatsTarget = 65;

  // ── FETCH ──────────────────────────────────────────────────────
  const fetchMeals = useCallback(async () => {
    try {
      const [mealsRes, summaryRes] = await Promise.all([
        mealAPI.getAll(),
        mealAPI.getSummary(),
      ]);
      const mealsData = mealsRes.data.data;
      if (mealsData && mealsData.length > 0) {
        setMeals(mealsData.map((m: any) => ({
          ...m,
          id: m._id || m.id,
          totalCals: m.calories || 0,
          items: m.items || [{ name: m.name, cals: m.calories || 0 }],
        })));
      } else {
        setMeals(fallbackMeals);
      }
      const s = summaryRes.data.data;
      if (s && s.mealCount > 0) {
        setSummary(s);
      }
    } catch {
      setMeals(fallbackMeals);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDiets = useCallback(async () => {
    try {
      const res = await dietAPI.getAll();
      const data = res.data.data || [];
      const mapped = data.map((d: any) => ({
        ...d,
        // Normalize both id fields to plain strings for safe comparison
        id: String(d._id || d.id),
        createdBy: d.createdBy ? String(d.createdBy) : undefined,
        meals: d.meals || [],
      }));
      setDiets(mapped);
      if (mapped.length > 0) {
        setSelectedDietId((prev) => prev && mapped.some((d: DietItem) => d.id === prev) ? prev : mapped[0].id);
      } else {
        setSelectedDietId(null);
      }
      setDietFetchError(null);
      setDietError(null);
    } catch (err: any) {
      setDiets([]);
      setSelectedDietId(null);
      const msg = err?.message || 'Failed to load diet plans';
      setDietFetchError(msg);
    }
  }, []);

  useEffect(() => { fetchMeals(); }, [fetchMeals]);
  useEffect(() => { fetchDiets(); }, [fetchDiets]);

  // ── CREATE ─────────────────────────────────────────────────────
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;
    setError(null);
    setSubmitting(true);
    const mealData = {
      name: formName.trim(),
      type: formType,
      calories: parseInt(formCalories) || 0,
      protein: parseInt(formProtein) || 0,
      carbs: parseInt(formCarbs) || 0,
      fats: parseInt(formFats) || 0,
    };
    try {
      await mealAPI.create(mealData);
      setFabModalOpen(false);
      resetForm();
      await fetchMeals();
    } catch (err: any) {
      setError(err.message || 'Failed to log meal');
    } finally {
      setSubmitting(false);
    }
  };

  // ── UPDATE ─────────────────────────────────────────────────────
  const openEdit = (m: MealItem) => {
    setEditTarget(m);
    setFormName(m.name);
    setFormCalories(String(m.calories || 0));
    setFormProtein(String(m.protein || 0));
    setFormCarbs(String(m.carbs || 0));
    setFormFats(String(m.fats || 0));
    setFormType(m.type);
    setEditModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget || !formName.trim()) return;
    setError(null);
    setSubmitting(true);
    try {
      const targetId = editTarget._id || editTarget.id;
      await mealAPI.update(targetId, {
        name: formName.trim(),
        type: formType,
        calories: parseInt(formCalories) || 0,
        protein: parseInt(formProtein) || 0,
        carbs: parseInt(formCarbs) || 0,
        fats: parseInt(formFats) || 0,
      });
      setEditModalOpen(false);
      resetForm();
      await fetchMeals();
    } catch (err: any) {
      setError(err.message || 'Failed to update meal');
    } finally {
      setSubmitting(false);
    }
  };

  // ── DELETE ─────────────────────────────────────────────────────
  const openDelete = (m: MealItem) => {
    setEditTarget(m);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!editTarget) return;
    setError(null);
    setSubmitting(true);
    try {
      const targetId = editTarget._id || editTarget.id;
      await mealAPI.delete(targetId);
      setDeleteModalOpen(false);
      setEditTarget(null);
      await fetchMeals();
    } catch (err: any) {
      setError(err.message || 'Failed to delete meal');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedDiet = diets.find((d) => d.id === selectedDietId) || null;
  // Coerce both sides to strings so ObjectId vs string mismatches don't silently fail
  const canManageSelectedDiet = !!(
    selectedDiet &&
    user?._id &&
    String(selectedDiet.createdBy) === String(user._id)
  );

  const resetDietForm = () => {
    setDietTitle('');
    setDietDescription('');
    setDietTarget(null);
    setDietError(null);
    // Note: intentionally NOT clearing dietFetchError here — it's page-level
  };

  const resetDietMealForm = () => {
    setDietMealName('');
    setDietMealCalories('');
    setDietMealProtein('');
    setDietMealCarbs('');
    setDietMealFats('');
    setDietMealQuantity('');
    setDietMealTime('Breakfast');
    setDietMealNotes('');
    setDietError(null);
  };

  const handleCreateDiet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dietTitle.trim()) {
      setDietError('Diet title is required');
      return;
    }
    setDietSubmitting(true);
    setDietError(null);
    try {
      await dietAPI.create({
        title: dietTitle.trim(),
        // Compatibility payload for environments still expecting legacy naming.
        dietName: dietTitle.trim(),
        description: dietDescription.trim(),
      });
      setDietModalOpen(false);
      resetDietForm();
      await fetchDiets();
    } catch (err: any) {
      setDietError(err.message || 'Failed to create diet');
    } finally {
      setDietSubmitting(false);
    }
  };

  const openEditDiet = (diet: DietItem) => {
    setDietTarget(diet);
    setDietTitle(diet.title);
    setDietDescription(diet.description || '');
    setDietEditModalOpen(true);
    setDietError(null);
  };

  const handleUpdateDiet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dietTarget || !dietTitle.trim()) return;
    setDietSubmitting(true);
    setDietError(null);
    try {
      await dietAPI.update(dietTarget._id || dietTarget.id, {
        title: dietTitle.trim(),
        description: dietDescription.trim(),
      });
      setDietEditModalOpen(false);
      resetDietForm();
      await fetchDiets();
    } catch (err: any) {
      setDietError(err.message || 'Failed to update diet');
    } finally {
      setDietSubmitting(false);
    }
  };

  const openDeleteDiet = (diet: DietItem) => {
    setDietTarget(diet);
    setDietDeleteModalOpen(true);
    setDietError(null);
  };

  const handleDeleteDiet = async () => {
    if (!dietTarget) return;
    setDietSubmitting(true);
    setDietError(null);
    try {
      const deletingId = dietTarget._id || dietTarget.id;
      await dietAPI.delete(deletingId);
      setDietDeleteModalOpen(false);
      setDietTarget(null);
      if (selectedDietId === deletingId) {
        setSelectedDietId(null);
      }
      await fetchDiets();
    } catch (err: any) {
      setDietError(err.message || 'Failed to delete diet');
    } finally {
      setDietSubmitting(false);
    }
  };

  const handleAddMealToDiet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDiet || !dietMealName.trim()) return;
    setDietSubmitting(true);
    setDietError(null);
    try {
      const res = await dietAPI.addMeal(selectedDiet._id || selectedDiet.id, {
        name: dietMealName.trim(),
        calories: parseInt(dietMealCalories) || 0,
        protein: parseInt(dietMealProtein) || 0,
        carbs: parseInt(dietMealCarbs) || 0,
        fats: parseInt(dietMealFats) || 0,
        quantity: dietMealQuantity.trim(),
        time: dietMealTime,
        notes: dietMealNotes.trim(),
      });
      const updatedDiet = { ...res.data.data, id: res.data.data._id || res.data.data.id };
      setDiets((prev) => prev.map((d) => (d.id === updatedDiet.id ? updatedDiet : d)));
      setSelectedDietId(updatedDiet.id);
      setAddDietMealModalOpen(false);
      resetDietMealForm();
    } catch (err: any) {
      setDietError(err.message || 'Failed to add meal to diet');
    } finally {
      setDietSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormName(''); setFormCalories(''); setFormProtein('');
    setFormCarbs(''); setFormFats(''); setFormType('Breakfast'); setEditTarget(null); setError(null);
  };

  const consumed = summary.totalCalories;
  const remaining = Math.max(dailyTarget - consumed, 0);

  // ── FORM JSX ───────────────────────────────────────────────────
  const formFields = (
    <>
      <div className="space-y-2">
        <label htmlFor="meal-name" className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em]">Meal Name</label>
        <input
          id="meal-name"
          type="text"
          value={formName}
          onChange={e => setFormName(e.target.value)}
          placeholder="e.g. Grilled Salmon"
          className="w-full bg-surface-low border border-outline px-6 py-4 text-sm font-medium text-on-surface focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-on-surface-variant/20"
          required
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="meal-calories" className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em]">Calories</label>
          <input id="meal-calories" type="number" value={formCalories} onChange={e => setFormCalories(e.target.value)} placeholder="520" className="w-full bg-surface-low border border-outline px-4 py-4 text-sm font-medium text-on-surface focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-on-surface-variant/20" />
        </div>
        <div className="space-y-2">
          <label htmlFor="meal-protein" className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em]">Protein (g)</label>
          <input id="meal-protein" type="number" value={formProtein} onChange={e => setFormProtein(e.target.value)} placeholder="42" className="w-full bg-surface-low border border-outline px-4 py-4 text-sm font-medium text-on-surface focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-on-surface-variant/20" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label htmlFor="meal-carbs" className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em]">Carbs (g)</label>
          <input id="meal-carbs" type="number" value={formCarbs} onChange={e => setFormCarbs(e.target.value)} placeholder="60" className="w-full bg-surface-low border border-outline px-4 py-4 text-sm font-medium text-on-surface focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-on-surface-variant/20" />
        </div>
        <div className="space-y-2">
          <label htmlFor="meal-fats" className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em]">Fats (g)</label>
          <input id="meal-fats" type="number" value={formFats} onChange={e => setFormFats(e.target.value)} placeholder="18" className="w-full bg-surface-low border border-outline px-4 py-4 text-sm font-medium text-on-surface focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-on-surface-variant/20" />
        </div>
        <div className="space-y-2">
          <label htmlFor="meal-type" className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em]">Type</label>
          <select id="meal-type" value={formType} onChange={e => setFormType(e.target.value)} className="w-full bg-surface-low border border-outline px-4 py-4 text-sm font-medium text-on-surface focus:ring-1 focus:ring-primary focus:outline-none transition-all">
            <option>Breakfast</option>
            <option>Lunch</option>
            <option>Dinner</option>
            <option>Snack</option>
          </select>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <TopBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <main className="lg:ml-64 pt-20">
        <div className="p-6 md:p-12 max-w-7xl mx-auto space-y-12">
          
          {/* Summary Header */}
          <section className="grid grid-cols-12 gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="col-span-12 lg:col-span-7 bg-surface-container p-10 border-l-4 border-primary relative overflow-hidden"
            >
              <div className="relative z-10">
                <span className="text-[10px] uppercase tracking-[0.4em] font-black text-primary mb-4 block">Remaining Balance</span>
                <div className="flex items-baseline gap-4">
                  <h2 className="font-headline text-5xl md:text-7xl font-black text-on-surface tracking-tighter italic">{remaining.toLocaleString()}</h2>
                  <span className="text-xl font-headline font-bold text-on-surface-variant uppercase italic">kcal</span>
                </div>
                <div className="mt-10 flex flex-wrap gap-8 sm:gap-12">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.3em] font-black text-on-surface-variant mb-1">Consumed</p>
                    <p className="text-xl font-headline font-bold text-on-surface">{consumed.toLocaleString()} <span className="text-xs font-normal italic">kcal</span></p>
                  </div>
                  <div className="w-px h-10 bg-outline"></div>
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.3em] font-black text-on-surface-variant mb-1">Target</p>
                    <p className="text-xl font-headline font-bold text-on-surface">{dailyTarget.toLocaleString()} <span className="text-xs font-normal italic">kcal</span></p>
                  </div>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="col-span-12 lg:col-span-5 bg-surface-container p-10 flex flex-col justify-between"
            >
              <h4 className="font-headline text-xl font-black uppercase italic tracking-tight mb-8">Macro Distribution</h4>
              <div className="space-y-6">
                <MacroBar label="Protein" current={summary.totalProtein} target={proteinTarget} color="bg-primary" />
                <MacroBar label="Carbs" current={summary.totalCarbs} target={carbsTarget} color="bg-blue-500" />
                <MacroBar label="Fats" current={summary.totalFats} target={fatsTarget} color="bg-emerald-500" />
              </div>
            </motion.div>
          </section>

          {/* Diet Plans */}
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="font-headline text-3xl font-black uppercase italic tracking-tighter">Diet Plans</h3>
              <button
                onClick={() => { resetDietForm(); setDietModalOpen(true); }}
                className="px-6 py-3 bg-primary text-on-primary font-black text-[10px] uppercase tracking-[0.3em] hover:brightness-110 transition-all"
              >
                Create Diet
              </button>
            </div>

            {/* Page-level fetch error banner */}
            {dietFetchError && (
              <div className="flex items-center justify-between p-4 bg-red-900/20 border border-red-500/40">
                <p className="text-red-400 text-xs font-bold uppercase tracking-widest">
                  {dietFetchError.toLowerCase().includes('unauthorized') || dietFetchError.toLowerCase().includes('401')
                    ? '⚠ Session expired — please log in again to manage diet plans'
                    : `⚠ ${dietFetchError}`}
                </p>
                <button
                  onClick={() => setDietFetchError(null)}
                  className="ml-4 text-red-400 hover:text-red-300 text-xs font-black uppercase tracking-widest"
                >
                  Dismiss
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {diets.map((diet) => {
                const isActive = selectedDietId === diet.id;
                // Coerce to strings for safe ObjectId comparison
                const isOwner = !!(user?._id && String(diet.createdBy) === String(user._id));
                return (
                  <div
                    key={diet.id}
                    onClick={() => setSelectedDietId(diet.id)}
                    className={cn(
                      "bg-surface-container p-6 border cursor-pointer transition-all",
                      isActive ? "border-primary" : "border-outline hover:border-primary/30"
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-on-surface-variant mb-2">Plan</p>
                        <h4 className="font-headline text-xl font-black uppercase italic tracking-tight text-on-surface">{diet.title}</h4>
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary bg-primary/10 px-2 py-1">
                        {diet.meals?.length || 0} Meals
                      </span>
                    </div>
                    {diet.description && (
                      <p className="mt-3 text-sm text-on-surface-variant font-light leading-relaxed line-clamp-3">{diet.description}</p>
                    )}
                    {isOwner && (
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); openEditDiet(diet); }}
                          className="px-3 py-2 border border-outline text-[9px] font-black uppercase tracking-[0.2em] hover:bg-surface-bright transition-all"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); openDeleteDiet(diet); }}
                          className="px-3 py-2 border border-outline text-[9px] font-black uppercase tracking-[0.2em] hover:bg-red-600 hover:text-white hover:border-red-600 transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {diets.length === 0 && (
              <div className="p-12 border-2 border-dashed border-outline flex flex-col items-center justify-center">
                <Leaf className="w-10 h-10 mb-4 text-on-surface-variant/20" />
                <p className="font-headline text-xl font-black uppercase italic tracking-tight text-on-surface-variant mb-2">No Diet Plans Yet</p>
                <p className="text-sm text-on-surface-variant font-light">Create a diet plan to organize your meals.</p>
              </div>
            )}

            {selectedDiet && (
              <div className="bg-surface-container p-8 border border-outline space-y-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.3em] font-black text-on-surface-variant mb-2">Diet Detail</p>
                    <h4 className="font-headline text-2xl font-black uppercase italic tracking-tight text-on-surface">{selectedDiet.title}</h4>
                    {selectedDiet.description && (
                      <p className="mt-2 text-sm text-on-surface-variant font-light max-w-2xl leading-relaxed">{selectedDiet.description}</p>
                    )}
                  </div>
                  {canManageSelectedDiet && (
                    <button
                      onClick={() => { resetDietMealForm(); setAddDietMealModalOpen(true); }}
                      className="px-5 py-3 bg-surface-lowest border border-outline hover:border-primary/40 hover:bg-surface transition-all"
                    >
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">+ Add Meal</span>
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {selectedDiet.meals?.map((meal, idx) => (
                    <div key={meal._id || `${meal.name}-${idx}`} className="bg-surface-low p-5 border border-outline">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className="font-headline text-lg font-black uppercase italic tracking-tight text-on-surface">{meal.name}</p>
                          <p className="text-[10px] uppercase tracking-[0.2em] font-black text-on-surface-variant mt-1">{meal.time || 'Meal'} {meal.quantity ? `• ${meal.quantity}` : ''}</p>
                        </div>
                        <p className="text-sm font-black text-primary">{meal.calories || 0} kcal</p>
                      </div>
                      <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                        <p className="text-on-surface-variant">Protein: <span className="text-on-surface font-bold">{meal.protein || 0}g</span></p>
                        <p className="text-on-surface-variant">Carbs: <span className="text-on-surface font-bold">{meal.carbs || 0}g</span></p>
                        <p className="text-on-surface-variant">Fats: <span className="text-on-surface font-bold">{meal.fats || 0}g</span></p>
                      </div>
                      {meal.notes && (
                        <p className="mt-2 text-xs text-on-surface-variant italic">{meal.notes}</p>
                      )}
                    </div>
                  ))}

                  {(!selectedDiet.meals || selectedDiet.meals.length === 0) && (
                    <div className="p-10 border-2 border-dashed border-outline flex flex-col items-center justify-center">
                      <Info className="w-8 h-8 mb-3 text-on-surface-variant/30" />
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant">No Meals Added</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>

          {/* Meal Log */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-headline text-3xl font-black uppercase italic tracking-tighter">Meal Log</h3>
              <div className="flex gap-4">
                <button className="p-3 bg-surface-container border border-outline hover:bg-surface-bright transition-all">
                  <Search className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => { resetForm(); setFabModalOpen(true); }}
                  className="px-6 py-3 bg-primary text-on-primary font-black text-[10px] uppercase tracking-[0.3em] hover:brightness-110 transition-all"
                >
                  Add Entry
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : (
              <div className="space-y-4">
                {meals.map((meal) => (
                  <MealCard
                    key={meal._id || meal.id}
                    id={meal._id || meal.id}
                    time={meal.time || '—'}
                    type={meal.type}
                    items={meal.items}
                    totalCals={meal.totalCals || meal.calories}
                    icon={typeIcons[meal.type] || Utensils}
                    onEdit={() => openEdit(meal)}
                    onDelete={() => openDelete(meal)}
                  />
                ))}

                {meals.length === 0 && (
                  <div className="p-16 border-2 border-dashed border-outline flex flex-col items-center justify-center">
                    <Utensils className="w-12 h-12 mb-4 text-on-surface-variant/20" />
                    <p className="font-headline text-xl font-black uppercase italic tracking-tight text-on-surface-variant mb-2">No Meals Logged</p>
                    <p className="text-sm text-on-surface-variant font-light">Start by logging your first meal.</p>
                  </div>
                )}

                {/* Add meal CTA */}
                <div 
                  onClick={() => { resetForm(); setFabModalOpen(true); }}
                  className="p-10 border-2 border-dashed border-outline flex flex-col items-center justify-center group cursor-pointer hover:bg-surface-container/30 transition-all"
                >
                  <Plus className="w-8 h-8 text-on-surface-variant mb-4 group-hover:text-primary transition-colors" />
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-on-surface-variant">Log Next Meal</p>
                </div>
              </div>
            )}
          </section>

          {/* Pulse Insight */}
          <section className="bg-surface-bright p-10 border border-primary/20 relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Zap className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h5 className="font-headline text-2xl font-black uppercase italic tracking-tight mb-3">Pulse Insight</h5>
                <p className="text-on-surface-variant text-sm leading-relaxed max-w-2xl font-light">
                  {summary.totalProtein < proteinTarget * 0.7
                    ? `Your current protein intake is ${Math.round(((proteinTarget - summary.totalProtein) / proteinTarget) * 100)}% below target for optimal recovery. We recommend a high-protein meal to prevent muscle catabolism.`
                    : 'Great progress! Your macros are well-balanced today. Keep up the consistent intake.'}
                </p>
              </div>
              <button className="mt-6 md:mt-0 md:ml-auto px-8 py-4 border border-primary text-primary font-black text-[10px] uppercase tracking-[0.3em] hover:bg-primary hover:text-on-primary transition-all whitespace-nowrap flex-shrink-0">
                Adjust Plan
              </button>
            </div>
          </section>
        </div>

        <Footer />
      </main>

      {/* FAB */}
      <button 
        onClick={() => { resetForm(); setFabModalOpen(true); }}
        className="fixed bottom-6 right-6 sm:bottom-12 sm:right-12 w-14 h-14 sm:w-16 sm:h-16 bg-primary text-on-primary flex items-center justify-center shadow-2xl transition-transform active:scale-90 group z-50 hover:brightness-110"
      >
        <Scan className="w-8 h-8" />
      </button>

      {/* ── Create Meal Modal ─────────────────────────────────────── */}
      <Modal isOpen={fabModalOpen} onClose={() => setFabModalOpen(false)} title="Log Meal">
        {error && <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 text-red-500 text-xs font-black uppercase tracking-widest">Error: {error}</div>}
        <form className="space-y-6" onSubmit={handleCreate}>
          {formFields}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-5 bg-primary text-on-primary font-black text-[10px] uppercase tracking-[0.4em] hover:brightness-110 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Log Entry
          </button>
        </form>
      </Modal>

      {/* ── Edit Meal Modal ───────────────────────────────────────── */}
      <Modal isOpen={editModalOpen} onClose={() => { setEditModalOpen(false); resetForm(); }} title="Edit Meal">
        {error && <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 text-red-500 text-xs font-black uppercase tracking-widest">Error: {error}</div>}
        <form className="space-y-6" onSubmit={handleUpdate}>
          {formFields}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-5 bg-primary text-on-primary font-black text-[10px] uppercase tracking-[0.4em] hover:brightness-110 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Save Changes
          </button>
        </form>
      </Modal>

      {/* ── Delete Confirmation Modal ─────────────────────────────── */}
      <Modal isOpen={deleteModalOpen} onClose={() => { setDeleteModalOpen(false); setEditTarget(null); setError(null); }} title="Delete Meal">
        <div className="space-y-8">
          {error && <div className="p-4 bg-red-900/20 border border-red-500/50 text-red-500 text-xs font-black uppercase tracking-widest">Error: {error}</div>}
          <p className="text-on-surface-variant text-sm leading-relaxed">
            Are you sure you want to delete <span className="font-black text-on-surface">{editTarget?.name}</span>? This action cannot be undone.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => { setDeleteModalOpen(false); setEditTarget(null); setError(null); }}
              className="flex-1 py-4 border border-outline text-on-surface font-black text-[10px] uppercase tracking-[0.3em] hover:bg-surface-bright transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={submitting}
              className="flex-1 py-4 bg-red-600 text-white font-black text-[10px] uppercase tracking-[0.3em] hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Delete
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={dietModalOpen} onClose={() => { setDietModalOpen(false); resetDietForm(); }} title="Create Diet Plan">
        <form className="space-y-6" onSubmit={handleCreateDiet}>
          {dietError && <div className="p-4 bg-red-900/20 border border-red-500/50 text-red-500 text-xs font-black uppercase tracking-widest">Error: {dietError}</div>}
          <div className="space-y-2">
            <label htmlFor="diet-title" className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em]">Diet Title</label>
            <input id="diet-title" type="text" value={dietTitle} onChange={(e) => setDietTitle(e.target.value)} className="w-full bg-surface-low border border-outline px-6 py-4 text-sm font-medium text-on-surface focus:ring-1 focus:ring-primary focus:outline-none transition-all" required />
          </div>
          <div className="space-y-2">
            <label htmlFor="diet-desc" className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em]">Description</label>
            <textarea id="diet-desc" value={dietDescription} onChange={(e) => setDietDescription(e.target.value)} rows={4} className="w-full bg-surface-low border border-outline px-6 py-4 text-sm font-medium text-on-surface focus:ring-1 focus:ring-primary focus:outline-none transition-all resize-none" />
          </div>
          <button type="submit" disabled={dietSubmitting} className="w-full py-5 bg-primary text-on-primary font-black text-[10px] uppercase tracking-[0.4em] hover:brightness-110 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3">
            {dietSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Create Diet
          </button>
        </form>
      </Modal>

      <Modal isOpen={dietEditModalOpen} onClose={() => { setDietEditModalOpen(false); resetDietForm(); }} title="Edit Diet Plan">
        <form className="space-y-6" onSubmit={handleUpdateDiet}>
          {dietError && <div className="p-4 bg-red-900/20 border border-red-500/50 text-red-500 text-xs font-black uppercase tracking-widest">Error: {dietError}</div>}
          <div className="space-y-2">
            <label htmlFor="diet-edit-title" className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em]">Diet Title</label>
            <input id="diet-edit-title" type="text" value={dietTitle} onChange={(e) => setDietTitle(e.target.value)} className="w-full bg-surface-low border border-outline px-6 py-4 text-sm font-medium text-on-surface focus:ring-1 focus:ring-primary focus:outline-none transition-all" required />
          </div>
          <div className="space-y-2">
            <label htmlFor="diet-edit-desc" className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em]">Description</label>
            <textarea id="diet-edit-desc" value={dietDescription} onChange={(e) => setDietDescription(e.target.value)} rows={4} className="w-full bg-surface-low border border-outline px-6 py-4 text-sm font-medium text-on-surface focus:ring-1 focus:ring-primary focus:outline-none transition-all resize-none" />
          </div>
          <button type="submit" disabled={dietSubmitting} className="w-full py-5 bg-primary text-on-primary font-black text-[10px] uppercase tracking-[0.4em] hover:brightness-110 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3">
            {dietSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Save Changes
          </button>
        </form>
      </Modal>

      <Modal isOpen={dietDeleteModalOpen} onClose={() => { setDietDeleteModalOpen(false); setDietTarget(null); setDietError(null); }} title="Delete Diet Plan">
        <div className="space-y-8">
          {dietError && <div className="p-4 bg-red-900/20 border border-red-500/50 text-red-500 text-xs font-black uppercase tracking-widest">Error: {dietError}</div>}
          <p className="text-on-surface-variant text-sm leading-relaxed">
            Are you sure you want to delete <span className="font-black text-on-surface">{dietTarget?.title}</span>? This action cannot be undone.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => { setDietDeleteModalOpen(false); setDietTarget(null); setDietError(null); }}
              className="flex-1 py-4 border border-outline text-on-surface font-black text-[10px] uppercase tracking-[0.3em] hover:bg-surface-bright transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteDiet}
              disabled={dietSubmitting}
              className="flex-1 py-4 bg-red-600 text-white font-black text-[10px] uppercase tracking-[0.3em] hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {dietSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Delete
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={addDietMealModalOpen} onClose={() => { setAddDietMealModalOpen(false); resetDietMealForm(); }} title="Add Meal">
        <form className="space-y-6" onSubmit={handleAddMealToDiet}>
          {dietError && <div className="p-4 bg-red-900/20 border border-red-500/50 text-red-500 text-xs font-black uppercase tracking-widest">Error: {dietError}</div>}
          <div className="space-y-2">
            <label htmlFor="diet-meal-name" className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em]">Meal Name</label>
            <input id="diet-meal-name" type="text" value={dietMealName} onChange={(e) => setDietMealName(e.target.value)} className="w-full bg-surface-low border border-outline px-6 py-4 text-sm font-medium text-on-surface focus:ring-1 focus:ring-primary focus:outline-none transition-all" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input type="number" value={dietMealCalories} onChange={(e) => setDietMealCalories(e.target.value)} placeholder="Calories" className="w-full bg-surface-low border border-outline px-4 py-4 text-sm font-medium text-on-surface focus:ring-1 focus:ring-primary focus:outline-none transition-all" />
            <input type="text" value={dietMealQuantity} onChange={(e) => setDietMealQuantity(e.target.value)} placeholder="Quantity" className="w-full bg-surface-low border border-outline px-4 py-4 text-sm font-medium text-on-surface focus:ring-1 focus:ring-primary focus:outline-none transition-all" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <input type="number" value={dietMealProtein} onChange={(e) => setDietMealProtein(e.target.value)} placeholder="Protein (g)" className="w-full bg-surface-low border border-outline px-4 py-4 text-sm font-medium text-on-surface focus:ring-1 focus:ring-primary focus:outline-none transition-all" />
            <input type="number" value={dietMealCarbs} onChange={(e) => setDietMealCarbs(e.target.value)} placeholder="Carbs (g)" className="w-full bg-surface-low border border-outline px-4 py-4 text-sm font-medium text-on-surface focus:ring-1 focus:ring-primary focus:outline-none transition-all" />
            <input type="number" value={dietMealFats} onChange={(e) => setDietMealFats(e.target.value)} placeholder="Fats (g)" className="w-full bg-surface-low border border-outline px-4 py-4 text-sm font-medium text-on-surface focus:ring-1 focus:ring-primary focus:outline-none transition-all" />
          </div>
          <div className="space-y-2">
            <label htmlFor="diet-meal-time" className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em]">Time</label>
            <select id="diet-meal-time" value={dietMealTime} onChange={(e) => setDietMealTime(e.target.value)} className="w-full bg-surface-low border border-outline px-4 py-4 text-sm font-medium text-on-surface focus:ring-1 focus:ring-primary focus:outline-none transition-all">
              <option>Breakfast</option>
              <option>Lunch</option>
              <option>Dinner</option>
            </select>
          </div>
          <textarea value={dietMealNotes} onChange={(e) => setDietMealNotes(e.target.value)} rows={3} placeholder="Notes" className="w-full bg-surface-low border border-outline px-4 py-4 text-sm font-medium text-on-surface focus:ring-1 focus:ring-primary focus:outline-none transition-all resize-none" />
          <button type="submit" disabled={dietSubmitting} className="w-full py-5 bg-primary text-on-primary font-black text-[10px] uppercase tracking-[0.4em] hover:brightness-110 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3">
            {dietSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Add Meal
          </button>
        </form>
      </Modal>
    </div>
  );
}
