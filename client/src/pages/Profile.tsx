import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Shield, Target, LogOut, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { Footer } from '@/components/layout/Footer';
import { Modal } from '@/components/ui/Modal';
import { useAuth, type User as ProfileUser } from '@/context/AuthContext';
import { authAPI } from '@/lib/api';
import { cn } from '@/lib/utils';

const FITNESS_GOALS = ['Fat Loss', 'Muscle Gain', 'Maintenance', 'General Fitness'] as const;
const ACTIVITY_LEVELS = ['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active'] as const;
const DIETARY = ['No Preference', 'Vegetarian', 'Vegan', 'Keto', 'Paleo'] as const;
const GENDERS = ['Male', 'Female', 'Other'] as const;

function initials(name: string, email: string) {
  const n = name?.trim();
  if (n) {
    const p = n.split(/\s+/);
    if (p.length >= 2) return (p[0][0] + p[1][0]).toUpperCase();
    return n.slice(0, 2).toUpperCase();
  }
  return email?.slice(0, 2).toUpperCase() || 'U';
}

export default function Profile() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    height: '' as string | number,
    weight: '' as string | number,
    age: '' as string | number,
    gender: '',
    fitnessGoal: '',
    activityLevel: '',
    dietaryPreference: '',
  });

  const [passwordOpen, setPasswordOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    next: '',
    confirm: '',
  });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await authAPI.getProfile();
      const u = res.data.data as ProfileUser;
      setProfile(u);
      setForm({
        name: u.name || '',
        phone: u.phone || '',
        height: u.height ?? '',
        weight: u.weight ?? '',
        age: u.age ?? '',
        gender: u.gender || '',
        fitnessGoal: u.fitnessGoal || '',
        activityLevel: u.activityLevel || '',
        dietaryPreference: u.dietaryPreference || '',
      });
    } catch {
      setLoadError('Could not load profile. Try again.');
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    try {
      await authAPI.updateProfile({
        name: form.name.trim(),
        phone: form.phone.trim(),
        height: form.height === '' ? undefined : Number(form.height),
        weight: form.weight === '' ? undefined : Number(form.weight),
        age: form.age === '' ? undefined : Number(form.age),
        gender: form.gender || undefined,
        fitnessGoal: form.fitnessGoal || undefined,
        activityLevel: form.activityLevel || undefined,
        dietaryPreference: form.dietaryPreference || undefined,
      });
      await refreshUser();
      await loadProfile();
      setEditOpen(false);
    } catch (err: unknown) {
      const m = err instanceof Error ? err.message : 'Save failed';
      alert(m);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    if (passwordForm.next !== passwordForm.confirm) {
      setPasswordError('New passwords do not match.');
      return;
    }
    setPasswordSaving(true);
    try {
      await authAPI.changePassword(passwordForm.current, passwordForm.next);
      setPasswordOpen(false);
      setPasswordForm({ current: '', next: '', confirm: '' });
    } catch (err: unknown) {
      setPasswordError(err instanceof Error ? err.message : 'Could not update password');
    } finally {
      setPasswordSaving(false);
    }
  };

  const updatePreference = async (
    key: keyof NonNullable<ProfileUser['preferences']>,
    value: boolean
  ) => {
    const next = {
      ...(profile?.preferences || {}),
      [key]: value,
    };
    try {
      await authAPI.updateProfile({ preferences: next });
      await refreshUser();
      setProfile((p) => (p ? { ...p, preferences: next } : null));
    } catch {
      /* ignore */
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const stats = profile?.stats;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <TopBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

      <main className="lg:ml-64 pt-20">
        <div className="p-6 md:p-12 max-w-7xl mx-auto space-y-12">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant">
                Loading profile
              </p>
            </div>
          ) : loadError ? (
            <div className="text-center py-16 space-y-4">
              <p className="text-on-surface">{loadError}</p>
              <button
                type="button"
                onClick={loadProfile}
                className="px-8 py-3 bg-primary text-on-primary text-[10px] font-black uppercase tracking-[0.3em]"
              >
                Retry
              </button>
            </div>
          ) : profile ? (
            <>
              <section className="bg-surface-container p-8 md:p-12 border border-outline relative overflow-hidden">
                <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
                  <div className="relative">
                    <div className="w-28 h-28 sm:w-40 sm:h-40 rounded-sm overflow-hidden border-2 border-primary/20 flex items-center justify-center bg-surface-low">
                      {profile.avatar ? (
                        <img
                          src={profile.avatar}
                          alt=""
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span className="text-3xl sm:text-4xl font-headline font-black text-primary">
                          {initials(profile.name, profile.email)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                      <h2 className="font-headline text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-on-surface">
                        {profile.name}
                      </h2>
                      <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-[9px] font-black uppercase tracking-[0.3em] border border-primary/20">
                        {profile.tier || 'Starter'} tier
                      </span>
                    </div>
                    <p className="text-on-surface-variant max-w-md font-light leading-relaxed mb-8">
                      {profile.email}
                      {profile.createdAt && (
                        <span className="block mt-2 text-[10px] uppercase tracking-widest text-on-surface-variant/60">
                          Member since{' '}
                          {new Date(profile.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      )}
                    </p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-6 sm:gap-8">
                      <ProfileStat
                        label="Consistency"
                        value={
                          stats?.consistency != null ? `${stats.consistency}%` : '—'
                        }
                      />
                      <ProfileStat
                        label="Workouts (profile)"
                        value={
                          stats?.totalWorkouts != null ? `${stats.totalWorkouts}` : '—'
                        }
                      />
                      <ProfileStat
                        label="Level"
                        value={stats?.level != null ? `${stats.level}` : '—'}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setEditOpen(true)}
                      className="px-8 py-4 bg-primary text-on-primary font-black text-[10px] uppercase tracking-[0.3em] hover:brightness-110 transition-all"
                    >
                      Edit profile
                    </button>
                    <button
                      type="button"
                      onClick={() => setPasswordOpen(true)}
                      className="px-8 py-4 border border-outline text-on-surface font-black text-[10px] uppercase tracking-[0.3em] hover:bg-surface-bright transition-all"
                    >
                      Change password
                    </button>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -mr-48 -mt-48 blur-3xl" />
              </section>

              <div className="grid grid-cols-12 gap-10">
                <div className="col-span-12 lg:col-span-8 space-y-10">
                  <section>
                    <div className="flex items-center gap-3 mb-8">
                      <Shield className="w-5 h-5 text-primary" />
                      <h3 className="font-headline text-2xl font-black uppercase italic tracking-tight">
                        Body &amp; account
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <ReadOnlyRow label="Email" value={profile.email} />
                      <ReadOnlyRow label="Phone" value={profile.phone || '—'} />
                      <ReadOnlyRow
                        label="Height (cm)"
                        value={profile.height != null ? String(profile.height) : '—'}
                      />
                      <ReadOnlyRow
                        label="Weight (kg)"
                        value={profile.weight != null ? String(profile.weight) : '—'}
                      />
                      <ReadOnlyRow
                        label="Age"
                        value={profile.age != null ? String(profile.age) : '—'}
                      />
                      <ReadOnlyRow label="Gender" value={profile.gender || '—'} />
                    </div>
                  </section>

                  <section>
                    <div className="flex items-center gap-3 mb-8">
                      <Target className="w-5 h-5 text-primary" />
                      <h3 className="font-headline text-2xl font-black uppercase italic tracking-tight">
                        Goals
                      </h3>
                    </div>
                    <div className="space-y-3">
                      <ReadOnlyRow
                        label="Fitness goal"
                        value={profile.fitnessGoal || '—'}
                      />
                      <ReadOnlyRow
                        label="Activity level"
                        value={profile.activityLevel || '—'}
                      />
                      <ReadOnlyRow
                        label="Dietary preference"
                        value={profile.dietaryPreference || '—'}
                      />
                    </div>
                  </section>
                </div>

                <div className="col-span-12 lg:col-span-4 space-y-8">
                  <section className="bg-surface-container p-8 border border-outline">
                    <h3 className="font-headline text-xl font-black uppercase italic tracking-tight mb-6">
                      Subscription
                    </h3>
                    <p className="text-sm text-on-surface mb-2">
                      Plan:{' '}
                      <span className="font-bold">
                        {profile.subscription?.plan || 'Free'}
                      </span>
                    </p>
                    <p className="text-sm text-on-surface-variant mb-4">
                      Status: {profile.subscription?.status || '—'}
                    </p>
                    <p className="text-xs text-on-surface-variant/70">
                      Billing management will appear here when connected to payments.
                    </p>
                  </section>

                  <section className="bg-surface-container p-8 border border-outline">
                    <h3 className="font-headline text-xl font-black uppercase italic tracking-tight mb-8">
                      Preferences
                    </h3>
                    <div className="space-y-6">
                      <ToggleRow
                        label="Biometric sync"
                        value={profile.preferences?.biometricSync ?? true}
                        onChange={(v) => updatePreference('biometricSync', v)}
                      />
                      <ToggleRow
                        label="Dark mode"
                        value={profile.preferences?.darkMode ?? true}
                        onChange={(v) => updatePreference('darkMode', v)}
                      />
                      <ToggleRow
                        label="Push notifications"
                        value={profile.preferences?.pushNotifications ?? false}
                        onChange={(v) => updatePreference('pushNotifications', v)}
                      />
                      <ToggleRow
                        label="Public profile"
                        value={profile.preferences?.publicProfile ?? false}
                        onChange={(v) => updatePreference('publicProfile', v)}
                      />
                    </div>
                    <div className="mt-12 pt-8 border-t border-outline">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center justify-between text-on-surface-variant hover:text-primary transition-colors group"
                      >
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                          Log out
                        </span>
                        <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </section>
                </div>
              </div>
            </>
          ) : null}
        </div>

        <Footer />
      </main>

      <Modal title="Edit profile" isOpen={editOpen} onClose={() => setEditOpen(false)}>
        <form onSubmit={handleSaveProfile} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <Field
            label="Name"
            value={form.name}
            onChange={(v) => setForm((f) => ({ ...f, name: v }))}
          />
          <Field
            label="Phone"
            value={form.phone}
            onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field
              label="Height (cm)"
              type="number"
              value={form.height}
              onChange={(v) => setForm((f) => ({ ...f, height: v }))}
            />
            <Field
              label="Weight (kg)"
              type="number"
              value={form.weight}
              onChange={(v) => setForm((f) => ({ ...f, weight: v }))}
            />
            <Field
              label="Age"
              type="number"
              value={form.age}
              onChange={(v) => setForm((f) => ({ ...f, age: v }))}
            />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant block mb-2">
              Gender
            </label>
            <select
              value={form.gender}
              onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
              className="w-full bg-surface-low border border-outline px-4 py-3 text-sm text-on-surface"
            >
              <option value="">—</option>
              {GENDERS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant block mb-2">
              Fitness goal
            </label>
            <select
              value={form.fitnessGoal}
              onChange={(e) => setForm((f) => ({ ...f, fitnessGoal: e.target.value }))}
              className="w-full bg-surface-low border border-outline px-4 py-3 text-sm text-on-surface"
            >
              <option value="">—</option>
              {FITNESS_GOALS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant block mb-2">
              Activity level
            </label>
            <select
              value={form.activityLevel}
              onChange={(e) => setForm((f) => ({ ...f, activityLevel: e.target.value }))}
              className="w-full bg-surface-low border border-outline px-4 py-3 text-sm text-on-surface"
            >
              <option value="">—</option>
              {ACTIVITY_LEVELS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant block mb-2">
              Dietary preference
            </label>
            <select
              value={form.dietaryPreference}
              onChange={(e) =>
                setForm((f) => ({ ...f, dietaryPreference: e.target.value }))
              }
              className="w-full bg-surface-low border border-outline px-4 py-3 text-sm text-on-surface"
            >
              <option value="">—</option>
              {DIETARY.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="w-full py-4 bg-primary text-on-primary font-black text-[10px] uppercase tracking-[0.3em] disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      </Modal>

      <Modal title="Change password" isOpen={passwordOpen} onClose={() => setPasswordOpen(false)}>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <Field
            label="Current password"
            type="password"
            value={passwordForm.current}
            onChange={(v) => setPasswordForm((f) => ({ ...f, current: v }))}
          />
          <Field
            label="New password"
            type="password"
            value={passwordForm.next}
            onChange={(v) => setPasswordForm((f) => ({ ...f, next: v }))}
          />
          <Field
            label="Confirm new password"
            type="password"
            value={passwordForm.confirm}
            onChange={(v) => setPasswordForm((f) => ({ ...f, confirm: v }))}
          />
          {passwordError && (
            <p className="text-xs text-red-400 font-light">{passwordError}</p>
          )}
          <button
            type="submit"
            disabled={passwordSaving}
            className="w-full py-4 bg-primary text-on-primary font-black text-[10px] uppercase tracking-[0.3em] disabled:opacity-50"
          >
            {passwordSaving ? 'Updating…' : 'Update password'}
          </button>
        </form>
      </Modal>
    </div>
  );
}

function ProfileStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-[0.3em] mb-1">
        {label}
      </span>
      <span className="text-2xl font-headline font-black text-on-surface italic">{value}</span>
    </div>
  );
}

function ReadOnlyRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface-low/50 border border-outline/50 p-4 rounded-sm">
      <p className="text-[9px] font-black uppercase tracking-[0.3em] text-on-surface-variant mb-1">
        {label}
      </p>
      <p className="text-on-surface font-medium">{value}</p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-surface-low border border-outline px-4 py-3 text-sm text-on-surface focus:ring-1 focus:ring-primary focus:outline-none"
      />
    </div>
  );
}

function ToggleRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em]">
        {label}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={cn(
          'w-10 h-5 rounded-full relative transition-all duration-300 shrink-0',
          value ? 'bg-primary' : 'bg-surface-highest'
        )}
      >
        <motion.div
          layout
          className={cn(
            'absolute top-1 w-3 h-3 bg-white rounded-full',
            value ? 'right-1' : 'left-1'
          )}
        />
      </button>
    </div>
  );
}
