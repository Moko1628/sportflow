import json

workflow = {
  "name": "SportFlow - Collecte Sportive IA (90% Afrique / 10% International)",
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [
            {
              "field": "cronExpression",
              "expression": "0 6,14 * * *"
            }
          ]
        }
      },
      "name": "Cron Quotidien (6h & 14h)",
      "type": "n8n-nodes-base.scheduleTrigger",
      "typeVersion": 1.2,
      "position": [200, 300]
    },
    {
      "parameters": {
        "url": "https://www.africatopsports.com/feed/",
        "options": {}
      },
      "name": "RSS Africa Top Sports",
      "type": "n8n-nodes-base.rssFeedRead",
      "typeVersion": 1.1,
      "position": [480, 60]
    },
    {
      "parameters": {
        "url": "https://www.rfi.fr/fr/sports/rss",
        "options": {}
      },
      "name": "RSS RFI Sport",
      "type": "n8n-nodes-base.rssFeedRead",
      "typeVersion": 1.1,
      "position": [480, 200]
    },
    {
      "parameters": {
        "url": "https://sports.abidjan.net/",
        "sendHeaders": True,
        "headerParameters": {
          "parameters": [
            {
              "name": "User-Agent",
              "value": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) SportFlowBot/1.0"
            }
          ]
        },
        "options": {}
      },
      "name": "HTTP Sports Abidjan",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [480, 340]
    },
    {
      "parameters": {
        "extractionValues": {
          "values": [
            {
              "key": "titre",
              "cssSelector": "a[href*='/actualites/']",
              "returnValue": "text"
            },
            {
              "key": "link",
              "cssSelector": "a[href*='/actualites/']",
              "returnValue": "attribute",
              "attribute": "href"
            }
          ]
        },
        "options": {}
      },
      "name": "HTML Extract Sports Abidjan",
      "type": "n8n-nodes-base.html",
      "typeVersion": 1.2,
      "position": [700, 340]
    },
    {
      "parameters": {
        "url": "https://www.fratmat.info/sports",
        "sendHeaders": True,
        "headerParameters": {
          "parameters": [
            {
              "name": "User-Agent",
              "value": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) SportFlowBot/1.0"
            }
          ]
        },
        "options": {}
      },
      "name": "HTTP FratMat Sports",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [480, 480]
    },
    {
      "parameters": {
        "extractionValues": {
          "values": [
            {
              "key": "titre",
              "cssSelector": "h2 a, a[href*='/article/']",
              "returnValue": "text"
            },
            {
              "key": "link",
              "cssSelector": "h2 a, a[href*='/article/']",
              "returnValue": "attribute",
              "attribute": "href"
            }
          ]
        },
        "options": {}
      },
      "name": "HTML Extract FratMat",
      "type": "n8n-nodes-base.html",
      "typeVersion": 1.2,
      "position": [700, 480]
    },
    {
      "parameters": {
        "url": "https://sportnewsafrica.com/",
        "sendHeaders": True,
        "headerParameters": {
          "parameters": [
            {
              "name": "User-Agent",
              "value": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) SportFlowBot/1.0"
            }
          ]
        },
        "options": {}
      },
      "name": "HTTP Sport News Africa",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [480, 620]
    },
    {
      "parameters": {
        "extractionValues": {
          "values": [
            {
              "key": "titre",
              "cssSelector": "a[href*='/articles/']",
              "returnValue": "text"
            },
            {
              "key": "link",
              "cssSelector": "a[href*='/articles/']",
              "returnValue": "attribute",
              "attribute": "href"
            }
          ]
        },
        "options": {}
      },
      "name": "HTML Extract Sport News Africa",
      "type": "n8n-nodes-base.html",
      "typeVersion": 1.2,
      "position": [700, 620]
    },
    {
      "parameters": {
        "mode": "combine",
        "combinationMode": "multiplex",
        "options": {}
      },
      "name": "Fusionner Sources",
      "type": "n8n-nodes-base.merge",
      "typeVersion": 3,
      "position": [960, 300]
    },
    {
      "parameters": {
        "jsCode": "/* Normalisation, Déduplication & Règle 90/10 */\nconst items = $input.all();\nconst now = new Date();\nconst normalized = [];\nconst seenUrls = new Set();\n\nfor (const item of items) {\n  const json = item.json;\n  const title = json.titre || json.title || '';\n  let link = json.link || json.url || '';\n  const pubDate = new Date(json.isoDate || json.pubDate || now);\n  const content = json.contentSnippet || json.content || json.summary || title;\n  let imageUrl = json.image_url || json.enclosure?.url || json.image?.url || null;\n\n  if (!title || !link || title.length < 10) continue;\n\n  let sourceNom = 'SportFlow';\n  let origine = 'local';\n\n  if (link.includes('abidjan.net') || link.startsWith('/actualites/')) {\n    sourceNom = 'Sports Abidjan';\n    origine = 'local';\n    if (link.startsWith('/')) link = 'https://sports.abidjan.net' + link;\n  } else if (link.includes('fratmat') || link.startsWith('/article/')) {\n    sourceNom = 'FratMat Sports';\n    origine = 'local';\n    if (link.startsWith('/')) link = 'https://www.fratmat.info' + link;\n  } else if (link.includes('sportnewsafrica') || link.startsWith('/articles/')) {\n    sourceNom = 'Sport News Africa';\n    origine = 'afrique';\n    if (link.startsWith('/')) link = 'https://sportnewsafrica.com' + link;\n  } else if (link.includes('africatopsports')) {\n    sourceNom = 'Africa Top Sports';\n    origine = 'afrique';\n  } else if (link.includes('rfi')) {\n    sourceNom = 'RFI Sport';\n    origine = 'international';\n\n    const keywords = ['afrique', 'africain', 'can', 'cameroun', 'côte d\\'ivoire', 'senegal', 'maroc', 'nigeria', 'algérie', 'ghana', 'osimhen', 'salah', 'hakimi', 'mane'];\n    const lowerText = (title + ' ' + content).toLowerCase();\n    if (!keywords.some(k => lowerText.includes(k))) continue;\n  } else {\n    origine = 'local';\n  }\n\n  if (seenUrls.has(link)) continue;\n  seenUrls.add(link);\n\n  normalized.push({\n    json: {\n      titre_original: title.trim(),\n      source_url: link.trim(),\n      source_nom: sourceNom,\n      resume_original: content.trim(),\n      image_url: imageUrl,\n      created_at: pubDate.toISOString(),\n      origine: origine\n    }\n  });\n}\n\nconst localOrAfrique = normalized.filter(i => i.json.origine !== 'international');\nconst international = normalized.filter(i => i.json.origine === 'international');\nconst targetIntCount = Math.ceil(localOrAfrique.length * 0.1);\n\nreturn [...localOrAfrique, ...international.slice(0, targetIntCount)];"
      },
      "name": "Filtrage & Normalisation",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [1180, 300]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "http://localhost:20128/v1/chat/completions",
        "sendHeaders": True,
        "headerParameters": {
          "parameters": [
            {
              "name": "Content-Type",
              "value": "application/json"
            }
          ]
        },
        "sendBody": True,
        "specifyBody": "json",
        "jsonBody": "={\n  \"model\": \"default\",\n  \"messages\": [\n    {\n      \"role\": \"system\",\n      \"content\": \"Tu es un journaliste sportif professionnel rédigeant pour le site SportFlow. Ton rôle est de réécrire et paraphraser complètement l'article source en français. Ne fais jamais de copie mot pour mot. Fournis un titre accrocheur mais factuel, un résumé de 3-4 lignes pour le champ 'resume', un contenu développé de 150 à 250 mots pour le champ 'contenu', et détermine la catégorie exacte parmi : Football, Basketball, Athlétisme, Sport local, Autre. Réponds STRICTEMENT au format JSON valide avec les clés exactes: titre, resume, contenu, categorie.\"\n    },\n    {\n      \"role\": \"user\",\n      \"content\": \"Titre original: {{$json.titre_original}}\\nSource: {{$json.source_nom}}\\nContenu source: {{$json.resume_original}}\"\n    }\n  ],\n  \"temperature\": 0.7\n}",
        "options": {}
      },
      "name": "Génération IA (OmniRoute)",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [1400, 300]
    },
    {
      "parameters": {
        "jsCode": "const items = $input.all();\nconst parsedItems = [];\n\nfor (let i = 0; i < items.length; i++) {\n  try {\n    const rawAiResponse = items[i].json.choices[0].message.content;\n    const cleanedJson = rawAiResponse.replace(/```json/g, '').replace(/```/g, '').trim();\n    const aiData = JSON.parse(cleanedJson);\n    \n    const originalItem = $('Filtrage & Normalisation').all()[i].json;\n\n    parsedItems.push({\n      json: {\n        titre: aiData.titre || originalItem.titre_original,\n        resume: aiData.resume || originalItem.resume_original,\n        contenu: aiData.contenu || originalItem.resume_original,\n        source_url: originalItem.source_url,\n        source_nom: originalItem.source_nom,\n        categorie: aiData.categorie || 'Football',\n        image_url: originalItem.image_url,\n        created_at: originalItem.created_at,\n        origine: originalItem.origine\n      }\n    });\n  } catch (err) {\n    console.error('Erreur parsing JSON IA:', err);\n  }\n}\n\nreturn parsedItems;"
      },
      "name": "Parser Réponse IA",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [1620, 300]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "={{ $env.SUPABASE_URL }}/rest/v1/articles",
        "sendHeaders": True,
        "headerParameters": {
          "parameters": [
            {
              "name": "apikey",
              "value": "={{ $env.SUPABASE_SERVICE_KEY }}"
            },
            {
              "name": "Authorization",
              "value": "Bearer {{$env.SUPABASE_SERVICE_KEY}}"
            },
            {
              "name": "Content-Type",
              "value": "application/json"
            },
            {
              "name": "Prefer",
              "value": "resolution=ignore-duplicates"
            }
          ]
        },
        "sendBody": True,
        "specifyBody": "json",
        "jsonBody": "={{ JSON.stringify($json) }}",
        "options": {}
      },
      "name": "Insertion Supabase",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [1840, 300]
    }
  ],
  "connections": {
    "Cron Quotidien (6h & 14h)": {
      "main": [
        [
          { "node": "RSS Africa Top Sports", "type": "main", "index": 0 },
          { "node": "RSS RFI Sport", "type": "main", "index": 0 },
          { "node": "HTTP Sports Abidjan", "type": "main", "index": 0 },
          { "node": "HTTP FratMat Sports", "type": "main", "index": 0 },
          { "node": "HTTP Sport News Africa", "type": "main", "index": 0 }
        ]
      ]
    },
    "HTTP Sports Abidjan": {
      "main": [
        [ { "node": "HTML Extract Sports Abidjan", "type": "main", "index": 0 } ]
      ]
    },
    "HTTP FratMat Sports": {
      "main": [
        [ { "node": "HTML Extract FratMat", "type": "main", "index": 0 } ]
      ]
    },
    "HTTP Sport News Africa": {
      "main": [
        [ { "node": "HTML Extract Sport News Africa", "type": "main", "index": 0 } ]
      ]
    },
    "RSS Africa Top Sports": {
      "main": [
        [ { "node": "Fusionner Sources", "type": "main", "index": 0 } ]
      ]
    },
    "RSS RFI Sport": {
      "main": [
        [ { "node": "Fusionner Sources", "type": "main", "index": 1 } ]
      ]
    },
    "HTML Extract Sports Abidjan": {
      "main": [
        [ { "node": "Fusionner Sources", "type": "main", "index": 2 } ]
      ]
    },
    "HTML Extract FratMat": {
      "main": [
        [ { "node": "Fusionner Sources", "type": "main", "index": 3 } ]
      ]
    },
    "HTML Extract Sport News Africa": {
      "main": [
        [ { "node": "Fusionner Sources", "type": "main", "index": 4 } ]
      ]
    },
    "Fusionner Sources": {
      "main": [
        [ { "node": "Filtrage & Normalisation", "type": "main", "index": 0 } ]
      ]
    },
    "Filtrage & Normalisation": {
      "main": [
        [ { "node": "Génération IA (OmniRoute)", "type": "main", "index": 0 } ]
      ]
    },
    "Génération IA (OmniRoute)": {
      "main": [
        [ { "node": "Parser Réponse IA", "type": "main", "index": 0 } ]
      ]
    },
    "Parser Réponse IA": {
      "main": [
        [ { "node": "Insertion Supabase", "type": "main", "index": 0 } ]
      ]
    }
  },
  "pinData": {}
}

with open('/home/moko1628/projects/sportflow/sportflow_workflow.json', 'w') as f:
    json.dump(workflow, f, indent=2)

print("Workflow successfully generated and saved.")
