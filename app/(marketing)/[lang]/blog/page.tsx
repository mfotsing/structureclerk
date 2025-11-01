'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  User,
  TrendingUp,
  FileText,
  Brain,
  Shield,
  Globe,
  BarChart3,
  ArrowRight,
  Search,
  Tag,
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  Eye
} from 'lucide-react';
import Link from 'next/link';
import { BRAND_COLORS } from '@/components/brand/BrandColors';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorRole: string;
  authorAvatar: string;
  date: string;
  readTime: number;
  category: string;
  tags: string[];
  featured: boolean;
  views: string;
  likes: string;
  comments: number;
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'How AI Document Automation Saved Canadian Businesses $2.4M in 2024',
    excerpt: 'Discover how 500+ Canadian companies leveraged StructureClerk to save thousands of administrative hours and millions in operational costs. Learn the exact ROI metrics and automation strategies that delivered 400% average returns.',
    content: 'Canadian businesses are increasingly turning to AI-powered solutions to streamline their operations...',
    author: 'Sarah Chen',
    authorRole: 'CEO & Founder',
    authorAvatar: 'SC',
    date: '2024-11-15',
    readTime: 8,
    category: 'Case Studies',
    tags: ['ROI', 'Automation', 'Canadian Business', 'Success Stories'],
    featured: true,
    views: '12.5K',
    likes: '892',
    comments: 45
  },
  {
    id: '2',
    title: 'PIPEDA Compliance Made Easy: Your Complete 2025 Guide',
    excerpt: 'Navigate Canadian privacy laws with confidence. This comprehensive guide covers everything from data residency requirements to automated compliance monitoring, helping you avoid fines and build customer trust.',
    content: 'Privacy compliance is no longer optional for Canadian businesses...',
    author: 'Marc Dubois',
    authorRole: 'Legal & Compliance Expert',
    authorAvatar: 'MD',
    date: '2024-11-12',
    readTime: 12,
    category: 'Compliance',
    tags: ['PIPEDA', 'Privacy', 'Legal', 'Compliance'],
    featured: true,
    views: '8.3K',
    likes: '567',
    comments: 23
  },
  {
    id: '3',
    title: 'The Future of Work: How AI is Redefining Canadian Small Business Operations',
    excerpt: 'Explore the technological revolution happening in Canadian small businesses. From automated document processing to AI-driven decision making, discover how early adopters are gaining competitive advantages.',
    content: 'The Canadian business landscape is undergoing a dramatic transformation...',
    author: 'Jennifer Park',
    authorRole: 'Business Strategy Consultant',
    authorAvatar: 'JP',
    date: '2024-11-08',
    readTime: 10,
    category: 'Industry Trends',
    tags: ['AI', 'Future of Work', 'Small Business', 'Innovation'],
    featured: false,
    views: '6.7K',
    likes: '423',
    comments: 18
  },
  {
    id: '4',
    title: 'Bilingual AI: Processing English and French Documents with 99.5% Accuracy',
    excerpt: 'Learn how our advanced AI models handle Canadian bilingual documents with remarkable precision. From invoices to legal documents, see real examples of how businesses are saving time while maintaining quality.',
    content: 'Canada\'s bilingual nature presents unique challenges for document processing...',
    author: 'Alexandre Tremblay',
    authorRole: 'AI Research Lead',
    authorAvatar: 'AT',
    date: '2024-11-05',
    readTime: 7,
    category: 'Technology',
    tags: ['Bilingual', 'AI', 'Document Processing', 'Accuracy'],
    featured: false,
    views: '5.2K',
    likes: '345',
    comments: 12
  },
  {
    id: '5',
    title: 'From Paper to Digital: A Montreal Law Firm\'s Complete Transformation Journey',
    excerpt: 'Follow the remarkable story of how a 50-employee Montreal law firm eliminated 90% of their paper-based processes, reduced administrative overhead by 60%, and improved client response times by 400%.',
    content: 'Traditional law firms have been slow to embrace digital transformation...',
    author: 'Sarah Chen',
    authorRole: 'CEO & Founder',
    authorAvatar: 'SC',
    date: '2024-11-01',
    readTime: 15,
    category: 'Case Studies',
    tags: ['Legal', 'Digital Transformation', 'Success Stories', 'ROI'],
    featured: false,
    views: '4.8K',
    likes: '298',
    comments: 15
  },
  {
    id: '6',
    title: 'Building a $10M SaaS Company: Lessons from Our First 1000 Canadian Customers',
    excerpt: 'Exclusive insights into how StructureClerk scaled from startup to serving thousands of Canadian businesses. Learn the critical lessons about product-market fit, customer acquisition, and scaling in the Canadian market.',
    content: 'Reaching 1000 customers is a significant milestone for any SaaS company...',
    author: 'Sarah Chen',
    authorRole: 'CEO & Founder',
    authorAvatar: 'SC',
    date: '2024-10-28',
    readTime: 11,
    category: 'Business Growth',
    tags: ['Scaling', 'SaaS', 'Growth Hacking', 'Canadian Market'],
    featured: false,
    views: '7.9K',
    likes: '612',
    comments: 34
  }
];

