import React from 'react'
import { ResponsiveBar } from '@nivo/bar'
import { useTheme } from '@mui/material'
import { formatCurrency } from '../../utils/formatters'

interface BarChartProps {
  data: {
    month: string
    income: number
    expense: number
  }[]
}

export const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const theme = useTheme()

  // Transformar datos para formato compatible con Nivo
  const chartData = data.map((item) => {
    // Formatear etiqueta de mes (ej. "2023-01" a "Ene")
    const [year, month] = item.month.split('-')
    const monthNames = [
      'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
      'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ]
    const monthLabel = monthNames[parseInt(month) - 1]
    
    return {
      month: `${monthLabel}`,
      Ingresos: item.income,
      Gastos: item.expense
    }
  })

  return (
    <ResponsiveBar
      data={chartData}
      keys={['Ingresos', 'Gastos']}
      indexBy="month"
      margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
      padding={0.3}
      groupMode="grouped"
      valueScale={{ type: 'linear' }}
      indexScale={{ type: 'band', round: true }}
      colors={['#4caf50', '#f44336']} // verde para ingresos, rojo para gastos
      borderColor={{
        from: 'color',
        modifiers: [['darker', 1.6]],
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Mes',
        legendPosition: 'middle',
        legendOffset: 32,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Cantidad',
        legendPosition: 'middle',
        legendOffset: -40,
      }}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{
        from: 'color',
        modifiers: [['darker', 1.6]],
      }}
      legends={[
        {
          dataFrom: 'keys',
          anchor: 'bottom',
          direction: 'row',
          justify: false,
          translateX: 0,
          translateY: 40,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: 'left-to-right',
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [
            {
              on: 'hover',
              style: {
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
      tooltip={({ id, value, color }) => (
        <div
          style={{
            padding: 12,
            background: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 4,
          }}
        >
          <strong style={{ color }}>{id}</strong>: {formatCurrency(value)}
        </div>
      )}
      animate={true}
    />
  )
} 