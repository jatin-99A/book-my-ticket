"use strict";
//  CREATE TABLE seats (
//      id SERIAL PRIMARY KEY,
//      name VARCHAR(255),
//      isbooked INT DEFAULT 0
//  );
// INSERT INTO seats (isbooked)
// SELECT 0 FROM generate_series(1, 20);
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = void 0;
const express_1 = __importDefault(require("express"));
const pg_1 = __importDefault(require("pg"));
const path_1 = require("path");
const url_1 = require("url");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const __dirname = (0, path_1.dirname)((0, url_1.fileURLToPath)(import.meta.url));
const port = process.env.PORT || 8080;
// Equivalent to mongoose connection
// Pool is nothing but group of connections
// If you pick one connection out of the pool and release it
// the pooler will keep that connection open for sometime to other clients to reuse
const pool = new pg_1.default.Pool({
    host: "localhost",
    port: 5433,
    user: "postgres",
    password: "postgres",
    database: "book_my_ticket_db",
    max: 20,
    connectionTimeoutMillis: 0,
    idleTimeoutMillis: 0,
});
const app = new express_1.default();
app.use((0, cors_1.default)());
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});
//get all seats
app.get("/seats", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield pool.query("select * from seats"); // equivalent to Seats.find() in mongoose
    res.send(result.rows);
}));
//book a seat give the seatId and your name
app.put("/:id/:name", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const name = req.params.name;
        // payment integration should be here
        // verify payment
        const conn = yield pool.connect(); // pick a connection from the pool
        //begin transaction
        // KEEP THE TRANSACTION AS SMALL AS POSSIBLE
        yield conn.query("BEGIN");
        //getting the row to make sure it is not booked
        /// $1 is a variable which we are passing in the array as the second parameter of query function,
        // Why do we use $1? -> this is to avoid SQL INJECTION
        // (If you do ${id} directly in the query string,
        // then it can be manipulated by the user to execute malicious SQL code)
        const sql = "SELECT * FROM seats where id = $1 and isbooked = 0 FOR UPDATE";
        const result = yield conn.query(sql, [id]);
        //if no rows found then the operation should fail can't book
        // This shows we Do not have the current seat available for booking
        if (result.rowCount === 0) {
            res.send({ error: "Seat already booked" });
            return;
        }
        //if we get the row, we are safe to update
        const sqlU = "update seats set isbooked = 1, name = $2 where id = $1";
        const updateResult = yield conn.query(sqlU, [id, name]); // Again to avoid SQL INJECTION we are using $1 and $2 as placeholders
        //end transaction by committing
        yield conn.query("COMMIT");
        conn.release(); // release the connection back to the pool (so we do not keep the connection open unnecessarily)
        res.send(updateResult);
    }
    catch (ex) {
        console.log(ex);
        res.status(500).send("Internal error");
        yield conn.query("ROLLBACK");
        conn.release();
    }
}));
const startServer = () => {
    app.listen(port, () => console.log("Server starting on port: " + port));
};
exports.startServer = startServer;
exports.default = app;