const categories = [
  { name: 'All', icon: FileText },
  { name: 'Case Studies', icon: TrendingUp },
  { name: 'Technology', icon: Brain },
  { name: 'Compliance', icon: Shield },
  { name: 'Industry Trends', icon: Globe },
  { name: 'Business Growth', icon: BarChart3 }
];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = searchTerm === '' ||
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredPosts = blogPosts.filter(post => post.featured);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #F8FAFC 0%, #FFFFFF 100%)' }}>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden"
               style={{ background: `linear-gradient(135deg, ${BRAND_COLORS.primaryNavy} 0%, #1E40AF 50%, ${BRAND_COLORS.primaryNavy} 100%)` }}>
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              className="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold mb-8"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#FFFFFF' }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Canadian Business Insights
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Insights for Canadian
              <span className="block" style={{ color: BRAND_COLORS.accentTeal }}>
                Entrepreneurs & Leaders
              </span>
            </h1>

            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Expert analysis, case studies, and strategic insights to help your Canadian business thrive in the digital age.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 text-white">
                <Eye className="h-5 w-5" />
                <span>50K+ Monthly Readers</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Heart className="h-5 w-5" />
                <span>4.9/5 Rating</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Calendar className="h-5 w-5" />
                <span>Weekly Updates</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: BRAND_COLORS.primaryNavy }}>
              Featured Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our most popular insights and success stories
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPosts.slice(0, 3).map((post, index) => (
              <motion.article
                key={post.id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="relative">
                  <div className="h-48 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 text-xs font-semibold text-white rounded-full"
                          style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold mr-3">
                      {post.authorAvatar}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{post.author}</p>
                      <p className="text-sm text-gray-500">{post.authorRole}</p>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {post.readTime} min read
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {post.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {post.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        {post.comments}
                      </span>
                    </div>
                    <Link
                      href={`/blog/${post.id}`}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                    >
                      Read More
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Filter and Search */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedCategory === category.name
                        ? 'text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    style={{
                      backgroundColor: selectedCategory === category.name ? BRAND_COLORS.primaryNavy : '#F3F4F6'
                    }}
                  >
                    <category.icon className="h-4 w-4" />
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="mt-4 flex flex-wrap gap-2">
              {['ROI', 'Automation', 'AI', 'Canadian Business', 'PIPEDA', 'Digital Transformation'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSearchTerm(tag)}
                  className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* All Posts */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <motion.article
                key={post.id}
                className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 text-xs font-semibold rounded-lg"
                          style={{
                            backgroundColor: `${BRAND_COLORS.primaryNavy}20`,
                            color: BRAND_COLORS.primaryNavy
                          }}>
                      {post.category}
                    </span>
                    {post.featured && (
                      <span className="px-2 py-1 text-xs font-semibold text-yellow-600 bg-yellow-50 rounded-lg">
                        Featured
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="text-xs text-gray-500">+{post.tags.length - 3} more</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {post.author}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {post.readTime} min
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {post.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {post.likes}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="text-gray-400 hover:text-red-500 transition-colors">
                        <Bookmark className="h-4 w-4" />
                      </button>
                      <button className="text-gray-400 hover:text-blue-500 transition-colors">
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-12 rounded-2xl shadow-xl border border-gray-100 text-center"
               style={{ background: `linear-gradient(135deg, ${BRAND_COLORS.primaryNavy} 0%, #1E40AF 100%)` }}>
            <h2 className="text-3xl font-bold text-white mb-4">
              Stay Ahead of the Curve
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Get weekly insights on Canadian business trends, AI advancements, and exclusive case studies delivered to your inbox.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-8 py-3 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105"
                      style={{ backgroundColor: BRAND_COLORS.accentTeal }}>
                Subscribe Now
              </button>
            </div>

            <p className="text-sm text-blue-200 mt-4">
              Join 50,000+ Canadian entrepreneurs. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}