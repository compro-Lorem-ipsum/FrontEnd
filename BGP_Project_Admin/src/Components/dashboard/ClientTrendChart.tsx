import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export const CustomDot = (props: any) => {
  const { cx, cy, stroke } = props;
  return <circle cx={cx} cy={cy} r={3} fill={stroke} stroke={stroke} />;
};

export const legendFormatter = (value: string) => {
  const labels: Record<string, string> = {
    hadir: "Hadir",
    terlambat: "Terlambat",
    izin: "Izin/Sakit",
    tidakHadir: "Tidak Hadir",
    late: "Terlambat",
    absent: "Tidak Hadir",
    teguran: "Teguran",
    sp: "Surat Peringatan"
  };
  return (
    <span style={{ fontSize: 11, color: "#374151" }}>
      {labels[value] || value}
    </span>
  );
};

interface ClientTrendChartProps {
  trendData: any[];
}

export const ClientTrendChart = ({ trendData }: ClientTrendChartProps) => {
  return (
    <div className="flex flex-col border border-[#E8EEFF] bg-white rounded-lg gap-1 p-2.5 flex-1 min-h-0">
      <div>
        <h2 className="text-[#122C93] font-semibold text-base">
          Tren kehadiran satpam per Bulan
        </h2>
        <h2 className="text-[#8D8787] font-light text-[11px]">
          Rata-rata tingkat kehadiran personel
        </h2>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={trendData}
          margin={{ top: 8, right: 16, left: -15, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="4 4"
            stroke="#e0e0e0"
            vertical={false}
          />
          <XAxis
            dataKey="bulan"
            tick={{ fontSize: 11, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
            domain={[0, 35]}
            ticks={[0, 10, 20, 30]}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              fontSize: "11px",
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: "11px", paddingTop: "4px" }}
            iconType="square"
            iconSize={10}
            formatter={legendFormatter}
          />
          <Line
            type="monotone"
            dataKey="hadir"
            stroke="#122C93"
            strokeWidth={2}
            dot={<CustomDot />}
            activeDot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="terlambat"
            stroke="#CB9235"
            strokeWidth={2}
            dot={<CustomDot />}
            activeDot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="izin"
            stroke="#2F58FB"
            strokeWidth={2}
            dot={<CustomDot />}
            activeDot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="tidakHadir"
            stroke="#A70202"
            strokeWidth={2}
            dot={<CustomDot />}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
