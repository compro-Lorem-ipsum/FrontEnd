import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface DonutChartProps {
  data: { name: string; value: number; color: string }[];
  size?: number;
  label: { value: string | number; sub: string };
}

export const DonutChart = ({ data, size = 110, label }: DonutChartProps) => (
  <div className="relative shrink-0" style={{ width: size, height: size }}>
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={size / 2 - 16}
          outerRadius={size / 2}
          dataKey="value"
          startAngle={90}
          endAngle={-270}
          strokeWidth={0}
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name) => [value, name]}
          contentStyle={{
            fontSize: 12,
            borderRadius: 6,
            border: "1px solid #e5e7eb",
          }}
        />
      </PieChart>
    </ResponsiveContainer>
    {/* center label */}
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
      <span className="text-xl font-bold text-[#122C93] leading-none">
        {label.value}
      </span>
      <span className="text-[10px] text-gray-500 mt-1">{label.sub}</span>
    </div>
  </div>
);
