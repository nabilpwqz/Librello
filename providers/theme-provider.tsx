"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// এই ফাংশনটিই 'layout.js' খুঁজছিল কিন্তু পাচ্ছিল না।
// এখান থেকে এটিকে default export করা হলো।
export default function Providers({ children }) {
  return (
    <NextThemesProvider
      attribute="class" // এটি ডার্ক মোড অন হলে HTML ট্যাগে 'dark' ক্লাস বসাবে
      defaultTheme="light" // আপনার নিয়ম অনুযায়ী প্রথমবার সাইট লাইট মোডে ওপেন হবে
      enableSystem={false} // সিস্টেম থিম ট্র্যাক অফ রাখা হলো কাস্টম কন্ট্রোলের জন্য
      disableTransitionOnChange // থিম বদলানোর সময় যেন কোনো কন্টেন্ট ঝিলিক (Flash) না মারে
    >
      {children}
    </NextThemesProvider>
  );
}
