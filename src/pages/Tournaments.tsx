export function Tournaments() {
  return (
    <div className="p-4 pb-24 space-y-6">
      <h1 className="text-3xl font-black text-center">Турниры CS2</h1>

      <div className="bg-zinc-900 rounded-3xl p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-bold text-xl">BLAST Premier Spring Final 2026</p>
            <p className="text-emerald-400 text-sm">12–15 марта • $400 000</p>
          </div>
          <span className="bg-red-500 px-3 py-1 rounded-full text-xs font-bold">LIVE</span>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-3">
          <button className="bg-zinc-800 hover:bg-zinc-700 py-4 rounded-2xl text-sm">Top-1<br/>50 cryst</button>
          <button className="bg-zinc-800 hover:bg-zinc-700 py-4 rounded-2xl text-sm">Top-3<br/>100 cryst</button>
          <button className="bg-zinc-800 hover:bg-zinc-700 py-4 rounded-2xl text-sm">Top-5<br/>200 cryst</button>
        </div>
      </div>

      <div className="bg-zinc-900 rounded-3xl p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-bold text-xl">IEM Katowice 2026</p>
            <p className="text-emerald-400 text-sm">20–23 марта • $1 000 000</p>
          </div>
          <span className="bg-yellow-500 px-3 py-1 rounded-full text-xs font-bold">Скоро</span>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-3">
          <button className="bg-zinc-800 hover:bg-zinc-700 py-4 rounded-2xl text-sm">Top-1<br/>50 cryst</button>
          <button className="bg-zinc-800 hover:bg-zinc-700 py-4 rounded-2xl text-sm">Top-3<br/>100 cryst</button>
          <button className="bg-zinc-800 hover:bg-zinc-700 py-4 rounded-2xl text-sm">Top-5<br/>200 cryst</button>
        </div>
      </div>
    </div>
  );
}
