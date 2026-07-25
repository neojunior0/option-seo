'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Trash2, Save, AlertTriangle, Download, Upload } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

const SEO_DATA_KEYS = [
  'optionseo_saved_keywords',
  'optionseo_rank_tracking',
  'optionseo_audits',
  'optionseo_history_keywords',
  'optionseo_history_domain',
  'optionseo_history_backlinks',
  'optionseo_history_brand-lookup',
  'optionseo_history_prompt-explorer',
] as const;

export default function ProfilePage() {
  const { user, getApiKeys, saveApiKeys, deleteAccount } = useAuth();
  const router = useRouter();
  const [openrouter, setOpenrouter] = useState('');
  const [dfsLogin, setDfsLogin] = useState('');
  const [dfsPassword, setDfsPassword] = useState('');
  const [loaded, setLoaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!user) return;
    const keys = getApiKeys();
    setOpenrouter(keys.openrouter ?? '');
    setDfsLogin(keys.dataforseoLogin ?? '');
    setDfsPassword(keys.dataforseoPassword ?? '');
    setLoaded(true);
  }, [user, getApiKeys]);

  if (!user) return null;

  const handleSave = () => {
    saveApiKeys({
      openrouter: openrouter.trim() || undefined,
      dataforseoLogin: dfsLogin.trim() || undefined,
      dataforseoPassword: dfsPassword || undefined,
    });
    toast.success('API keys saved to your browser.');
  };

  const handleDelete = () => {
    deleteAccount();
    toast.success('Your account and all saved data have been deleted.');
    router.push('/');
  };

  const handleExport = () => {
    const data: Record<string, unknown> = {
      _meta: {
        exportedAt: new Date().toISOString(),
        user: user?.username ?? 'unknown',
      },
    };
    SEO_DATA_KEYS.forEach((key) => {
      try {
        const stored = localStorage.getItem(key);
        if (stored) data[key] = JSON.parse(stored);
      } catch {
        // skip invalid entries
      }
    });
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `optionseo-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Data exported to JSON file');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (!data || typeof data !== 'object') {
          toast.error('Invalid JSON file');
          return;
        }
        let imported = 0;
        Object.entries(data).forEach(([key, value]) => {
          if (SEO_DATA_KEYS.includes(key as (typeof SEO_DATA_KEYS)[number])) {
            localStorage.setItem(key, JSON.stringify(value));
            imported++;
          }
        });
        if (imported > 0) {
          toast.success(`Imported ${imported} data ${imported === 1 ? 'set' : 'sets'} — reloading…`);
          setTimeout(() => window.location.reload(), 1500);
        } else {
          toast.error('No valid OptionSEO data found in file');
        }
      } catch {
        toast.error('Failed to parse JSON file');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <div className="flex items-center gap-2">
        <Search className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Profile & API Keys</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>
            Your account lives only in this browser. No data is sent to a server.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between rounded-md bg-muted/40 px-4 py-3">
            <div>
              <p className="text-sm text-muted-foreground">Username</p>
              <p className="font-medium">{user.username}</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Joined {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>
            Paste your own keys here. OptionSEO uses your quota directly — we
            never store or see your keys on any server.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="openrouter">OpenRouter API Key</Label>
            <Input
              id="openrouter"
              type="password"
              placeholder="sk-or-v1-…"
              value={openrouter}
              onChange={(e) => setOpenrouter(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Used for AI-powered features (Prompt Explorer, AI Insight Agent). Get a key at
              openrouter.ai.
            </p>
          </div>

          <div className="space-y-2">
            <Label>DataForSEO Credentials</Label>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="dfs-login" className="text-xs">
                  Login
                </Label>
                <Input
                  id="dfs-login"
                  placeholder="your@email.com"
                  value={dfsLogin}
                  onChange={(e) => setDfsLogin(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="dfs-password" className="text-xs">
                  Password
                </Label>
                <Input
                  id="dfs-password"
                  type="password"
                  placeholder="••••••••"
                  value={dfsPassword}
                  onChange={(e) => setDfsPassword(e.target.value)}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Used for all SEO data (keywords, backlinks, domain, audits, etc.).
              Requests go through a keyless proxy that forwards your header
              straight to DataForSEO. Get credentials at dataforseo.com.
            </p>
          </div>

          <Button onClick={handleSave} disabled={!loaded} className="w-full sm:w-auto">
            <Save className="mr-2 h-4 w-4" />
            Save Keys
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Import / Export Data</CardTitle>
          <CardDescription>
            Save your SEO data (saved keywords, tracked domains, audits, search
            history) to a JSON file, or load previously exported data back into
            your browser.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export to JSON
          </Button>
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
            <Upload className="mr-2 h-4 w-4" />
            Import from JSON
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            onChange={handleImport}
            className="hidden"
          />
        </CardContent>
      </Card>

      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Permanently delete your account and all stored API keys from this
            browser. This cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will remove your username, password, and all API keys
                  from this browser&apos;s local storage. Any saved keywords or
                  tracked data will also be lost. This action is permanent.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Yes, delete everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
