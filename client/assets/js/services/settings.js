const endPoint = "http://localhost:8888/api";

const headers = {};

const getMe = ({ success }) => {
  $.ajax({
    type: "GET",
    url: `${endPoint}/user/me`,
    success,
    headers
  });
};

const putMe = ({ data, success, error }) => {
  $.ajax({
    type: "PUT",
    url: `${endPoint}/user/me`,
    success,
    headers,
    data,
    error
  });
};

const InfoDriver = ({ success }) => {
  $.ajax({
    type: "GET",
    url: `${endPoint}/reports/info/driver`,
    success,
    headers
  });
};

const InfoPartner = ({ success }) => {
  $.ajax({
    type: "GET",
    url: `${endPoint}/reports/info/partner`,
    success,
    headers
  });
};

const InfoCar = ({ success }) => {
  $.ajax({
    type: "GET",
    url: `${endPoint}/reports/info/car`,
    success,
    headers
  });
};
const getPartnerAndDriverName = ({ success }) => {
  $.ajax({
    type: "GET",
    url: `${endPoint}/user/name`,
    success,
    headers
  });
};
const accountALLPartner = ({ success, y, m }) => {
  $.ajax({
    type: "GET",
    url: `${endPoint}/reports/account/all/partner?y=${y}&m=${m}`,
    success,
    headers
  });
};

const accountDriver = ({ success, driver, y, m }) => {
  $.ajax({
    type: "GET",
    url: `${endPoint}/reports/account/driver?y=${y}&m=${m}&d=${driver}`,
    success,
    headers
  });
};
