import React from 'react';
import { Dimensions, Text, View } from 'react-native';
import Svg, { Line, Rect, Text as SvgText } from 'react-native-svg';

interface BarChartProps {
  data: number[];
  labels: string[];
  width?: number;
  height?: number;
  color?: string;
  backgroundColor?: string;
  title?: string;
}

const SimpleBarChart: React.FC<BarChartProps> = ({
  data,
  labels,
  width = Dimensions.get('window').width - 40,
  height = 220,
  color = '#000000',
  backgroundColor = '#ffffff',
  title
}) => {
  if (data.length === 0) return null;

  const padding = { top: 20, right: 20, bottom: 40, left: 40 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  
  const maxValue = Math.max(...data);
  const barWidth = chartWidth / data.length - 10;
  
  return (
    <View style={{ 
      width, 
      height, 
      backgroundColor, 
      borderRadius: 16,
      padding: 10,
      borderWidth: 1,
      borderColor: '#f0f0f0'
    }}>
      {title && <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#000000' }}>{title}</Text>}
      
      <Svg width={width - 20} height={height - (title ? 40 : 20)}>
        {/* Y-axis */}
        <Line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={padding.top + chartHeight}
          stroke="#000000"
          strokeWidth="1"
        />
        
        {/* X-axis */}
        <Line
          x1={padding.left}
          y1={padding.top + chartHeight}
          x2={padding.left + chartWidth}
          y2={padding.top + chartHeight}
          stroke="#000000"
          strokeWidth="1"
        />
        
        {/* Bars */}
        {data.map((value, index) => {
          const barHeight = (value / maxValue) * chartHeight;
          const x = padding.left + index * (chartWidth / data.length) + 5;
          const y = padding.top + chartHeight - barHeight;
          
          return (
            <Rect
              key={index}
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              fill={color}
              rx={4}
            />
          );
        })}
        
        {/* X-axis labels */}
        {labels.map((label, index) => {
          const x = padding.left + index * (chartWidth / labels.length) + (chartWidth / labels.length) / 2;
          return (
            <SvgText
              key={index}
              x={x}
              y={height - padding.bottom + 15}
              fontSize="10"
              fill="#000000"
              textAnchor="middle"
            >
              {label}
            </SvgText>
          );
        })}
        
        {/* Y-axis labels */}
        {[0, 0.5, 1].map((ratio, index) => {
          const value = maxValue * ratio;
          const y = padding.top + chartHeight - ratio * chartHeight;
          return (
            <SvgText
              key={index}
              x={padding.left - 10}
              y={y + 4}
              fontSize="10"
              fill="#000000"
              textAnchor="end"
            >
              {Math.round(value)}
            </SvgText>
          );
        })}
      </Svg>
    </View>
  );
};

export default SimpleBarChart;