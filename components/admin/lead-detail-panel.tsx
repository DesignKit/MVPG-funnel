"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getLeadDetail } from "@/lib/actions/admin";

interface LeadDetailPanelProps {
  registrationId: string | null;
  onClose: () => void;
}

export function LeadDetailPanel({
  registrationId,
  onClose,
}: LeadDetailPanelProps) {
  const [data, setData] = useState<Awaited<
    ReturnType<typeof getLeadDetail>
  > | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!registrationId) {
      setData(null);
      return;
    }
    setLoading(true);
    getLeadDetail(registrationId)
      .then(setData)
      .finally(() => setLoading(false));
  }, [registrationId]);

  const reg = data?.registration;

  return (
    <Dialog open={!!registrationId} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-inter-tight text-lg">
            {loading ? "Loading..." : reg?.name || "Lead Detail"}
          </DialogTitle>
          {reg && (
            <p className="text-sm text-muted-secondary">{reg.email}</p>
          )}
        </DialogHeader>

        {loading && (
          <div className="py-8 text-center text-sm text-muted-secondary">
            Loading lead details...
          </div>
        )}

        {data && reg && (
          <Tabs defaultValue="details" className="mt-2">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details" className="text-xs">
                Details
              </TabsTrigger>
              <TabsTrigger value="booking" className="text-xs">
                Booking
              </TabsTrigger>
              <TabsTrigger value="workshop" className="text-xs">
                Workshop
              </TabsTrigger>
              <TabsTrigger value="outline" className="text-xs">
                Outline
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 mt-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-secondary">
                  Status
                </p>
                <Badge className="mt-1 bg-accent-purple/10 text-accent-purple border-accent-purple/20">
                  {reg.status}
                </Badge>
              </div>
              <Separator />
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-secondary">
                  Idea
                </p>
                <p className="mt-1 text-sm text-foreground whitespace-pre-wrap">
                  {reg.idea_description || "—"}
                </p>
              </div>
              {reg.additional_expectations && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-secondary">
                      Additional Expectations
                    </p>
                    <p className="mt-1 text-sm text-foreground whitespace-pre-wrap">
                      {reg.additional_expectations}
                    </p>
                  </div>
                </>
              )}
              <Separator />
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-secondary">
                  Registered
                </p>
                <p className="mt-1 text-sm text-muted-secondary">
                  {new Date(reg.created_at).toLocaleDateString("en", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="booking" className="mt-4">
              {data.booking ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-secondary">
                        Date
                      </p>
                      <p className="mt-1 text-sm font-medium">
                        {data.booking.booking_date}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-secondary">
                        Time
                      </p>
                      <p className="mt-1 text-sm font-medium">
                        {data.booking.booking_time || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-secondary">
                        Status
                      </p>
                      <Badge className="mt-1 bg-accent-purple/10 text-accent-purple border-accent-purple/20">
                        {data.booking.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-secondary">
                        Payment
                      </p>
                      <p className="mt-1 text-sm">
                        {data.booking.stripe_payment_intent_id
                          ? "Paid"
                          : "Not paid"}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="py-8 text-center text-sm text-muted-secondary">
                  No booking yet
                </p>
              )}
            </TabsContent>

            <TabsContent value="workshop" className="mt-4">
              {data.responses.length > 0 ? (
                <div className="space-y-4">
                  {data.responses.map((r) => (
                    <div key={r.question_key}>
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-secondary">
                        {r.question_text}
                      </p>
                      <p className="mt-1 text-sm text-foreground whitespace-pre-wrap">
                        {r.answer_text}
                      </p>
                      <Separator className="mt-4" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-8 text-center text-sm text-muted-secondary">
                  No workshop responses yet
                </p>
              )}
            </TabsContent>

            <TabsContent value="outline" className="mt-4">
              {data.outline ? (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className="bg-accent-purple/10 text-accent-purple border-accent-purple/20">
                      {data.outline.status}
                    </Badge>
                    <span className="text-xs text-muted-secondary">
                      v{data.outline.version}
                    </span>
                  </div>
                  <div className="prose prose-sm max-w-none rounded-lg border border-border bg-surface-gray p-4 text-sm">
                    <pre className="whitespace-pre-wrap font-inter text-sm">
                      {data.outline.content_markdown}
                    </pre>
                  </div>
                </div>
              ) : (
                <p className="py-8 text-center text-sm text-muted-secondary">
                  No outline generated yet
                </p>
              )}
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
