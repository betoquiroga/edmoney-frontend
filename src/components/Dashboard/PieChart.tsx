import React from 'react'
import { ResponsivePie } from '@nivo/pie'
import { useTheme } from '@mui/material'

interface PieChartProps {
  data: {
    category_id: string
    category_name: string
    total: number
    percentage: number
  }[]
}

export const PieChart: React.FC<PieChartProps> = ({ data }) => {
  const theme = useTheme()
  
  // Transformar datos para Nivo
  const chartData = data.map((item) => ({
    id: item.category_name,
    label: item.category_name,
    value: item.total,
    percentage: item.percentage,
  }))

  return (
    <ResponsivePie
      data={chartData}
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      borderWidth={1}
      borderColor={{
        from: 'color',
        modifiers: [['darker', 0.2]],
      }}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor={theme.palette.text.primary}
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: 'color' }}
      arcLabelsSkipAngle={10}
      arcLabelsTextColor={{
        from: 'color',
        modifiers: [['darker', 2]],
      }}
      tooltip={({ datum }) => (
        <div
          style={{
            padding: 12,
            background: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 4,
          }}
        >
          <strong>{datum.label}</strong>: {datum.data.percentage}%
        </div>
      )}
      legends={[
        {
          anchor: 'bottom',
          direction: 'row',
          justify: false,
          translateX: 0,
          translateY: 56,
          itemsSpacing: 0,
          itemWidth: 100,
          itemHeight: 18,
          itemTextColor: theme.palette.text.primary,
          itemDirection: 'left-to-right',
          itemOpacity: 1,
          symbolSize: 18,
          symbolShape: 'circle',
        },
      ]}
    />
  )
} 