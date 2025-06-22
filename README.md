To use this, run "npm install" 

What this does:
- Generates custom fields to be passed to a different web service via WebSockets.
- Allows exporting of fields and importing them back

Roadmap:
- Better UI
- Boolean fields (to trigger stuff like roulettes, etc.)

Creating JSON for your dropdown
1. Create your own <anyName>.json
2. Follow either of the two formats:
For simple dropdowns (e.g. player names):
[
    {
        "id":"Dropdown Value"
    }
]
Complex dropdowns (e.g. Song Select):
[
    {
        "id":"Song 1"
        "values": {
            "difficulty": 123,
            "artist": "DECO*27"
        },
        "id":"Song 2"
        "values": {
            "difficulty": 456,
            "artist": "sasakure*UK"
        },
    }
]
This will populate the dropdown with the IDs, but will send everything inside "values" on the websocket. This is useful if you want to select a song and transmit the complete song information or for other use-cases.
3. On your field, select "dropdown" and click on the Folder icon at the right most of the field and upload your JSON file.

Creating your own field layout:
1. Too lazy to explain this tbh so just checkout the structure of testField.json