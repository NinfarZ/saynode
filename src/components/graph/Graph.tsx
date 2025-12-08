import { useEffect, useMemo, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import annotationPlugin from "chartjs-plugin-annotation";
import Skeleton from "./skeleton/Skeleton";



ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin,
  annotationPlugin
);

type GraphProps = {
  url: string;
  label: string;
  color: string;
};

export default function Graph({ url, label, color }: GraphProps) {
  const [loaded, setLoaded] = useState(false);
  const [badEvents, setBadEvents] = useState<number[]>([]);

  
  const datasetRef = useRef<{ labels: string[]; values: Float64Array } | null>(null);

  const chartOptions: ChartOptions<"line"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      spanGaps: true,
      fill: false,

      interaction: { intersect: false },
      animation: false,
      radius: 0,

      scales: {
        x: {
          ticks: {
            maxTicksLimit: 8,
            
            source: "auto",
          },
        },
        y: {
          type: "linear",
          
          grid: { drawTicks: false },
        },
        
      },

      elements: {
        point: { radius: 0 },
        line: { borderWidth: 2 },
      },

      plugins: {
        tooltip: {
          animation: false,
          mode: "nearest",
          intersect: false,
        },
        zoom: {
          zoom: {
            wheel: { enabled: true, pinch: { enabled: true } },
            mode: "x",
         
            
          },
        },
        annotation: loaded && badEvents.length > 0
      ? {
          annotations: Object.fromEntries(
            badEvents.map((event, i) => [
              `line${i}`,
              {
                type: "line",
                scaleID: "x",
                value: event,
                borderColor: "rgba(255,0,0,0.6)",
                borderWidth: 2,
                label: {
                  content: `Event ${i + 1}`,
                  enabled: true,
                },
              },
            ])
          ),
        }
      : {},
      },
      
    }),
    [badEvents]
  );

  console.log(badEvents);

  useEffect(() => {
    const load = async () => {
      try {
        const resp = await fetch(url);
        if (!resp.ok) throw new Error(`Failed: ${url}`);

        const text = await resp.text();

        const worker = new Worker(new URL("./csvWorker.js", import.meta.url), {
          type: "module",
        });

        worker.onmessage = (msg) => {
          datasetRef.current = msg.data;
          worker.terminate();
          setLoaded(true);
          setBadEvents(msg.data.downtrendIndices);
        };

        worker.postMessage(text);
      } catch (err) {
        console.error("Worker CSV load failed", err);
      }
    };

    load();
  }, []);

  const chartData = useMemo(() => {
    if (!loaded || !datasetRef.current) return null;

    return {
      labels: datasetRef.current.labels,
      datasets: [
        {
          label,
          borderColor: color,
          data: datasetRef.current.values,
         
        },
      ],
    };
  }, [loaded]);

  return !loaded ? (
  <Skeleton />
) : (
  <div className="border-b-5 drop-shadow-amber-100 shadow-xl border-l border-r border-b-blue-600/50 w-full h-[700px] lg:aspect-video rounded-lg overflow-hidden relative bg-white p-5">
    <h2 className="text-2xl text-start font-semibold mb-4 text-gray-800">{label}</h2>
    <Line data={chartData!} options={chartOptions} />
  </div>
);

}
