import axios from 'axios';
const BASE_QUERY = process.env.REACT_APP_API_HOST;
const HttpServices = () => {
  return {
    get: route => {
      return axios
        .get(BASE_QUERY + route)
        .then(response => {
          if (response && response.status === 200) {
            return response.data;
          } else {
            console.log(response.status);
          }
        })
        .catch(error => console.log(error));
    },
    command: (route, payload) => {
      return axios
        .post(BASE_QUERY + route, payload)
        .then(response => {
          if (response && response.status === 200) {
            return response.data;
          } else {
            console.log(response.status);
          }
        })
        .catch(error => console.log(error));
    },
    commandPut: (route, payload) => {
      return axios
        .put(BASE_QUERY + route, payload)
        .then(response => {
          if (response && response.status === 200) {
            return response.data;
          } else {
            console.log(response.status);
          }
        })
        .catch(error => console.log(error));
    },
    commandDelete: (route, payload) => {
      return axios
        .delete(BASE_QUERY + route, payload)
        .then(response => {
          if (response && response.status === 200) {
            return response.data;
          } else {
            console.log(response.status);
          }
        })
        .catch(error => console.log(error));
    },
  };
};

export default HttpServices;
