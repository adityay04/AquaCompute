"use client";

import { useState, useEffect, useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ReferenceDot,
} from "recharts";
import { motion } from "motion/react";
import { calculateImpact } from "@/lib/math/modelEstimator";
import { OpenRouterModel } from "@/lib/openrouter";

interface ScaleChartProps {
  model: OpenRouterModel | null;
  inputTokens: number;
  outputTokens: number;
  currentRequestsPerDay: number;
}

const REQUEST_STEPS = [100, 1000, 10000, 100000, 1000000, 10000000, 100000000];

type MetricKey = "waterLiters" | "energyKwh" | "carbonGrams";

const METRICS: {
  key: MetricKey;
  label: string;
  unit: string;
  color: string;
}[] = [
  { key: "waterLiters", label: "Water", unit: "L/day", color: "#6EE7B7" },
  { key: "energyKwh", label: "Energy", unit: "kWh/day", color: "#FBBF24" },
  { key: "carbonGrams", label: "Carbon", unit: "gCO₂/day", color: "#F87171" },
];

function formatTick(value: number): string {
  if (value >= 1000000) return `${(value / 1000000).toFixed(0)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
  return value.toString();
}

function formatValue(value: number): string {
  if (value >= 1000000) return `${(value / 1000000).toFixed(2)}M`;
  if (value >= 1000)
    return value.toLocaleString("en-IN", { maximumFractionDigits: 0 });
  if (value >= 1) return value.toFixed(2);
  if (value >= 0.01) return value.toFixed(4);
  return value.toExponential(2);
}

export default function ScaleChart({
  model,
  inputTokens,
  outputTokens,
  currentRequestsPerDay,
}: ScaleChartProps) {
  const [activeMetric, setActiveMetric] = useState<MetricKey>("waterLiters");

  const data = useMemo(() => {
    if (!model) return [];
    const tokensPerRequest = inputTokens + outputTokens;

    return REQUEST_STEPS.map((requests) => {
      const totalTokens = requests * tokensPerRequest;
      const impact = calculateImpact(totalTokens, model.id, model.name);
      return {
        requests,
        waterLiters: impact.waterLiters,
        energyKwh: impact.energyKwh,
        carbonGrams: impact.carbonGrams,
      };
    });
  }, [model, inputTokens, outputTokens]);

  const currentMetric = METRICS.find((m) => m.key === activeMetric)!;

  const currentImpact = useMemo(() => {
    if (!model) return 0;
    const tokensPerRequest = inputTokens + outputTokens;
    const totalTokens = currentRequestsPerDay * tokensPerRequest;
    const impact = calculateImpact(totalTokens, model.id, model.name);
    return impact[activeMetric];
  }, [model, inputTokens, outputTokens, currentRequestsPerDay, activeMetric]);

  if (!model || data.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="border border-border rounded-lg p-8 bg-foreground/[0.04] flex flex-col gap-6"
    >
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <span className="text-[10px] tracking-[0.2em] uppercase text-muted font-sans">
            Scaling curve
          </span>
          <div className="text-foreground font-sans text-sm mt-1">
            How {currentMetric.label.toLowerCase()} scales with traffic
          </div>
        </div>

        <div className="flex gap-2">
          {METRICS.map((metric) => (
            <button
              key={metric.key}
              onClick={() => setActiveMetric(metric.key)}
              className={`px-3 py-1.5 text-xs rounded-md border transition-colors font-sans ${
                activeMetric === metric.key
                  ? "border-accent text-accent bg-accent/10"
                  : "border-border text-muted hover:border-foreground/50 hover:text-foreground"
              }`}
            >
              {metric.label}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full h-[340px] -ml-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 40, left: 20, bottom: 20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="currentColor"
              strokeOpacity={0.08}
              vertical={false}
            />
            <XAxis
              dataKey="requests"
              scale="log"
              domain={[100, 100000000]}
              ticks={REQUEST_STEPS}
              tickFormatter={formatTick}
              stroke="currentColor"
              strokeOpacity={0.3}
              tick={{
                fill: "currentColor",
                fontSize: 11,
                fontFamily: "var(--font-inter)",
              }}
              axisLine={false}
              tickLine={false}
              label={{
                value: "Requests per day",
                position: "insideBottom",
                offset: -10,
                style: {
                  fill: "currentColor",
                  fontSize: 11,
                  fontFamily: "var(--font-inter)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                },
              }}
            />
            <YAxis
              scale="log"
              domain={["auto", "auto"]}
              tickFormatter={formatValue}
              stroke="currentColor"
              strokeOpacity={0.3}
              tick={{
                fill: "currentColor",
                fontSize: 11,
                fontFamily: "var(--font-inter)",
              }}
              axisLine={false}
              tickLine={false}
              width={70}
              label={{
                value: currentMetric.unit,
                angle: -90,
                position: "insideLeft",
                style: {
                  fill: "currentColor",
                  fontSize: 11,
                  fontFamily: "var(--font-inter)",
                  letterSpacing: "0.1em",
                },
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(10, 10, 10, 0.95)",
                border: "1px solid #222",
                borderRadius: "6px",
                fontSize: "12px",
                fontFamily: "var(--font-inter)",
                color: "#F5F5F5",
                padding: "10px 14px",
              }}
              labelFormatter={(value) =>
                `${Number(value).toLocaleString("en-IN")} req/day`
              }
              formatter={(value: number) => [
                formatValue(value),
                currentMetric.label,
              ]}
            />
            <ReferenceLine
              x={currentRequestsPerDay}
              stroke="#6EE7B7"
              strokeDasharray="4 4"
              strokeOpacity={0.5}
            />
            <ReferenceDot
              x={currentRequestsPerDay}
              y={currentImpact}
              r={6}
              fill="#6EE7B7"
              stroke="#0A0A0A"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey={activeMetric}
              stroke={currentMetric.color}
              strokeWidth={2.5}
              dot={{ fill: currentMetric.color, r: 4, strokeWidth: 0 }}
              activeDot={{ r: 7, stroke: "#0A0A0A", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-accent" />
          <span className="text-xs text-muted font-sans">
            Your current workload:{" "}
            <span className="text-foreground font-mono">
              {currentRequestsPerDay.toLocaleString("en-IN")} req/day
            </span>{" "}
            →{" "}
            <span className="text-accent font-mono">
              {formatValue(currentImpact)} {currentMetric.unit}
            </span>
          </span>
        </div>
        <span className="text-[10px] text-faint font-sans">
          Log scale — each gridline is 10× the previous
        </span>
      </div>
    </motion.div>
  );
}
