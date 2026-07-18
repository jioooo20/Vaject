#!/usr/bin/env python3
"""
=============================================================================
generate-security-report.py - Unified Security Report Generator
=============================================================================
Mengumpulkan semua hasil scan keamanan dari berbagai tool, menormalisasi,
mengurutkan dari yang paling fatal, dan menghasilkan:

  1. security-report.html   -> HTML self-contained (bisa dibuka offline)
  2. findings.json          -> Machine-readable JSON
  3. $GITHUB_STEP_SUMMARY   -> Markdown untuk GitHub Actions UI

Tool yang didukung:
  - Semgrep   (SARIF)   -> SAST
  - Trivy     (SARIF)   -> SCA + Container Scan
  - ZAP       (JSON)    -> DAST
  - npm audit (JSON)    -> SCA Quick Gate
  - Gitleaks  (SARIF)   -> Secrets Scan

Cara pakai:
  python .github/scripts/generate-security-report.py \
    --input-dir ./scan-results \
    --output-dir ./reports \
    --github-summary

Dependencies: Hanya Python 3 standard library (json, pathlib, html, os)
=============================================================================
"""

import json
import os
import sys
import glob
import html
import re
from pathlib import Path
from datetime import datetime

# ---------------------------------------------------------------------------
# CONSTANTS
# ---------------------------------------------------------------------------

SEVERITY_ORDER = {
    "CRITICAL": 0,
    "HIGH": 1,
    "MEDIUM": 2,
    "LOW": 3,
    "INFO": 4,
    "WARNING": 5,
    "NOTE": 6,
    "NONE": 7,
}

SEVERITY_SCORE = {
    "CRITICAL": 95,
    "HIGH": 75,
    "MEDIUM": 55,
    "LOW": 35,
    "INFO": 15,
    "WARNING": 10,
    "NOTE": 5,
    "NONE": 0,
}

SEVERITY_COLORS = {
    "CRITICAL": "#dc3545",
    "HIGH": "#fd7e14",
    "MEDIUM": "#ffc107",
    "LOW": "#0dcaf0",
    "INFO": "#6c757d",
    "WARNING": "#6f42c1",
    "NOTE": "#adb5bd",
    "NONE": "#ced4da",
}

TOOL_NAMES = {
    "semgrep": "Semgrep SAST",
    "trivy": "Trivy",
    "trivy-fs": "Trivy (Filesystem)",
    "trivy-image": "Trivy (Container)",
    "zap": "OWASP ZAP",
    "zap-baseline": "OWASP ZAP Baseline",
    "zap-full": "OWASP ZAP Full Scan",
    "npm-audit": "npm audit",
    "gitleaks": "Gitleaks",
}

TOOL_TYPES = {
    "semgrep": "SAST",
    "trivy": "SCA",
    "trivy-fs": "SCA",
    "trivy-image": "Container",
    "zap": "DAST",
    "zap-baseline": "DAST",
    "zap-full": "DAST",
    "npm-audit": "SCA",
    "gitleaks": "Secrets",
}


# ---------------------------------------------------------------------------
# FINDING CLASS
# ---------------------------------------------------------------------------

class Finding:
    """Representasi normal dari satu temuan keamanan (finding)."""

    def __init__(self, title, severity, tool, description="", location=None,
                 remediation="", cve_id="", cwe_id="", details=None):
        self.title = title
        self.severity = severity.upper() if severity else "INFO"
        self.tool = tool.lower()
        self.description = description or ""
        self.location = location or {}
        self.remediation = remediation or ""
        self.cve_id = cve_id or ""
        self.cwe_id = cwe_id or ""
        self.details = details or {}

    @property
    def severity_score(self):
        return SEVERITY_SCORE.get(self.severity, 0)

    @property
    def sort_key(self):
        """Key untuk sorting: severity (desc) -> tool -> title."""
        sev = SEVERITY_ORDER.get(self.severity, 99)
        return (sev, self.tool, self.title.lower())

    @property
    def tool_type(self):
        return TOOL_TYPES.get(self.tool, "Unknown")

    @property
    def tool_name(self):
        return TOOL_NAMES.get(self.tool, self.tool.title())

    @property
    def color(self):
        return SEVERITY_COLORS.get(self.severity, "#6c757d")

    def to_dict(self):
        return {
            "title": self.title,
            "severity": self.severity,
            "severity_score": self.severity_score,
            "tool": self.tool,
            "tool_name": self.tool_name,
            "tool_type": self.tool_type,
            "description": self.description,
            "location": self.location,
            "remediation": self.remediation,
            "cve_id": self.cve_id,
            "cwe_id": self.cwe_id,
            "details": self.details,
        }


# ---------------------------------------------------------------------------
# PARSERS
# ---------------------------------------------------------------------------

