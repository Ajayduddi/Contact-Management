import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

// Sets the execution mode to verbose 
const sqlite = sqlite3.verbose();

// Get the current file path
const __filename = fileURLToPath(import.meta.url);

// Get the directory name of the current file
const __dirname = path.dirname(__filename);

// Define the path to the SQLite database file
const dbPath = path.join(__dirname, '../../database.sqlite');

// creating the database or connect to existing the database
const DB = new sqlite.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.log("Error while connecting the database: ", err.message);
        return;
    }
    console.log(" Databse is created or connected successfully");
});

class Model {

    name = "";
    feilds = "";

    constructor(name, schema, indxces = "") {
        const { sql, fields } = this.getsql(schema);
        console.log('Fields:', fields);

        const query = `CREATE TABLE IF NOT EXISTS ${name} (${sql})`;

        try {

            DB.run(query, (err) => {
                if (err) {
                    console.log('Error creating table:', err.message);
                    return;
                }
                this.name = name;
                this.feilds = fields;
                console.log("Table created successfully");

                indxces != "" ? this.createIndex(indxces?.index, indxces?.columns) : "";
            });
        } catch (error) {
            console.log('Error:', error.message);
        }
    }

    // create a index on one or more columns of table
    createIndex(index, column) {
        const columns = column instanceof Array ? column.join(",") : column;
        const query = `CREATE INDEX IF NOT EXISTS ${index} on ${this.name} (${columns})`;
        console.log(query);
        try {
            DB.exec(query, (err) => {
                if (err) {
                    console.log('Error while creating index:', err.message);
                    return;
                }
                console.log("Index Created SuccessFully");
            })
        } catch (error) {
            console.log('Error:', error.message);
        }
    }


    // get all data from the table
    getAll(search, fun) {
        try {
            console.log("getting all data");
            const f = this.feilds.split(",").map((key) => `${key} like ?`).join(" or ")
            const val = this.feilds.split(",").map(() => `${search}%`)
            const sql = val[0] == '' ? `select * from ${this.name}` : `select * from ${this.name} where ${f}`
            val[0] == '' ? DB.all(sql, fun) : DB.all(sql,val, fun);
        } catch (error) {
            console.log(error.message);
            throw new Error(`Something went wrong with the database : ${error.message}`);
        }
    }

    // add data to the table
    add(data, fun) {
        try {
            console.log("adding data");
            // Get values and field names
            const values = this.getValuesSql(data);
            const placeholders = Object.keys(data).map(() => "?").join(", "); // Generate placeholders like ?, ?, ?
            const sql = `INSERT INTO ${this.name} (${this.feilds}) VALUES (${placeholders})`;

            DB.run(sql, values, fun);

        } catch (error) {
            console.log(error.message);
            throw new Error(`Something went wrong with the database : ${error.message}`);

        }
    }

    // update data in the teble
    update(data, id, fun) {
        console.log("update");
        try {
            let { feilds, val } = this.getUpdateValueSql(data);
            let sql = `update ${this.name} set ${feilds} where id = ?`;
            val.push(id);
            DB.run(sql, val, fun);
        } catch (error) {
            console.log(error.message);
            throw new Error(`Something went wrong with the database : ${error.message}`);
        }
    }

    // delete row from the table
    delete(id, fun) {
        console.log("delete");
        try {
            let sql = `delete from ${this.name} where id = ?`
            DB.run(sql, id, fun);
        } catch (error) {
            console.log(error.message);
            throw new Error(`Something went wrong with the database : ${error.message}`);
        }
    }

    // run custom sql
    run(sql, fun) {
        try {
            DB.run(sql, fun);
        } catch (error) {
            console.log(error.message);
            throw new Error(`Something went wrong with the database : ${err.message}`);
        }
    }

    // get row by id
    get(sql, data, fun) {
        try {
            DB.get(sql, data, fun);
        } catch (error) {
            console.log(error.message);
            throw new Error(`Something went wrong with the database : ${err.message}`);
        }
    }

    getsql(schema) {
        let sql = "";
        let fields = "";
        for (let [key, value] of Object.entries(schema)) {
            const columnDefinition = Object.values(value).join(" ");
            sql += `${key} ${columnDefinition}, `;
            if (key !== 'created_at' && key !== 'updated_at' && key !== 'id') {
                fields += `${key},`;
            }
        }

        // Remove trailing commas
        sql = sql.trim().replace(/,$/, '');
        fields = fields.trim().replace(/,$/, '');

        return { sql, fields };
    }


    getValuesSql(data) {
        let val = Object.values(data)
        return val;
    }

    getUpdateValueSql(data) {
        let feilds = Object.keys(data).map((key) => `${key} = ?`).join(",");
        let val = Object.values(data);

        return { feilds, val }
    }
}

export { Model };