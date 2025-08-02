export default function StatCard({ title, value, icon, color = "blue" }) {
    return (
      <div className={`bg-${color}-100 text-${color}-800 p-5 rounded-2xl shadow-md flex items-center gap-4`}>
        <div className="text-3xl">{icon}</div>
        <div>
          <div className="text-sm">{title}</div>
          <div className="font-bold text-xl">{value}</div>
        </div>
      </div>
    );
  }
  