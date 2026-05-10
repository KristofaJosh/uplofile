import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "Can I limit the number of files?",
    answer: (
      <p>
        Use <code className="code-inline">maxCount</code> on{" "}
        <code className="code-inline">Root</code>.
      </p>
    ),
  },
  {
    question: "Can I pre-hydrate already-uploaded files?",
    answer: (
      <p>
        Pass{" "}
        <code className="code-inline">
          initial=[{`{ id, uid, name, url }`}]
        </code>{" "}
        (id/uid optional). They'll be shown as done and included in{" "}
        <code className="code-inline">HiddenInput</code>.
      </p>
    ),
  },
  {
    question: "How do I do strict server-side delete?",
    answer: (
      <p>
        Set <code className="code-inline">removeMode="strict"</code> and
        implement <code className="code-inline">onRemove(item, signal)</code>.
      </p>
    ),
  },
  {
    question: "Do I have to use Tailwind?",
    answer: (
      <p>
        No. The components are unstyled besides minimal examples; you can render
        your own UI with the render props and actions.
      </p>
    ),
  },
];

export const FAQSection = () => {
  return (
    <section className="py-20 border-t border-border">
      <div className="container max-w-3xl">
        <h2 className="mb-8 text-3xl font-bold tracking-tight">FAQ</h2>

        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left font-medium">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
