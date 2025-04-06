"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { blogPosts, blogTopics, getFeaturedPosts, getRecentPosts } from "@/data/blog"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, ChevronRight, Search } from "lucide-react"
import ScrollToTop from "@/components/scroll-to-top"

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [filteredPosts, setFilteredPosts] = useState(blogPosts)
  const featuredPosts = getFeaturedPosts()
  const recentPosts = getRecentPosts(4)

  useEffect(() => {
    let results = blogPosts

    if (searchTerm) {
      results = results.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.author.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedTopic) {
      results = results.filter((post) => post.topic === selectedTopic)
    }

    setFilteredPosts(results)
  }, [searchTerm, selectedTopic])

  return (
    <div>
      <ScrollToTop />

      {/* Hero Section */}
      <section className="bg-[#f5f1eb] py-16">
        <div className="container">
          <h1 className="text-4xl font-bold text-center text-[#405862] mb-4">Dr. Interested Blog</h1>
          <p className="text-center text-[#405862] max-w-2xl mx-auto mb-8">
            Explore the latest insights, research, and information about healthcare careers, medical advancements, and
            educational opportunities.
          </p>

          <div className="max-w-xl mx-auto relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-[#405862]/60" />
            </div>
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-3 rounded-full border border-[#405862]/20 focus:outline-none focus:ring-2 focus:ring-[#4ecdc4] bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Topics */}
      <section className="py-12 bg-[#f5f1eb]">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8 text-[#405862]">
            Browse by Topic
            <div className="w-24 h-1 bg-[#4ecdc4] mt-2"></div>
          </h2>

          <div className="flex flex-wrap gap-4 mb-8">
            <Button
              variant={selectedTopic === null ? "default" : "outline"}
              className={
                selectedTopic === null
                  ? "bg-[#405862] hover:bg-[#334852]"
                  : "border-[#405862] text-[#405862] hover:bg-[#405862] hover:text-white"
              }
              onClick={() => setSelectedTopic(null)}
            >
              All Topics
            </Button>

            {blogTopics.map((topic, index) => (
              <Button
                key={index}
                variant={selectedTopic === topic.name ? "default" : "outline"}
                className={
                  selectedTopic === topic.name
                    ? "bg-[#405862] hover:bg-[#334852]"
                    : "border-[#405862] text-[#405862] hover:bg-[#405862] hover:text-white"
                }
                onClick={() => setSelectedTopic(topic.name)}
              >
                {topic.name}
              </Button>
            ))}
          </div>

          {selectedTopic && (
            <div className="mb-8 p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-2 text-[#405862]">{selectedTopic}</h3>
              <p className="text-[#405862]/80">
                {blogTopics.find((topic) => topic.name === selectedTopic)?.description}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* All Posts / Filtered Posts */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8 text-[#405862]">
            {searchTerm ? "Search Results" : selectedTopic ? `Articles on ${selectedTopic}` : "All Articles"}
            <div className="w-24 h-1 bg-[#4ecdc4] mt-2"></div>
          </h2>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-[#405862] mb-2">No articles found</h3>
              <p className="text-[#405862]/70 mb-6">Try adjusting your search or browse all topics</p>
              <Button
                variant="outline"
                className="border-[#405862] text-[#405862] hover:bg-[#405862] hover:text-white"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedTopic(null)
                }}
              >
                View All Articles
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <Card
                  key={index}
                  className="overflow-hidden border-[#405862]/20 hover:shadow-lg transition-all duration-300 hover:border-[#405862] flex flex-col h-full group"
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={post.coverImage || "/placeholder.svg"}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-6 flex flex-col flex-grow">
                    <div>
                      <div className="text-sm text-[#405862]/70 mb-2 flex items-center flex-wrap">
                        <span className="bg-[#f5f1eb] px-2 py-1 rounded-full text-xs">{post.topic}</span>
                        <span className="mx-2">•</span>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {post.readingTime}
                        </span>
                      </div>
                      <Link href={`/blog/${post.slug}`} className="block group-hover:text-[#4ecdc4] transition-colors">
                        <h3 className="text-lg font-bold mb-2 text-[#405862] group-hover:text-[#4ecdc4] transition-colors">
                          {post.title}
                        </h3>
                      </Link>
                      <p className="text-[#405862]/80 mb-4 text-sm leading-relaxed line-clamp-3">{post.excerpt}</p>
                    </div>
                    <div className="mt-auto">
                      <div className="flex items-center justify-between pt-4 border-t border-[#405862]/10">
                        <div className="flex items-center">
                          <div className="relative h-8 w-8 rounded-full overflow-hidden mr-2">
                            <Image
                              src={post.author.image || "/placeholder.svg"}
                              alt={post.author.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <span className="text-xs font-medium text-[#405862] block">{post.author.name}</span>
                            <span className="text-xs text-[#405862]/70">{post.date}</span>
                          </div>
                        </div>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="text-[#4ecdc4] hover:text-[#405862] transition-colors text-sm font-medium"
                        >
                          Read
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Recent Posts */}
      {!searchTerm && !selectedTopic && (
        <section className="py-16 bg-[#f5f1eb]">
          <div className="container">
            <h2 className="text-2xl font-bold mb-8 text-[#405862]">
              Recent Articles
              <div className="w-24 h-1 bg-[#4ecdc4] mt-2"></div>
            </h2>

            <div className="grid md:grid-cols-4 gap-6">
              {recentPosts.map((post, index) => (
                <Card
                  key={index}
                  className="overflow-hidden border-[#405862]/20 hover:shadow-lg transition-all duration-300 hover:border-[#405862] flex flex-col h-full group"
                >
                  <div className="relative h-40">
                    <Image
                      src={post.coverImage || "/placeholder.svg"}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4 flex flex-col flex-grow">
                    <div>
                      <div className="text-xs text-[#405862]/70 mb-1">{post.date}</div>
                      <h3 className="text-base font-bold mb-2 text-[#405862] group-hover:text-[#4ecdc4] transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                    </div>
                    <div className="mt-auto">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-[#4ecdc4] hover:text-[#405862] transition-colors text-xs font-medium flex items-center mt-2"
                      >
                        Read article
                        <ChevronRight className="h-3 w-3 ml-1" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="py-16 bg-[#405862] text-white">
        <div className="container">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Subscribe to Our Blog</h2>
            <p className="mb-6">
              Get the latest articles, research insights, and healthcare career information delivered directly to your
              inbox.
            </p>

            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-3 rounded-md border border-white bg-[#4f6b75] text-white placeholder:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4ecdc4] flex-grow"
                required
              />
              <Button className="bg-[#4ecdc4] hover:bg-[#3dbdb5] text-white px-6 py-3 rounded-md font-medium transition-colors shadow-md hover:shadow-lg transform hover:scale-105 duration-300">
                Subscribe
              </Button>
            </form>
            <p className="text-sm mt-4 text-white/70">
              By subscribing, you agree to our{" "}
              <Link href="/terms" className="text-[#4ecdc4] hover:text-white transition-colors underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy-policy" className="text-[#4ecdc4] hover:text-white transition-colors underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

