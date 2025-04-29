import faqs from "@/data/faqs.json";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

export default function FaqSection() {

  return (
    <motion.section
      id="faqs"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="max-w-3xl mx-auto py-16 px-4">
      <h2 className="text-3xl gradient-title font-bold text-center mb-10">
        Frequently Asked Questions
      </h2>

      <Accordion type="single" collapsible className="space-y-4">
        {faqs.map((faq, index) => {
          const value = `item-${index}`;
          return (
            <AccordionItem key={index} value={value}>
              <AccordionTrigger className="flex justify-between items-center">
                <span>{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className={"text-muted-foreground"}>{faq.answer}</AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </motion.section>
  );
}
