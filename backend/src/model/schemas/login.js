import { Model } from '../database.js';

/**
 * define all values in schema in string type
 * you must give the keyword in the value as sqlite3 keywords, otherwise you will get the error
 */

const schema = {
    id: {
        type: "integer",
        key: "primary key",
        others: "autoincrement"
    },
    email: {
        type: "text",
        others: "not null unique"
    },
    password: {
        type: "text",
        others: "not null"
    },
    created_at: {
        type: "datatime",
        others: "default CURRENT_TIMESTAMP"
    },
    updated_at: {
        type: "datatime",
        others: "default CURRENT_TIMESTAMP"
    }
}

const createIndex = { index: "idx_login_id_email", columns: ["id", "email"] }
export const login = new Model("login", schema, createIndex);