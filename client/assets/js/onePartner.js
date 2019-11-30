$(document).ready(function() {
  const { token, power } = testLogin("onePartner");
  const start = () => {
    renderSiteBar();
  };
  start();

  const tableNode = $("table");

  const tableConfig = {
    paging: false,
    searching: false
  };
  $("#new-4").on("click", function() {
    $("#a4-modal #modal").modal("show");
  });
  const driverTable = tableNode.DataTable(tableConfig);

  const datePicker = $("#date-picker input");
  datePicker
    .datepicker({
      format: "mm-yyyy",
      startView: "months",
      minViewMode: "months"
    })
    .datepicker("setDate", "now");

  new Vue({
    el: "#a4-modal",
    data: {
      H_: {
        title: "اضافة دفعة"
      }
    }
  });
});
