"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, Legend, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"
import { getTransactionSummary } from "@/utils/transaction"
import { Spinner } from "./spinner"


const chartConfig = {
  finance: {
    label: "Finance",
  },
  income: {
    label: "Income",
    color: "hsl(142.1 76.2% 36.3%)",
  },
  expense: {
    label: "Expense",
    color: "hsl(0 72.2% 50.6%)",
  },
} 

export function BarChar({transactions}) {
  
    const [timeRange, setTimeRange] = React.useState("7d");

    const [chartData, setChartData ]= React.useState([]);
const [chartLoading, setChartLoading] =React.useState(true);
const [chartError, setChartError] = React.useState(null);

React.useEffect(() => {
  if (!Array.isArray(transactions)) return;

  const fetchChart = async () => {
    try {
      setChartLoading(true);
      const result = await getTransactionSummary(transactions);
      setChartData(result);
    } catch (err) {
      console.error("Error generating chart:", err);
      setChartError(err);
    } finally {
      setChartLoading(false);
    }
  };

  fetchChart();
}, [transactions]);

  
    const filteredData = React.useMemo(() => {
      return chartData.filter((item) => {
        const date = new Date(item.date)
        const referenceDate = new Date()
        let daysToSubtract = 90
        if (timeRange === "30d") {
          daysToSubtract = 30
        } else if (timeRange === "7d") {
          daysToSubtract = 7
        }
        const startDate = new Date(referenceDate)
        startDate.setDate(startDate.getDate() - daysToSubtract)
        return date >= startDate
      })
    }, [timeRange,chartData])
  

  const total = React.useMemo(
    () => ({
      income: filteredData.reduce((acc, curr) => acc + curr.income, 0),
      expense: filteredData.reduce((acc, curr) => acc + curr.expense, 0),
    }),
    [filteredData]
  )



  return (
    <Card>
     <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Your Finance  Chart Data</CardTitle>
          <CardDescription>Showing total income and expenses for the selected time period</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto" aria-label="Select a time range">
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <div className="flex border-b">
        <div className="flex flex-1 flex-col justify-center gap-1 border-r px-6 py-4 text-left sm:px-8 sm:py-6">
          <span className="text-xs text-muted-foreground">{chartConfig.income.label}</span>
          <span className="text-lg font-bold leading-none sm:text-3xl">${total.income.toLocaleString("en-Us",
            { minimumFractionDigits:2,},{ maximumFractionDigits:2,})}</span>
        </div>
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-left sm:px-8 sm:py-6">
          <span className="text-xs text-muted-foreground">{chartConfig.expense.label}</span>
          <span className="text-lg font-bold leading-none sm:text-3xl">${total.expense.toLocaleString("en-Us",
            { minimumFractionDigits:2,},{ maximumFractionDigits:2,})}</span>
        </div>
      </div>
      <CardContent className="px-2 sm:p-6">

        {
          chartLoading && (
            <div className="flex items-center justify-center h-screen gap-3">
             <Spinner className="h-6 w-6 animate-spin- text-purple-500" />
             <div className="loader text-2xl ">
              
               Loading Data Please wait.....
             </div>
           </div>
          )
        }
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full"
        >
           <BarChart
            accessibilityLayer
            data={filteredData}
            margin={{
              left: 12,
              right: 12,
              bottom: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                />
              }
            />
              <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => {
                return chartConfig[value]?.label || value
              }}
            />
             <Bar dataKey="income" fill="var(--color-income)" name="income" radius={[4, 4, 0, 0]} />
             <Bar dataKey="expense" fill="var(--color-expense)" name="expense" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
