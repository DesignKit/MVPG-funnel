"use client";

import { useState } from "react";
import { updatePricingTier } from "@/lib/actions/admin";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

interface PricingTier {
  id: string;
  key: string;
  name: string;
  badge: string | null;
  duration: string;
  price_cents: number;
  display_price: string;
  stripe_price_id: string | null;
  features: string[];
  recommended: boolean;
  active: boolean;
  sort_order: number;
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor} className="text-xs font-medium text-muted-secondary">{label}</Label>
      {children}
    </div>
  );
}

function TierCard({
  tier,
  onSaved,
}: {
  tier: PricingTier;
  onSaved: (updated: PricingTier) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState(tier.name);
  const [badge, setBadge] = useState(tier.badge ?? "");
  const [duration, setDuration] = useState(tier.duration);
  const [displayPrice, setDisplayPrice] = useState(tier.display_price);
  const [priceCents, setPriceCents] = useState(tier.price_cents);
  const [stripePriceId, setStripePriceId] = useState(
    tier.stripe_price_id ?? ""
  );
  const [features, setFeatures] = useState(tier.features.join("\n"));
  const [recommended, setRecommended] = useState(tier.recommended);
  const [active, setActive] = useState(tier.active);

  function handleCancel() {
    setName(tier.name);
    setBadge(tier.badge ?? "");
    setDuration(tier.duration);
    setDisplayPrice(tier.display_price);
    setPriceCents(tier.price_cents);
    setStripePriceId(tier.stripe_price_id ?? "");
    setFeatures(tier.features.join("\n"));
    setRecommended(tier.recommended);
    setActive(tier.active);
    setEditing(false);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const featuresList = features
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean);

      await updatePricingTier(tier.id, {
        name,
        badge: badge || null,
        duration,
        display_price: displayPrice,
        price_cents: priceCents,
        stripe_price_id: stripePriceId || null,
        features: featuresList,
        recommended,
        active,
      });

      onSaved({
        ...tier,
        name,
        badge: badge || null,
        duration,
        display_price: displayPrice,
        price_cents: priceCents,
        stripe_price_id: stripePriceId || null,
        features: featuresList,
        recommended,
        active,
      });
      setEditing(false);
    } catch (err) {
      console.error("Failed to save:", err);
    } finally {
      setSaving(false);
    }
  }

  const isFree = tier.price_cents === 0;

  return (
    <div
      className={`rounded-lg border p-5 ${
        !active
          ? "border-border bg-surface-gray opacity-60"
          : tier.recommended
            ? "border-accent-purple/30 bg-white"
            : "border-border bg-white"
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-inter-tight text-lg font-semibold text-foreground">{tier.name}</h3>
            {tier.recommended && (
              <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px]">
                Recommended
              </Badge>
            )}
            {!active && (
              <Badge className="bg-surface-gray text-muted-secondary border-border text-[10px]">
                Inactive
              </Badge>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-secondary">
            {tier.display_price} &middot; {tier.duration}
          </p>
          {!isFree && (
            <p className="mt-1 text-xs text-muted-secondary">
              Stripe Price:{" "}
              {tier.stripe_price_id ? (
                <code className="text-foreground">{tier.stripe_price_id}</code>
              ) : (
                <span className="text-primary-gold">Not configured</span>
              )}
            </p>
          )}
        </div>
        <button
          onClick={() => (editing ? handleCancel() : setEditing(true))}
          className="text-sm text-muted-secondary hover:text-foreground transition-colors"
        >
          {editing ? "Cancel" : "Edit"}
        </button>
      </div>

      {!editing && (
        <ul className="mt-3 flex flex-col gap-1">
          {tier.features.map((f, i) => (
            <li key={i} className="text-sm text-muted-secondary">
              &bull; {f}
            </li>
          ))}
        </ul>
      )}

      {editing && (
        <div className="mt-4 flex flex-col gap-4">
          <div className="grid gap-4 tablet:grid-cols-2">
            <Field label="Name" htmlFor={`name-${tier.id}`}>
              <Input
                id={`name-${tier.id}`}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Field>
            <Field label="Badge text" htmlFor={`badge-${tier.id}`}>
              <Input
                id={`badge-${tier.id}`}
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. Recommended for you"
              />
            </Field>
            <Field label="Display Price" htmlFor={`price-${tier.id}`}>
              <Input
                id={`price-${tier.id}`}
                value={displayPrice}
                onChange={(e) => setDisplayPrice(e.target.value)}
                placeholder="e.g. $49, FREE"
              />
            </Field>
            <Field label="Price (cents)" htmlFor={`cents-${tier.id}`}>
              <Input
                id={`cents-${tier.id}`}
                type="number"
                value={priceCents}
                onChange={(e) => setPriceCents(Number(e.target.value))}
              />
            </Field>
            <Field label="Duration" htmlFor={`dur-${tier.id}`}>
              <Input
                id={`dur-${tier.id}`}
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </Field>
            {!isFree && (
              <Field label="Stripe Price ID" htmlFor={`stripe-${tier.id}`}>
                <Input
                  id={`stripe-${tier.id}`}
                  value={stripePriceId}
                  onChange={(e) => setStripePriceId(e.target.value)}
                  placeholder="price_xxx"
                />
              </Field>
            )}
          </div>

          <Field label="Features (one per line)" htmlFor={`feat-${tier.id}`}>
            <Textarea
              id={`feat-${tier.id}`}
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </Field>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch
                id={`rec-${tier.id}`}
                checked={recommended}
                onCheckedChange={setRecommended}
              />
              <Label htmlFor={`rec-${tier.id}`} className="text-sm text-foreground">
                Recommended
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id={`act-${tier.id}`}
                checked={active}
                onCheckedChange={setActive}
              />
              <Label htmlFor={`act-${tier.id}`} className="text-sm text-foreground">
                Active
              </Label>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-md bg-accent-purple px-4 py-2 text-sm font-medium text-white hover:bg-accent-purple/90 disabled:opacity-40 transition-colors"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={handleCancel}
              className="rounded-md border border-border px-4 py-2 text-sm text-muted-secondary hover:bg-surface-gray transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function PricingManager({
  initialTiers,
}: {
  initialTiers: PricingTier[];
}) {
  const [tiers, setTiers] = useState(initialTiers);

  function handleSaved(updated: PricingTier) {
    setTiers((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  }

  return (
    <div className="flex flex-col gap-4">
      {tiers.map((tier) => (
        <TierCard key={tier.id} tier={tier} onSaved={handleSaved} />
      ))}
      {tiers.length === 0 && (
        <p className="text-sm text-gray-500">
          No pricing tiers found. Run the migration to seed default tiers.
        </p>
      )}
    </div>
  );
}
