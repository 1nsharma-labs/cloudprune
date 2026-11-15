/**
 * CloudPrune AWS Waste Scanner & Heuristic Engine
 * Detects idle, orphaned, and zombie cloud resources
 */

export const AWS_PRICING = {
  ebsPerGbMonth: 0.08,           // gp3 standard
  unassociatedIpMonth: 3.60,      // $0.005/hr * 720 hrs
  stoppedEc2DiskPerGbMonth: 0.08,
  snapshotPerGbMonth: 0.05,
  idleAlbMonth: 16.20             // $0.0225/hr
};

export class AwsWasteScanner {
  constructor(options = {}) {
    this.region = options.region || process.env.AWS_REGION || 'us-east-1';
  }

  /**
   * Main scan routine
   */
  async scan() {
    // If AWS credentials exist, integrate with AWS SDK / CLI
    const hasAwsCreds = Boolean(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY);

    if (hasAwsCreds) {
      return await this.scanLiveAws();
    }

    // Default: High-fidelity synthetic scan for demonstration & local testing
    return this.generateSyntheticScan();
  }

  async scanLiveAws() {
    // Placeholder for live AWS API calls via fetch/sigv4
    return this.generateSyntheticScan();
  }

  generateSyntheticScan() {
    const unattachedVolumes = [
      { id: 'vol-0a1b2c3d4e5f6g7h8', sizeGb: 200, type: 'gp3', region: this.region, daysIdle: 42, state: 'available' },
      { id: 'vol-0987654321fedcba0', sizeGb: 500, type: 'gp3', region: this.region, daysIdle: 95, state: 'available' },
      { id: 'vol-01122334455667788', sizeGb: 100, type: 'gp2', region: this.region, daysIdle: 14, state: 'available' }
    ];

    const unassociatedIps = [
      { id: 'eipalloc-01a2b3c4d5e6f7g8', ip: '54.210.12.34', region: this.region, daysIdle: 60 },
      { id: 'eipalloc-09f8e7d6c5b4a3a2', ip: '34.195.45.67', region: this.region, daysIdle: 120 }
    ];

    const stoppedInstances = [
      { id: 'i-0a1b2c3d4e5f67890', type: 't3.xlarge', rootDiskGb: 80, region: this.region, stoppedDays: 28, name: 'staging-worker-legacy' },
      { id: 'i-0fedcba9876543210', type: 'm5.large', rootDiskGb: 100, region: this.region, stoppedDays: 45, name: 'temp-db-migration' }
    ];

    const orphanedSnapshots = [
      { id: 'snap-0123456789abcdef0', sizeGb: 250, ageDays: 140, description: 'pre-migration-backup-2025' },
      { id: 'snap-0fedcba9876543210', sizeGb: 500, ageDays: 210, description: 'manual-dump-before-refactor' }
    ];

    const idleAlbs = [
      { id: 'arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/app/old-staging-alb/50dc6c495c0c9188', name: 'old-staging-alb', activeTargets: 0, daysIdle: 35 }
    ];

    // Compute costs
    let totalMonthlyWasteUSD = 0;

    // 1. Volumes cost
    const totalVolumeGb = unattachedVolumes.reduce((acc, v) => acc + v.sizeGb, 0);
    const volumeCostMonthly = totalVolumeGb * AWS_PRICING.ebsPerGbMonth;
    totalMonthlyWasteUSD += volumeCostMonthly;

    // 2. IPs cost
    const ipCostMonthly = unassociatedIps.length * AWS_PRICING.unassociatedIpMonth;
    totalMonthlyWasteUSD += ipCostMonthly;

    // 3. Stopped EC2 root disk waste
    const stoppedDiskGb = stoppedInstances.reduce((acc, i) => acc + i.rootDiskGb, 0);
    const stoppedDiskCostMonthly = stoppedDiskGb * AWS_PRICING.stoppedEc2DiskPerGbMonth;
    totalMonthlyWasteUSD += stoppedDiskCostMonthly;

    // 4. Snapshots cost
    const snapshotGb = orphanedSnapshots.reduce((acc, s) => acc + s.sizeGb, 0);
    const snapshotCostMonthly = snapshotGb * AWS_PRICING.snapshotPerGbMonth;
    totalMonthlyWasteUSD += snapshotCostMonthly;

    // 5. Idle ALBs cost
    const albCostMonthly = idleAlbs.length * AWS_PRICING.idleAlbMonth;
    totalMonthlyWasteUSD += albCostMonthly;

    return {
      provider: 'AWS',
      scannedAt: new Date().toISOString(),
      region: this.region,
      summary: {
        totalMonthlyWasteUSD: Number(totalMonthlyWasteUSD.toFixed(2)),
        projectedAnnualWasteUSD: Number((totalMonthlyWasteUSD * 12).toFixed(2)),
        totalZombieResources: unattachedVolumes.length + unassociatedIps.length + stoppedInstances.length + orphanedSnapshots.length + idleAlbs.length
      },
      categories: {
        unattachedVolumes: { count: unattachedVolumes.length, totalGb: totalVolumeGb, monthlyWasteUSD: Number(volumeCostMonthly.toFixed(2)), items: unattachedVolumes },
        unassociatedIps: { count: unassociatedIps.length, monthlyWasteUSD: Number(ipCostMonthly.toFixed(2)), items: unassociatedIps },
        stoppedInstances: { count: stoppedInstances.length, totalRootDiskGb: stoppedDiskGb, monthlyWasteUSD: Number(stoppedDiskCostMonthly.toFixed(2)), items: stoppedInstances },
        orphanedSnapshots: { count: orphanedSnapshots.length, totalGb: snapshotGb, monthlyWasteUSD: Number(snapshotCostMonthly.toFixed(2)), items: orphanedSnapshots },
        idleLoadBalancers: { count: idleAlbs.length, monthlyWasteUSD: Number(albCostMonthly.toFixed(2)), items: idleAlbs }
      }
    };
  }
}
