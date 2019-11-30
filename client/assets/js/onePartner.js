$(document).ready(function() {
  const { token, power } = testLogin("onePartner");
  const __DATA__ = {
    date: moment().format("MM-YYYY"),
    payment: [],
    account: [],
    repairing: []
  };
  const MainDate = new Vue({
    el: "#MainDate",
    data: {
      date: new Date(),
      options: {
        format: "MM-YYYY ",
        useCurrent: true
      }
    },
    watch: {
      date(val) {
        let [m, y] = val.split("-");
        m = parseInt(m);
        y = parseInt(y);

        if (val !== __DATA__.date) {
          getData({
            m,
            y,
            success({ data }) {
              console.log(data);
            }
          });
        }
      }
    },
    mounted() {
      let [m, y] = __DATA__.date.split("-");
      m = parseInt(m);
      y = parseInt(y);
      getData({
        m,
        y,
        success({ data }) {
          console.log(data);
        }
      });
    }
  });
  const tableConfig = {
    paging: false,
    searching: false
  };
  const accountTable = $("#account-table").DataTable(tableConfig);
  const repairingTable = $("#repairing-table").DataTable(tableConfig);
  const paymentTable = $("#payment-table").DataTable(tableConfig);

  const initAccount = () => {};
  const initRepairing = () => {};
  const initPayment = () => {};

  $("#new-4").on("click", function() {
    $("#a4-modal #modal").modal("show");
  });

  new Vue({
    el: "#a4-modal",
    data: {
      H_: {
        title: "اضافة دفعة"
      }
    }
  });

  const start = () => {
    renderSiteBar();
    initAccount();
    initRepairing();
    initPayment();
  };
  start();
});
