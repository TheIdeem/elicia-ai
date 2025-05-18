import { FC } from 'react';

interface DataPoint {
  label: string;
  value: number;
}

interface AnalyticsChartProps {
  title?: string;
  data: DataPoint[];
  className?: string;
  type?: 'bar' | 'line' | 'pie';
  height?: number;
  barColor?: string;
  lineColor?: string;
  colors?: string[];
}

const AnalyticsChart: FC<AnalyticsChartProps> = ({
  title,
  data,
  className = '',
  type = 'bar',
  height = 200,
  barColor = '#3B82F6',
  lineColor = '#3B82F6',
  colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
}) => {
  // Find the maximum value for scaling
  const maxValue = Math.max(...data.map(d => d.value));
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);
  
  // Generate pie segments
  const generatePieSegments = () => {
    // Handle edge case where there's no data or total value is 0
    if (data.length === 0 || totalValue === 0) {
      return [{
        color: '#e5e7eb', // Gray color for empty chart
        startPercent: 0,
        endPercent: 100,
        label: 'No Data',
        value: 0,
        percent: 100
      }];
    }
    
    // Handle edge case where there's only one data point
    if (data.length === 1) {
      return [{
        color: colors[0],
        startPercent: 0,
        endPercent: 100,
        label: data[0].label,
        value: data[0].value,
        percent: 100
      }];
    }
    
    let cumulativePercent = 0;
    
    return data.map((item, index) => {
      const startPercent = cumulativePercent;
      const percent = (item.value / totalValue) * 100;
      cumulativePercent += percent;
      
      return {
        color: colors[index % colors.length],
        startPercent,
        endPercent: cumulativePercent,
        label: item.label,
        value: item.value,
        percent
      };
    });
  };
  
  const pieSegments = type === 'pie' ? generatePieSegments() : [];
  
  return (
    <div className={className}>
      {title && <h3 className="text-base font-medium text-gray-800 mb-4">{title}</h3>}
      
      <div className="mt-2">
        {type === 'pie' ? (
          // PIE CHART
          <div className="flex flex-col items-center" style={{ height: `${height}px` }}>
            <div className="relative" style={{ width: '180px', height: '180px' }}>
              {/* Main pie chart */}
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {console.log('Pie segments:', pieSegments)}
                {/* Calculate pie segments using SVG paths for better browser support */}
                {pieSegments.map((segment, index) => {
                  // SVG arc calculations
                  const startAngle = 2 * Math.PI * (segment.startPercent / 100);
                  const endAngle = 2 * Math.PI * (segment.endPercent / 100);
                  
                  // Convert to cartesian coordinates
                  const startX = 50 + 40 * Math.cos(startAngle - Math.PI / 2);
                  const startY = 50 + 40 * Math.sin(startAngle - Math.PI / 2);
                  const endX = 50 + 40 * Math.cos(endAngle - Math.PI / 2);
                  const endY = 50 + 40 * Math.sin(endAngle - Math.PI / 2);
                  
                  // Arc flag calculation
                  const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;
                  
                  // Create SVG path - use a simpler approach for segments
                  let pathData;
                  
                  // If it's a full circle (100%), use a different approach to ensure it renders
                  if (Math.abs(segment.endPercent - segment.startPercent) >= 99.9) {
                    // Draw two half-circles for a full circle
                    pathData = [
                      `M 50 50`,
                      `L 50 10`, // Top point
                      `A 40 40 0 1 1 50 90`, // First half
                      `A 40 40 0 1 1 50 10`, // Second half
                      'Z'
                    ].join(' ');
                  } else {
                    pathData = [
                      `M 50 50`,
                      `L ${startX} ${startY}`,
                      `A 40 40 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                      'Z'
                    ].join(' ');
                  }
                  
                  console.log(`Segment ${index}:`, { 
                    color: segment.color,
                    startPercent: segment.startPercent, 
                    endPercent: segment.endPercent,
                    pathData
                  });
                  
                  return (
                    <path
                      key={`segment-${index}`}
                      d={pathData}
                      fill={segment.color}
                      stroke="white"
                      strokeWidth="0.5"
                    />
                  );
                })}
                
                {/* Render a gray circle if no segments */}
                {pieSegments.length === 0 && (
                  <circle cx="50" cy="50" r="40" fill="#e5e7eb" />
                )}
                
                {/* Center circle */}
                <circle cx="50" cy="50" r="20" fill="white" />
                
                {/* Total value */}
                <text
                  x="50"
                  y="50"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="10"
                  fill="#666"
                  fontWeight="500"
                >
                  {totalValue > 0 ? totalValue : 'N/A'}
                </text>
              </svg>
            </div>
            
            {/* Legend - Improved to prevent overflow */}
            <div className="grid grid-cols-2 gap-2 mt-4 px-2 max-w-full">
              {pieSegments.map((segment, index) => (
                <div key={`legend-${index}`} className="flex items-center overflow-hidden">
                  <div 
                    className="flex-shrink-0 w-3 h-3 rounded-sm mr-2" 
                    style={{ backgroundColor: segment.color }}
                  />
                  <span className="text-xs text-gray-600 truncate">{segment.label}</span>
                </div>
              ))}
            </div>
          </div>
        ) : type === 'line' ? (
          // LINE CHART
          <div style={{ height: `${height}px`, position: 'relative' }}>
            <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
              {/* Y-axis line */}
              <line x1="0" y1="0" x2="0" y2="100%" stroke="#e5e7eb" strokeWidth="1" />
              
              {/* X-axis line */}
              <line x1="0" y1="100%" x2="100%" y2="100%" stroke="#e5e7eb" strokeWidth="1" />
              
              {/* Horizontal grid lines */}
              {[0.25, 0.5, 0.75].map((ratio, idx) => (
                <line 
                  key={`grid-h-${idx}`}
                  x1="0" 
                  y1={`${ratio * 100}%`} 
                  x2="100%" 
                  y2={`${ratio * 100}%`} 
                  stroke="#f3f4f6" 
                  strokeWidth="1" 
                  strokeDasharray="4 4"
                />
              ))}
              
              {/* Draw line segments between data points */}
              <polyline
                points={data.map((item, index) => {
                  const x = (index / Math.max(data.length - 1, 1)) * 100;
                  const y = (1 - item.value / Math.max(maxValue, 1)) * 100;
                  return `${x},${y}`;
                }).join(' ')}
                fill="none"
                stroke={lineColor}
                strokeWidth="2"
                strokeLinejoin="round"
              />
              
              {/* Draw data points */}
              {data.map((item, index) => {
                const x = (index / Math.max(data.length - 1, 1)) * 100;
                const y = (1 - item.value / Math.max(maxValue, 1)) * 100;
                
                return (
                  <g key={`point-${index}`}>
                    {/* Larger invisible circle for better hover target */}
                    <circle cx={x} cy={y} r="7" fill="transparent" />
                    
                    {/* Visible point */}
                    <circle 
                      cx={x} 
                      cy={y} 
                      r="4" 
                      fill="white" 
                      stroke={lineColor} 
                      strokeWidth="2" 
                    />
                  </g>
                );
              })}
            </svg>
            
            {/* X-axis labels */}
            <div className="flex justify-between mt-2">
              {data.map((item, index) => (
                <div key={`label-${index}`} className="text-xs text-gray-500 text-center" style={{ width: `${100 / data.length}%` }}>
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        ) : (
          // BAR CHART
          <div className="h-full" style={{ height: `${height}px` }}>
            <div className="flex flex-col h-full">
              <div className="flex-1 flex items-end">
                {data.map((item, index) => {
                  const barHeight = Math.max((item.value / maxValue) * 0.85 * 100, 5);
                  
                  return (
                    <div 
                      key={`bar-${index}`} 
                      className="flex-1 flex flex-col items-center justify-end px-1"
                    >
                      <div 
                        className="w-full rounded-t-sm transition-all duration-300 hover:opacity-80" 
                        style={{ 
                          height: `${barHeight}%`,
                          backgroundColor: barColor,
                          minHeight: '8px',
                          maxWidth: '80%',
                          marginLeft: 'auto',
                          marginRight: 'auto'
                        }}
                      />
                    </div>
                  );
                })}
              </div>
              
              {/* X-axis labels */}
              <div className="flex justify-between mt-4">
                {data.map((item, index) => (
                  <div key={`label-${index}`} className="flex-1 text-xs text-gray-500 text-center px-1">
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsChart; 