def parse_sarif_semgrep(filepath):
    """Parse SARIF dari Semgrep."""
    findings = []
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except (json.JSONDecodeError, FileNotFoundError) as e:
        print(f"  [WARN] Gagal parse SARIF Semgrep: {e}")
        return findings

    for run in data.get("runs", []):
        rules_map = {}
        for rule in run.get("tool", {}).get("driver", {}).get("rules", []):
            rules_map[rule.get("id")] = rule.get("shortDescription", {}).get("text", "")

        for result in run.get("results", []):
            rule_id = result.get("ruleId", "unknown")
            level = result.get("level", "warning")
            sev_map = {"error": "HIGH", "warning": "MEDIUM", "note": "LOW"}
            severity = sev_map.get(level, "INFO")

            message = result.get("message", {}).get("text", "")
            description = rules_map.get(rule_id, message)

            location = {}
            locs = result.get("locations", [])
            if locs:
                phys = locs[0].get("physicalLocation", {})
                art_loc = phys.get("artifactLocation", {})
                region = phys.get("region", {})
                uri = art_loc.get("uri", "")
                if uri:
                    location["file"] = uri
                if region.get("startLine"):
                    location["line"] = region["startLine"]

            cwe_id = ""
            props = result.get("properties", {})
            if props.get("tags"):
                for tag in props["tags"]:
                    if tag.startswith("CWE-"):
                        cwe_id = tag
                        break

            finding = Finding(
                title=message or rule_id,
                severity=severity,
                tool="semgrep",
                description=description,
                location=location,
                remediation=f"Perbaiki pattern insecure di {location.get('file', '?')}:{location.get('line', '?')}",
                cwe_id=cwe_id,
                details={"rule_id": rule_id},
            )
            findings.append(finding)

    return findings


def parse_sarif_trivy(filepath, tool_name="trivy-fs"):
    """Parse SARIF dari Trivy."""
    findings = []
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except (json.JSONDecodeError, FileNotFoundError) as e:
        print(f"  [WARN] Gagal parse SARIF Trivy: {e}")
        return findings

    for run in data.get("runs", []):
        rules_map = {}
        for rule in run.get("tool", {}).get("driver", {}).get("rules", []):
            rid = rule.get("id", "")
            desc = rule.get("shortDescription", {}).get("text", "")
            full_desc = rule.get("fullDescription", {}).get("text", "")
            rules_map[rid] = {
                "description": desc or full_desc,
                "help": rule.get("help", {}).get("text", "") if isinstance(rule.get("help"), dict) else "",
            }

        for result in run.get("results", []):
            rule_id = result.get("ruleId", "unknown")
            level = result.get("level", "warning")
            sev_map = {"error": "CRITICAL", "warning": "HIGH"}
            severity = sev_map.get(level, "MEDIUM")

            message = result.get("message", {}).get("text", "")
            rule_info = rules_map.get(rule_id, {})
            description = rule_info.get("description", message)

            cve_id = ""
            rid_upper = rule_id.upper()
            if rid_upper.startswith("CVE-"):
                cve_id = rule_id
            else:
                cve_match = re.search(r'(CVE-\d{4}-\d+)', message)
                if cve_match:
                    cve_id = cve_match.group(1)

            location = {}
            props = result.get("properties", {})
            if props.get("package"):
                location["package"] = props["package"]
            if props.get("installedVersion"):
                location["installed_version"] = props["installedVersion"]
            if props.get("fixedVersion"):
                location["fixed_version"] = props["fixedVersion"]

            remediation = ""
            if location.get("fixed_version"):
                remediation = f"Update package {location.get('package', '?')} ke versi {location['fixed_version']}"
            elif rule_info.get("help"):
                remediation = rule_info["help"]

            finding = Finding(
                title=f"{cve_id or rule_id}: {message}" if message else (cve_id or rule_id),
                severity=severity,
                tool=tool_name,
                description=description,
                location=location,
                remediation=remediation,
                cve_id=cve_id,
                details={
                    "rule_id": rule_id,
                    "package": location.get("package", ""),
                    "installed": location.get("installed_version", ""),
                    "fixed": location.get("fixed_version", ""),
                },
            )
            findings.append(finding)

    return findings


