# shoraq-extension

The chrome extension for ShoRaq.

## How to properly install RethinkDB, install the API dependencies, etc.

Assuming OSX/Linux, but the Windows instructions aren't that much different.
I recommend installing using Homebrew if you're on OSX.
You must have Node.js installed.

https://www.rethinkdb.com/docs/install/ <-- Install RethinkDB

1. Go into the API directory. (cd shoraq-extension/api)
2. Start RethinkDB in this directory. (rethinkdb)
3. RethinkDB will run using the "rethinkdb_data" directory as it's source. This contains our schema and existing documents.
4. Open a new terminal and change into our api directory (cd shoraq-extension/api).
5. Install all dependencies for the API server. (npm install)
6. This is important: build our database, tables, and existing products. (node build.js)
7. After all dependencies are installed, you're ready to run the API server locally.
8. Run the server using the start script defined in "package.json". (npm start)

## Important Notes
 - localhost:8080 will bring you to the Rethink admin panel.
 - Don't run RethinkDB in a folder other than specified; it'll make a new "rethinkdb_data" in that folder and run using that as it's source.