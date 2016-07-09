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
6. Change directories to db_utils, and run build.js to build our RethinkDB database/tables/documents (cd db_utils && node build.js).
7. After all dependencies are installed and the db is set up, you're ready to run the API server locally.
8. Run the server using the start script defined in "package.json". (npm start)

### db_utils ; important notes
- build.js builds the database. Only run this when RethinkDB is already running.
- teardown.js removes the rethinkdb_data folder, wiping the database. Only run this when RethinkDB is not running.
- products.json is our catalog of products. If you want to start mocking out products, this is where you start.
- The general process, for now, is to wipe the database and rebuild it as needed.