def parse_zap_json(filepath):
    """Parse JSON report dari OWASP ZAP."""
    findings = []
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except (json.JSONDecodeError, FileNotFoundError) as e:
        print(f"  [WARN] Gagal parse ZAP JSON: {e}")
        return findings

    if isinstance(data, list):
        alerts = data
    elif isinstance(data, dict):
        if "site" in data:
            alerts = []
            for site in data["site"]:
                for alert in site.get("alerts", []):
                    alerts.append(alert)
        else:
            alerts = data.get("alerts", [])

    for alert in alerts:
        if isinstance(alert, dict):
            name = alert.get("name") or alert.get("alert", "Unknown Alert")
            risk = alert.get("risk", "info").upper()
            risk_map = {
                "CRITICAL": "CRITICAL",
                "HIGH": "HIGH",
                "MEDIUM": "MEDIUM",
                "LOW": "LOW",
                "INFO": "INFO",
                "0": "INFO",
                "1": "LOW",
                "2": "MEDIUM",
                "3": "HIGH",
            }
            severity = risk_map.get(risk, "INFO")

            description = alert.get("description", "")
            solution = alert.get("solution", "")
            alert_id = str(alert.get("id") or alert.get("pluginId", ""))

            url = alert.get("url", "")
            location = {}
            if url:
                location["url"] = url

            if alert.get("param"):
                location["parameter"] = alert["param"]

            evidence = alert.get("evidence", "")
            if evidence:
                location["evidence"] = evidence[:200]

            cwe_id = ""
            cwe = alert.get("cweid")
            if cwe:
                cwe_id = f"CWE-{cwe}"

            finding = Finding(
                title=name,
                severity=severity,
                tool="zap",
                description=description,
                location=location,
                remediation=solution,
                cwe_id=cwe_id,
                details={
                    "alert_id": alert_id,
                    "url": url,
                    "confidence": alert.get("confidence", ""),
                    "evidence": evidence[:200] if evidence else "",
                },
            )
            findings.append(finding)

    return findings


def parse_npm_audit(filepath):
    """Parse JSON output dari npm audit."""
    findings = []
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except (json.JSONDecodeError, FileNotFoundError) as e:
        print(f"  [WARN] Gagal parse npm audit: {e}")
        return findings

    vulns = data.get("vulnerabilities", {})
    for pkg_name, info in vulns.items():
        severity = info.get("severity", "info").upper()
        if severity == "CRITICAL":
            sev = "CRITICAL"
        elif severity == "HIGH":
            sev = "HIGH"
        elif severity == "MODERATE":
            sev = "MEDIUM"
        else:
            sev = "LOW"

        title = info.get("title", "") or f"Vulnerability in {pkg_name}"
        via = info.get("via", [])
        cve_id = ""
        if via and isinstance(via, list):
            for v in via:
                if isinstance(v, dict):
                    if not cve_id:
                        cve_match = re.search(r'(CVE-\d{4}-\d+)', str(v.get("url", "")))
                        if cve_match:
                            cve_id = cve_match.group(1)

        range_info = info.get("range", "")
        fix_available = "fix" in info.get("fixAvailable", {}) if isinstance(info.get("fixAvailable"), dict) else bool(info.get("fixAvailable"))

        finding = Finding(
            title=f"{pkg_name}: {title}" if title else pkg_name,
            severity=sev,
            tool="npm-audit",
            description=f"Package {pkg_name} memiliki vulnerability. Rentang versi terpengaruh: {range_info}",
            location={"package": pkg_name, "range": range_info},
            remediation=f"Update {pkg_name} ke versi terbaru: npm update {pkg_name}" if fix_available else
                        f"Tidak ada fix yang tersedia untuk {pkg_name}. Pertimbangkan migrasi.",
            cve_id=cve_id,
            details={
                "package": pkg_name,
                "range": range_info,
                "fix_available": fix_available,
                "severity": severity,
            },
        )
        findings.append(finding)

    return findings


def parse_sarif_gitleaks(filepath):
    """Parse SARIF dari Gitleaks."""
    findings = []
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except (json.JSONDecodeError, FileNotFoundError) as e:
        print(f"  [WARN] Gagal parse Gitleaks SARIF: {e}")
        return findings

    for run in data.get("runs", []):
        for result in run.get("results", []):
            rule_id = result.get("ruleId", "unknown")
            level = result.get("level", "error")
            severity = "CRITICAL" if level == "error" else "HIGH"

            message = result.get("message", {}).get("text", "")

            location = {}
            locs = result.get("locations", [])
            if locs:
                phys = locs[0].get("physicalLocation", {})
                art_loc = phys.get("artifactLocation", {})
                region = phys.get("region", {})
                if art_loc.get("uri"):
                    location["file"] = art_loc["uri"]
                if region.get("startLine"):
                    location["line"] = region["startLine"]
                if region.get("snippet", {}).get("text"):
                    location["snippet"] = region["snippet"]["text"]

            cwe_id = ""
            for tag in result.get("properties", {}).get("tags", []):
                if str(tag).startswith("CWE-"):
                    cwe_id = str(tag)
                    break

            finding = Finding(
                title=message or f"Secret ditemukan: {rule_id}",
                severity=severity,
                tool="gitleaks",
                description="Secret/credential terdeteksi di file. Segera hapus dari riwayat git!",
                location=location,
                remediation=f"Hapus secret dari file {location.get('file', '?')} "
                           f"dan gunakan GitHub Secrets atau environment variable.",
                cwe_id=cwe_id,
                details={
                    "rule_id": rule_id,
                    "commit": result.get("properties", {}).get("commit", ""),
                },
            )
            findings.append(finding)

    return findings


