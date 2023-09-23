'use client';

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

const ProgressChart = ({ data }: any) => {
	console.log(data);
	return (
		<ResponsiveContainer width='100%' height={350}>
			<LineChart data={data}>
				<XAxis
					dataKey='date'
					stroke='#888888'
					fontSize={12}
					axisLine={false}
					tickLine={false}
					tickMargin={12}
				/>
				<YAxis
					stroke='#888888'
					fontSize={12}
					tickLine={false}
					axisLine={false}
					tickFormatter={(value) => `${value}kg`}
				/>
				<Line
					dataKey='weight'
					dot={{ stroke: '#FACC14', strokeWidth: 2, fill: '#FACC14' }}
					stroke='#FACC14'
					strokeWidth={2}
					activeDot={{ r: 8 }}
				/>
			</LineChart>
		</ResponsiveContainer>
	);
};

export default ProgressChart;
