import { Model } from '../database.js';

/**
 * define all values in schema in string type
 * you must give the keyword in the value as sqlite3 keywords, otherwise you will get the error
 */
const schema = {
    id: {
        type: "integer",
        key: "primary key",
        others : "autoincrement"
    },
    firstname: {
        type: "text",
        others: "not null"
    },
    lastname: {
        type: "text",
        others: "not null",
    },
    email: {
        type: "text",
        others: "not null unique"
    },
    phone_no: {
        text: "integer",
        others: "not null"
    },
    company: {
        type: "text",
        others: "not null"
    },
    job_title: {
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
    },

}

const createIndex = { index:"idx_user_id_FirstName", columns:["id", "firstname"] }
export const user =new Model("user", schema, createIndex);
