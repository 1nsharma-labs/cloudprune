<p align="center">
  <img src="https://raw.githubusercontent.com/1nsharma-labs/cloudprune/main/ui/logo.png" alt="CloudPrune Logo" width="100" onerror="this.style.display='none'"/>
</p>

<h1 align="center">🍃 CloudPrune</h1>

<p align="center">
  <b>The Open-Source Cloud Waste & Zombie Resource Killer for AWS & GCP</b><br>
  Instantly discover unattached EBS disks, idle Elastic IPs, stopped EC2 instances, and orphaned snapshots. Recover thousands of wasted cloud dollars per year with 1-click dry-run safety.
</p>

<p align="center">
  <a href="https://github.com/1nsharma-labs/cloudprune/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-Apache_2.0-blue.svg" alt="License"></a>
  <a href="https://github.com/1nsharma-labs/cloudprune/blob/main/ee/LICENSE-EE"><img src="https://img.shields.io/badge/EE_License-BSL_1.1-purple.svg" alt="EE License"></a>
  <a href="https://github.com/sponsors/1nsharma"><img src="https://img.shields.io/badge/Sponsor-GitHub_Sponsors-pink.svg" alt="Sponsor"></a>
</p>

---

## ⚡ Why CloudPrune?

Engineering teams waste **15% to 35% of their monthly cloud bills** on forgotten infrastructure:
* **Unattached EBS Volumes:** Disconnected disks still cost \$0.08–\$0.10/GB every single month.
* **Unassociated Elastic IPs:** AWS charges \$3.60/month per unused allocated IP.
* **Stopped EC2 Instances:** Legacy staging VMs that haven't received traffic in months still rack up root volume and reservation charges.
* **Orphaned Snapshots:** Manual backup dumps from 2024 lingering forever.

**CloudPrune** scans your accounts, calculates exact monthly wasted spend, and outputs an executive visual HTML report with 1-click safe remediation.

---

## 🚀 Quick Start (No Install Needed)

### Run via npx / Node.js

```bash
# Scan and generate instant terminal + HTML report
npx cloudprune scan

# Simulate remediation with safe dry-run
npx cloudprune prune --dry-run
```

### Run via Docker

```bash
docker run --rm -v ~/.aws:/root/.aws:ro 1nsharma-labs/cloudprune:latest scan
```

---

## 💻 CLI Commands

```bash
cloudprune scan               # Scan account & calculate monthly waste in USD
cloudprune report             # Generate standalone cloudprune-report.html
cloudprune prune --dry-run    # Simulate deletion with exact savings plan
cloudprune prune --force      # Execute safe deletion of zombie resources
```

---

## 📊 Visual HTML Audit Report

Every `cloudprune scan` automatically outputs `cloudprune-report.html`:
* Executive KPI Cards (Monthly Waste, Annual Savings, Zombie count)
* Detailed breakdown table by resource ID and age
* 1-Click copy remediation commands

---

## 💼 Dual Licensing & Open-Core Model

* **Community CLI (`/core`):** 100% Free under **Apache License 2.0**.
* **Enterprise Edition (`/ee`):** Licensed under **Business Source License (BSL 1.1)** for automated scheduled daemons, multi-account AWS Organizations scanning, and Slack/Teams alerts.

See [PRICING.md](PRICING.md) for full details.

---

## 🤝 Sponsoring & Community

* **GitHub Sponsors:** [github.com/sponsors/1nsharma](https://github.com/sponsors/1nsharma)
* **Maintained by:** [1nsharma-labs](https://github.com/1nsharma-labs)

---

## 🌐 The 1nsharma-labs Open-Source Suite

Explore our interconnected developer tools to slash costs and automate governance:
* 🛡️ [**TokenArmor**](https://github.com/1nsharma-labs/tokenarmor): AI Gateway & Token FinOps Firewall.
* 🍃 [**CloudPrune**](https://github.com/1nsharma-labs/cloudprune): AWS & GCP Cloud Waste & Zombie Resource Killer.
* 🔒 [**CompliGuard**](https://github.com/1nsharma-labs/compliguard): Continuous SOC 2 & ISO 27001 Evidence Engine.
* 🔑 [**SecretArmor**](https://github.com/1nsharma-labs/secretarmor): Zero-Trust Secret Sprawl & API Key Leak Firewall.
* ☸️ [**KubePrune**](https://github.com/1nsharma-labs/kubeprune): Kubernetes Over-Provisioning & Pod Waste Killer.
* 🏗️ [**DriftArmor**](https://github.com/1nsharma-labs/driftarmor): Terraform Drift Detector & Cloud Cost Firewall.
