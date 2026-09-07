import json

with open('/home/moko1628/projects/sportflow/sportflow_workflow.json', 'r') as f:
    wf = json.load(f)

# Find and inspect current nodes
names = [n['name'] for n in wf['nodes']]
print("Current nodes:", names)

# Replace the HTTP Request "Insertion Supabase" node with the official n8n Supabase node
for node in wf['nodes']:
    if node['name'] == "Insertion Supabase":
        node['parameters'] = {
            "resource": "row",
            "operation": "create",
            "tableId": "={{ 'articles' }}",
            "dataToSend": "autoMapInputData",
            "inputsToIgnore": ""
        }
        node['type'] = "n8n-nodes-base.supabase"
        node['typeVersion'] = 1
        node['credentials'] = {
            "supabaseApi": {
                "id": "KDvVZeEbWxAqxcTG",
                "name": "Supabase account"
            }
        }

with open('/home/moko1628/projects/sportflow/sportflow_workflow.json', 'w') as f:
    json.dump(wf, f, indent=2)

print("\nWorkflow updated. Insertion node is now official n8n Supabase using existing 'Supabase account' credential.")
print("JSON still valid check below.")
