import posts from "../../data/posts.json";
import BlogCard from "../../components/BlogCard";

export default function BlogPage() {
  return (
    <main className="blog-editorial">
      <section className="section-header">
        <div className="section-label">
          Blendibox Journal
        </div>

        <h1 className="section-title">
          Inspiração para quem vive o universo puffer
        </h1>
      </section>

      <section className="editorial-grid">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </section>
    </main>
  );
}