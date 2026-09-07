import json

with open('/home/moko1628/projects/sportflow/sportflow_workflow.json', 'r') as f:
    wf = json.load(f)

# Ensure ID is present for n8n import
wf['id'] = "sportflow-collect-ai-1"

with open('/home/moko1628/projects/sportflow/sportflow_workflow.json', 'w') as f:
    json.dump(wf, f, indent=2)

print("Added ID to workflow.")
