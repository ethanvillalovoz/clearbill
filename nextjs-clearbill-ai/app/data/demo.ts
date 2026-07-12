import type { ChatResponse, SourceReference } from "../types";

export const DEMO_SOURCES: SourceReference[] = [
  {
    title: "Understanding your health insurance bill",
    publisher: "HealthCare.gov",
    url: "https://www.healthcare.gov/blog/understanding-your-health-insurance-bill/",
  },
  {
    title: "Know your rights under the No Surprises Act",
    publisher: "Centers for Medicare & Medicaid Services",
    url: "https://www.cms.gov/nosurprises/consumers",
  },
  {
    title: "How to dispute a medical bill",
    publisher: "Consumer Financial Protection Bureau",
    url: "https://www.consumerfinance.gov/ask-cfpb/category-medical-bills/",
  },
];

const answers = {
  eob: `An Explanation of Benefits is not a bill. It is your insurer's record of how a claim was processed.

Compare these fields before paying:

1. **Amount billed** - what the provider submitted.
2. **Allowed amount** - the insurer's negotiated or recognized price.
3. **Plan paid** - the amount paid by insurance.
4. **You may owe** - deductible, copay, coinsurance, or a non-covered amount.

Match the provider, date of service, and claim number against the bill you received. If the amounts do not line up, call the number on the EOB and ask whether the claim was finalized or adjusted.`,
  network: `An out-of-network charge means the provider did not have a negotiated rate with your plan for that service. That can change both the allowed amount and your share.

Check the provider name, facility, date of service, and network status on your EOB. For emergency care and certain services at an in-network facility, the No Surprises Act may limit balance billing. Ask the insurer for the claim's network determination and appeal instructions before paying a disputed balance.`,
  default: `Start by matching the bill to your Explanation of Benefits and separating the provider's charge from the amount your plan says you owe.

Look for the **date of service**, **provider**, **procedure or revenue code**, **amount billed**, **insurance adjustment**, and **patient responsibility**. Ask the provider for an itemized bill if those details are missing.

Before paying a charge you do not recognize, confirm that the claim is final, request the billing code and plain-language description, and compare the patient-responsibility amount with the insurer's record.`,
};

export function getDemoResponse(question: string): ChatResponse {
  const normalized = question.toLowerCase();
  const answer = normalized.includes("eob") || normalized.includes("explanation of benefits")
    ? answers.eob
    : normalized.includes("network") || normalized.includes("surprise")
      ? answers.network
      : answers.default;

  return { answer, sources: DEMO_SOURCES, mode: "demo" };
}
