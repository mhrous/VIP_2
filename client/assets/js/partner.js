$(document).ready(function() {
  const { token, power } = testLogin("partner");

  const allPartnerTableInit = () => {
    const tableNode = $("#all-partner-table");

    const tableConfig = {
      paging: false,
      searching: false,
      columnDefs: [{ orderable: false, targets: 1 }]
    };
    const driverTable = tableNode.DataTable(tableConfig);

    getPartner({
      success({ data }) {
        data.forEach(({ address, name, phone, _id }) => {
          driverTable.row
            .add([
              `<a href="./onePartner.html?_id=${_id}">${name}</a>`,
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

  const header = () => {
    const datePicker = $("#date-picker input");
    const dataPickerNode = $("#date-picker");

    $("#partner_tab").on("click", () => {
      dataPickerNode.addClass("hide");
    });

    $("#account_tap").on("click", () => {
      dataPickerNode.removeClass("hide");
    });

    let _DATE_ = new Date();

    datePicker.on("change", function(e) {});
  };

  const start = () => {
    renderSiteBar();
    header();
    setTimeout(allPartnerTableInit, 0);
    setTimeout(accountInit, 0);
  };

  start();
});
