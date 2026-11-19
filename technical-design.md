# SentinelGrid technical design

**Development Status: In Progress** — implementation plan.

## Scope and approach

Normalize sample AWS security findings, correlate them with resource and identity context, and produce an analyst-reviewed investigation brief. A reasoning component may propose next steps, but it cannot change cloud resources.

### Case model
Each case has a stable ID, linked finding IDs, affected resource ARNs, event timestamps, severity, evidence pointers, and a review state. Raw source events stay immutable in S3; DynamoDB holds only normalized fields and references.

### Processing contract
Ingestion validates schema and account allowlists, derives a deterministic deduplication key, then writes evidence before correlation. Correlation groups by resource, identity, and bounded time window. Failed processing goes to a dead-letter queue for replay.

### Human control
The summary worker cites exact evidence IDs and labels uncertainty. Its output is advisory. The first version has no remediation permissions; an analyst approves or rejects each proposed action in the UI.

### Evaluation
Replay a labeled synthetic finding set. Measure grouping precision and recall, false-positive rate, time to triage, citation validity, and processing latency. Compare with ungrouped Security Hub findings.

## Quality and operating requirements

Use least-privilege read roles, KMS encryption, private evidence buckets, retention limits, redacted logs, and explicit separation between monitored and application accounts. Avoid importing real incident data into public demos.

The first implementation should include structured logs, explicit failure handling, bounded retries where external services are involved, and a reproducible local run path. Proposed services and models may change after the baseline is measured.
