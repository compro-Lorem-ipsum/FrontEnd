import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { legendFormatter } from "./ClientTrendChart";

interface ClientOffendersChartProps {
  offendersData: any[];
}

export const ClientOffendersChart = ({ offendersData }: ClientOffendersChartProps) => {
  return (
    <div className="flex flex-col border border-[#E8EEFF] bg-white rounded-lg gap-1 p-2.5 flex-1 min-h-0">
      <div>
        <h2 className="font-semibold text-base text-[#122C93]">
          Satpam Perlu Perhatian
        </h2>
        <h2 className="text-[11px] text-gray-500">
          Skor perhatian tertinggi berdasarkan telat & tidak hadir · 30 hari
          terakhir
        </h2>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={offendersData}
          margin={{ top: 16, right: 16, left: -15, bottom: 0 }}
          barCategoryGap="30%"
          barGap={2}
        >
          <CartesianGrid
            strokeDasharray="4 4"
            stroke="#e0e0e0"
            vertical={false}
          />
          <XAxis
            dataKey="nama"
            tick={{ fontSize: 11, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
            domain={[0, 'dataMax + 5']}
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
          <Bar dataKey="late" fill="#CB9235" radius={[3, 3, 0, 0]}>
            <LabelList
              dataKey="late"
              position="top"
              style={{ fontSize: 10, fill: "#374151" }}
            />
          </Bar>
          <Bar dataKey="absent" fill="#A70202" radius={[3, 3, 0, 0]}>
            <LabelList
              dataKey="absent"
              position="top"
              style={{ fontSize: 10, fill: "#374151" }}
            />
          </Bar>
          <Bar dataKey="teguran" fill="#2F58FB" radius={[3, 3, 0, 0]}>
            <LabelList
              dataKey="teguran"
              position="top"
              style={{ fontSize: 10, fill: "#374151" }}
            />
          </Bar>
          <Bar dataKey="sp" fill="#122C93" radius={[3, 3, 0, 0]}>
            <LabelList
              dataKey="sp"
              position="top"
              style={{ fontSize: 10, fill: "#374151" }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
