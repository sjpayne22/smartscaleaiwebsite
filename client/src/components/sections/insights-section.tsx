import { InsightCard } from "@/components/ui/insight-card";
import { GradientButton } from "@/components/ui/gradient-button";

export function InsightsSection() {
  const insights = [
    {
      title: "5 Ways Small Businesses Can Leverage AI in 2023",
      description: "Discover practical AI applications that can help small businesses compete with larger corporations.",
      category: "AI Strategy",
      image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      color: "turquoise" as const
    },
    {
      title: "The Power of Predictive Analytics for Inventory Management",
      description: "Learn how AI-powered predictive analytics can optimize your inventory and reduce costs.",
      category: "Analytics",
      image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      color: "green" as const
    },
    {
      title: "How RetailConnect Achieved 40% Faster Response Times with AI",
      description: "A detailed look at how we helped RetailConnect transform their customer service with AI.",
      category: "Case Study",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      color: "orange" as const
    }
  ];

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
    </section>
  );
}
