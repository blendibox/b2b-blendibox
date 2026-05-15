import Link from "next/link";

type Post = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  cover: string;
  category: string;
};

type Props = {
  post: Post;
};

export default function BlogCard({ post }: Props) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="editorial-card"
    >
      <div className="editorial-image">
        <img src={post.cover} alt={post.title} />
      </div>

      <div className="editorial-content">
        <span className="editorial-category">
          {post.category}
        </span>

        <h2 className="editorial-title">
          {post.title}
        </h2>

        <p className="editorial-excerpt">
          {post.excerpt}
        </p>
      </div>
    </Link>
  );
}