import { Suspense } from "react";
import "./App.css";
import { lazy } from "react";
import Skeleton from "./components/graph/skeleton/Skeleton";
import LazyOnView from "./components/lazyOnView/LazyOnView";

const Graph = lazy(() => import("./components/graph/Graph"));

function App() {
  const base = import.meta.env.VITE_BASE_PATH || '/saynode/';

  const files = [
    {
      key: "d1",
      url: `${base}data/equity_curve.csv`,
      label: "Equity Curve",
      color: "#4BC0C0",
    },
    {
      key: "d2",
      url: `${base}data/equity_curve_ar_56_tp_sl.csv`,
      label: "Equity Curve AR 56 TP SL",
      color: "#9966FF",
    },
    {
      key: "d3",
      url: `${base}data/equity_curve_ar_only.csv`,
      label: "Equity Curve AR Only",
      color: "#FF9F40",
    },
    {
      key: "d4",
      url: `${base}data/equity_curve_ar_raw.csv`,
      label: "Equity Curve AR Raw",
      color: "#FFCD56",
    },
    {
      key: "d5",
      url: `${base}data/equity_curve_backtest_2.csv`,
      label: "Backtest 2",
      color: "#36A2EB",
    },
    {
      key: "d6",
      url: `${base}data/equity_curve_backtest_3_improved.csv`,
      label: "Backtest 3 Improved",
      color: "#FF6384",
    },
    {
      key: "d7",
      url: `${base}data/equity_curve_backtest_3_sensor_chop_mode.csv`,
      label: "Sensor Chop Mode",
      color: "#C9CBcf",
    },
    {
      key: "d8",
      url: `${base}data/equity_curve_backtest_3.csv`,
      label: "Backtest 3",
      color: "#000000",
    },
  ];


  return (
    <main className="flex flex-col gap-10 p-5 lg:items-center lg:justify-center min-h-screen">
      <h1 className="font-bold text-4xl tracking-widest text-blue-950 drop-shadow-blue-300 drop-shadow-xl">GRAPHS</h1>
      <Suspense fallback={null}>
        <Graph url={files[0].url} label={files[0].label} color={files[0].color} />
      </Suspense>
      {files.slice(1).map((f, i) => (
        <LazyOnView key={i}>
          <Suspense fallback={<Skeleton />}>
            <Graph key={f.key} url={f.url} label={f.label} color={f.color} />
          </Suspense>
        </LazyOnView>
      ))}
    </main>
  );
}

export default App;
