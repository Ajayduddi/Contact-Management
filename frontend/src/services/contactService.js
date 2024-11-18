import axios from 'axios'
import { Api } from '../constants/constants'

const api = axios.create({
    baseURL: Api.BASE_URL,
    withCredentials: true,
    headers: {
        'Authorization': localStorage.getItem('token')
    },
});

class contactService {

    static instance = null;

    // create a single ton instance
    constructor() {
        if (contactService.instance) {
            return contactService.instance;
        }

        contactService.instance = this;
    }

    // method to get the instance
    static getInstance() {
        if (!contactService.instance) {
            contactService.instance = new contactService();
        }
        return contactService.instance;
    }

    // Method to get all contacts
    getAllContacts = async (data) => {
        try {
            const res = await api.get(Api.API_ENDPOINT.CONTACTS, {
                params: {
                    search : data
                }
            });
            return res.data; // Return only the data part of the response
        } catch (err) {
           throw new Error(JSON.stringify(err.response.data.message))
        }
    };

    // Method to add a new contact
    addContact = async (data) => {
        try {
            const res = await api.post(Api.API_ENDPOINT.CONTACTS, data);
            return res.data; // Return only the data part of the response
        } catch (err) {
            console.log(err.response.data.message)
            throw new Error(JSON.stringify(err.response.data.message))
        }
    };

    // Method to update a contact
    updateContact = async (id, data) => {
        try {
            const res = await api.put(`${Api.API_ENDPOINT.CONTACTS}/${id}`, data);
            return res.data; // Return only the data part of the response
        } catch (err) {
            throw new Error(JSON.stringify(err.response.data.message))
        }
    };

    // Method to delete a contact
    deleteContact = async (id) => {
        try {
            const res = await api.delete(`${Api.API_ENDPOINT.CONTACTS}/${id}`);
            return res.data; // Return only the data part of the response
        } catch (err) {
            throw new Error(JSON.stringify(err.response.data.message))
        }
    };

}

export default contactService.getInstance();