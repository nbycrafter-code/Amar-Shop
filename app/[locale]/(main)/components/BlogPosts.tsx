'use client'

import { Link } from "lucide-react";

export const BlogPosts = () => {
    const blogPosts = [
        {
            id: 1,
            title: "How to Write a Blog Post Your Readers Will Love in 5 Steps",
            excerpt: "Why the world would end without travel coupons. The...",
            image:
                "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=250&fit=crop",
            date: "February 9, 2024",
            author: "Editor",
        },
        {
            id: 2,
            title: "9 Content Marketing Trends and Ideas to Increase Traffic",
            excerpt: "Why do people think wholesale accessories are a good...",
            image:
                "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=250&fit=crop",
            date: "February 7, 2024",
            author: "Editor",
        },
        {
            id: 3,
            title: "The Ultimate Guide to Marketing Strategies to Improve Sales",
            excerpt: "Many things about electronic devices your kids don't want...",
            image:
                "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
            date: "February 5, 2024",
            author: "Editor",
        },
    ];
    return (
        <div className="pt-8 pb-12">
            <div className="container mx-auto w-full px-4">
                <h1 className="text-xl font-semibold text-gray-600 mb-8">Our Blog</h1>
                <div className="grid md:grid-cols-3 gap-6">
                    {blogPosts.map((post) => (
                        <article
                            key={post.id}
                            className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                        >
                            <Link
                                href={`/blog/${post.id}`}
                                className="block overflow-hidden"
                            >
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-60 object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </Link>
                            <div className="p-6">
                                <p className="text-sm text-[#ef553f] mb-2">
                                    {post.date} • by {post.author}
                                </p>
                                <h3 className="font-semibold text-md mb-3 text-gray-600 hover:text-[#ef553f] transition-colors cursor-pointer">
                                    {post.title}
                                </h3>
                                <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    );
};