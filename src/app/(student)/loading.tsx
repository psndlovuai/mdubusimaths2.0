export default function StudentLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-8 bg-white rounded-xl w-56" />
        <div className="h-4 bg-white/70 rounded-lg w-40" />
      </div>
      <div className="bg-white rounded-2xl shadow-card h-96" />
      <div className="space-y-3">
        <div className="h-5 bg-white/70 rounded-lg w-36" />
        <div className="bg-white rounded-xl shadow-card h-20" />
        <div className="bg-white rounded-xl shadow-card h-20" />
      </div>
    </div>
  )
}
