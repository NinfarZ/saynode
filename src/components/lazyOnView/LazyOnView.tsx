import { useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  height?: number;
};

export default function LazyOnView({ children, height = 700 }: Props) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      }
      
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ minHeight: height }} className="w-full">
      {visible ? children : <div>Loading…</div>}
    </div>
  );
}
