const { default: axios } = require("axios");

export const BASE_URL = "https://sparklink-qalk.onrender.com";

export const clientServer = axios.create({
  baseURL: BASE_URL,
});
