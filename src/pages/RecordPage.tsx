import { useState, useEffect } from "react";
import { CalendarDays, Save, CheckCircle } from "lucide-react";
import { saveRecord as saveToDB } from "@/lib/time-records";
import { saveRecord as saveSQLiteRecord } from "@/lib/sqlite-db";
import TimeInputCard from "@/components/TimeInputCard";
import { useForm } from "@/contexts/FormContext";
import { toast } from "sonner";

const RecordPage = () => {
  const { formData, updateField, clearForm } = useForm();
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!formData.date) {
      toast.error("Please select a date");
      return;
    }

    try {
      // Save to both localStorage (legacy) and SQLite (new)
      const record = saveToDB({
        date: formData.date,
        morningIn: formData.morningIn,
        lunchOut: formData.lunchOut,
        afternoonIn: formData.afternoonIn,
        eveningOut: formData.eveningOut,
      });

      // Also save to SQLite for mobile
      await saveSQLiteRecord(record);

      setSaved(true);
      toast.success("Time record saved!");
      
      // Keep form data for stateless editing, but show success state
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error("[v0] Error saving record:", error);
      toast.error("Failed to save record");
    }
  };

  const handleClear = () => {
    clearForm();
    setSaved(false);
  };

  return (
    <div className="min-h-screen pb-24 max-w-md mx-auto px-4">
      {/* Header */}
      <div className="pt-12 pb-6">
        <h1 className="text-2xl font-bold tracking-tight">Daily Time Record</h1>
        <p className="text-muted-foreground text-sm mt-1">Log your work hours</p>
      </div>

      {/* Date picker */}
      <div className="bg-card rounded-lg p-4 border border-border mb-4 animate-fade-in">
        <div className="flex items-center gap-2 mb-2">
          <CalendarDays className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-muted-foreground">Date</span>
        </div>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => updateField("date", e.target.value)}
          className="w-full bg-secondary text-foreground rounded-md px-3 py-2.5 text-base font-heading focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        />
      </div>

      {/* Time inputs */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <TimeInputCard label="Morning In" icon="morning" value={formData.morningIn} onChange={(v) => updateField("morningIn", v)} />
        <TimeInputCard label="Lunch Out" icon="lunch" value={formData.lunchOut} onChange={(v) => updateField("lunchOut", v)} />
        <TimeInputCard label="Afternoon In" icon="afternoon" value={formData.afternoonIn} onChange={(v) => updateField("afternoonIn", v)} />
        <TimeInputCard label="Evening Out" icon="evening" value={formData.eveningOut} onChange={(v) => updateField("eveningOut", v)} />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm transition-all ${
            saved
              ? "bg-success text-success-foreground"
              : "bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98]"
          }`}
        >
          {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? "Saved!" : "Save Record"}
        </button>
        <button
          onClick={handleClear}
          className="px-5 py-3 rounded-lg font-semibold text-sm bg-secondary text-secondary-foreground hover:opacity-80 active:scale-[0.98] transition-all"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default RecordPage;
