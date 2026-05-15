import posts from "../../../data/posts.json";
import { notFound } from "next/navigation";

import Footer from "../../Footer";
import Menu from "../../Menu";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;

  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return {};
  }

  const url = `https://blendibox.com.br/blog/${post.slug}`;

  return {
    title: `${post.title} | Blendibox`,
    
    description: post.excerpt,

    keywords: [
      "bolsa puffer",
      "bolsa personalizada",
      "bolsas no atacado",
      "press kit",
      "bolsa para marcas",
      "bolsa personalizada para empresas",
      "blendibox",
      post.category
    ],

    authors: [
      {
        name: "Juliana Costa",
		authorImage: "/images/autor.jpg"
      }
    ],

    creator: "Blendibox",

    publisher: "Blendibox",

    alternates: {
      canonical: url
    },

    openGraph: {
      title: post.title,

      description: post.excerpt,

      url,

      siteName: "Blendibox",

      locale: "pt_BR",

      type: "article",

      images: [
        {
          url: post.cover,
          width: 1200,
          height: 630,
          alt: post.title
        }
      ]
    },

    twitter: {
      card: "summary_large_image",

      title: post.title,

      description: post.excerpt,

      images: [post.cover]
    },

    robots: {
      index: true,
      follow: true
    }
  };
}
export default async function PostPage({ params }: Props) {
  const { slug } = await params;

  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
  <>
   <Menu/>
    <article className="post-editorial">
      <img
        src={post.cover}
        alt={post.title}
        className="post-editorial-cover"
      />

      <span className="post-editorial-category">
        {post.category}
      </span>

      <h1 className="post-editorial-title">
        {post.title}
      </h1>

     <div className="post-editorial-meta">
	  <div className="post-author">
		<img
		  src={post.authorImage}
		  alt={post.author}
		  className="post-author-image"
		/>

		<div className="post-author-info">
		  <span className="post-author-name">
			{post.author}
		  </span>

		  <span className="post-read-time">
			{post.readTime}
		  </span>
		</div>
	  </div>
	</div>

      <div className="post-editorial-content">
        {post.content.map((block, index) => {
          if (block.type === "heading") {
            return <h2 key={index}>{block.text}</h2>;
          }

          return <p key={index}>{block.text}</p>;
        })}
      </div>
    </article>
	<Footer/>
	</>
  );
}