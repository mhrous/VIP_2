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

const addPayment = ({ data, success, error }) => {
  $.ajax({
    type: "POST",
    url: `${endPoint}/payment`,
    data,
    success,
    error,
    headers
  });
};

const deletePayment = ({ id, success }) => {
  $.ajax({
    type: "DELETE",
    url: `${endPoint}/payment/${id}`,
    success,
    headers
  });
};

const putPayment = ({ id, data, success, error }) => {
  $.ajax({
    type: "PUT",
    url: `${endPoint}/payment/${id}`,
    success,
    data,
    error,

    headers
  });
};
