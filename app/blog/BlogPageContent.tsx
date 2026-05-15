"use client";

import { useMemo, useState } from "react";






import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import posts from "../../data/posts.json";

import BlogCard from "../../components/BlogCard";
import BlogSidebar from "../../components/BlogSidebar";

import Footer from "../Footer";
import Menu from "../Menu";

export default function BlogPageContent() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const initialCategory =
    searchParams.get("categoria") || "all";

  const [selectedCategory, setSelectedCategory] =
    useState(initialCategory);

  const categories = useMemo(() => {
    const allCategories = posts.map(
      (post) => post.category
    );

    return [...new Set(allCategories)];
  }, []);

  const filteredPosts =
    selectedCategory === "all"
      ? posts
      : posts.filter(
          (post) =>
            post.category ===
            selectedCategory
        );

  function handleCategory(category: string) {
    setSelectedCategory(category);

    if (category === "all") {
      router.push("/blog");
      return;
    }

    router.push(
      `/blog?categoria=${category}`
    );
  }

  return (
    <>
      <Menu />

      <main className="blog-layout">
        <BlogSidebar
          categories={categories}
          selected={selectedCategory}
          onSelect={handleCategory}
        />

        <section className="blog-editorial">
          <section className="blog-heading">
            <span className="blog-label">
              Blendibox Journal
            </span>

            <h1 className="blog-main-title">
              Inspiração para marcas que desejam
              campanhas premium e memoráveis
            </h1>
          </section>

          <section className="editorial-grid">
            {filteredPosts.map((post) => (
              <BlogCard
                key={post.id}
                post={post}
              />
            ))}
          </section>
        </section>
      </main>

      <Footer />
    </>
  );
}