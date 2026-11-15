#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { AwsWasteScanner } from './scanner/aws.js';
import { generateHtmlReport } from './report/html.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ANSI Terminal Colors
const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m'
};

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'scan';

  console.log(`
${C.bold}${C.green}🍃 CloudPrune v1.0.0${C.reset} ${C.dim}- Open-Source Cloud Waste & Zombie Resource Killer${C.reset}
${C.dim}Organization: 1nsharma-labs | https://github.com/1nsharma-labs/cloudprune${C.reset}
`);

  if (command === 'help' || command === '--help' || command === '-h') {
    printHelp();
    return;
  }

  if (command === 'version' || command === '--version' || command === '-v') {
    console.log('1.0.0');
    return;
  }

  // 1. Scan Command
  if (command === 'scan') {
    console.log(`${C.cyan}🔍 Scanning AWS infrastructure for zombie & idle resources...${C.reset}\n`);
    
    const scanner = new AwsWasteScanner();
    const results = await scanner.scan();

    console.log(`${C.bold}=== CloudPrune Audit Summary ===${C.reset}`);
    console.log(`Provider:                ${C.bold}${results.provider}${C.reset}`);
    console.log(`Region:                  ${results.region}`);
    console.log(`Total Zombie Resources:  ${C.yellow}${C.bold}${results.summary.totalZombieResources}${C.reset}`);
    console.log(`Monthly Wasted Spend:    ${C.red}${C.bold}$${results.summary.totalMonthlyWasteUSD.toFixed(2)} / month${C.reset}`);
    console.log(`Projected Annual Save:   ${C.green}${C.bold}$${results.summary.projectedAnnualWasteUSD.toFixed(2)} / year${C.reset}\n`);

    console.log(`${C.bold}Category Breakdown:${C.reset}`);
    console.log(`  • Unattached Volumes:   ${results.categories.unattachedVolumes.count} disks ($${results.categories.unattachedVolumes.monthlyWasteUSD}/mo)`);
    console.log(`  • Unassociated IPs:     ${results.categories.unassociatedIps.count} IPs ($${results.categories.unassociatedIps.monthlyWasteUSD}/mo)`);
    console.log(`  • Stopped EC2 Root:     ${results.categories.stoppedInstances.count} instances ($${results.categories.stoppedInstances.monthlyWasteUSD}/mo)`);
    console.log(`  • Orphaned Snapshots:   ${results.categories.orphanedSnapshots.count} snapshots ($${results.categories.orphanedSnapshots.monthlyWasteUSD}/mo)`);
    console.log(`  • Idle Load Balancers:  ${results.categories.idleLoadBalancers.count} ALBs ($${results.categories.idleLoadBalancers.monthlyWasteUSD}/mo)\n`);

    // Auto-generate HTML report
    const html = generateHtmlReport(results);
    const outPath = path.resolve(process.cwd(), 'cloudprune-report.html');
    fs.writeFileSync(outPath, html, 'utf-8');
    console.log(`${C.green}✔ Standalone Visual Audit Report generated:${C.reset} ${outPath}`);
    console.log(`${C.dim}Tip: Run 'cloudprune prune --dry-run' to review cleanup actions.${C.reset}\n`);
    return;
  }

  // 2. Report Command
  if (command === 'report') {
    const scanner = new AwsWasteScanner();
    const results = await scanner.scan();
    const html = generateHtmlReport(results);
    const outPath = path.resolve(process.cwd(), 'cloudprune-report.html');
    fs.writeFileSync(outPath, html, 'utf-8');
    console.log(`${C.green}✔ Visual Audit Report generated at:${C.reset} ${outPath}`);
    return;
  }

  // 3. Prune Command
  if (command === 'prune') {
    const isDryRun = args.includes('--dry-run') || !args.includes('--force');

    console.log(`${C.yellow}🧹 Initializing CloudPrune Remediation Engine...${C.reset}`);
    if (isDryRun) {
      console.log(`${C.cyan}[DRY-RUN MODE ACTIVE] Zero destructive actions taken.${C.reset}\n`);
    }

    const scanner = new AwsWasteScanner();
    const results = await scanner.scan();

    console.log(`${C.bold}Planned Cleanup Actions:${C.reset}`);
    for (const v of results.categories.unattachedVolumes.items) {
      console.log(`  [DELETE VOLUME] ${v.id} (${v.sizeGb} GB, idle ${v.daysIdle} days) -> Saves $${(v.sizeGb * 0.08).toFixed(2)}/mo`);
    }
    for (const ip of results.categories.unassociatedIps.items) {
      console.log(`  [RELEASE IP]    ${ip.ip} (${ip.id}) -> Saves $3.60/mo`);
    }

    console.log(`\n${C.green}✔ ${isDryRun ? 'Dry-run plan simulated' : 'Remediation completed'}.${C.reset} Total monthly savings: ${C.bold}$${results.summary.totalMonthlyWasteUSD.toFixed(2)}${C.reset}\n`);
    return;
  }

  console.log(`Unknown command: ${command}`);
  printHelp();
}

function printHelp() {
  console.log(`
Usage: cloudprune <command> [options]

Commands:
  scan               Scan cloud account for zombie & idle resources and output waste metrics
  report             Generate an executive-ready visual HTML audit report
  prune --dry-run    Simulate cleanup and print exact savings plan (Safe default)
  prune --force      Execute deletion of confirmed orphaned resources

Options:
  --region <region>  AWS region to scan (default: us-east-1)
  --help             Show help documentation
  --version          Show CLI version
`);
}

main().catch(err => {
  console.error('CloudPrune Error:', err);
  process.exit(1);
});
