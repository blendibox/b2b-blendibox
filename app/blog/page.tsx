"use client";
import { Suspense } from "react";
import BlogPageContent from "./BlogPageContent";

export default function BlogPage() {
  return (
    <Suspense>
      <BlogPageContent />
    </Suspense>
  );
}