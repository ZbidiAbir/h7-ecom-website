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
        question: "01.Customer Support",
        answer: `Need help? Our team is always ready to assist you
    
    How to Contact Us:
    - WhatsApp: +216 XX XXX XXX
    - Email: contact@hashseven.tn
    - Instagram: @hashseven.tn
    
    We're available from Monday to Saturday, 9 AM – 6 PM.
    Support Topics:
    - Help with orders and payments
    - Delivery tracking and shipping questions
    - Returns and exchanges
    -Product or size inquiries
    We aim to respond within 24 hours to all messages.`,
      },
      {
        id: "support-areas",
        question: "02.Delivery Details",
        answer: `
            We deliver anywhere in Tunisia, fast and securely.
            Delivery Time:
    - 1–3 business days for most cities
    - Up to 5 days for remote areas
    Delivery Fees::
    - Between 6 TND and 10 TND, depending on your location
    Order Tracking:
    Once your order is shipped, you’ll receive a WhatsApp or SMS message with your tracking details and courier contact.
    Important Notes:
    -Please double-check your address and phone number before confirming your order.
    -If you’re not available at delivery, the courier will contact you to schedule another attempt.
    `,
      },

      {
        id: "order-help",
        question: " 03.Terms & Conditions",
        answer: `By using our website and placing an order, you agree to the following terms:
        
1.Product Availability:
All items are subject to stock availability. If an item becomes unavailable after ordering, we will contact you to offer an alternative or a refund.
2.Pricing:
Prices are listed in Tunisian Dinar (TND) and include VAT where applicable. Hashseven reserves the right to change prices or promotions without prior notice.
3.Order Confirmation:
You will receive an order confirmation message once your purchase is completed
Hashseven reserves the right to cancel an order in case of suspected fraud or incorrect information.
4.Returns & Exchanges:
Exchanges are accepted within 3 days after delivery for items that are unused, unwashed, and in original packaging.
Return shipping costs are the responsibility of the customer unless the product received is incorrect or defective.
5.Intellectual Property:
All images, designs, and logos on this site are the property of Hashseven.
Reuse without permission is strictly prohibited.
6.Limitation of Liability:
Hashseven is not responsible for delays or damages caused by third-party delivery services.




`,
      },
      {
        id: "payment-methods",
        question: " 04.Privacy Policy",
        answer: `At Hashseven, your privacy matters. We respect and protect all personal information you share with us.
        What We Collect:
        - Name, address, and phone number for delivery.
        -Email address for communication and order confirmation.
        -Payment details (securely processed by certified payment gateways)
        How We Use Your Data:
        -To process and deliver your orders.
        -To contact you regarding your purchase or inquiries.
        -To improve your shopping experience and offer personalized promotions
        Data Protection:
        -We never share or sell your personal information to third parties.
        -Payment information is encrypted and handled by secure local payment providers.
        Cookies:
        -Our site uses cookies to improve navigation and personalize your experience.
        -You can disable cookies in your browser settings at any time.

        `,
      },
    ],
  },
];

const HelpCenter = () => {
  return (
    <div className="w-full mx-auto p-6">
      <HeaderWrapper />
      <div className="text-start mb-12 pt-24">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Help center </h1>
        <p className="text-xl text-gray-600 mx-auto">How can we help you ? </p>
      </div>

      {/* Accordéon des questions */}
      <div className="space-y-6">
        {helpSections.map((section) => (
          <div
            key={section.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200"
          >
            <Accordion type="single" collapsible className="w-full">
              {section.questions.map((faq, index) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="border-b border-gray-100 last:border-b-0"
                >
                  <AccordionTrigger className="px-6 py-4 text-left hover:no-underline hover:bg-gray-50 transition-colors">
                    <span className="font-medium text-gray-900 text-2xl">
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 pt-2">
                    <div className="text-gray-700 leading-relaxed whitespace-pre-line text-xl">
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
export default HelpCenter;
