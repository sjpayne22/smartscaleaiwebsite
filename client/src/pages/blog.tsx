import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { InsightCard } from "@/components/ui/insight-card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Tag, User, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { fetchPosts } from "../services/wordpressApi";
import { InsightPost, allBlogPosts } from "../lib/blog-data"; // Keep for types and fallback data
import { cn } from "@/lib/utils";

// List of categories for filtering
const categories = [
  "AI Strategy", 
  "Analytics", 
  "Case Study", 
  "Machine Learning", 
  "Business Intelligence", 
  "Natural Language Processing", 
  "Automation"
];

export default function Blog() {
  // State for managing which insight dialog is open
  const [openDialog, setOpenDialog] = useState<string | null>(null);
  // State for search and filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  // State for blog posts from WordPress
  const [posts, setPosts] = useState<InsightPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch posts from WordPress
  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        const fetchedPosts = await fetchPosts();
        if (fetchedPosts && fetchedPosts.length > 0) {
          setPosts(fetchedPosts);
        } else {
          // Fallback to local data if no posts are returned or if API fails
          setPosts(allBlogPosts);
        }
        setError(null);
      } catch (err) {
        console.error('Failed to fetch posts:', err);
        setError('Failed to load blog posts. Using fallback data.');
        setPosts(allBlogPosts);
      } finally {
        setLoading(false);
      }
    };
    
    loadPosts();
  }, []);
  
  // Function to handle opening an insight dialog
  const handleOpenInsightDetail = (title: string) => {
    setOpenDialog(title);
  };
  
  // Function to close any open dialog
  const handleCloseDialog = () => {
    setOpenDialog(null);
  };

  // Filter posts based on search query and selected category
  const filteredPosts = posts.filter((post: InsightPost) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? post.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Header />
      
      <main className="min-h-screen">
        {/* Hero section */}
        <section className="bg-gradient-to-b from-gray-50 to-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">AI Insights & Resources</h1>
              <p className="text-xl text-gray-600 mb-8">
                Stay ahead of the curve with our latest insights on artificial intelligence, 
                machine learning, and business automation strategies.
              </p>
              
              {/* Search and filter */}
              <div className="bg-white rounded-lg shadow-md p-4 mb-8">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input 
                      type="text" 
                      placeholder="Search articles..." 
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <select
                      className="w-full md:w-auto appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-2 px-10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={selectedCategory || ""}
                      onChange={(e) => setSelectedCategory(e.target.value || null)}
                    >
                      <option value="">All Categories</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Blog posts grid */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-gray-200 rounded-full animate-spin border-t-primary"></div>
                <p className="mt-4 text-gray-600">Loading blog posts...</p>
              </div>
            ) : error ? (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded my-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">{error}</p>
                  </div>
                </div>
              </div>
            ) : filteredPosts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post: InsightPost, index: number) => (
                  <InsightCard
                    key={index}
                    title={post.title}
                    description={post.description}
                    category={post.category}
                    image={post.image}
                    color={post.color}
                    onClick={() => handleOpenInsightDetail(post.title)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No articles found</h3>
                <p className="text-gray-500">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
              </div>
            )}
          </div>
        </section>
      
        {/* Insight Detail Dialogs */}
        {posts.map((insight: InsightPost) => {
          const colorClass = insight.color === 'turquoise' ? 'text-[#0AB5CE]' : 
                           insight.color === 'green' ? 'text-[#5CDC74]' : 
                           'text-[#FDA035]';
          
          const bgColorClass = insight.color === 'turquoise' ? 'bg-[#0AB5CE]' : 
                             insight.color === 'green' ? 'bg-[#5CDC74]' : 
                             'bg-[#FDA035]';
          
          const lightBgColorClass = insight.color === 'turquoise' ? 'bg-[#0AB5CE]/5' : 
                                  insight.color === 'green' ? 'bg-[#5CDC74]/5' : 
                                  'bg-[#FDA035]/5';
          
          return (
            <Dialog key={insight.title} open={openDialog === insight.title} onOpenChange={handleCloseDialog}>
              <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden">
                {/* Header image */}
                <div className="absolute top-0 left-0 w-full h-40 overflow-hidden -mt-6 -mx-6">
                  <div 
                    className="w-full h-full bg-cover bg-center" 
                    style={{ backgroundImage: `url(${insight.image})` }}
                  >
                    <div className="w-full h-full bg-black/50 backdrop-blur-sm"></div>
                  </div>
                </div>

                {/* Content with proper spacing from header image */}
                <div className="mt-32">
                  <DialogHeader>
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${bgColorClass} text-white mb-2`}>
                      {insight.category}
                    </div>
                    <DialogTitle className="text-2xl md:text-3xl font-bold">
                      {insight.title}
                    </DialogTitle>
                    
                    {/* Meta information */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-2">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{insight.detailedContent.publishDate}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{insight.detailedContent.readTime}</span>
                      </div>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        <span>{insight.detailedContent.author}</span>
                      </div>
                    </div>
                  </DialogHeader>
                
                  {/* Scrollable content area */}
                  <div className="overflow-y-auto pr-2 mt-4 max-h-[calc(90vh-250px)]">
                    {/* Introduction */}
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {insight.detailedContent.introText}
                    </p>
                    
                    {/* Content sections */}
                    <div className="space-y-6">
                      {insight.detailedContent.sections.map((section: {heading: string; content: string; bulletPoints?: string[]}, index: number) => (
                        <div key={index} className="border-l-4 border-gray-100 pl-4 py-1">
                          <h3 className={`text-xl font-semibold mb-3 ${colorClass}`}>
                            {section.heading}
                          </h3>
                          <p className="text-gray-600 mb-3 leading-relaxed">
                            {section.content}
                          </p>
                          
                          {section.bulletPoints && (
                            <ul className="space-y-2 mt-3">
                              {section.bulletPoints.map((point: string, i: number) => (
                                <li key={i} className="flex items-start">
                                  <div className={`h-5 w-5 rounded-full flex items-center justify-center mr-2 flex-shrink-0 ${bgColorClass} mt-0.5`}>
                                    <span className="text-white text-xs">•</span>
                                  </div>
                                  <span className="text-gray-600">{point}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {/* Conclusion */}
                    <div className={`mt-6 p-4 rounded-lg ${lightBgColorClass} border-l-4 ${bgColorClass}`}>
                      <h3 className={`text-xl font-semibold mb-2 ${colorClass}`}>
                        Conclusion
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {insight.detailedContent.conclusion}
                      </p>
                    </div>
                  </div>
                  
                  <DialogFooter className="border-t border-gray-100 pt-4 mt-6">
                    <div className="flex justify-between items-center w-full flex-wrap">
                      <a href="#contact" className={`flex items-center ${colorClass} hover:underline text-sm`} onClick={handleCloseDialog}>
                        Have questions about this topic? Contact us
                      </a>
                      <DialogClose asChild>
                        <Button variant="outline">
                          Close
                        </Button>
                      </DialogClose>
                    </div>
                  </DialogFooter>
                </div>
              </DialogContent>
            </Dialog>
          );
        })}
      </main>
      
      <Footer />
    </>
  );
}