# ---------------------------------------------------------------------------
# AUTO-DETECT & PARSE ALL FILES
# ---------------------------------------------------------------------------

def auto_detect_and_parse(input_dir):
    """Mendeteksi file hasil scan di input_dir dan memparse sesuai formatnya."""
    input_path = Path(input_dir)
    if not input_path.exists():
        print(f"  [ERROR] Direktori {input_dir} tidak ditemukan!")
        return []

    all_findings = []

    sarif_files = list(input_path.glob("**/*.sarif"))
    print(f"  Ditemukan {len(sarif_files)} file SARIF:")

    for sf in sarif_files:
        fname = sf.name.lower()
        print(f"     - {sf.name}")

        if "semgrep" in fname:
            findings = parse_sarif_semgrep(sf)
            print(f"       -> {len(findings)} findings (Semgrep SAST)")
        elif "trivy" in fname and ("image" in fname or "container" in fname):
            findings = parse_sarif_trivy(sf, tool_name="trivy-image")
            print(f"       -> {len(findings)} findings (Trivy Container)")
        elif "trivy" in fname:
            findings = parse_sarif_trivy(sf, tool_name="trivy-fs")
            print(f"       -> {len(findings)} findings (Trivy Filesystem)")
        elif "gitleaks" in fname:
            findings = parse_sarif_gitleaks(sf)
            print(f"       -> {len(findings)} findings (Gitleaks)")
        else:
            findings = try_detect_sarif_tool(sf)
            print(f"       -> {len(findings)} findings (auto-detected)")
        all_findings.extend(findings)

    json_files = list(input_path.glob("**/*.json"))
    print(f"  Ditemukan {len(json_files)} file JSON:")

    for jf in json_files:
        fname = jf.name.lower()
        print(f"     - {jf.name}")

        if "zap" in fname or "alert" in fname:
            findings = parse_zap_json(jf)
            print(f"       -> {len(findings)} findings (ZAP DAST)")
        elif "npm" in fname or "audit" in fname:
            findings = parse_npm_audit(jf)
            print(f"       -> {len(findings)} findings (npm audit)")
        else:
            print(f"       -> dilewati (bukan file scan yang dikenal)")
            findings = []
        all_findings.extend(findings)

    return all_findings


def try_detect_sarif_tool(filepath):
    """Coba deteksi tool dari konten SARIF."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except (json.JSONDecodeError, FileNotFoundError):
        return []

    for run in data.get("runs", []):
        driver_name = run.get("tool", {}).get("driver", {}).get("name", "").lower()
        if "semgrep" in driver_name:
            return parse_sarif_semgrep(filepath)
        elif "trivy" in driver_name:
            return parse_sarif_trivy(filepath, tool_name="trivy")
        elif "gitleaks" in driver_name:
            return parse_sarif_gitleaks(filepath)

    return []


# ---------------------------------------------------------------------------
# REPORT GENERATORS
# ---------------------------------------------------------------------------

def generate_html_report(findings, output_path):
    """Generate HTML report self-contained dengan findings terurut dari yang paling fatal."""
    sorted_findings = sorted(findings, key=lambda f: f.sort_key)

    stats = {}
    for sev in ["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO", "WARNING"]:
        stats[sev] = sum(1 for f in sorted_findings if f.severity == sev)

    per_tool = {}
    for f in sorted_findings:
        per_tool.setdefault(f.tool_name, {"count": 0, "critical": 0})
        per_tool[f.tool_name]["count"] += 1
        if f.severity == "CRITICAL":
            per_tool[f.tool_name]["critical"] += 1

    per_type = {}
    for f in sorted_findings:
        per_type.setdefault(f.tool_type, 0)
        per_type[f.tool_type] += 1

    total = len(sorted_findings)
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S UTC")

    rows_html = ""
    for i, f in enumerate(sorted_findings):
        sev_badge = f'<span class="badge severity-{f.severity.lower()}">{f.severity}</span>'
        loc_str = ""
        if f.location.get("file"):
            loc_str = f'{html.escape(f.location["file"])}:{f.location.get("line", "?")}'
        elif f.location.get("url"):
            loc_str = html.escape(f.location["url"])
        elif f.location.get("package"):
            pkg = f.location.get("package", "")
            ver = f.location.get("installed_version", "")
            loc_str = f"{pkg} {ver}" if ver else pkg

        cve_str = f'<code>{html.escape(f.cve_id)}</code>' if f.cve_id else ""
        desc_escaped = html.escape(f.description[:300] + ("..." if len(f.description) > 300 else ""))
        remed_escaped = html.escape(f.remediation[:500] if f.remediation else "Tidak ada informasi remediasi.")

        row_id = f"finding-{i}"
        rows_html += f"""
        <tr class="finding-row severity-{f.severity.lower()}" onclick="toggleDetail('{row_id}')">
            <td>{sev_badge}</td>
            <td class="tool-cell">{html.escape(f.tool_name)}</td>
            <td class="type-cell">{f.tool_type}</td>
            <td class="title-cell">{html.escape(f.title[:120])}</td>
            <td class="loc-cell">{loc_str}</td>
            <td>{cve_str}</td>
        </tr>
        <tr id="{row_id}" class="detail-row" style="display:none;">
            <td colspan="6">
                <div class="finding-detail">
                    <h4>Deskripsi</h4>
                    <p>{desc_escaped}</p>
                    <h4>Remediasi</h4>
                    <p>{remed_escaped}</p>
                    {'<h4>CWE</h4><p><code>' + html.escape(f.cwe_id) + '</code></p>' if f.cwe_id else ''}
                    {'<h4>Lokasi Detail</h4><pre>' + html.escape(json.dumps(f.location, indent=2)) + '</pre>' if f.location else ''}
                </div>
            </td>
        </tr>
        """

    chart_labels = json.dumps([k for k, v in stats.items() if v > 0])
    chart_data = json.dumps([v for k, v in stats.items() if v > 0])
    chart_colors = json.dumps([SEVERITY_COLORS[k] for k, v in stats.items() if v > 0])

    # Build tool summary cards
    tool_cards = ""
    for t, info in sorted(per_tool.items(), key=lambda x: -x[1]["critical"]):
        tool_cards += f"""
        <div class="tool-card">
            <div class="info">
                <h3>{html.escape(t)}</h3>
                <p>{info['count']} findings - {info['critical']} critical</p>
            </div>
        </div>"""

    html_content = f"""<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Security Scan Report - Vaject</title>
