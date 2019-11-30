$(document).ready(function() {
  const { token, power } = testLogin("driver");

  const allDriverTableInit = () => {
    const tableNode = $("#all-drivers-table");

    const tableConfig = {
      paging: false,
      searching: false,
      columnDefs: [{ orderable: false, targets: 1 }]
    };
    const driverTable = tableNode.DataTable(tableConfig);

    getDriver({
      success({ data }) {
        data.forEach(({ address, name, phone, _id }) => {
          driverTable.row
            .add([
              `<a href="./oneDriver.html?_id=${_id}">${name}</a>`,
              renderPhone(phone),
              address
            ])
            .draw(false);
        });
      }
    });
  };
  const accountInit = () => {
    const tableNode = $("#account-table");
    const tableConfig = {
      paging: false,
      searching: false
    };
    const accountTable = tableNode.DataTable(tableConfig);
  };

  const headerInit = () => {
    const datePicker = $("#date-picker input");
    const dataPickerNode = $("#date-picker");

    $("#driver_tap").on("click", () => {
      dataPickerNode.addClass("hide");
    });

    $("#account_tap").on("click", () => {
      dataPickerNode.removeClass("hide");
    });

    let _DATE_ = new Date();
    datePicker
      .datepicker({
        format: "mm-yyyy",
        startView: "months",
        minViewMode: "months"
      })
      .datepicker("setDate", "now");
    _DATE_ = datePicker.val();
    datePicker.on("change", function(e) {});
  };

  const start = () => {
    renderSiteBar();
    headerInit();

    setTimeout(allDriverTableInit, 0);
    setTimeout(accountInit, 0);
  };
  start();
});
