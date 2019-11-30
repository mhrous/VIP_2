$(document).ready(function() {
  const { token, power } = testLogin("car");
  let vueObj = null;
  let __ALL_CAR__ = [];

  const allCarTableInit = () => {
    const tableNode = $("#all-cars-table");

    const tableConfig = {
      paging: false,
      searching: false,
      columnDefs: [
        {
          orderable: false,
          targets: [4]
        },
        {
          targets: [3, 1, 0],
          width: "70px"
        }
      ]
    };
    if (power == "admin") {
      $("#car-table-header").append("<th></th>");
      tableConfig.columnDefs.push({
        width: "50px",
        orderable: false,
        targets: 5
      });
    }
    const carTable = tableNode.DataTable(tableConfig);

    $("body").on("click", ".remove-table", function() {
      const id = $(this).data("id");
      const row = carTable.row("#" + $(this).data("id"));
      const index = __ALL_CAR__.findIndex(e => e._id == id);
      swal(
        {
          title: `هل تريد حذف ${__ALL_CAR__[index].name}`,
          type: "info",
          showCancelButton: true,
          confirmButtonClass: "btn-danger",
          confirmButtonText: "نعم",
          cancelButtonText: "لا"
        },
        function(isConfirm) {
          if (isConfirm) {
            deleteCar({
              id,
              success() {
                swal("حذف", "", "success");
                row.remove().draw();
                __ALL_CAR__ = [
                  ...__ALL_CAR__.slice(0, index),
                  ...__ALL_CAR__.slice(index + 1)
                ];
              }
            });
          }
        }
      );
    });

    $("body").on("click", ".edit-table", function() {
      const id = $(this).data("id");
      const data = __ALL_CAR__.find(e => e._id == id);

      const partners = [];
      data.partners.forEach(({ partner, value, _id }) => {
        partners.push({ partner: partner._id, value, _id });
      });

      $("#car-modal #modal").modal("show");
      vueObj.H_.title = "تعديل سيارة";
      vueObj.H_.edit = true;
      vueObj.H_.okBtnTitle = "تعديل";
      vueObj.H_.id = id;
      vueObj.name = data.name;
      vueObj.number = data.number;
      vueObj.driver = data.driver._id;
      vueObj.expensesMax = data.expensesMax;
      vueObj.partners = partners;
    });

    const renderPartner = obj => {
      let str = "<div>";
      obj.forEach(e => {
        str += `<div class="row mb-3">
                    ${e.partner.name} (${e.value})
                </div> `;
      });
      str += "</div>";

      return str;
    };

    const addToCarTable = obj => {
      __ALL_CAR__ = [...__ALL_CAR__, obj];

      const valueRow = [
        obj.name,
        obj.number,
        obj.driver.name,
        obj.expensesMax,
        renderPartner(obj.partners)
      ];
      if (power === "admin") valueRow.push(renderTableAction(obj._id));
      const newRow = carTable.row
        .add(valueRow)
        .draw(false)
        .node();
      $(newRow).attr("id", obj._id);
    };

    const editFromCarTable = ({ id, data }) => {
      __ALL_CAR__ = __ALL_CAR__.map(e => (e._id == id ? data : e));
      const row = carTable.row("#" + id);

      const valueRow = [
        data.name,
        data.number,
        data.driver.name,
        data.expensesMax,
        renderPartner(data.partners)
      ];
      if (power === "admin") valueRow.push(renderTableAction(data._id));

      const rowNode = row.data(valueRow).draw(false);
    };

    getCar({
      success({ data }) {
        data.forEach(e => {
          addToCarTable(e);
        });
      }
    });

    return { addToTable: addToCarTable, editFromTable: editFromCarTable };
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

    $("#car_tap").on("click", () => {
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

  const modalInit = ({ addToTable, editFromTable }) => {
    if (power != "admin") {
      $("#add-new-car-section").addClass("hide");
      return;
    }

    const validCar = obj => {
      if (
        !obj.name ||
        !obj.number ||
        !obj.driver ||
        !obj.expensesMax ||
        obj.partners.length == 0
      ) {
        return false;
      }
      for (let e of obj.partners) {
        if (!e.partner || !e.value) {
          return false;
        }
      }

      return true;
    };

    vueObj = new Vue({
      el: "#car-modal #modal",
      data: {
        H_: {
          title: "",
          okBtnTitle: "",
          edit: null,
          driverName: [],
          partnerName: []
        },

        name: "",
        number: "",
        driver: "",
        expensesMax: 0,
        partners: [{ partner: "", value: 0, _id: new Date().getTime() }]
      },
      methods: {
        ok() {
          const obj = JSON.parse(JSON.stringify(this.$data));
          delete obj.H_;

          if (!validCar(obj)) {
            swal({
              title: "بعض الحقول ناقصة",
              type: "warning",
              confirmButtonText: "اعد التعبئة",
              closeOnConfirm: false
            });
            return;
          }

          if (this.H_.edit) {
            const id = this.H_.id;
            putCar({
              id,
              data: obj,
              success({ data }) {
                editFromTable({ data, id });
              },
              error(e) {
                swal({
                  title: e.responseJSON.error,
                  type: "info",
                  confirmButtonText: "اعد التعبئة",
                  closeOnConfirm: false
                });
                return;
              }
            });
          } else {
            addCar({
              data: obj,
              success({ data }) {
                addToTable(data);
              },
              error(e) {
                swal({
                  title: e.responseJSON.error,
                  type: "info",
                  confirmButtonText: "اعد التعبئة",
                  closeOnConfirm: false
                });
                return;
              }
            });
          }
          $("#car-modal #modal").modal("hide");
        },
        addPartner() {
          this.partners = [
            ...this.partners,
            { partner: "", value: 0, _id: new Date().getTime() }
          ];
        },
        removePartner(_id) {
          this.partners = this.partners.filter(e => e._id !== _id);
        }
      }
    });

    const newCarBtn = $("#new-car");
    const modalNode = $("#car-modal #modal");
    newCarBtn.on("click", () => {
      modalNode.modal("show");
      vueObj.H_.title = "اضافة سيارة";
      vueObj.H_.edit = false;
      vueObj.H_.okBtnTitle = "اضافة";
      vueObj.name = "";
      vueObj.number = "";
      vueObj.driver = "";
      vueObj.expensesMax = 0;
      vueObj.partners = [{ partner: "", value: 0, _id: new Date().getTime() }];
    });
  };

  const start = () => {
    header();
    renderSiteBar();
    const { addToTable, editFromTable } = allCarTableInit();
    modalInit({ addToTable, editFromTable });
    accountInit();

    getPartnerAndDriverName({
      success({ data }) {
        data.forEach(e => {
          if (e.power == "D")
            vueObj.H_.driverName = [...vueObj.H_.driverName, e];
          else if (e.power == "P")
            vueObj.H_.partnerName = [...vueObj.H_.partnerName, e];
        });
      }
    });
  };

  start();
});
