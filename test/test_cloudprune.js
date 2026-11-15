import assert from 'node:assert';
import fs from 'node:fs';

import { AwsWasteScanner } from '../core/src/scanner/aws.js';
import { generateHtmlReport } from '../core/src/report/html.js';
import { CloudPruneLicenseVerifier } from '../ee/license/verifier.js';

console.log('🧪 Starting CloudPrune Automated Test Suite...\n');

// 1. Scanner Test
console.log('Test 1: AWS Waste Scanner & Heuristics');
const scanner = new AwsWasteScanner({ region: 'us-east-1' });
const results = await scanner.scan();

assert.strictEqual(results.provider, 'AWS');
assert.ok(results.summary.totalMonthlyWasteUSD > 0, 'Must detect monthly waste');
assert.ok(results.summary.projectedAnnualWasteUSD > results.summary.totalMonthlyWasteUSD, 'Annual waste must exceed monthly');
assert.ok(results.summary.totalZombieResources > 0, 'Must detect zombie resources');
console.log('  ✅ Detected Zombie Resources:', results.summary.totalZombieResources);
console.log('  ✅ Monthly Waste Calculated: $' + results.summary.totalMonthlyWasteUSD + '/mo');

// 2. HTML Report Generator Test
console.log('\nTest 2: Executive HTML Report Generator');
const html = generateHtmlReport(results);
assert.ok(html.includes('CloudPrune Audit Report'), 'Must include title');
assert.ok(html.includes('Monthly Cloud Waste'), 'Must include waste section');
assert.ok(html.includes(String(results.summary.totalMonthlyWasteUSD)), 'Must render waste amount');
console.log('  ✅ HTML Report generated successfully (' + html.length + ' bytes)');

// 3. Enterprise License Verifier Test
console.log('\nTest 3: Offline BSL 1.1 License Verifier');
const verifier = new CloudPruneLicenseVerifier('test-cloudprune-secret');
const key = verifier.generateKey('StripeCorp', 60, 'ENT');
const verified = verifier.verifyKey(key);
assert.strictEqual(verified.valid, true);
assert.strictEqual(verified.tier, 'ENTERPRISE');
assert.strictEqual(verified.organization, 'STRIPECORP');
console.log('  ✅ Offline Enterprise License verified:', key);

console.log('\n🎉 ALL CLOUDPRUNE TESTS PASSED SUCCESSFULLY!\n');
process.exit(0);
