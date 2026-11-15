# Show HN: CloudPrune – Open-source cloud waste and zombie resource killer

Title: Show HN: CloudPrune – Open-source cloud waste and zombie resource killer for AWS & GCP

Repo: https://github.com/1nsharma-labs/cloudprune

Hey HN,

Companies waste 15% to 35% of their monthly AWS/GCP bills on forgotten zombie resources:
- Unattached EBS volumes ($0.08–$0.10/GB/month)
- Unassociated Elastic IPs ($3.60/month per unused IP)
- Stopped EC2 instances charging for root volumes
- Forgotten manual snapshots from 2024
- Idle Application Load Balancers ($16+/month each)

We built **CloudPrune** (https://github.com/1nsharma-labs/cloudprune): an open-source CLI that scans your infrastructure, calculates dollar-by-dollar waste, and generates an executive visual HTML report with safe 1-click dry-run remediation.

Core CLI is 100% free under Apache 2.0.
Enterprise edition (BSL 1.1) adds scheduled Slack bot alerts and multi-account scanning.

Run it in 1 line:
$ npx cloudprune scan

Feedback and contributions welcome!
