"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Hand, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { authClient } from "@/lib/auth/client";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await authClient.signIn.email({
        email,
        password,
      });

      if (res.error) {
        setError(res.error.message || "Failed to sign in. Please verify your credentials.");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred during sign in.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleLoading(true);

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: window.location.origin + "/",
      });
    } catch (err: any) {
      setError(err?.message || "Failed to initialize Google authentication.");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50/60 p-4">
      <div className="w-full max-w-md">
        {/* Back Link & Brand */}
        <div className="mb-6 flex flex-col items-center text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 mb-5 text-xs font-mono text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Gesturify</span>
          </Link>
          <div className="w-11 h-11 rounded-xl bg-amethyst_smoke-400 flex items-center justify-center text-white shadow-xs mb-3">
            <Hand className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold font-mono text-zinc-900">Sign In to Gesturify</h1>
          <p className="text-xs text-zinc-500 font-mono mt-1">
            Access your practice drills and translation history
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-zinc-200/90 rounded-2xl p-7 shadow-xs">
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-mono flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white border border-zinc-200 hover:border-zinc-400 rounded-xl text-xs font-mono font-medium text-zinc-800 hover:bg-zinc-50 transition-all cursor-pointer shadow-xs disabled:opacity-50"
          >
            {googleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-zinc-500" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200"></div>
            </div>
            <div className="relative flex justify-center text-[11px] font-mono text-zinc-400 uppercase tracking-widest">
              <span className="bg-white px-3">or continue with email</span>
            </div>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-medium text-zinc-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3.5 py-2 text-xs font-mono bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amethyst_smoke-400 focus:border-transparent text-zinc-900 placeholder:text-zinc-400"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono font-medium text-zinc-700">
                  Password
                </label>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2 text-xs font-mono bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amethyst_smoke-400 focus:border-transparent text-zinc-900 placeholder:text-zinc-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full mt-2 py-2.5 px-4 bg-amethyst_smoke-400 hover:bg-amethyst_smoke-500 text-white rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Sign In</span>
            </button>
          </form>

          {/* Card Footer */}
          <div className="mt-6 pt-5 border-t border-zinc-100 text-center">
            <p className="text-xs font-mono text-zinc-500">
              Don&apos;t have an account?{" "}
              <Link
                href="/sign-up"
                className="font-semibold text-zinc-900 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Database info banner */}
        <div className="mt-4 text-center">
          <span className="text-[11px] font-mono text-zinc-400">
            Secured by Neon Auth on Postgres (autumn-darkness-76788986)
          </span>
        </div>
      </div>
    </div>
  );
}
