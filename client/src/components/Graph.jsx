import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Bahagia', value: 40 },
  { name: 'Stres', value: 25 },
  { name: 'Cemas', value: 20 },
  { name: 'Netral', value: 15 },
];

const COLORS = ['#c3e6cb', '#95d6a7', '#81c784', '#a8e6cf'];

function Graph() {
  return (
    <section className="graph" id="graph">
      <div className="container">
        <h2 className="section-title">Statistik Kesehatan Mental</h2>
        <div className="graph-wrapper">
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie 
                data={data} 
                dataKey="value" 
                nameKey="name" 
                cx="50%" 
                cy="50%" 
                outerRadius={120} 
                label
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}

export default Graph;