<style>
    :root {{
        --bg: #ffffff;
        --bg-card: #f8f9fa;
        --text: #212529;
        --text-secondary: #6c757d;
        --border: #dee2e6;
        --bg-hover: #e9ecef;
    }}
    @media (prefers-color-scheme: dark) {{
        :root {{
            --bg: #0d1117;
            --bg-card: #161b22;
            --text: #e6edf3;
            --text-secondary: #8b949e;
            --border: #30363d;
            --bg-hover: #1c2128;
        }}
    }}
    * {{ margin: 0; padding: 0; box-sizing: border-box; }}
    body {{
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        background: var(--bg); color: var(--text); line-height: 1.6; padding: 20px;
    }}
    .container {{ max-width: 1400px; margin: 0 auto; }}
    .header {{
        background: linear-gradient(135deg, #0d1117 0%, #161b22 100%);
        color: #e6edf3; padding: 40px; border-radius: 12px; margin-bottom: 24px;
        border: 1px solid #30363d;
    }}
    .header h1 {{ font-size: 28px; margin-bottom: 8px; }}
    .header .subtitle {{ color: #8b949e; font-size: 14px; }}
    .stats-grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; margin-bottom: 24px; }}
    .stat-card {{
        background: var(--bg-card); border: 1px solid var(--border); border-radius: 8px;
        padding: 20px; text-align: center; transition: transform 0.2s;
    }}
    .stat-card:hover {{ transform: translateY(-2px); }}
    .stat-card .number {{ font-size: 36px; font-weight: 700; line-height: 1.2; }}
    .stat-card .label {{ font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: var(--text-secondary); margin-top: 4px; }}
    .badge {{
        display: inline-block; padding: 2px 8px; border-radius: 4px;
        font-size: 11px; font-weight: 600; text-transform: uppercase;
        letter-spacing: 0.5px;
    }}
    .severity-critical {{ background: #dc3545; color: #fff; }}
    .severity-high {{ background: #fd7e14; color: #fff; }}
    .severity-medium {{ background: #ffc107; color: #000; }}
    .severity-low {{ background: #0dcaf0; color: #000; }}
    .severity-info {{ background: #6c757d; color: #fff; }}
    .severity-warning {{ background: #6f42c1; color: #fff; }}
    .tool-summary {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-bottom: 24px; }}
    .tool-card {{
        background: var(--bg-card); border: 1px solid var(--border); border-radius: 8px;
        padding: 16px; display: flex; align-items: center; gap: 12px;
    }}
    .tool-card .info h3 {{ font-size: 14px; margin-bottom: 2px; }}
    .tool-card .info p {{ font-size: 12px; color: var(--text-secondary); }}
    table {{ width: 100%; border-collapse: collapse; margin-top: 16px; }}
    th, td {{ padding: 10px 12px; text-align: left; border-bottom: 1px solid var(--border); font-size: 13px; }}
    th {{ background: var(--bg-card); font-weight: 600; position: sticky; top: 0; z-index: 10; }}
    .finding-row {{ cursor: pointer; transition: background 0.15s; }}
    .finding-row:hover {{ background: var(--bg-hover); }}
    .finding-row.severity-critical td {{ border-left: 3px solid #dc3545; }}
    .finding-row.severity-high td {{ border-left: 3px solid #fd7e14; }}
    .finding-row.severity-medium td {{ border-left: 3px solid #ffc107; }}
    .finding-row.severity-low td {{ border-left: 3px solid #0dcaf0; }}
    .finding-row.severity-info td {{ border-left: 3px solid #6c757d; }}
    .title-cell {{ max-width: 350px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }}
    .loc-cell {{ max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-family: monospace; font-size: 12px; }}
    .tool-cell {{ white-space: nowrap; }}
    .type-cell {{ white-space: nowrap; }}
    .detail-row td {{ padding: 0; }}
    .finding-detail {{ padding: 16px 24px; background: var(--bg-card); border: 1px solid var(--border); border-radius: 8px; margin: 8px; }}
    .finding-detail h4 {{ margin-top: 12px; margin-bottom: 4px; font-size: 13px; color: var(--text-secondary); }}
    .finding-detail p {{ font-size: 13px; line-height: 1.6; }}
    .finding-detail pre {{ background: #161b22; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; color: #e6edf3; margin-top: 4px; }}
    code {{ background: rgba(255,255,255,0.1); padding: 1px 4px; border-radius: 3px; font-size: 12px; }}
    .chart-container {{ background: var(--bg-card); border: 1px solid var(--border); border-radius: 8px; padding: 20px; margin-bottom: 24px; }}
    canvas {{ max-height: 200px; margin: 0 auto; display: block; }}
    .search-bar {{ margin-bottom: 16px; }}
    .search-bar input {{
        width: 100%; padding: 10px 16px; border: 1px solid var(--border); border-radius: 8px;
        background: var(--bg); color: var(--text); font-size: 14px;
    }}
    .search-bar input:focus {{ outline: none; border-color: #58a6ff; }}
    .footer {{ text-align: center; color: var(--text-secondary); font-size: 12px; margin-top: 40px; padding: 20px; border-top: 1px solid var(--border); }}
    @media (max-width: 768px) {{
        .stats-grid {{ grid-template-columns: repeat(2, 1fr); }}
        .tool-summary {{ grid-template-columns: 1fr 1fr; }}
        .loc-cell, .type-cell {{ display: none; }}
    }}
</style>
</head>
<body>
<div class="container">
    <div class="header">
        <h1>Security Scan Report</h1>
        <p>Vaject Portfolio - {html.escape(now)}</p>
        <p class="subtitle">Total: {total} findings - {stats.get('CRITICAL', 0)} Critical - {stats.get('HIGH', 0)} High - {stats.get('MEDIUM', 0)} Medium</p>
    </div>

    <div class="stats-grid">
        <div class="stat-card" style="border-left: 4px solid #dc3545;">
            <div class="number" style="color:#dc3545;">{stats.get('CRITICAL', 0)}</div>
            <div class="label">Critical</div>
        </div>
        <div class="stat-card" style="border-left: 4px solid #fd7e14;">
            <div class="number" style="color:#fd7e14;">{stats.get('HIGH', 0)}</div>
            <div class="label">High</div>
        </div>
        <div class="stat-card" style="border-left: 4px solid #ffc107;">
            <div class="number" style="color:#ffc107;">{stats.get('MEDIUM', 0)}</div>
            <div class="label">Medium</div>
        </div>
        <div class="stat-card" style="border-left: 4px solid #0dcaf0;">
            <div class="number" style="color:#0dcaf0;">{stats.get('LOW', 0)}</div>
            <div class="label">Low</div>
        </div>
        <div class="stat-card" style="border-left: 4px solid #6c757d;">
            <div class="number" style="color:#6c757d;">{stats.get('INFO', 0)}</div>
            <div class="label">Info</div>
        </div>
        <div class="stat-card" style="border-left: 4px solid #6f42c1;">
            <div class="number" style="color:#6f42c1;">{stats.get('WARNING', 0)}</div>
            <div class="label">Warning</div>
        </div>
    </div>

    <div class="tool-summary">
        {tool_cards}
    </div>

    <div class="chart-container">
        <h3 style="margin-bottom:12px;">Severity Distribution</h3>
        <canvas id="severityChart"></canvas>
    </div>

    <div class="search-bar">
        <input type="text" id="searchInput" placeholder="Cari berdasarkan severity, tool, judul, file..." onkeyup="filterTable()">
    </div>

    <div style="overflow-x:auto;">
    <table id="findingsTable">
        <thead>
            <tr>
                <th style="width:90px;">Severity</th>
                <th style="width:160px;">Tool</th>
                <th style="width:80px;">Type</th>
                <th>Title</th>
                <th style="width:250px;">Location</th>
                <th style="width:130px;">CVE</th>
            </tr>
        </thead>
        <tbody>
            {rows_html}
        </tbody>
    </table>
    </div>

    <div class="footer">
        <p>Generated by Vaject Security Pipeline - {html.escape(now)}</p>
        <p>Tools: Semgrep - Trivy - OWASP ZAP - npm audit - Gitleaks</p>
    </div>
</div>

<script>
    const labels = {chart_labels};
    const data = {chart_data};
    const colors = {chart_colors};
    const total = data.reduce((a,b) => a+b, 0);

    function drawChart() {{
        const canvas = document.getElementById('severityChart');
        if (!canvas || total === 0) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.parentElement.clientWidth;
        canvas.width = Math.min(w, 400);
        canvas.height = 200;
        const cx = canvas.width / 2, cy = 100, r = 80;

        let currentAngle = -Math.PI / 2;
        const sum = data.reduce((a,b) => a+b, 0);
        if (sum === 0) return;

        data.forEach((val, i) => {{
            const sliceAngle = (val / sum) * 2 * Math.PI;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, r, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();
            ctx.fillStyle = colors[i];
            ctx.fill();
            currentAngle += sliceAngle;
        }});

        ctx.beginPath();
        ctx.arc(cx, cy, 45, 0, 2 * Math.PI);
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg-card').trim() || '#161b22';
        ctx.fill();

        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || '#e6edf3';
        ctx.font = 'bold 24px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(total, cx, cy - 6);
        ctx.font = '11px sans-serif';
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim() || '#8b949e';
        ctx.fillText('findings', cx, cy + 18);
    }}

    function filterTable() {{
        const input = document.getElementById('searchInput').value.toLowerCase();
        const rows = document.querySelectorAll('.finding-row');
        rows.forEach(row => {{
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(input) ? '' : 'none';
        }});
    }}

    function toggleDetail(id) {{
        const row = document.getElementById(id);
        if (row) {{
            const isHidden = row.style.display === 'none' || row.style.display === '';
            row.style.display = isHidden ? 'table-row' : 'none';
        }}
    }}

    window.addEventListener('load', drawChart);
    window.addEventListener('resize', drawChart);
</script>
</body>
</html>"""

    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html_content)

    print(f"\n  HTML report: {output_path}")
    return output_path


def generate_github_summary(findings, output_path=None):
    """Generate GitHub Actions Job Summary (Markdown), sorted by severity."""
    sorted_findings = sorted(findings, key=lambda f: f.sort_key)
    total = len(sorted_findings)

    stats = {}
    for sev in ["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"]:
        stats[sev] = sum(1 for f in sorted_findings if f.severity == sev)

    lines = []
    lines.append("## Security Scan Summary\n")
    lines.append(f"**Total:** {total} findings | ")
    lines.append(f"**Critical:** {stats.get('CRITICAL', 0)} | ")
    lines.append(f"**High:** {stats.get('HIGH', 0)} | ")
    lines.append(f"**Medium:** {stats.get('MEDIUM', 0)} | ")
    lines.append(f"**Low:** {stats.get('LOW', 0)} | ")
    lines.append(f"**Info:** {stats.get('INFO', 0)}\n")
    lines.append("")

    lines.append("| Severity | Count |")
    lines.append("|----------|-------|")
    for sev in ["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"]:
        count = stats.get(sev, 0)
        lines.append(f"| {sev} | {count} |")
    lines.append("")

    per_tool = {}
    for f in sorted_findings:
        per_tool.setdefault(f.tool_name, {"count": 0, "critical": 0})
        per_tool[f.tool_name]["count"] += 1
        if f.severity == "CRITICAL":
            per_tool[f.tool_name]["critical"] += 1

    lines.append("### Per Tool\n")
    lines.append("| Tool | Findings | Critical |")
    lines.append("|------|----------|----------|")
    for t, info in sorted(per_tool.items(), key=lambda x: -x[1]["critical"]):
        lines.append(f"| {t} | {info['count']} | {info['critical']} |")
    lines.append("")

    fatal_findings = [f for f in sorted_findings if f.severity in ("CRITICAL", "HIGH")][:10]
    if fatal_findings:
        lines.append("### Top Findings (Paling Fatal)\n")
        lines.append("| # | Severity | Tool | Title | Location |")
        lines.append("|---|----------|------|-------|----------|")
        for i, f in enumerate(fatal_findings, 1):
            loc_str = ""
            if f.location.get("file"):
                loc_str = f"{f.location['file']}:{f.location.get('line', '?')}"
            elif f.location.get("url"):
                loc_str = f.location["url"]
            elif f.location.get("package"):
                loc_str = f.location["package"]
            title_escaped = f.title.replace("|", "\\|")[:100]
            lines.append(f"| {i} | {f.severity} | {f.tool_name} | {title_escaped} | {loc_str} |")
        lines.append("")

    lines.append("---")
    lines.append(f"_Generated by Vaject Security Pipeline - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}_")
    lines.append("")

    markdown = "\n".join(lines)

    if output_path:
        output_path = Path(output_path)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(markdown)
        print(f"  Markdown summary: {output_path}")

    github_summary = os.environ.get("GITHUB_STEP_SUMMARY")
    if github_summary:
        try:
            with open(github_summary, 'a', encoding='utf-8') as f:
                f.write(markdown)
            print(f"  GitHub Step Summary di-update")
        except Exception as e:
            print(f"  [WARN] Gagal update GITHUB_STEP_SUMMARY: {e}")

    return markdown


def generate_findings_json(findings, output_path):
    """Generate findings.json -- machine-readable."""
    data = {
        "generated_at": datetime.utcnow().isoformat() + "Z",
        "repository": os.environ.get("GITHUB_REPOSITORY", "unknown"),
        "sha": os.environ.get("GITHUB_SHA", ""),
        "total_findings": len(findings),
        "summary": {},
        "findings": [f.to_dict() for f in sorted(findings, key=lambda f: f.sort_key)],
    }

    for sev in ["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"]:
        data["summary"][sev] = sum(1 for f in findings if f.severity == sev)

    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)

    print(f"  JSON findings: {output_path}")
    return output_path


# ---------------------------------------------------------------------------
# MAIN
# ---------------------------------------------------------------------------

def main():
    import argparse

    parser = argparse.ArgumentParser(
        description="Generate unified security report dari hasil scan tools."
    )
    parser.add_argument(
        "--input-dir", "-i",
        default="./scan-results",
        help="Direktori yang berisi file hasil scan (.sarif, .json)"
    )
    parser.add_argument(
        "--output-dir", "-o",
        default="./reports",
        help="Direktori output untuk report"
    )
    parser.add_argument(
        "--github-summary", "-g",
        action="store_true",
        help="Update GITHUB_STEP_SUMMARY dengan markdown"
    )
    parser.add_argument(
        "--verbose", "-v",
        action="store_true",
        help="Tampilkan detail parsing"
    )

    args = parser.parse_args()

    print("=" * 60)
    print("  Security Report Generator")
    print("=" * 60)
    print(f"\nInput directory: {args.input_dir}")
    print(f"Output directory: {args.output_dir}")
    print()

    findings = auto_detect_and_parse(args.input_dir)

    if not findings:
        print("\n  Tidak ada findings ditemukan. Buat file scan kosong.")
        findings = [
            Finding(
                title="Tidak ada hasil scan - semua aman",
                severity="INFO",
                tool="unknown",
                description="Pipeline selesai tanpa menemukan vulnerability.",
            )
        ]

    print(f"\n  Total findings: {len(findings)}")

    stats = {}
    for f in findings:
        stats[f.severity] = stats.get(f.severity, 0) + 1
    print(f"     CRITICAL: {stats.get('CRITICAL', 0)}")
    print(f"     HIGH:     {stats.get('HIGH', 0)}")
    print(f"     MEDIUM:   {stats.get('MEDIUM', 0)}")
    print(f"     LOW:      {stats.get('LOW', 0)}")
    print(f"     INFO:     {stats.get('INFO', 0)}")

    print("\nGenerating reports...")
    output_dir = Path(args.output_dir)

    html_path = output_dir / "security-report.html"
    generate_html_report(findings, html_path)

    json_path = output_dir / "findings.json"
    generate_findings_json(findings, json_path)

    md_path = output_dir / "github-summary.md"
    generate_github_summary(findings, md_path)

    print(f"\n{'=' * 60}")
    print(f"  Report selesai!")
    print(f"     HTML:  {html_path}")
    print(f"     JSON:  {json_path}")
    print(f"     MD:    {md_path}")
    print(f"{'=' * 60}")

    critical_high = stats.get("CRITICAL", 0) + stats.get("HIGH", 0)
    if critical_high > 0:
        print(f"\n  Ditemukan {critical_high} CRITICAL/HIGH findings - pipeline gagal.")
        sys.exit(1)
    else:
        print(f"\n  Tidak ada CRITICAL/HIGH findings - pipeline lulus.")
        sys.exit(0)


if __name__ == "__main__":
    main()
