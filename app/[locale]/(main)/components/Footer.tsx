'use client'

import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

interface Settings {
  address?: string;
  phone?: string;
  email?: string;
}

interface FooterProps {
  settings?: Settings;
}

interface FooterLink {
  name: string;
  path: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface FooterLinks {
  help: FooterSection;
  info: FooterSection;
  policy: FooterSection;
  product: FooterSection;
}

export const Footer = ({ settings = {} }: FooterProps) => {
  const { language } = useLanguage();

  const footerLinks: FooterLinks = {
    help: {
      title: language === 'bn' ? "সহায়তা" : "Help",
      links: [
        { name: language === 'bn' ? "শর্ত ও নীতি" : "Term & Policy", path: "/terms" },
        { name: "Press", path: "/press" },
        { name: "Careers", path: "/careers" },
        { name: language === 'bn' ? "ডেলিভারি" : "Delivery", path: "/delivery" },
        { name: language === 'bn' ? "সেবা" : "Service", path: "/service" },
      ],
    },
    info: {
      title: language === 'bn' ? "তথ্য" : "Info",
      links: [
        { name: language === 'bn' ? "যোগাযোগ করুন" : "Contact Us", path: "/contact" },
        { name: language === 'bn' ? "আমাদের সম্পর্কে" : "About Us", path: "/about" },
        { name: language === 'bn' ? "আমার কার্ট" : "My Cart", path: "/cart" },
        { name: language === 'bn' ? "চেকআউট" : "Checkout", path: "/checkout" },
        { name: language === 'bn' ? "অর্ডার ট্র্যাকিং" : "Order Tracking", path: "/order-tracking" },
      ],
    },
    policy: {
      title: language === 'bn' ? "নীতি" : "Policy",
      links: [
        { name: language === 'bn' ? "রিটার্ন পলিসি" : "Return Policy", path: "/return-policy" },
        { name: language === 'bn' ? "নিরাপত্তা" : "Security", path: "/security" },
        { name: "Careers", path: "/careers" },
        { name: "Sitemap", path: "/sitemap" },
        { name: language === 'bn' ? "প্রশ্নাবলী" : "FAQs", path: "/faqs" },
      ],
    },
    product: {
      title: language === 'bn' ? "পণ্য" : "Product",
      links: [
        { name: language === 'bn' ? "বেস্ট সেলার" : "Best Seller", path: "/products?category=best-seller" },
        { name: language === 'bn' ? "টপ রেটেড" : "Top Rated", path: "/products?category=top-rated" },
        { name: language === 'bn' ? "স্পেশাল" : "Special", path: "/products?category=special" },
        { name: language === 'bn' ? "ফিচার্ড" : "Featured", path: "/products?category=featured" },
        { name: language === 'bn' ? "নতুন আগমন" : "New Arrivals", path: "/products?category=new-arrivals" },
      ],
    },
  };

  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const emailInput = form.elements.namedItem('email') as HTMLInputElement;
    const email = emailInput?.value;
    
    if (email) {
      console.log("Newsletter signup:", email);
      alert(language === 'bn' ? "সাবস্ক্রাইব করার জন্য ধন্যবাদ!" : "Thank you for subscribing!");
      form.reset();
    }
  };

  const getNewsletterText = () => {
    if (language === 'bn') {
      return {
        title: "নিউজলেটারের জন্য সাইন আপ করুন",
        description: "আমাদের মেইলিং লিস্টে যোগ দিন এবং ১৫% ছাড় পান। আমরা স্প্যাম না করার প্রতিশ্রুতি দিচ্ছি।",
        placeholder: "আপনার ইমেইল ঠিকানা",
        button: "সাইন আপ"
      };
    }
    return {
      title: "Sign up for newsletter",
      description: "Join our mailing list and get 15% Off. We promise not to spam.",
      placeholder: "Your email address",
      button: "Sign Up"
    };
  };

  const newsletterText = getNewsletterText();

  return (
    <footer className="bg-[#f3f3f3] text-gray-700">
      <section className="border-y border-gray-200 bg-[#ececec]">
        <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <p className="flex items-center gap-2 text-2xl text-[20px] font-semibold">
            <Mail className="h-5 w-5" /> {newsletterText.title}
          </p>
          <p className="text-sm">
            {newsletterText.description}
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex w-full max-w-[420px] items-center gap-2">
            <input
              name="email"
              type="email"
              required
              placeholder={newsletterText.placeholder}
              className="flex-1 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ef553f]"
            />
            <button 
              type="submit"
              className="rounded bg-[#ef553f] px-5 py-2 text-white hover:bg-[#d4382c] transition-colors duration-300"
            >
              {newsletterText.button}
            </button>
          </form>
        </div>
      </section>
      
      <section className="container mx-auto grid w-full grid-cols-2 gap-6 px-4 py-10 md:grid-cols-5">
        <div>
          <h3 className="mb-3 text-lg text-[22px] font-semibold text-[#ef553f]">
            {footerLinks.help.title}
          </h3>
          <ul className="space-y-2 text-sm">
            {footerLinks.help.links.map((link) => (
              <li key={link.name}>
                <Link href={link.path} className="hover:text-[#ef553f] transition-colors duration-300">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-lg text-[22px] font-semibold text-[#ef553f]">
            {footerLinks.info.title}
          </h3>
          <ul className="space-y-2 text-sm">
            {footerLinks.info.links.map((link) => (
              <li key={link.name}>
                <Link href={link.path} className="hover:text-[#ef553f] transition-colors duration-300">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-lg text-[22px] font-semibold text-[#ef553f]">
            {footerLinks.policy.title}
          </h3>
          <ul className="space-y-2 text-sm">
            {footerLinks.policy.links.map((link) => (
              <li key={link.name}>
                <Link href={link.path} className="hover:text-[#ef553f] transition-colors duration-300">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-lg text-[22px] font-semibold text-[#ef553f]">
            {footerLinks.product.title}
          </h3>
          <ul className="space-y-2 text-sm">
            {footerLinks.product.links.map((link) => (
              <li key={link.name}>
                <Link href={link.path} className="hover:text-[#ef553f] transition-colors duration-300">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-lg text-[22px] font-semibold text-[#ef553f]">
            {language === 'bn' ? 'যোগাযোগের তথ্য' : 'Contact Info'}
          </h3>
          <div className="space-y-2 text-sm">
            <p className="flex items-start gap-2">
              <MapPin className="mt-1 h-4 w-4 flex-shrink-0" />
              <span>{settings?.address || (language === 'bn' ? 'ঠিকানা পাওয়া যায়নি' : 'Address not found')}</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 flex-shrink-0" />
              <a href={`tel:${settings?.phone}`} className="hover:text-[#ef553f] transition-colors">
                {settings?.phone || (language === 'bn' ? 'ফোন পাওয়া যায়নি' : 'Phone not found')}
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4 flex-shrink-0" />
              <a href={`mailto:${settings?.email}`} className="hover:text-[#ef553f] transition-colors">
                {settings?.email || (language === 'bn' ? 'ইমেইল পাওয়া যায়নি' : 'Email not found')}
              </a>
            </p>
          </div>
        </div>
      </section>
      
      <section className="border-t border-gray-200 py-5 text-center text-sm">
        © 2026 Amar-Shop - {language === 'bn' ? 'থিম দ্বারা' : 'Theme by'} Dipankar
      </section>
    </footer>
  );
};