import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Scale, FileText, Shield, Users, Building, Heart } from 'lucide-react';

export default function Resources() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <Scale className="h-16 w-16 text-primary mx-auto" />
            <h1 className="text-4xl font-bold text-foreground">Estate Planning Resources</h1>
            <p className="text-lg text-muted-foreground">
              Educational information to help you understand Islamic inheritance and Illinois estate law
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="why-estate-planning">
              <Card>
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Heart className="h-6 w-6 text-primary" />
                    <span className="font-semibold text-lg">Why Estate Planning Matters</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-3 text-muted-foreground">
                    <p>
                      Estate planning ensures your assets are distributed according to your wishes and Islamic principles after you pass away. 
                      Without a valid will, Illinois intestacy laws determine how your property is divided—which may not align with Sharia requirements.
                    </p>
                    <p>
                      A well-structured estate plan protects your family, minimizes disputes, and ensures compliance with both religious obligations 
                      and state legal requirements.
                    </p>
                  </div>
                </AccordionContent>
              </Card>
            </AccordionItem>

            <AccordionItem value="estate-planning-documents">
              <Card>
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <FileText className="h-6 w-6 text-primary" />
                    <span className="font-semibold text-lg">Key Estate Planning Documents</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-4 text-muted-foreground">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Last Will and Testament</h4>
                      <p>Your primary document for distributing probate assets and naming guardians for minor children.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Revocable Living Trust</h4>
                      <p>Allows assets to pass outside probate while maintaining control during your lifetime.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Power of Attorney</h4>
                      <p>Authorizes someone to manage your financial affairs if you become incapacitated.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Healthcare Directive</h4>
                      <p>Specifies your medical treatment preferences and designates a healthcare agent.</p>
                    </div>
                  </div>
                </AccordionContent>
              </Card>
            </AccordionItem>

            <AccordionItem value="wills">
              <Card>
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Shield className="h-6 w-6 text-primary" />
                    <span className="font-semibold text-lg">Understanding Wills</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-3 text-muted-foreground">
                    <p>
                      A will is a legal document that directs how your probate estate will be distributed after death. In Illinois, 
                      a valid will must be:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>In writing</li>
                      <li>Signed by you (the testator) or at your direction</li>
                      <li>Witnessed by two credible witnesses who are not beneficiaries</li>
                      <li>Signed by witnesses in your presence</li>
                    </ul>
                    <p className="mt-3">
                      <strong className="text-foreground">Important:</strong> Handwritten (holographic) wills are NOT valid in Illinois 
                      unless they meet the formal witness requirements.
                    </p>
                  </div>
                </AccordionContent>
              </Card>
            </AccordionItem>

            <AccordionItem value="important-considerations">
              <Card>
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Users className="h-6 w-6 text-primary" />
                    <span className="font-semibold text-lg">Important Considerations</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-4 text-muted-foreground">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Spousal Rights</h4>
                      <p>
                        Illinois law provides surviving spouses with an "elective share"—approximately one-third of your estate 
                        if you have descendants. Your spouse can choose this over what your will provides.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Guardianship for Minors</h4>
                      <p>
                        Naming a guardian in your will is crucial if you have minor children. Without this designation, 
                        the court will decide who raises your children.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Islamic Wasiyyah</h4>
                      <p>
                        Under Sunni fiqh, voluntary bequests (wasiyyah) to non-heirs are typically limited to one-third of your estate. 
                        Amounts exceeding this may require written consent from all Quranic heirs.
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </Card>
            </AccordionItem>

            <AccordionItem value="probate">
              <Card>
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Building className="h-6 w-6 text-primary" />
                    <span className="font-semibold text-lg">Probate Process</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-3 text-muted-foreground">
                    <p>
                      Probate is the court-supervised process of validating a will and distributing assets. In Illinois, 
                      probate typically takes 6-12 months and involves:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Filing the will with the county court</li>
                      <li>Appointing an executor</li>
                      <li>Identifying and valuing assets</li>
                      <li>Paying debts and taxes</li>
                      <li>Distributing remaining assets to beneficiaries</li>
                    </ul>
                    <p className="mt-3">
                      Assets held in joint tenancy, trusts, or with designated beneficiaries pass outside probate.
                    </p>
                  </div>
                </AccordionContent>
              </Card>
            </AccordionItem>

            <AccordionItem value="living-trusts">
              <Card>
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Shield className="h-6 w-6 text-primary" />
                    <span className="font-semibold text-lg">Living Trusts</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-3 text-muted-foreground">
                    <p>
                      A revocable living trust is a legal entity that holds your assets during your lifetime and distributes 
                      them after death without probate. Benefits include:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Avoiding probate delays and costs</li>
                      <li>Maintaining privacy (trusts don't become public record)</li>
                      <li>Providing for management if you become incapacitated</li>
                      <li>Offering flexibility in distribution terms</li>
                    </ul>
                    <p className="mt-3">
                      <strong className="text-foreground">Note:</strong> You can name a trust as the beneficiary of retirement accounts, 
                      life insurance, and other non-probate assets to ensure Sharia-compliant distribution.
                    </p>
                  </div>
                </AccordionContent>
              </Card>
            </AccordionItem>

            <AccordionItem value="powers-of-attorney">
              <Card>
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Users className="h-6 w-6 text-primary" />
                    <span className="font-semibold text-lg">Powers of Attorney</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-4 text-muted-foreground">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Financial Power of Attorney</h4>
                      <p>
                        Authorizes someone to manage your financial affairs if you cannot. This should be "durable" 
                        (remains effective if you become incapacitated).
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Healthcare Power of Attorney</h4>
                      <p>
                        Designates someone to make medical decisions on your behalf. This is critical for end-of-life 
                        situations and should reflect your Islamic values.
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </Card>
            </AccordionItem>

            <AccordionItem value="living-will">
              <Card>
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <FileText className="h-6 w-6 text-primary" />
                    <span className="font-semibold text-lg">Living Will Declaration</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-3 text-muted-foreground">
                    <p>
                      A living will (also called an advance directive) specifies your wishes regarding life-sustaining 
                      medical treatment if you're terminally ill or permanently unconscious.
                    </p>
                    <p>
                      For Muslims, this document should reflect Islamic principles about:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Extraordinary life support measures</li>
                      <li>Pain management and palliative care</li>
                      <li>Organ donation preferences</li>
                      <li>Burial wishes and funeral arrangements</li>
                    </ul>
                    <p className="mt-3">
                      Consult with an Islamic scholar to ensure your healthcare directives align with your faith.
                    </p>
                  </div>
                </AccordionContent>
              </Card>
            </AccordionItem>
          </Accordion>

          <Card className="p-6 bg-primary/5 border-primary/20">
            <div className="space-y-3 text-center">
              <p className="font-semibold text-foreground">Professional Consultation Required</p>
              <p className="text-sm text-muted-foreground">
                This information is educational only. Always consult with a licensed Illinois estate attorney 
                and a qualified Islamic scholar before implementing any estate plan. Every family situation is unique 
                and requires personalized professional guidance.
              </p>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
