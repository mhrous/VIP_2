const endPoint = "http://localhost:8888/api/user";

const headers = {};

const getDriver = ({ success }) => {
  $.ajax({
    type: "GET",
    url: `${endPoint}`,
    success,
    headers
  });
};
