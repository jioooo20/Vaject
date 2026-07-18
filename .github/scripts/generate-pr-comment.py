#!/usr/bin/env python3
"""Generate PR comment from findings.json for GitHub Actions."""

import argparse
import json
import os
import sys

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--run-id', required=True, help='Workflow run ID for artifact URL')
    parser.add_argument('--repo', default=os.environ.get('GITHUB_REPOSITORY', ''),
                        help='GitHub repository (owner/name)')
    args = parser.parse_args()

    findings_path = '/tmp/report/findings.json'

    if not os.path.exists(findings_path):
        print('comment=Tidak ada hasil scan yang tersedia.')
        sys.exit(0)

    with open(findings_path) as f:
        data = json.load(f)

    summary = data.get('summary', {})
    total = data.get('total_findings', 0)
    findings = data.get('findings', [])

    # Build comment
    comment_lines = ['## Security Scan Report', '']
    comment_lines.append('| Severity | Count |')
    comment_lines.append('|----------|-------|')

    for sev in ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO']:
        cnt = summary.get(sev, 0)
        comment_lines.append(f'| {sev} | {cnt} |')

    comment_lines.append('')
    comment_lines.append(f'**Total:** {total} findings')
    comment_lines.append('')

    # Top 5 most fatal
    fatal = [f for f in findings if f['severity'] in ('CRITICAL', 'HIGH')][:5]
    if fatal:
        comment_lines.append('### Top Findings (Most Fatal)')
        comment_lines.append('')
        for i, f in enumerate(fatal, 1):
            loc = f.get('location', {})
            loc_str = loc.get('file', '') or loc.get('url', '') or loc.get('package', '') or ''
            line = loc.get('line', '')
            if line:
                loc_str += f':{line}'
            comment_lines.append(f'{i}. **[{f["severity"]}]** {f["tool_name"]} - {f["title"][:100]}')
            comment_lines.append(f'   _{loc_str}_')
            comment_lines.append('')

    comment_lines.append('---')
    comment_lines.append(f'[Download HTML Report](https://github.com/{args.repo}/actions/runs/{args.run_id}/artifacts)')

    comment = '\n'.join(comment_lines)

    # Escape for GitHub Actions
    comment = comment.replace('%', '%25').replace('\n', '%0A').replace('\r', '%0D')
    print(f'comment={comment}')

if __name__ == '__main__':
    main()
