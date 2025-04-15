import { Logo } from "@/components/ui/logo";
import { Facebook, Linkedin, Youtube } from "lucide-react";
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

interface FooterSectionProps {
  title: string;
  links: { label: string; href: string }[];
}

function FooterSection({ title, links }: FooterSectionProps) {
  return (
    <div>
      <h3 className="font-semibold text-lg mb-4">{title}</h3>
      <ul className="space-y-2">
        {links.map((link, index) => (
          <li key={index}>
            <a href={link.href} className="text-gray-400 hover:text-white transition">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();
  // State for managing which policy dialog is open
  const [openPolicy, setOpenPolicy] = useState<'privacy' | 'terms' | 'cookies' | null>(null);

  const quickLinks = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Insights", href: "#insights" },
    { label: "Contact", href: "#contact" },
  ];

  const services = [
    { label: "AI Strategy & Consulting", href: "#services" },
    { label: "AI Implementation", href: "#services" },
    { label: "Process Automation", href: "#services" },
    { label: "Predictive Analytics", href: "#services" },
    { label: "AI Training & Workshops", href: "#services" },
  ];

  const handleOpenPolicy = (policy: 'privacy' | 'terms' | 'cookies') => {
    setOpenPolicy(policy);
  };

  const handleClosePolicy = () => {
    setOpenPolicy(null);
  };

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <a href="#home" className="flex items-center space-x-2 mb-4">
              <Logo darkMode />
            </a>
            <p className="text-gray-400 mb-6 max-w-md">
              SmartScale AI Consulting helps small and mid-sized businesses leverage artificial intelligence for smarter growth, efficiency, and innovation.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.linkedin.com/in/stanley-payne-212092232" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://www.facebook.com/profile.php?id=61573967995732" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://www.youtube.com/@SmartScaleai_ai" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          <FooterSection title="Quick Links" links={quickLinks} />
          <FooterSection title="Services" links={services} />
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              &copy; {currentYear} SmartScale AI Consulting LLC. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <button 
                onClick={() => handleOpenPolicy('privacy')} 
                className="text-gray-500 hover:text-gray-400 text-sm bg-transparent border-0 p-0 cursor-pointer"
              >
                Privacy Policy
              </button>
              <button 
                onClick={() => handleOpenPolicy('terms')} 
                className="text-gray-500 hover:text-gray-400 text-sm bg-transparent border-0 p-0 cursor-pointer"
              >
                Terms of Service
              </button>
              <button 
                onClick={() => handleOpenPolicy('cookies')} 
                className="text-gray-500 hover:text-gray-400 text-sm bg-transparent border-0 p-0 cursor-pointer"
              >
                Cookie Policy
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Policy Dialog */}
      <Dialog open={openPolicy === 'privacy'} onOpenChange={handleClosePolicy}>
        <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold pb-2 border-b">Privacy Policy</DialogTitle>
            <DialogDescription>
              Last Updated: March 1, 2025
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto pr-2 my-4 max-h-[calc(80vh-180px)]">
            <div className="space-y-4">
              <section>
                <h3 className="text-lg font-semibold mb-2">1. Introduction</h3>
                <p className="text-gray-700">
                  SmartScale AI Consulting LLC ("we", "our", or "us") respects your privacy and is committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-2">2. The Data We Collect About You</h3>
                <p className="text-gray-700">
                  Personal data means any information about an individual from which that person can be identified. We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
                </p>
                <ul className="list-disc ml-6 mt-2 space-y-1 text-gray-700">
                  <li>Identity Data includes first name, last name, username or similar identifier, title.</li>
                  <li>Contact Data includes billing address, delivery address, email address and telephone numbers.</li>
                  <li>Technical Data includes internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
                  <li>Usage Data includes information about how you use our website, products and services.</li>
                  <li>Marketing and Communications Data includes your preferences in receiving marketing from us and our third parties and your communication preferences.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-2">3. How We Use Your Personal Data</h3>
                <p className="text-gray-700">
                  We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                </p>
                <ul className="list-disc ml-6 mt-2 space-y-1 text-gray-700">
                  <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                  <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                  <li>Where we need to comply with a legal obligation.</li>
                </ul>
                <p className="text-gray-700 mt-2">
                  Generally, we do not rely on consent as a legal basis for processing your personal data although we will get your consent before sending third party direct marketing communications to you via email or text message. You have the right to withdraw consent to marketing at any time by contacting us.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-2">4. Data Security</h3>
                <p className="text-gray-700">
                  We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know. They will only process your personal data on our instructions and they are subject to a duty of confidentiality.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-2">5. Your Legal Rights</h3>
                <p className="text-gray-700">
                  Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:
                </p>
                <ul className="list-disc ml-6 mt-2 space-y-1 text-gray-700">
                  <li>Request access to your personal data.</li>
                  <li>Request correction of your personal data.</li>
                  <li>Request erasure of your personal data.</li>
                  <li>Object to processing of your personal data.</li>
                  <li>Request restriction of processing your personal data.</li>
                  <li>Request transfer of your personal data.</li>
                  <li>Right to withdraw consent.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-2">6. Contact Us</h3>
                <p className="text-gray-700">
                  If you have any questions about this privacy policy or our privacy practices, please contact us at:
                </p>
                <p className="text-gray-700 mt-2">
                  SmartScale AI Consulting LLC<br />
                  3143 Autumnwood Trl, Apopka, Florida 32703<br />
                  Email: info@smartscaleai.ai<br />
                  Phone: (386) 801-6711
                </p>
              </section>
            </div>
          </div>

          <DialogFooter className="border-t pt-4">
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Terms of Service Dialog */}
      <Dialog open={openPolicy === 'terms'} onOpenChange={handleClosePolicy}>
        <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold pb-2 border-b">Terms of Service</DialogTitle>
            <DialogDescription>
              Last Updated: March 1, 2025
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto pr-2 my-4 max-h-[calc(80vh-180px)]">
            <div className="space-y-4">
              <section>
                <h3 className="text-lg font-semibold mb-2">1. Introduction</h3>
                <p className="text-gray-700">
                  These Terms of Service ("Terms") govern your access to and use of SmartScale AI Consulting LLC's website, products, and services ("Services"). By accessing or using our Services, you agree to be bound by these Terms.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-2">2. Acceptance of Terms</h3>
                <p className="text-gray-700">
                  By accessing or using our Services, you affirm that you are at least 18 years of age or have the consent of a legal guardian. You also affirm that you are capable of entering into a binding contract and are not prohibited from doing so under any applicable laws.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-2">3. Changes to Terms</h3>
                <p className="text-gray-700">
                  We reserve the right to modify these Terms at any time. If we make changes, we will provide notice by updating the date at the top of these Terms and by maintaining a current version of the Terms on our website. Your continued use of our Services after such modifications will constitute your acknowledgment and agreement to the modified Terms.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-2">4. Use of Services</h3>
                <p className="text-gray-700">
                  You agree to use our Services only for purposes that are permitted by these Terms and any applicable law, regulation, or generally accepted practices or guidelines in the relevant jurisdictions. You may not:
                </p>
                <ul className="list-disc ml-6 mt-2 space-y-1 text-gray-700">
                  <li>Use our Services to violate any law or regulation;</li>
                  <li>Attempt to circumvent any access control or security measure of our Services;</li>
                  <li>Engage in any activity that interferes with or disrupts our Services;</li>
                  <li>Attempt to access any user account or computer system that you are not authorized to access;</li>
                  <li>Collect or harvest any information or data from our Services or our systems;</li>
                  <li>Submit, upload, or transmit any content that is illegal, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, invasive of another's privacy, or otherwise objectionable.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-2">5. Intellectual Property</h3>
                <p className="text-gray-700">
                  Our Services and all content and materials included on our Services, including but not limited to text, graphics, logos, icons, images, audio clips, digital downloads, data compilations, and software, are the property of SmartScale AI Consulting LLC or its licensors and are protected by United States and international copyright, trademark, and other intellectual property laws.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-2">6. Disclaimer of Warranties</h3>
                <p className="text-gray-700">
                  Our Services are provided "as is" and "as available" without warranties of any kind, either express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-2">7. Limitation of Liability</h3>
                <p className="text-gray-700">
                  In no event shall SmartScale AI Consulting LLC, its officers, directors, employees, or agents, be liable to you for any direct, indirect, incidental, special, punitive, or consequential damages whatsoever resulting from any (i) errors, mistakes, or inaccuracies in content; (ii) personal injury or property damage related to your use of our Services; (iii) unauthorized access to or use of our systems or servers; (iv) interruption or cessation of transmission to or from our Services; (v) bugs, viruses, trojan horses, or the like that may be transmitted to or through our Services; or (vi) any use or inability to use any content or services made available on or through our Services, whether based on warranty, contract, tort, or any other legal theory, and whether or not we are advised of the possibility of such damages.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-2">8. Contact Us</h3>
                <p className="text-gray-700">
                  If you have any questions about these Terms, please contact us at:
                </p>
                <p className="text-gray-700 mt-2">
                  SmartScale AI Consulting LLC<br />
                  3143 Autumnwood Trl, Apopka, Florida 32703<br />
                  Email: info@smartscaleai.ai<br />
                  Phone: (386) 801-6711
                </p>
              </section>
            </div>
          </div>

          <DialogFooter className="border-t pt-4">
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cookie Policy Dialog */}
      <Dialog open={openPolicy === 'cookies'} onOpenChange={handleClosePolicy}>
        <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold pb-2 border-b">Cookie Policy</DialogTitle>
            <DialogDescription>
              Last Updated: March 1, 2025
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto pr-2 my-4 max-h-[calc(80vh-180px)]">
            <div className="space-y-4">
              <section>
                <h3 className="text-lg font-semibold mb-2">1. What Are Cookies</h3>
                <p className="text-gray-700">
                  Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently, as well as to provide information to the owners of the site. Cookies enhance your browsing experience by allowing websites to remember your preferences and tailor content to your interests.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-2">2. How We Use Cookies</h3>
                <p className="text-gray-700">
                  SmartScale AI Consulting LLC uses cookies for various purposes, including:
                </p>
                <ul className="list-disc ml-6 mt-2 space-y-1 text-gray-700">
                  <li><strong>Essential Cookies:</strong> These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and account access.</li>
                  <li><strong>Analytics Cookies:</strong> These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This allows us to improve our website based on user behavior.</li>
                  <li><strong>Functional Cookies:</strong> These cookies enable enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.</li>
                  <li><strong>Marketing Cookies:</strong> These cookies track your online activity to help advertisers deliver more relevant advertising or to limit how many times you see an ad. These cookies can share that information with other organizations or advertisers.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-2">3. Types of Cookies We Use</h3>
                <p className="text-gray-700">
                  Our website uses the following types of cookies:
                </p>
                <ul className="list-disc ml-6 mt-2 space-y-1 text-gray-700">
                  <li><strong>Session Cookies:</strong> These cookies are temporary and are erased when you close your browser. They allow our website to link your actions during a browser session.</li>
                  <li><strong>Persistent Cookies:</strong> These cookies remain on your device for a set period or until you delete them. They help our website remember your preferences and settings for future visits.</li>
                  <li><strong>First-Party Cookies:</strong> These cookies are set by our website directly.</li>
                  <li><strong>Third-Party Cookies:</strong> These cookies are set by third parties, such as analytics providers and advertising networks.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-2">4. Managing Cookies</h3>
                <p className="text-gray-700">
                  Most web browsers allow you to manage your cookie preferences. You can set your browser to refuse cookies, or to alert you when cookies are being sent. However, if you disable cookies, some parts of our website may not function properly.
                </p>
                <p className="text-gray-700 mt-2">
                  Here are links to instructions on how to manage cookies in common web browsers:
                </p>
                <ul className="list-disc ml-6 mt-2 space-y-1 text-gray-700">
                  <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">Google Chrome</a></li>
                  <li><a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">Mozilla Firefox</a></li>
                  <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">Safari</a></li>
                  <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">Microsoft Edge</a></li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-2">5. Changes to Our Cookie Policy</h3>
                <p className="text-gray-700">
                  We may update our Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this Cookie Policy periodically to stay informed about how we are using cookies.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-2">6. Contact Us</h3>
                <p className="text-gray-700">
                  If you have any questions about our Cookie Policy, please contact us at:
                </p>
                <p className="text-gray-700 mt-2">
                  SmartScale AI Consulting LLC<br />
                  3143 Autumnwood Trl, Apopka, Florida 32703<br />
                  Email: info@smartscaleai.ai<br />
                  Phone: (386) 801-6711
                </p>
              </section>
            </div>
          </div>

          <DialogFooter className="border-t pt-4">
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </footer>
  );
}