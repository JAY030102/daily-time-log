import { useState, useEffect } from "react";
import { Trash2, Clock } from "lucide-react";
import { deleteRecord, formatTime, formatDateDisplay, type TimeRecord } from "@/lib/time-records";
import { getAllRecords, deleteRecordById } from "@/lib/sqlite-db";
import { toast } from "sonner";

const HistoryPage = () => {
  const [records, setRecords] = useState<TimeRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Load records from database on mount
  useEffect(() => {
    const loadRecords = async () => {
      try {
        setLoading(true);
        const dbRecords = await getAllRecords();
        setRecords(dbRecords);
        console.log(`[v0] Loaded ${dbRecords.length} records from database`);
      } catch (error) {
        console.error("[v0] Error loading records:", error);
        toast.error("Failed to load records");
      } finally {
        setLoading(false);
      }
    };

    loadRecords();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      // Delete from both localStorage and SQLite
      deleteRecord(id);
      await deleteRecordById(id);
      
      // Update UI
      setRecords(records.filter((r) => r.id !== id));
      toast.success("Record deleted");
    } catch (error) {
      console.error("[v0] Error deleting record:", error);
      toast.error("Failed to delete record");
    }
  };

  return (
    <div className="min-h-screen pb-24 max-w-md mx-auto px-4">
      {/* Header */}
      <div className="pt-12 pb-6">
        <h1 className="text-2xl font-bold tracking-tight">History</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {records.length} record{records.length !== 1 ? "s" : ""}
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground animate-fade-in">
          <Clock className="w-12 h-12 mb-3 opacity-40 animate-spin" />
          <p className="text-sm">Loading records...</p>
        </div>
      ) : records.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground animate-fade-in">
          <Clock className="w-12 h-12 mb-3 opacity-40" />
          <p className="text-sm">No records yet</p>
          <p className="text-xs mt-1">Start by logging your time</p>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((record, i) => (
            <div
              key={record.id}
              className="bg-card rounded-lg border border-border p-4 animate-slide-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading font-semibold text-sm">
                  {formatDateDisplay(record.date)}
                </h3>
                <button
                  onClick={() => handleDelete(record.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground text-xs">Morning In</span>
                  <p className="font-heading font-medium">{formatTime(record.morningIn)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs">Lunch Out</span>
                  <p className="font-heading font-medium">{formatTime(record.lunchOut)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs">Afternoon In</span>
                  <p className="font-heading font-medium">{formatTime(record.afternoonIn)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs">Evening Out</span>
                  <p className="font-heading font-medium">{formatTime(record.eveningOut)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
