import {getCsrfToken} from "./utils";
import axios from 'axios';

const client = axios.create({
  headers: {"X-CSRFToken" : getCsrfToken()}
});

export const get = async (url) => {
  return client.get(url);
};

export const post = async (url, data) => {
  return client.post(url, data);
};
