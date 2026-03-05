"use client";

import { useState, useEffect, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getLeadDetail, updateLeadCrmFields, getTeamMembers } from "@/lib/actions/admin";
import { SourceBadge } from "./source-badge";
import { ActivityTimeline } from "./activity-timeline";

interface LeadDetailPanelProps {
  registrationId: string | null;
  onClose: () => void;
}

const LEAD_STATUSES = [
  "open", "attempted", "connected", "in_progress", "bad_timing", "unqualified",
];

export function LeadDetailPanel({
  registrationId,
  onClose,
}: LeadDetailPanelProps) {
  const [data, setData] = useState<Awaited<
    ReturnType<typeof getLeadDetail>
  > | null>(null);
  const [loading, setLoading] = useState(false);
  const [teamMembers, setTeamMembers] = useState<{ id: string; name: string }[]>([]);
  const [isPending, startTransition] = useTransition();
  const [crmFields, setCrmFields] = useState({
    lead_status: "open",
    assigned_to: "" as string,
    phone: "", company: "", industry: "", budget: "",
    how_far_along: "", why_building_mvp: "",
  });
  const [notesFields, setNotesFields] = useState({ notes: "", next_steps: "" });

  useEffect(() => {
    if (!registrationId) { setData(null); return; }
    setLoading(true);
    Promise.all([getLeadDetail(registrationId), getTeamMembers()])
      .then(([detail, members]) => {
        setData(detail);
        setTeamMembers(members);
        if (detail.registration) {
          const r = detail.registration;
          setCrmFields({
            lead_status: r.lead_status || "open",
            assigned_to: r.assigned_to || "",
            phone: r.phone || "", company: r.company || "",
            industry: r.industry || "", budget: r.budget || "",
            how_far_along: r.how_far_along || "",
            why_building_mvp: r.why_building_mvp || "",
          });
          setNotesFields({ notes: r.notes || "", next_steps: r.next_steps || "" });
        }
      }).finally(() => setLoading(false));
  }, [registrationId]);

  function saveCrm() {
    if (!registrationId) return;
    startTransition(async () => {
      await updateLeadCrmFields(registrationId, { ...crmFields, assigned_to: crmFields.assigned_to || null });
      const detail = await getLeadDetail(registrationId);
      setData(detail);
    });
  }

  function saveNotes() {
    if (!registrationId) return;
    startTransition(async () => {
      await updateLeadCrmFields(registrationId, { notes: notesFields.notes || null, next_steps: notesFields.next_steps || null });
      const detail = await getLeadDetail(registrationId);
      setData(detail);
    });
  }

  const reg = data?.registration;

  return (
    <Dialog open={!!registrationId} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-inter-tight text-lg">
            {loading ? "Loading..." : reg?.name || "Lead Detail"}
          </DialogTitle>
          {reg && (
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-secondary">{reg.email}</p>
              {reg.source && <SourceBadge source={reg.source} />}
            </div>
          )}
        </DialogHeader>

        {loading && (
          <div className="py-8 text-center text-sm text-muted-secondary">
            Loading lead details...
          </div>
        )}

        {data && reg && (
          <Tabs defaultValue="details" className="mt-2">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="details" className="text-xs">Details</TabsTrigger>
              <TabsTrigger value="crm" className="text-xs">CRM</TabsTrigger>
              <TabsTrigger value="notes" className="text-xs">Notes</TabsTrigger>
              <TabsTrigger value="activity" className="text-xs">Activity</TabsTrigger>
              <TabsTrigger value="booking" className="text-xs">Booking</TabsTrigger>
              <TabsTrigger value="workshop" className="text-xs">Workshop</TabsTrigger>
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


            <TabsContent value="crm" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-muted-secondary">Lead Status</label>
                  <Select value={crmFields.lead_status} onValueChange={(v) => setCrmFields((f) => ({ ...f, lead_status: v }))}>
                    <SelectTrigger className="mt-1 h-9 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {LEAD_STATUSES.map((s) => (
                        <SelectItem key={s} value={s} className="text-sm">{s.replace(/_/g, " ")}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-muted-secondary">Assigned To</label>
                  <Select value={crmFields.assigned_to || "unassigned"} onValueChange={(v) => setCrmFields((f) => ({ ...f, assigned_to: v === "unassigned" ? "" : v }))}>
                    <SelectTrigger className="mt-1 h-9 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned" className="text-sm">Unassigned</SelectItem>
                      {teamMembers.map((m) => (
                        <SelectItem key={m.id} value={m.name} className="text-sm">{m.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-muted-secondary">Phone</label>
                  <Input value={crmFields.phone} onChange={(e) => setCrmFields((f) => ({ ...f, phone: e.target.value }))} className="mt-1 h-9 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-muted-secondary">Company</label>
                  <Input value={crmFields.company} onChange={(e) => setCrmFields((f) => ({ ...f, company: e.target.value }))} className="mt-1 h-9 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-muted-secondary">Industry</label>
                  <Input value={crmFields.industry} onChange={(e) => setCrmFields((f) => ({ ...f, industry: e.target.value }))} className="mt-1 h-9 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-muted-secondary">Budget</label>
                  <Input value={crmFields.budget} onChange={(e) => setCrmFields((f) => ({ ...f, budget: e.target.value }))} className="mt-1 h-9 text-sm" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-muted-secondary">How Far Along</label>
                <Input value={crmFields.how_far_along} onChange={(e) => setCrmFields((f) => ({ ...f, how_far_along: e.target.value }))} className="mt-1 h-9 text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-muted-secondary">Why Building MVP</label>
                <Input value={crmFields.why_building_mvp} onChange={(e) => setCrmFields((f) => ({ ...f, why_building_mvp: e.target.value }))} className="mt-1 h-9 text-sm" />
              </div>
              <Button onClick={saveCrm} disabled={isPending} className="w-full" size="sm">
                {isPending ? "Saving..." : "Save CRM Fields"}
              </Button>
            </TabsContent>

            <TabsContent value="notes" className="space-y-4 mt-4">
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-muted-secondary">Next Steps</label>
                <Textarea value={notesFields.next_steps} onChange={(e) => setNotesFields((f) => ({ ...f, next_steps: e.target.value }))} className="mt-1 text-sm min-h-[80px]" placeholder="What is the next action for this lead?" />
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-muted-secondary">Notes</label>
                <Textarea value={notesFields.notes} onChange={(e) => setNotesFields((f) => ({ ...f, notes: e.target.value }))} className="mt-1 text-sm min-h-[120px]" placeholder="Internal notes about this lead..." />
              </div>
              <Button onClick={saveNotes} disabled={isPending} className="w-full" size="sm">
                {isPending ? "Saving..." : "Save Notes"}
              </Button>
            </TabsContent>

            <TabsContent value="activity" className="mt-4">
              <ActivityTimeline activities={data.activities ?? []} />
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


          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
