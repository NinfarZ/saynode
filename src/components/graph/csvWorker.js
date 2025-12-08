import Papa from "papaparse";

self.onmessage = (e) => {
  const raw = e.data;

  Papa.parse(raw, {
    header: false,
    dynamicTyping: true,
    skipEmptyLines: true,
    worker: true,
    complete: (results) => {
      const rows = results.data;

      const labels = new Array(rows.length);
      const values = new Float64Array(rows.length);
      
      // Parse data
      for (let i = 0; i < rows.length; i++) {
        if (rows[i].length < 2) continue;
        labels[i] = rows[i][0];
        values[i] = rows[i][1];
      }

      // Detect downtrends
      const downtrendIndices = detectSharpDrops(values);
      
      self.postMessage({ 
        labels, 
        values,
        downtrendIndices 
      });
    },
  });
};

function detectSharpDrops(values, dropThreshold = -0.05) {
  const sharpDrops = [];
  
  for (let i = 1; i < values.length; i++) {
    const dailyReturn = (values[i] - values[i - 1]) / Math.abs(values[i - 1]);
    
    if (dailyReturn < dropThreshold) {
      sharpDrops.push(i);
    }
  }
  
  return sharpDrops;
}