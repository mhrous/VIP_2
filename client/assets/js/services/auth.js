const endPoint = "http://localhost:8888";


const logIn = ({ data, success, error }) => {
  $.ajax({
    type: "POST",
    url: `${endPoint}/signin`,
    data,
    success,
    error
  });
};
