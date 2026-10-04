"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import LibrelloLogo from "@/components/modules/shared/LibrelloLogo";

export default function SignupForm() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    photoUrl: "",
    role: "user",
  });

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (selectedRole) => {
    setFormData((prev) => ({
      ...prev,
      role: selectedRole,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return toast.error("Please upload a valid image file.");
    }

    setUploadingImage(true);
    const toastId = toast.loading("Uploading member avatar...");

    const imgBBFormData = new FormData();
    imgBBFormData.append("image", file);

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        {
          method: "POST",
          body: imgBBFormData,
        }
      );

      const data = await response.json();

      if (data.success) {
        setFormData((prev) => ({
          ...prev,
          photoUrl: data.data.url,
        }));
        toast.update(toastId, {
          render: "Avatar uploaded successfully.",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
      } else {
        throw new Error("Upload error");
      }
    } catch (error) {
      toast.update(toastId, {
        render: "Image upload failed. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 2500,
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match.", {
        position: "top-right",
      });
    }

    if (uploadingImage) {
      return toast.warn("Please wait until the avatar upload finishes.");
    }

    setLoading(true);

    try {
      await authClient.signUp.email(
        {
          email: formData.email,
          password: formData.password,
          name: formData.name,
          image: formData.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
          role: formData.role,
        },
        {
          onSuccess: async (ctx) => {
            if (ctx?.data?.token || ctx?.data?.user) {
              const apiBase = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "");
              fetch(`${apiBase}/api/send-email`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  email: formData.email,
                  name: formData.name,
                  image: formData.photoUrl,
                  role: formData.role,
                }),
              }).catch(() => {});
            }

            toast.success("Welcome to Librello. Account created successfully.", {
              position: "top-right",
              autoClose: 2500,
            });

            setTimeout(() => {
              router.push("/");
              router.refresh();
            }, 1000);
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || "Failed to create membership.");
          },
        }
      );
    } catch (error) {
      toast.error(error?.message || "Registration network error.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <section className="min-h-screen grid lg:grid-cols-12 bg-background text-foreground select-none">
      {/* LEFT SIDE: EDITORIAL SPREAD */}
      <div
        className="hidden lg:flex lg:col-span-5 relative p-12 flex-col justify-between bg-cover bg-center border-r border-border"
        style={{ backgroundImage: "url('/images/signup.png')" }}
      >
        <div className="absolute inset-0 bg-background/88 dark:bg-background/92" />

        <div className="relative z-10 space-y-6">
          <LibrelloLogo />
          <div className="pt-8 space-y-3">
            <span className="editorial-badge">
              Membership Invitation
            </span>
            <h1 className="text-3xl font-serif font-medium leading-snug text-foreground">
              Turn Pages. <br />
              <span className="italic text-primary">Find More.</span>
            </h1>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
              Join an international sanctuary of bibliophiles, university
              collectors, and preservationists dedicated to the life of the
              physical book.
            </p>
          </div>
        </div>

        <div className="relative z-10 border-t border-border/70 pt-4">
          <p className="text-xs font-serif italic text-muted-foreground">
            Librello: Discover. Read. Share.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: MEMBERSHIP FORM */}
      <div className="lg:col-span-7 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-lg space-y-6">
          <div className="text-center lg:text-left space-y-1.5">
            <div className="lg:hidden flex justify-center mb-4">
              <LibrelloLogo />
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-foreground tracking-tight">
              Apply for Archival Membership
            </h2>
            <p className="text-xs text-muted-foreground">
              Complete the registration form to unlock physical catalog circulation.
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            {/* Role Switcher */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Membership Category
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleRoleChange("user")}
                  className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                    formData.role === "user"
                      ? "border-primary bg-card text-primary font-semibold shadow-xs"
                      : "border-border bg-card-soft text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Reader / Member
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange("librarian")}
                  className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                    formData.role === "librarian"
                      ? "border-primary bg-card text-primary font-semibold shadow-xs"
                      : "border-border bg-card-soft text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Archivist / Curator
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Elena Vance"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="elena@example.com"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
            </div>

            {/* Avatar Upload */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                <span>Member Portrait (Optional)</span>
                {formData.photoUrl && (
                  <span className="text-primary text-[10px] font-semibold">
                    Portrait Attached
                  </span>
                )}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="input-field !h-10 pt-1.5 file:mr-3 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-card-soft file:text-foreground hover:file:bg-card cursor-pointer text-xs text-muted-foreground"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    value={formData.password}
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

              <div className="space-y-1.5">
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="••••••••"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="input-field pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || uploadingImage}
              className="btn-primary w-full !py-2.5 text-xs uppercase tracking-wider font-semibold disabled:opacity-50 mt-3"
            >
              {loading ? "Registering..." : "Submit Application"}
            </button>
          </form>

          <div className="pt-4 border-t border-border text-center text-xs text-muted-foreground">
            Already hold an archival membership?{" "}
            <Link
              href="/signin"
              className="text-primary font-semibold hover:underline"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
