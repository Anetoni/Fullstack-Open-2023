import axios from "axios";
const baseUrl = 'http://localhost:3001/api/persons'

const getAll = () => {
    const request = axios.get(baseUrl)
    console.log('request ', request)
    return request.then(response => response.data)
}

const add = newPerson => {
    const request = axios.post(baseUrl, newPerson)
    console.log('request ', request)
    return request.then(response => response.data)
}

const remove = (id) => {
    console.log(`${baseUrl}/${id}`)
    const request = axios.delete(`${baseUrl}/${id}`)
    return request.then(response => response.data)
}

const update = (id, newPerson) => {
    const request = axios.put(`${baseUrl}/${id}`, newPerson)
    return request.then(response => response.data)
}

const exportObject = {
    getAll,
    add,
    remove,
    update
}

export default exportObject