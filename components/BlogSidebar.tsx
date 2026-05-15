"use client";

import Link from "next/link";

type Props = {
  categories: string[];

  selected: string;

  onSelect?: (
    category: string
  ) => void;
};

export default function BlogSidebar({
  categories,
  selected,
  onSelect,
}: Props) {
  return (
    <aside className="blog-sidebar">
      <div className="blog-sidebar-sticky">
        <span className="blog-sidebar-label">
          Categorias
        </span>

        <ul className="blog-sidebar-list">
          <li>
            {onSelect ? (
              <button
                className={
                  selected === "all"
                    ? "blog-category active"
                    : "blog-category"
                }
                onClick={() =>
                  onSelect("all")
                }
              >
                Todos os artigos
              </button>
            ) : (
              <Link
                href="/blog"
                className="blog-category"
              >
                Todos os artigos
              </Link>
            )}
          </li>

          {categories.map((category) => (
            <li key={category}>
              {onSelect ? (
                <button
                  className={
                    selected === category
                      ? "blog-category active"
                      : "blog-category"
                  }
                  onClick={() =>
                    onSelect(category)
                  }
                >
                  {category}
                </button>
              ) : (
                <Link
                  href={`/blog?categoria=${category}`}
                  className={
                    selected === category
                      ? "blog-category active"
                      : "blog-category"
                  }
                >
                  {category}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}