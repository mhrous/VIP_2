const endPoint = "http://localhost:8888/api/user";

const headers = {};

const getPartner = ({ success }) => {
    $.ajax({
      type: "GET",
      url: `${endPoint}?power=P`,
      success,
      headers
    });
  };
  