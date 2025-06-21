Make sure Node is installed and can be ran in your terminal or command prompt.
To test, type "node -v" and it should show the installed node version

What this does:
- Extracts and formats song data from Zetaraku's Maimai masterlist
- Creates a separate song record for the same song, but different charts. (e.g. Fragrance is 14.2 & 14.6 respectively, this would create 2 song records for each chart that you can use for whatever purpose)

What is this for?
- Tournaments, data analysis I guess?

How to use it?
- Go to config.js to set minimum and maximum level constant
- In your terminal, run "node extractSongs.js"
- This should generate a "songData.json" file or whatever you put on your "Output" in the config