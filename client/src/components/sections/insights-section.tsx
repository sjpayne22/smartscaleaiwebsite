import { InsightCard } from "@/components/ui/insight-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Tag, User } from "lucide-react";

// Interface for our insight posts with detailed content
interface InsightPost {
  title: string;
  description: string;
  category: string;
  image: string;
  color: "turquoise" | "green" | "orange";
  detailedContent: {
    publishDate: string;
    readTime: string;
    author: string;
    introText: string;
    sections: {
      heading: string;
      content: string;
      bulletPoints?: string[];
    }[];
    conclusion: string;
  };
}

export function InsightsSection() {
  // State to track which insight dialog is open
  const [openDialog, setOpenDialog] = useState<string | null>(null);
  
  const insights: InsightPost[] = [
    {
      title: "5 Ways Small Businesses Can Leverage AI in 2025",
      description: "Discover practical AI applications that can help small businesses compete with larger corporations.",
      category: "AI Strategy",
      image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      color: "turquoise" as const,
      detailedContent: {
        publishDate: "February 15, 2025",
        readTime: "5 min read",
        author: "Sarah Johnson, AI Strategy Consultant",
        introText: "Artificial Intelligence is no longer just for big corporations with deep pockets. In 2025, AI has become more accessible, affordable, and practical for small businesses looking to increase efficiency, improve customer experiences, and stay competitive in their respective markets. This article explores five concrete ways small businesses can leverage AI to drive growth without breaking the bank.",
        sections: [
          {
            heading: "1. Intelligent Customer Service Automation",
            content: "Customer service can make or break small businesses, yet maintaining 24/7 support is challenging with limited staff. AI-powered chatbots and virtual assistants now offer sophisticated, affordable solutions that understand natural language and can resolve up to 80% of common customer inquiries without human intervention.",
            bulletPoints: [
              "Start with pre-trained chatbots that require minimal setup and can be customized to your brand voice",
              "Implement automated email response systems that prioritize and suggest replies",
              "Use sentiment analysis to flag urgent customer issues requiring immediate attention"
            ]
          },
          {
            heading: "2. Data-Driven Marketing Optimization",
            content: "Small businesses often struggle to compete with larger marketing budgets. AI tools can level the playing field by optimizing your marketing spend and targeting efforts with precision previously unavailable to smaller operations.",
            bulletPoints: [
              "Implement predictive analytics to identify which leads are most likely to convert",
              "Use AI-powered content tools to create and optimize website copy and social media posts",
              "Leverage recommendation engines to deliver personalized product suggestions to customers"
            ]
          },
          {
            heading: "3. Streamlined Inventory and Supply Chain Management",
            content: "For small retailers and manufacturers, managing inventory efficiently is critical to cash flow. AI forecasting tools can now predict demand patterns with remarkable accuracy, even for businesses with limited historical data.",
            bulletPoints: [
              "Deploy AI demand forecasting to reduce overstock and stockouts",
              "Implement automated reordering systems based on real-time sales data",
              "Use computer vision for quality control in manufacturing or food service"
            ]
          },
          {
            heading: "4. Enhanced Financial Operations",
            content: "Financial management is often a pain point for small business owners. AI-powered financial tools can automate bookkeeping, flag unusual transactions, and even provide cash flow forecasting to help businesses make more informed decisions.",
            bulletPoints: [
              "Adopt AI bookkeeping tools that automatically categorize expenses and reconcile accounts",
              "Implement fraud detection systems to protect against increasingly sophisticated scams",
              "Use predictive analytics for cash flow forecasting and budget planning"
            ]
          },
          {
            heading: "5. Productivity and Process Optimization",
            content: "Small teams need to maximize productivity. AI tools can automate repetitive tasks, streamline workflows, and even help identify inefficiencies in your business processes.",
            bulletPoints: [
              "Implement document automation systems for contract management and paperwork",
              "Use AI scheduling assistants to optimize employee scheduling and meeting coordination",
              "Leverage process mining tools to identify bottlenecks in your operations"
            ]
          }
        ],
        conclusion: "The AI revolution is no longer limited to enterprise-level businesses. Small businesses that thoughtfully implement AI solutions in these five areas can achieve significant competitive advantages while maintaining their unique strengths of agility and personal touch. By starting small with focused AI applications that address specific pain points, even businesses with modest technology budgets can reap substantial benefits in 2025 and beyond."
      }
    },
    {
      title: "The Power of Predictive Analytics for Inventory Management",
      description: "Learn how AI-powered predictive analytics can optimize your inventory and reduce costs.",
      category: "Analytics",
      image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      color: "green" as const,
      detailedContent: {
        publishDate: "January 22, 2025",
        readTime: "6 min read",
        author: "Michael Chen, Data Science Director",
        introText: "Inventory management is a delicate balancing act: carry too much stock and you tie up capital while risking obsolescence; carry too little and you face stockouts that disappoint customers and lose sales. Predictive analytics powered by artificial intelligence offers a revolutionary approach to this age-old business challenge, enabling businesses of all sizes to optimize inventory levels with unprecedented precision.",
        sections: [
          {
            heading: "Understanding Predictive Analytics for Inventory",
            content: "Predictive analytics uses historical data, statistical algorithms, and machine learning techniques to identify the likelihood of future outcomes. In inventory management, these systems analyze patterns across sales history, seasonality, market trends, and even external factors like weather or economic indicators to forecast demand with remarkable accuracy.",
            bulletPoints: [
              "Combines multiple data sources for comprehensive demand forecasting",
              "Continuously learns and improves predictions based on new data",
              "Accounts for complex variables that human forecasters might miss"
            ]
          },
          {
            heading: "Key Benefits for Businesses",
            content: "The implementation of predictive analytics in inventory management delivers multiple advantages that directly impact the bottom line and operational efficiency.",
            bulletPoints: [
              "Reduced carrying costs by maintaining optimal inventory levels",
              "Decreased stockouts by anticipating demand spikes",
              "Lower markdown rates through better product lifecycle management",
              "Improved cash flow by tying up less capital in excess inventory",
              "Enhanced customer satisfaction through improved product availability"
            ]
          },
          {
            heading: "Real-World Application Examples",
            content: "Predictive analytics isn't just theoretical—businesses across industries are achieving tangible results. A mid-sized electronics retailer implemented our AI-powered inventory system and reduced their carrying costs by 23% while simultaneously decreasing stockouts by 15%. Similarly, a regional grocery chain used predictive analytics to reduce perishable waste by 31% while maintaining product availability.",
            bulletPoints: [
              "Retail: Optimizing stock levels across multiple locations and categories",
              "Manufacturing: Planning production schedules and raw material procurement",
              "Healthcare: Managing medical supplies and pharmaceuticals with expiration dates",
              "Food service: Reducing waste while ensuring ingredient availability"
            ]
          },
          {
            heading: "Implementation Considerations",
            content: "While the benefits are compelling, successfully implementing predictive analytics requires careful planning and execution. Organizations should consider several factors before jumping in.",
            bulletPoints: [
              "Data quality and availability assessment",
              "Integration with existing inventory and POS systems",
              "Staff training and change management planning",
              "Starting with pilot programs in high-impact areas",
              "Establishing clear KPIs to measure success"
            ]
          }
        ],
        conclusion: "Predictive analytics represents a paradigm shift in inventory management, transforming it from an educated guessing game to a data-driven science. As AI technology becomes more accessible and affordable, businesses of all sizes can now leverage these powerful tools to optimize their inventory operations. Those who embrace this technology will gain significant competitive advantages through reduced costs, improved customer satisfaction, and more efficient operations. The question is no longer whether predictive analytics has value for inventory management, but rather how quickly organizations can implement it to stay ahead of the competition."
      }
    },
    {
      title: "How RetailConnect Achieved 40% Faster Response Times with AI",
      description: "A detailed look at how we helped RetailConnect transform their customer service with AI.",
      category: "Case Study",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      color: "orange" as const,
      detailedContent: {
        publishDate: "March 5, 2025",
        readTime: "7 min read",
        author: "David Wilson, Solutions Architect",
        introText: "RetailConnect, a multi-channel retailer with over 50 locations and a robust online presence, faced growing pains in their customer service operations. With increasing customer inquiries across multiple platforms and a goal to maintain their reputation for excellent service, they needed a scalable solution that wouldn't compromise quality. This case study details how our AI implementation transformed their customer service operations, resulting in 40% faster response times while improving customer satisfaction scores.",
        sections: [
          {
            heading: "The Challenge",
            content: "RetailConnect was experiencing a perfect storm of customer service challenges. Their inquiry volume had increased by 75% over two years due to business growth, while their skilled support team was struggling to keep pace. Customer satisfaction scores were beginning to decline, and response times had grown from minutes to hours. Additionally, their agents were spending too much time on repetitive questions, leaving complex issues without the attention they deserved.",
            bulletPoints: [
              "Rising inquiry volume across email, chat, social media, and phone",
              "Increasing first-response times affecting customer satisfaction",
              "Agent burnout and turnover due to repetitive tasks",
              "Inconsistent responses between different agents and channels",
              "Limited insights into customer service performance metrics"
            ]
          },
          {
            heading: "Our Solution Approach",
            content: "After a thorough assessment of RetailConnect's operations, we implemented a multi-faceted AI solution designed to augment their human agents rather than replace them. Our approach focused on automating routine tasks while providing agents with AI-powered tools to handle complex inquiries more efficiently.",
            bulletPoints: [
              "Deployed an omnichannel AI chatbot handling common inquiries across platforms",
              "Implemented AI-powered routing to direct inquiries to the most qualified agents",
              "Created a knowledge base with AI-suggested responses for human agents",
              "Developed sentiment analysis to flag urgent or negative interactions",
              "Built a real-time analytics dashboard for management insights"
            ]
          },
          {
            heading: "Implementation Process",
            content: "We took a phased approach to implementation, ensuring minimal disruption to ongoing operations while providing time for proper training and adaptation. The process involved close collaboration with RetailConnect's team to customize the solution to their specific needs.",
            bulletPoints: [
              "Phase 1: Data collection and analysis of historical customer interactions",
              "Phase 2: AI chatbot implementation for 20 most common inquiry types",
              "Phase 3: Agent assistance tools and knowledge base integration",
              "Phase 4: Advanced analytics and continuous improvement mechanisms"
            ]
          },
          {
            heading: "Results and Benefits",
            content: "Within three months of full implementation, RetailConnect experienced dramatic improvements across all customer service metrics. The impact extended beyond just faster response times to create a more efficient, consistent, and satisfying customer experience.",
            bulletPoints: [
              "40% reduction in first-response time across all channels",
              "65% of routine inquiries successfully handled by AI without human intervention",
              "Customer satisfaction scores increased by 22%",
              "Agent turnover reduced by 35% as they focused on more rewarding complex issues",
              "Data insights led to product and policy improvements reducing inquiry volume"
            ]
          }
        ],
        conclusion: "RetailConnect's transformation demonstrates how thoughtfully implemented AI can revolutionize customer service operations without losing the human touch that customers value. By automating routine inquiries and empowering human agents with AI-assisted tools, they achieved the seemingly contradictory goals of faster service and higher quality interactions. The company has now positioned itself for continued growth with a scalable customer service infrastructure that can adapt to changing customer needs and business requirements. Most importantly, they've proven that with the right approach, AI can enhance rather than replace the human connections that are at the heart of exceptional customer service."
      }
    }
  ];

  // Function to handle opening an insight dialog
  const handleOpenInsightDetail = (title: string) => {
    setOpenDialog(title);
  };
  
  // Function to close any open dialog
  const handleCloseDialog = () => {
    setOpenDialog(null);
  };

  return (
    <section id="insights" className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">AI Insights & Resources</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">Stay updated with the latest AI trends and learn how businesses are implementing AI solutions.</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {insights.map((insight, index) => (
            <InsightCard
              key={index}
              title={insight.title}
              description={insight.description}
              category={insight.category}
              image={insight.image}
              color={insight.color}
              onClick={() => handleOpenInsightDetail(insight.title)}
            />
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <a href="#contact">
            <GradientButton variant="outline">
              View All Insights
            </GradientButton>
          </a>
        </div>
      </div>

      {/* Insight Detail Dialogs */}
      {insights.map((insight) => {
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
                    {insight.detailedContent.sections.map((section, index) => (
                      <div key={index} className="border-l-4 border-gray-100 pl-4 py-1">
                        <h3 className={`text-xl font-semibold mb-3 ${colorClass}`}>
                          {section.heading}
                        </h3>
                        <p className="text-gray-600 mb-3 leading-relaxed">
                          {section.content}
                        </p>
                        
                        {section.bulletPoints && (
                          <ul className="space-y-2 mt-3">
                            {section.bulletPoints.map((point, i) => (
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
    </section>
  );
}
