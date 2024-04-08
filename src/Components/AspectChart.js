import React, { useEffect } from 'react';
import Chart from 'chart.js/auto';

const AspectChart = ({ responseData }) => {
  const chartRef = React.createRef();

  useEffect(() => {
    if (responseData && responseData.length > 0) {
      const chartInstance = new Chart(chartRef.current, {
        type: 'bar',
        data: {
          labels: responseData[0].absa.L.map(item => item.M.aspect.S),
          datasets: [{
            label: 'Scores by Aspect',
            data: responseData[0].absa.L.map(item => parseFloat(item.M.score.S)),
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            }
        }
      });

      return () => {
        chartInstance.destroy();
      };
    }
  }, [responseData, chartRef]);

  return (
    <div className="chart-container" style={{ width: '600px', height: '600px' }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default AspectChart;
