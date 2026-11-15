/**
 * CloudPrune Enterprise Scheduled Daemon & Slack Notifier (BSL 1.1)
 * Continuously monitors cloud accounts and alerts SecOps/FinOps via Webhook
 */

export class EnterpriseDaemon {
  constructor(options = {}) {
    this.webhookUrl = options.webhookUrl || process.env.CLOUDPRUNE_SLACK_WEBHOOK;
    this.intervalMs = (options.intervalMinutes || 60) * 60 * 1000;
  }

  /**
   * Send structured rich alert to Slack / MS Teams
   */
  async sendAlert(scanResults) {
    if (!this.webhookUrl) {
      console.log('[Enterprise Daemon] No Webhook configured. Skipping notification.');
      return;
    }

    const payload = {
      text: `🚨 *CloudPrune FinOps Alert*: Found *$${scanResults.summary.totalMonthlyWasteUSD.toFixed(2)}/mo* in zombie cloud waste!`,
      blocks: [
        {
          type: 'header',
          text: { type: 'plain_text', text: '🍃 CloudPrune Waste Alert' }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Provider:* ${scanResults.provider}\n*Zombie Resources:* ${scanResults.summary.totalZombieResources}\n*Monthly Waste:* *$${scanResults.summary.totalMonthlyWasteUSD.toFixed(2)}*\n*Annual Savings:* *$${scanResults.summary.projectedAnnualWasteUSD.toFixed(2)}*`
          }
        }
      ]
    };

    try {
      await fetch(this.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      console.log('[Enterprise Daemon] Slack alert delivered successfully.');
    } catch (err) {
      console.error('[Enterprise Daemon] Failed to deliver alert:', err.message);
    }
  }
}
