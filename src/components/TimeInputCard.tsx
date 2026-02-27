import { Sun, Coffee, CloudSun, Moon } from "lucide-react";

interface TimeInputCardProps {
  label: string;
  icon: "morning" | "lunch" | "afternoon" | "evening";
  value: string;
  onChange: (val: string) => void;
}

const iconMap = {
  morning: Sun,
  lunch: Coffee,
  afternoon: CloudSun,
  evening: Moon,
};

const labelColors = {
  morning: "text-amber-500",
  lunch: "text-orange-500",
  afternoon: "text-sky-500",
  evening: "text-indigo-400",
};

const TimeInputCard = ({ label, icon, value, onChange }: TimeInputCardProps) => {
  const Icon = iconMap[icon];

  return (
    <div className="bg-card rounded-lg p-4 border border-border animate-slide-up">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${labelColors[icon]}`} />
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      </div>
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-secondary text-foreground rounded-md px-3 py-2.5 text-lg font-heading focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
      />
    </div>
  );
};

export default TimeInputCard;
