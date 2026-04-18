export default function TutorLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-8 bg-white/60 rounded-xl w-56" />
        <div className="h-4 bg-white/40 rounded-lg w-40" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-card h-24" />
        ))}
      </div>
      <div className="bg-white rounded-xl shadow-card h-48" />
      <div className="bg-white rounded-xl shadow-card h-64" />
    </div>
  )
}
