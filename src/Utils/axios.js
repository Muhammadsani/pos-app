import axios from "axios"
import storage from "local-storage"

const instance = axios.create({
    baseURL: process.env.REACT_APP_API_BASEURL,
    headers: {
        authorization: 'Bearer ' + storage.get('token') || ""
    }
})

export default instance