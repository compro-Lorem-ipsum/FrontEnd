import { useMemo } from "react";
import type { Jadwal } from "../../types/schedule";

// Source chip color mapping (aligned with calendar.html reference)
const SOURCE_CHIP_CLASS: Record<string, string> = {
  pattern: "bg-blue-100 border-blue-500 text-blue-800",
  override: "bg-amber-100 border-amber-500 text-amber-800",
  manual: "bg-indigo-100 border-indigo-500 text-indigo-800",
  cancelled: "bg-slate-100 border-slate-300 text-slate-400 line-through",
};

interface JadwalBulananViewProps {
  currentDate: Date;
  allJadwal: Jadwal[];
  isJadwalLoading: boolean;
  onSelectDate: (dateIso: string) => void;
  selectedDate: string | null;
}

function toIso(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const DAYS_OF_WEEK = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

const JadwalBulananView = ({
  currentDate,
  allJadwal,
  isJadwalLoading,
  onSelectDate,
  selectedDate,
}: JadwalBulananViewProps) => {
  const todayIso = toIso(new Date());

  // Build map: dateIso → Jadwal[]
  const byDate = useMemo(() => {
    const map = new Map<string, Jadwal[]>();
    for (const j of allJadwal) {
      const key = j.work_date.split("T")[0];
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(j);
    }
    return map;
  }, [allJadwal]);

  // Build calendar grid — 42 cells starting from the Monday before first of month
  const cells = useMemo(() => {
    const firstOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    // Start from Sunday of the first week (0 = Sunday)
    const startDay = new Date(firstOfMonth);
    startDay.setDate(firstOfMonth.getDate() - firstOfMonth.getDay());

    const result: { date: Date; iso: string; outside: boolean }[] = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(startDay);
      d.setDate(startDay.getDate() + i);
      result.push({
        date: d,
        iso: toIso(d),
        outside: d < firstOfMonth || d > lastOfMonth,
      });
    }
    return result;
  }, [currentDate]);

  return (
    <div className="w-full">
      {/* Day headers */}
      <div className="grid grid-cols-7 bg-[#F1F1F1] rounded-t-xl overflow-hidden">
        {DAYS_OF_WEEK.map((d) => (
          <div
            key={d}
            className="py-3 text-center text-xs font-bold text-[#6B6B6B] uppercase tracking-widest"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 border border-[#E4E9F7] rounded-b-xl overflow-hidden bg-[#E4E9F7] gap-px">
        {cells.map(({ date, iso, outside }) => {
          const shifts = byDate.get(iso) ?? [];
          const visible = shifts.slice(0, 3);
          const extra = shifts.length - 3;
          const isToday = iso === todayIso;
          const isSelected = iso === selectedDate;

          return (
            <div
              key={iso}
              onClick={() => onSelectDate(iso)}
              className={[
                "min-h-[96px] p-1.5 flex flex-col gap-0.5 cursor-pointer transition-colors",
                outside ? "bg-[#FAFBFC]" : "bg-white hover:bg-[#F8FAFC]",
                isToday ? "!bg-blue-50" : "",
                isSelected ? "outline outline-2 outline-[#122C93] outline-offset-[-2px]" : "",
              ].join(" ")}
            >
              {/* Date number */}
              <span
                className={[
                  "text-xs font-bold self-start leading-none px-1 py-0.5 rounded-full",
                  outside ? "text-[#CBD5E1]" : "text-[#64748B]",
                  isToday ? "!text-[#122C93]" : "",
                  isSelected ? "bg-[#122C93] !text-white" : "",
                ].join(" ")}
              >
                {date.getDate()}
              </span>

              {/* Shift chips */}
              {isJadwalLoading ? null : (
                <>
                  {visible.map((s) => {
                    const chipKey = s.status === "cancelled" ? "cancelled" : s.source;
                    return (
                      <div
                        key={s.uuid}
                        className={`text-[10px] leading-tight px-1 py-0.5 rounded border-l-2 truncate ${SOURCE_CHIP_CLASS[chipKey] ?? SOURCE_CHIP_CLASS.pattern}`}
                        title={`${s.satpam.nama} · ${s.pos.nama} · ${s.source}`}
                      >
                        <span className="font-semibold">{s.satpam.nama}</span>
                      </div>
                    );
                  })}
                  {extra > 0 && (
                    <span className="text-[10px] text-[#64748B] font-medium pl-1">
                      +{extra} lagi
                    </span>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-4 flex-wrap mt-3 text-xs text-[#64748B]">
        {[
          { key: "pattern", label: "Dari aturan rutin" },
          { key: "override", label: "Dipindah / diubah" },
          { key: "manual", label: "Jadwal sekali pakai" },
          { key: "cancelled", label: "Dibatalkan" },
        ].map(({ key, label }) => (
          <span key={key} className="flex items-center gap-1.5">
            <span
              className={`inline-block w-2.5 h-2.5 rounded-sm border-l-2 ${SOURCE_CHIP_CLASS[key]}`}
            />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default JadwalBulananView;
