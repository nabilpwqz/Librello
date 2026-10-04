"use client";

import { addBooksByLibrarian } from "@/lib/actions/librarian";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { FiPlusCircle, FiLoader, FiUploadCloud } from "react-icons/fi";
import { Sparkles, Wand2 } from "lucide-react";
import { scanBookCover } from "@/lib/api/ai";
import { toast } from "react-toastify";

const LibrarianAddBook = () => {
  const [loading, setLoading] = useState(false);
  const [aiScanning, setAiScanning] = useState(false);
  const [aiScanStatus, setAiScanStatus] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    fee: "",
    category: "Fiction",
    description: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const { data: session } = authClient.useSession();
  const user = session?.user;

  // ইনপুট ফিল্ড ট্র্যাকিং
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ইমেজ সিলেক্ট এবং স্ক্রিনে লাইভ প্রিভিউ দেখানো
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Helper: Resize high-res smartphone/camera images to fast 1024px for lightning-fast AI vision
  const resizeImageForAI = (file, maxDimension = 1024) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          resolve(canvas.toDataURL("image/jpeg", 0.85));
        };
        img.onerror = reject;
        img.src = e.target.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  //  AI Multimodal Book Cover Scanning & Auto-Fill
  const handleAiScanCover = async (fileToScan?: any) => {
    const targetFile = fileToScan || imageFile;
    if (!targetFile) {
      document.getElementById("book-cover-input")?.click();
      return toast.info("Please select a book cover image first to auto-fill!");
    }

    setAiScanning(true);
    setAiScanStatus("AI Vision inspecting book cover...");

    try {
      // 1. Optimize image (under 100KB for lightning fast transfer)
      const base64Data = await resizeImageForAI(targetFile, 1024);

      // 2. Send to backend AI endpoint
      const res = await scanBookCover(base64Data, "image/jpeg");

      if (res.success && res.book) {
        setFormData((prev) => ({
          ...prev,
          title: res.book.title || prev.title,
          author: res.book.author || prev.author,
          category: res.book.category || prev.category,
          fee: res.book.fee !== undefined ? String(res.book.fee) : prev.fee,
          description: res.book.description || prev.description,
        }));

        toast.success(
          ` AI auto-filled: "${res.book.title}" by ${res.book.author}! (${res.provider || "AI Vision"})`
        );
      } else {
        throw new Error(res.error || "Could not extract book details.");
      }
    } catch (err) {
      console.error("AI Scan Error:", err);
      toast.error(err.message || "Failed to scan book cover. You can fill details manually.");
    } finally {
      setAiScanning(false);
      setAiScanStatus("");
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    //  ইমেজ সিলেক্ট না থাকলে আগেই আটকে দেওয়া
    if (!imageFile) {
      return toast.error("Please upload a book cover image before submitting!");
    }

    setLoading(true);

    try {
      //  imgBB ক্লাউড স্টোরেজে ইমেজ আপলোড পাইপলাইন
      const imgApiData = new FormData();
      imgApiData.append("image", imageFile);

      const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

      const imgbbUrl = `https://api.imgbb.com/1/upload?key=${apiKey}`;

      const imgResponse = await fetch(imgbbUrl, {
        method: "POST",
        body: imgApiData,
      });

      if (!imgResponse.ok) {
        throw new Error(
          `Cloud storage handshake failed with status ${imgResponse.status}`,
        );
      }

      const imgResult = await imgResponse.json();

      if (!imgResult?.success || !imgResult?.data?.display_url) {
        throw new Error(
          imgResult?.message || "Image extraction from imgBB failed!",
        );
      }

      // imgBB ক্লাউড থেকে জেনারেট হওয়া রিয়েল-টাইম লাইভ সিডিএন লিঙ্ক
      const liveImageUrl = imgResult.data.display_url;

      const finalBookPayload = {
        title: formData.title?.trim(),
        author: formData.author?.trim(),
        fee: Number(formData.fee) || 0,
        category: formData.category,
        description: formData.description?.trim(),
        cover: liveImageUrl,
        status: "Pending Approval",
        librarianName: user?.name || "Anonymous Provider",
        librarianEmail: user?.email,
        librarianId: user?.id,
        librarianImage: user?.image,
      };

      const res = await addBooksByLibrarian(finalBookPayload);

      if (res?.success || res?.insertedId || res?.acknowledged) {
        toast.success(
          `"${formData.title}" added successfully! Awaiting Admin Approval.`,
        );

        // ফর্ম ও প্রিভিউ মেমোরি ফ্লাশ (Reset) করা
        // setFormData({
        //   title: "",
        //   author: "",
        //   fee: "",
        //   category: "Fiction",
        //   description: "",
        // });
        // setImageFile(null);
        // e.target.reset();

        // প্রজেক্টের ফ্লো অনুযায়ী রাউটার একশন
        // router.push("/dashboard/librarian");
        // router.refresh();
      } else {
        throw new Error(
          res?.message || "Database engine declined the ingestion request.",
        );
      }
    } catch (error) {
      console.error(" [CRITICAL PIPELINE ERROR]:", error);
      toast.error(
        error.message || "An unexpected system execution failure occurred!",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl pt-6 mx-auto space-y-6 select-none animate-fadeIn">
      <div>
        <h1 className="text-3xl font-bold tracking-tight Poppins">
          Add New Book
        </h1>
        <p className="text-base sm:text-sm text-muted-foreground mt-1 Urbanist">
          List a physical book into the repository pipeline. Requires admin
          clearance.
        </p>
      </div>

      <div className="dashboard-card p-6 border border-border/40 rounded-2xl bg-card">
        <div className="flex items-center gap-2 mb-6 border-b border-border/40 pb-3">
          <FiPlusCircle className="text-primary" size={18} />
          <h3 className="text-lg sm:text-base font-bold Poppins">
            Book Specifications
          </h3>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5 Urbanist"
        >
          <div>
            <label className="text-base sm:text-sm font-bold text-muted-foreground block mb-2">
              Book Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter formal book title"
              className="input-field w-full"
              required
            />
          </div>

          <div>
            <label className="text-base sm:text-sm font-bold text-muted-foreground block mb-2">
              Author Name
            </label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              placeholder="Virginia Woolf"
              className="input-field w-full"
              required
            />
          </div>

          <div>
            <label className="text-base sm:text-sm font-bold text-muted-foreground block mb-2">
              Delivery Fee ($)
            </label>
            <input
              type="number"
              name="fee"
              value={formData.fee}
              onChange={handleInputChange}
              placeholder="Set handling charge in $USD"
              className="input-field w-full"
              required
            />
          </div>

          <div>
            <label className="text-base sm:text-sm font-bold text-muted-foreground block mb-2">
              Genre Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="input-field w-full bg-card cursor-pointer"
            >
              <option>Fiction</option>
              <option>Sci-Fi</option>
              <option>Academic</option>
              <option>Biography</option>
              <option>Mystery</option>
              <option>History</option>
              <option>Self-Help</option>
              <option>General</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="text-base sm:text-sm font-bold text-muted-foreground block mb-2">
              Full Description Summary
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Summarize the core content, condition, and parcel logistics terms..."
              className="input-field w-full h-28 py-2 resize-none"
              required
            />
          </div>

          {/* ️ IMGBB IMAGE UPLOAD CONTAINER WITH LIVE PREVIEW & AI SCANNER */}
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 items-center border-2 border-dashed border-border/60 rounded-xl p-5 bg-card-soft/10 relative overflow-hidden">
            <div className="md:col-span-2 text-center md:text-left space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h5 className="text-lg sm:text-base font-bold flex items-center justify-center md:justify-start gap-2">
                  <FiUploadCloud className="text-primary" /> Cover Image Upload
                </h5>

                {/*  Prominent AI Auto-Fill Button */}
                <button
                  type="button"
                  onClick={() => handleAiScanCover()}
                  disabled={aiScanning}
                  title={imageFile ? "Click to scan and auto-fill details" : "Select an image to auto-fill"}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-primary text-background hover:opacity-90 shadow-md hover:shadow-primary/30 transition-all cursor-pointer disabled:opacity-50"
                >
                  {aiScanning ? (
                    <>
                      <FiLoader className="animate-spin" size={13} />
                      <span>AI Vision Scanning...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={13} className="text-amber-200 animate-pulse" />
                      <span> AI Auto-Fill from Cover</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-muted-foreground">
                Select a high-resolution portrait cover. Upload streams
                instantly to imgBB storage cluster.
              </p>

              <input
                id="book-cover-input"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="text-base sm:text-sm mt-2 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-base sm:text-sm file:font-bold file:bg-primary/10 file:text-primary file:cursor-pointer"
                required
              />

              {previewUrl && !formData.title && (
                <p className="text-[11px] text-primary/90 font-medium flex items-center gap-1 mt-1 animate-pulse">
                  <Sparkles size={12} />
                  <span>Cover selected! Click <strong>" AI Auto-Fill from Cover"</strong> above to auto-detect details in 2 seconds!</span>
                </p>
              )}
            </div>

            <div className="flex flex-col items-center justify-center">
              <div className="relative">
                {previewUrl ? (
                  <div className="relative rounded-xl overflow-hidden border border-border shadow-md">
                    <img
                      src={previewUrl}
                      alt="Cover Preview"
                      className="w-24 h-32 object-cover animate-scaleUp"
                    />
                    {/* Glowing AI Scanning Radar Bar */}
                    {aiScanning && (
                      <div className="absolute inset-0 bg-primary/20 backdrop-blur-[1px] flex flex-col items-center justify-center">
                        <span className="w-full h-1 bg-gradient-to-r from-transparent via-amber-300 to-transparent absolute animate-bounce" />
                        <FiLoader className="animate-spin text-primary" size={24} />
                        <span className="text-[9px] font-bold text-foreground mt-1 bg-card/90 px-1.5 py-0.5 rounded">
                          Scanning
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-24 h-32 bg-card border border-border/60 rounded-xl flex items-center justify-center text-center text-[10px] text-muted-foreground p-2 italic">
                    No image selected
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="md:col-span-2 pt-2">
            <p className="text-[10px] text-amber-500 font-bold mb-4">
              ️ SYSTEM PROTOCOL: When submitted, the system forces initial
              status strictly to 'Pending Approval'. It will remain blacklisted
              from the public Browse feed until admin verification.
            </p>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 text-base sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin" /> Uploading...
                </>
              ) : (
                "Add Book"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LibrarianAddBook;
