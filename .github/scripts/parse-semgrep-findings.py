#!/usr/bin/env python3
"""Parse Semgrep SARIF output and print human-readable findings."""
import json

try:
    with open("semgrep-results.sarif") as f:
        data = json.load(f)
except FileNotFoundError:
    print("semgrep-results.sarif not found — scan mungkin belum jalan?")
    exit(0)

findings = []
for run in data.get("runs", []):
    for result in run.get("results", []):
        loc = result.get("locations", [{}])[0].get("physicalLocation", {})
        region = loc.get("region", {})
        artifact = loc.get("artifactLocation", {})
        findings.append({
            "ruleId": result.get("ruleId", "unknown"),
            "file": artifact.get("uri", "unknown"),
            "line": region.get("startLine", "unknown"),
            "message": result.get("message", {}).get("text", "unknown"),
            "snippet": region.get("snippet", {}).get("text", "unknown"),
        })

if not findings:
    print("No findings found.")
else:
    print("=== Semgrep Findings ===")
    for f in findings:
        print(f"Rule:    {f['ruleId']}")
        print(f"File:    {f['file']}")
        print(f"Line:    {f['line']}")
        print(f"Message: {f['message']}")
        print(f"Snippet: {f['snippet']}")
        print("---")
