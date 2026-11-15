/**
 * CloudPrune Visual HTML Audit Report Generator
 * Generates an executive-ready standalone HTML report
 */

export function generateHtmlReport(scanResults) {
  const summary = scanResults.summary;
  const cat = scanResults.categories;

  return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CloudPrune Audit Report | ${scanResults.provider}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    body { background-color: #0b0f17; color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    .glass { background: rgba(17, 24, 39, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.08); }
  </style>
</head>
<body class="min-h-screen p-4 md:p-8">

  <!-- Header -->
  <header class="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row items-center justify-between gap-4 glass rounded-2xl p-6">
    <div class="flex items-center gap-3">
      <div class="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white text-2xl shadow-lg shadow-emerald-500/20">
        <i class="fa-solid fa-leaf"></i>
      </div>
      <div>
        <div class="flex items-center gap-2">
          <h1 class="text-2xl font-bold tracking-tight text-white">CloudPrune Audit Report</h1>
          <span class="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">${scanResults.provider}</span>
        </div>
        <p class="text-xs text-gray-400">1nsharma-labs &bull; Scanned at ${new Date(scanResults.scannedAt).toLocaleString()}</p>
      </div>
    </div>
    <div>
      <a href="https://github.com/1nsharma-labs/cloudprune" target="_blank" class="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-gray-200 border border-gray-700 transition flex items-center gap-2">
        <i class="fa-brands fa-github text-sm"></i> GitHub Repository
      </a>
    </div>
  </header>

  <main class="max-w-6xl mx-auto space-y-6">

    <!-- Hero Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="glass p-6 rounded-2xl">
        <div class="text-xs uppercase tracking-wider font-semibold text-gray-400 mb-2">Monthly Cloud Waste</div>
        <div class="text-4xl font-extrabold text-rose-500">$${summary.totalMonthlyWasteUSD.toFixed(2)}</div>
        <p class="text-xs text-gray-400 mt-2">Draining from credit card every month</p>
      </div>

      <div class="glass p-6 rounded-2xl">
        <div class="text-xs uppercase tracking-wider font-semibold text-gray-400 mb-2">Projected Annual Savings</div>
        <div class="text-4xl font-extrabold text-emerald-400">$${summary.projectedAnnualWasteUSD.toFixed(2)}</div>
        <p class="text-xs text-gray-400 mt-2">Recoverable capital per year</p>
      </div>

      <div class="glass p-6 rounded-2xl">
        <div class="text-xs uppercase tracking-wider font-semibold text-gray-400 mb-2">Zombie Resources</div>
        <div class="text-4xl font-extrabold text-amber-400">${summary.totalZombieResources}</div>
        <p class="text-xs text-gray-400 mt-2">Unattached disks, idle IPs & load balancers</p>
      </div>
    </div>

    <!-- Category Breakdown Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div class="glass p-5 rounded-2xl">
        <div class="flex items-center justify-between text-xs text-gray-400 mb-2 font-semibold">
          <span>Unattached EBS Disks</span>
          <i class="fa-solid fa-hard-drive text-emerald-400"></i>
        </div>
        <div class="text-2xl font-bold text-white">$${cat.unattachedVolumes.monthlyWasteUSD}/mo</div>
        <div class="text-xs text-gray-400 mt-1">${cat.unattachedVolumes.count} disks (${cat.unattachedVolumes.totalGb} GB)</div>
      </div>

      <div class="glass p-5 rounded-2xl">
        <div class="flex items-center justify-between text-xs text-gray-400 mb-2 font-semibold">
          <span>Unassociated IPs</span>
          <i class="fa-solid fa-network-wired text-indigo-400"></i>
        </div>
        <div class="text-2xl font-bold text-white">$${cat.unassociatedIps.monthlyWasteUSD}/mo</div>
        <div class="text-xs text-gray-400 mt-1">${cat.unassociatedIps.count} idle Elastic IPs</div>
      </div>

      <div class="glass p-5 rounded-2xl">
        <div class="flex items-center justify-between text-xs text-gray-400 mb-2 font-semibold">
          <span>Stopped EC2 Disks</span>
          <i class="fa-solid fa-server text-purple-400"></i>
        </div>
        <div class="text-2xl font-bold text-white">$${cat.stoppedInstances.monthlyWasteUSD}/mo</div>
        <div class="text-xs text-gray-400 mt-1">${cat.stoppedInstances.count} instances (${cat.stoppedInstances.totalRootDiskGb} GB)</div>
      </div>
    </div>

    <!-- Detailed Resource Table -->
    <div class="glass p-6 rounded-2xl">
      <h2 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <i class="fa-solid fa-trash-can text-rose-400"></i> Actionable Zombie Resources
      </h2>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs font-mono">
          <thead class="text-gray-400 uppercase border-b border-gray-800 pb-2">
            <tr>
              <th class="pb-3">Type</th>
              <th class="pb-3">Resource ID / Name</th>
              <th class="pb-3">Size / Detail</th>
              <th class="pb-3">Idle Age</th>
              <th class="pb-3">Est. Waste ($/mo)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-800 text-gray-300">
            ${cat.unattachedVolumes.items.map(v => `
              <tr>
                <td class="py-2.5 text-emerald-400">EBS Volume</td>
                <td class="py-2.5 font-bold">${v.id}</td>
                <td class="py-2.5">${v.sizeGb} GB (${v.type})</td>
                <td class="py-2.5 text-amber-400">${v.daysIdle} days</td>
                <td class="py-2.5 font-bold text-rose-400">$${(v.sizeGb * 0.08).toFixed(2)}</td>
              </tr>
            `).join('')}

            ${cat.unassociatedIps.items.map(i => `
              <tr>
                <td class="py-2.5 text-indigo-400">Elastic IP</td>
                <td class="py-2.5 font-bold">${i.ip} (${i.id})</td>
                <td class="py-2.5">Unallocated</td>
                <td class="py-2.5 text-amber-400">${i.daysIdle} days</td>
                <td class="py-2.5 font-bold text-rose-400">$3.60</td>
              </tr>
            `).join('')}

            ${cat.stoppedInstances.items.map(inst => `
              <tr>
                <td class="py-2.5 text-purple-400">Stopped EC2</td>
                <td class="py-2.5 font-bold">${inst.id} (${inst.name})</td>
                <td class="py-2.5">${inst.rootDiskGb} GB root (${inst.type})</td>
                <td class="py-2.5 text-amber-400">${inst.stoppedDays} days</td>
                <td class="py-2.5 font-bold text-rose-400">$${(inst.rootDiskGb * 0.08).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Remediation Command -->
    <div class="glass p-6 rounded-2xl bg-gradient-to-r from-gray-900 via-gray-900 to-emerald-950/20 border-emerald-500/30">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-bold text-white flex items-center gap-2">
          <i class="fa-solid fa-terminal text-emerald-400"></i> Run Automated Pruning
        </h3>
        <span class="text-xs text-gray-400 font-mono">1-click dry-run safe</span>
      </div>
      <div class="p-3 bg-black/60 rounded-xl font-mono text-xs text-emerald-400 flex items-center justify-between">
        <code>cloudprune prune --dry-run</code>
        <button onclick="navigator.clipboard.writeText('cloudprune prune --dry-run'); alert('Command copied to clipboard!')" class="px-2.5 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs">Copy</button>
      </div>
    </div>

  </main>
</body>
</html>`;
}
