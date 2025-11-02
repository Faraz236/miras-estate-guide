import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';

export default function FAQs() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <HelpCircle className="h-16 w-16 text-primary mx-auto" />
            <h1 className="text-4xl font-bold text-foreground">Illinois Inheritance Law FAQs</h1>
            <p className="text-lg text-muted-foreground">
              Common questions about Islamic estate planning in Illinois
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="faq-1">
              <Card>
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <span className="font-semibold text-left">
                    1. What happens if I die without a will in Illinois?
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-muted-foreground">
                  <p>
                    If you die "intestate" (without a valid will), Illinois intestacy laws determine how your probate estate 
                    is distributed. Generally, your spouse and children receive shares according to a statutory formula that 
                    may not align with Islamic inheritance rules. For example, Illinois gives equal shares to sons and daughters, 
                    whereas Sunni fiqh typically allocates a 2:1 ratio. Creating a valid will ensures your estate follows 
                    Sharia principles.
                  </p>
                </AccordionContent>
              </Card>
            </AccordionItem>

            <AccordionItem value="faq-2">
              <Card>
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <span className="font-semibold text-left">
                    2. Can I fully enforce Sharia inheritance rules in Illinois?
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-muted-foreground">
                  <p>
                    Yes, with proper planning. Illinois allows you to distribute your estate according to Islamic principles 
                    through a valid will, but there are constraints:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                    <li>
                      <strong>Spousal elective share:</strong> A surviving spouse may claim approximately one-third of your estate 
                      regardless of your will's terms.
                    </li>
                    <li>
                      <strong>Non-probate assets:</strong> Retirement accounts, life insurance, and joint tenancy assets pass 
                      directly to named beneficiaries or co-owners, bypassing your will.
                    </li>
                  </ul>
                  <p className="mt-3">
                    Working with an attorney experienced in Islamic estate planning can help structure your plan to maximize 
                    Sharia compliance while respecting Illinois law.
                  </p>
                </AccordionContent>
              </Card>
            </AccordionItem>

            <AccordionItem value="faq-3">
              <Card>
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <span className="font-semibold text-left">
                    3. What is the spousal elective share and how does it affect my estate plan?
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-muted-foreground">
                  <p>
                    Illinois law gives a surviving spouse the right to claim an "elective share" of approximately one-third 
                    of your estate if you have living descendants (children or grandchildren). This protects spouses from 
                    being disinherited. If your Sharia distribution allocates less than this amount to your spouse (for example, 
                    a wife receiving 1/8 when children are present), your spouse can elect to take the larger statutory share instead.
                  </p>
                  <p className="mt-3">
                    <strong>Planning tip:</strong> Consider discussing this with your spouse and documenting their consent 
                    to waive the elective share in favor of the Sharia distribution, or structure non-probate assets 
                    to ensure they receive adequate provision.
                  </p>
                </AccordionContent>
              </Card>
            </AccordionItem>

            <AccordionItem value="faq-4">
              <Card>
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <span className="font-semibold text-left">
                    4. How can I ensure my 401(k), IRA, and life insurance follow Sharia rules?
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-muted-foreground">
                  <p>
                    These assets pass directly to the beneficiaries you name on the account or policy forms—they do NOT 
                    go through your will. To align them with Islamic inheritance:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                    <li>
                      <strong>Option 1:</strong> Update beneficiary forms to list each heir with percentages matching 
                      Sharia shares (e.g., sons and daughters in a 2:1 ratio).
                    </li>
                    <li>
                      <strong>Option 2:</strong> Name a revocable living trust as the beneficiary. The trust document 
                      then directs distribution according to Islamic rules.
                    </li>
                  </ul>
                  <p className="mt-3">
                    Review and update beneficiary designations regularly—especially after major life events like births, 
                    deaths, or marriages.
                  </p>
                </AccordionContent>
              </Card>
            </AccordionItem>

            <AccordionItem value="faq-5">
              <Card>
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <span className="font-semibold text-left">
                    5. What is wasiyyah and are there limits on how much I can give to charity or non-heirs?
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-muted-foreground">
                  <p>
                    <strong>Wasiyyah</strong> is a voluntary bequest to non-Quranic heirs (such as charities, distant relatives, 
                    or friends). Under Sunni fiqh, wasiyyah is generally limited to one-third (33.33%) of your net estate 
                    after debts and funeral expenses.
                  </p>
                  <p className="mt-3">
                    <strong>Key rules:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                    <li>Bequests exceeding 33.33% require written consent from all Quranic heirs.</li>
                    <li>You cannot use wasiyyah to favor one Quranic heir over another (e.g., giving extra to one child).</li>
                    <li>Illinois law permits unlimited charitable giving via will, but Islamic scholars recommend staying 
                      within the one-third limit for non-heirs.</li>
                  </ul>
                  <p className="mt-3">
                    Always consult an Islamic scholar to confirm your wasiyyah complies with fiqh requirements.
                  </p>
                </AccordionContent>
              </Card>
            </AccordionItem>

            <AccordionItem value="faq-6">
              <Card>
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <span className="font-semibold text-left">
                    6. Do I need both a will and a trust?
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-muted-foreground">
                  <p>
                    Not everyone needs a trust, but combining a will with a revocable living trust offers significant advantages:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                    <li>
                      <strong>Trust benefits:</strong> Assets held in trust avoid probate, provide privacy, and allow 
                      detailed instructions for distribution (including Sharia-compliant splits).
                    </li>
                    <li>
                      <strong>Will benefits:</strong> Names guardians for minor children and serves as a "pour-over" 
                      document to transfer any forgotten assets into the trust.
                    </li>
                  </ul>
                  <p className="mt-3">
                    For Muslim families with complex estates or non-probate assets, a trust is often the most effective 
                    tool to ensure comprehensive Sharia compliance.
                  </p>
                </AccordionContent>
              </Card>
            </AccordionItem>

            <AccordionItem value="faq-7">
              <Card>
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <span className="font-semibold text-left">
                    7. What are the witness requirements for a valid Illinois will?
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-muted-foreground">
                  <p>
                    To be valid in Illinois, your will must be signed by you (or someone at your direction in your presence) 
                    and by <strong>two witnesses</strong> who:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                    <li>Are at least 18 years old</li>
                    <li>Are mentally competent</li>
                    <li>Are not beneficiaries under your will (to avoid conflicts of interest)</li>
                    <li>Sign in your presence and in each other's presence</li>
                  </ul>
                  <p className="mt-3">
                    <strong>Important:</strong> Handwritten (holographic) wills are NOT valid in Illinois unless 
                    they meet these witness requirements. Always follow formal execution procedures with an attorney.
                  </p>
                </AccordionContent>
              </Card>
            </AccordionItem>

            <AccordionItem value="faq-8">
              <Card>
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <span className="font-semibold text-left">
                    8. Can adopted children inherit under Islamic law and Illinois law?
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-muted-foreground">
                  <p>
                    <strong>Illinois law:</strong> Adopted children have the same inheritance rights as biological children 
                    and are treated identically under intestacy statutes.
                  </p>
                  <p className="mt-3">
                    <strong>Islamic law:</strong> Classical Sunni fiqh does not grant adopted children automatic inheritance 
                    rights as Quranic heirs. However, you can provide for adopted children through:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                    <li>Wasiyyah (up to one-third of your estate)</li>
                    <li>Lifetime gifts (hiba)</li>
                    <li>Designation as beneficiaries on non-probate assets</li>
                  </ul>
                  <p className="mt-3">
                    This is a complex area requiring consultation with both an attorney and a scholar familiar with adoption 
                    in Islamic jurisprudence.
                  </p>
                </AccordionContent>
              </Card>
            </AccordionItem>

            <AccordionItem value="faq-9">
              <Card>
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <span className="font-semibold text-left">
                    9. How often should I update my estate plan?
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-muted-foreground">
                  <p>
                    Review and update your estate plan every 3-5 years or whenever you experience:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                    <li>Marriage, divorce, or remarriage</li>
                    <li>Birth or adoption of children</li>
                    <li>Death of a beneficiary or named executor</li>
                    <li>Significant changes in asset values or types</li>
                    <li>Changes in state or federal tax laws</li>
                    <li>Relocation to a different state</li>
                  </ul>
                  <p className="mt-3">
                    Regular updates ensure your plan remains valid, tax-efficient, and aligned with your current family 
                    structure and Islamic values.
                  </p>
                </AccordionContent>
              </Card>
            </AccordionItem>

            <AccordionItem value="faq-10">
              <Card>
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <span className="font-semibold text-left">
                    10. Is Miras a substitute for a lawyer or Islamic scholar?
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-muted-foreground">
                  <p>
                    <strong>No.</strong> Miras is an educational tool designed to help you understand Islamic inheritance 
                    principles and Illinois estate law. It provides:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                    <li>Sharia-compliant share calculations (Sunni fiqh model)</li>
                    <li>Detection of potential legal conflicts</li>
                    <li>An Action Packet with prioritized next steps</li>
                    <li>Sample documents for educational purposes only</li>
                  </ul>
                  <p className="mt-3 font-semibold text-foreground">
                    You MUST consult a licensed Illinois estate attorney and a qualified Islamic scholar before 
                    implementing any estate plan.
                  </p>
                  <p className="mt-2">
                    Miras is not legal advice and does not create an attorney-client relationship. Use it as a starting 
                    point for informed conversations with professionals.
                  </p>
                </AccordionContent>
              </Card>
            </AccordionItem>
          </Accordion>

          <Card className="p-6 bg-primary/5 border-primary/20">
            <div className="space-y-3 text-center">
              <p className="font-semibold text-foreground">Still Have Questions?</p>
              <p className="text-sm text-muted-foreground">
                These FAQs are for educational purposes only. For personalized guidance on your specific situation, 
                please consult with a licensed Illinois estate attorney and a qualified Islamic scholar.
              </p>
              <a 
                href="mailto:support@miras.com" 
                className="text-primary hover:underline text-sm font-medium inline-block mt-2"
              >
                Contact us at support@miras.com
              </a>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
