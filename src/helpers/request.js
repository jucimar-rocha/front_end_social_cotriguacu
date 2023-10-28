import axios from 'axios';

axios.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default class HttpRequest {
  URL_BASE = import.meta.env.VITE_BASE_URL;

  get(url, parametros, retorno, retornoErro, retornoFinally) {
    this.request(url, axios.get, parametros, retorno, retornoErro, retornoFinally)
  }

  post(url, parametros) {
    return axios.post(this.URL_BASE + url, parametros, this.getHeaderConfig());
  }


  put(url, parametros, retorno, retornoErro, retornoFinally) {
    this.request(url, axios.put, parametros, retorno, retornoErro, retornoFinally)
  }

  delete(url, parametros, retorno, retornoErro, retornoFinally) {
    this.request(url, axios.delete, parametros, retorno, retornoErro, retornoFinally)
  }

  request(url, methodHttpFunction, parametros, retorno, retornoErro, retornoFinally) {
    let headerConfig = this.getHeaderConfig();
    parametros = parametros || {};

    methodHttpFunction(this.URL_BASE + url, parametros, headerConfig)
      .then(retorno)
      .catch(function (error) {
        if (retornoErro && typeof retornoErro == 'function') retornoErro(error);

      })
      .finally(retornoFinally);
  }

  getHeaderConfig() {
    let token = sessionStorage.getItem('token');

    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json;charset=utf-8',
      }
    };
  }
}