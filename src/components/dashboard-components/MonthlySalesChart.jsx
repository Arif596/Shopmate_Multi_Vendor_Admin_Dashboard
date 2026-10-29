import { useSelector } from "react-redux";
import {
  XAxis,
  YAxis,
  LineChart,
  Line,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getLastNMonths } from "../../lib/helper";

const MonthlySalesChart = () => {
  const{MonthlySale}=useSelector((state)=>state.admin);
console.log("Raw MonthlySale:", JSON.stringify(MonthlySale, null, 2));
  const month=getLastNMonths(4).map((m)=>m.month);
  const filled=month.map((m)=>{
    const found=MonthlySale?.find((item)=>item.month===m);
    return{month:m,totalSales:found?.totalSales||0}
  })

  return <>
  <div className="bg-white p-4 rounded-xl shadow-md">
    <h3 className="font-semibold mb-2">Monthly Sales(Rs)</h3>
    <ResponsiveContainer width="100%" height={200}>
    <LineChart data={filled}
    >
      <XAxis dataKey='month'/>
      <YAxis/>
      <Tooltip/>
      <Line type="monotone" dataKey="totalSales" stroke="#10b981"/>
    </LineChart>
    </ResponsiveContainer>
  </div>
  </>;
};

export default MonthlySalesChart;
