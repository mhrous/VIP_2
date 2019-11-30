const endPoint = "http://localhost:8888/api";
const headers = {};
const id = window.location.search.split("=")[1];

const getData = ({ success, m, y }) => {
  $.ajax({
    type: "GET",
    url: `${endPoint}/page/one_partner${window.location.search}&m=${m}&y=${y}`,
    success,
    headers
  });
};
