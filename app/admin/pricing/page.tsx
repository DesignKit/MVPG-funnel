import { getPricingTiers } from "@/lib/actions/admin";
import { PricingManager } from "./pricing-manager";

export default async function AdminPricingPage() {
  const tiers = await getPricingTiers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-inter-tight text-2xl font-bold text-foreground">Pricing</h1>
        <p className="mt-1 font-inter text-sm text-muted-secondary">
          Manage workshop pricing tiers displayed on the confirmation page.
        </p>
      </div>
      <PricingManager initialTiers={tiers} />
    </div>
  );
}
