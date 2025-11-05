"use client";

import HeaderWrapper from "@/components/HeaderWrapper";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const helpSections = [
  {
    id: "orders-payments",
    questions: [
      {
        id: "contact-info",
        question: "01.About",
        answer: `Hashseven is a Tunisian streetwear brand created for people who love bold, modern, and effortless fashion.
        We combine comfort, quality, and attitude — inspired by the urban culture and creative minds of Tunisia.
        Our goal is simple:
        To make streetstyle accessible to everyone, while keeping it authentic and original.
        At Hashseven, fashion is not just about clothes — it's about self-expression.
        Every collection tells a story. Every piece reflects your vibe.   
   `,
      },
      {
        id: "support-areas",
        question: "02.Feature",
        answer: `
        Why shop with Hashseven? Here's what makes us different 
    - Exclusive Designs – Every piece is designed with a modern streetwear twist, created by our in-house team.
    - Fast Delivery – Get your order anywhere in Tunisia within 1 to 3 business days.
    - Affordable Prices – Trendy looks that fit your budget, with special drops and flash sales.
    - Responsive Support – Need help? Our team is available on WhatsApp, Instagram, and email to assist you anytime.
    - Secure Shopping – All transactions and customer data are protected with certified security systems.
    - Eco-Minded Vision – We aim to reduce packaging waste and encourage sustainable streetwear choices.
   
    `,
      },
      {
        id: "order-help",
        question: " 03.How it works",
        answer: `Shopping with Hashseven is fast and simple:
        
1. Browse our latest collections and choose your favorite items.
2. Add to Cart the sizes and colors you like.
3. Checkout with your delivery information and preferred payment method.
4. Receive Your Order within a few days anywhere in Tunisia.
5. Enjoy Your Fit and tag us @hashseven.tn to get featured!
If you need any help with your order, visit our FAQ page or contact us directly via WhatsApp.
`,
      },
    ],
  },
];

const Company = () => {
  return (
    <div className="w-full mx-auto px-36 bg-white">
      <HeaderWrapper />
      <div className="text-start mb-12 pt-24">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Company </h1>
      </div>

      {/* Accordéon des questions */}
      <div className="space-y-6">
        {helpSections.map((section) => (
          <div
            key={section.id}
            className="bg-white border-t border-b border-black"
          >
            <Accordion type="single" collapsible className="w-full">
              {section.questions.map((faq, index) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="border-b border-t border-[#000000] last:border-b-0"
                >
                  <AccordionTrigger className="px-6 py-8 text-left hover:no-underline hover:bg-gray-50 transition-colors">
                    <span className="font-bold text-gray-900 text-2xl">
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 pt-2">
                    <div className="text-[#000000] leading-relaxed whitespace-pre-line text-xl">
                      {faq.answer}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Company;
