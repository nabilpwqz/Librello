"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import LibrelloLogo from "@/components/modules/shared/LibrelloLogo";

export default function SigninForm() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authClient.signIn.email({
        email: loginData.email,
        password: loginData.password,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Welcome back. Session authenticated.", {
              position: "top-right",
              autoClose: 2500,
            });
            router.push("/");
            router.refresh();
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || "Invalid credentials provided.");
          },
        },
      });
    } catch (error) {
      toast.error(error?.message || "Authentication network error.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <section className="min-h-screen grid lg:grid-cols-12 bg-background text-foreground select-none">
      {/* LEFT SIDE: EDITORIAL SPREAD (5 Columns) */}
      <div
        className="hidden lg:flex lg:col-span-5 relative p-12 flex-col justify-between bg-cover bg-center border-r border-border"
        style={{ backgroundImage: "url('/images/signin.png')" }}
      >
        <div className="absolute inset-0 bg-background/88 dark:bg-background/92" />

        <div className="relative z-10 space-y-6">
          <LibrelloLogo />
          <div className="pt-8 space-y-3">
            <span className="editorial-badge">
              Member Sanctuary
            </span>
            <h1 className="text-3xl font-serif font-medium leading-snug text-foreground">
              Where Every Book <br />
              <span className="italic text-primary">Finds Its Place.</span>
            </h1>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
              Sign in to manage your active loans, review preserved manuscripts,
              and connect with fellow reading circles.
            </p>
          </div>
        </div>

        <div className="relative z-10 border-t border-border/70 pt-4">
          <p className="text-xs font-serif italic text-muted-foreground">
            "Turn pages. Find more."
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: CLEAN MINIMAL SIGN IN FORM (7 Columns) */}
      <div className="lg:col-span-7 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left space-y-2">
            <div className="lg:hidden flex justify-center mb-4">
              <LibrelloLogo />
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-foreground tracking-tight">
              Sign In to Your Account
            </h2>
            <p className="text-xs text-muted-foreground">
              Enter your registered archival credentials below.
            </p>
          </div>

          <form onSubmit={handleSignin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="reader@librello.com"
                required
                value={loginData.email}
                onChange={handleInputChange}
                className="input-field"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  required
                  value={loginData.password}
                  onChange={handleInputChange}
                  className="input-field pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full !py-2.5 text-xs uppercase tracking-wider font-semibold disabled:opacity-50 mt-2"
            >
              {loading ? "Authenticating..." : "Access Portal"}
            </button>
          </form>

          <div className="pt-4 border-t border-border text-center text-xs text-muted-foreground">
            Do not have an archival membership?{" "}
            <Link
              href="/signup"
              className="text-primary font-semibold hover:underline"
            >
              Apply for Membership
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
