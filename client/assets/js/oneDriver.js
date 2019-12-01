$(document).ready(function() {
  const { token, power } = testLogin("oneDriver");
  let user, MainDate;
  const __DATA__ = {
    cars: [],
    partners: [],
    payment: [],
    expenses: []
  };

  const initPayment = () => {
    let vueObj;
    const tableNode = $("#payment-table");
    const tableConfig = {
      paging: false,
      searching: false
    };
    const paymentTable = tableNode.DataTable(tableConfig);

    $("body").on("click", "#payment-table .remove-table", function() {
      const id = $(this).data("id");
      const row = paymentTable.row("#" + $(this).data("id"));
      const index = __DATA__.payment.findIndex(e => e._id == id);
      swal(
        {
          title: `  هل تريد الغاء الدفعة `,
          type: "info",
          showCancelButton: true,
          confirmButtonClass: "btn-danger",
          confirmButtonText: "نعم",
          cancelButtonText: "لا"
        },
        function(isConfirm) {
          if (isConfirm) {
            deletePayment({
              id,
              success() {
                swal("حذف", "", "success");
                row.remove().draw();
                __DATA__.payment = [
                  ...__DATA__.payment.slice(0, index),
                  ...__DATA__.payment.slice(index + 1)
                ];
              }
            });
          }
        }
      );
    });
    $("body").on("click", "#payment-table .edit-table", function() {
      const id = $(this).data("id");
      const data = __DATA__.payment.find(e => e._id == id);

      $("#payment-modal #modal").modal("show");
      vueObj.H_.title = "تعديل  الدفعة";
      vueObj.H_.edit = true;
      vueObj.H_.okBtnTitle = "تعديل";
      vueObj.H_.id = id;
      vueObj.date = data.date;
      vueObj.amount = data.amount;
    });

    const addToPaymentTable = obj => {
      __DATA__.payment = [...__DATA__.payment, obj];
      const newRow = paymentTable.row
        .add([
          moment(obj.date).format("YYYY-MM-DD"),
          obj.amount,
          renderTableAction(obj._id)
        ])
        .draw(false)
        .node();
      $(newRow).attr("id", obj._id);
    };

    const editFromPaymentTable = ({ id, data }) => {
      __DATA__.payment = __DATA__.payment.map(e => (e._id == id ? data : e));
      const index = __DATA__.payment.findIndex(e => e._id == id);

      const row = paymentTable.row("#" + id);
      if (
        new Date(data.date).getMonth() == new Date(MainDate.date).getMonth()
      ) {
        const rowNode = row
          .data([
            moment(data.date).format("YYYY-MM-DD"),
            data.amount,
            renderTableAction(data._id)
          ])
          .draw(false);
      } else {
        row.remove().draw();
        __DATA__.payment = [
          ...__DATA__.payment.slice(0, index),
          ...__DATA__.payment.slice(index + 1)
        ];
      }
    };
    const clearTable = () => paymentTable.clear().draw();

    const modalInit = () => {
      const validUser = obj => obj.amount && obj.date;

      vueObj = new Vue({
        el: "#payment-modal #modal",
        data: {
          H_: {
            title: "",
            okBtnTitle: "",
            edit: null,

            options: {
              format: "YYYY-MM-DD",
              useCurrent: true
            }
          },

          date: null,
          amount: null
        },
        methods: {
          ok() {
            const obj = TO_JSON(this.$data);
            delete obj.H_;
            obj.date = moment(obj.date).format("YYYY-MM-DD");

            if (!validUser(obj)) {
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

              putPayment({
                id,
                data: obj,
                success({ data }) {
                  editFromPaymentTable({ data, id });
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
              obj.user = user.user._id;

              addPayment({
                data: obj,
                success({ data }) {
                  if (
                    new Date(data.date).getMonth() ==
                    new Date(MainDate.date).getMonth()
                  )
                    addToPaymentTable(data);
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
            $("#payment-modal #modal").modal("hide");
          }
        }
      });
      const newPaymentBtn = $("#new-payment");
      const modalNode = $("#payment-modal #modal");
      newPaymentBtn.on("click", () => {
        modalNode.modal("show");
        vueObj.H_.title = "اضافة دفعة";
        vueObj.H_.edit = false;
        vueObj.H_.okBtnTitle = "اضافة";
        vueObj.date = moment().format("YYYY-MM-DD");
        vueObj.amount = null;
      });
    };
    modalInit();
    return {
      addPaymentToTable: addToPaymentTable,
      clearPaymentTable: clearTable
    };
  };

  const initExpenses = () => {
    const TRUE = "<p style='color:#5e72e4; text-align: center;'>&#10004;</p>";
    const FALSE = "<p style='color:#f5365c; text-align: center;'>&#10008;</p>";
    const renderPartnerLink = ({ _id, name }) => `
    <a href="./onePartner.html?_id=${_id}">${name}</a>
    `;
    let vueObj;
    const tableNode = $("#expenses-table");
    const tableConfig = {
      paging: false,
      searching: false,
      columnDefs: [
        { targets: [0, 5], width: "75px" },
        { targets: [2, 3, 4, 6], width: "50px" }
      ]
    };
    const expensesTable = tableNode.DataTable(tableConfig);

    $("body").on("click", "#expenses-table .remove-table", function() {
      const id = $(this).data("id");
      const row = expensesTable.row("#" + $(this).data("id"));
      const index = __DATA__.expenses.findIndex(e => e._id == id);
      swal(
        {
          title: `  هل تريد الغاء المصروف `,
          type: "info",
          showCancelButton: true,
          confirmButtonClass: "btn-danger",
          confirmButtonText: "نعم",
          cancelButtonText: "لا"
        },
        function(isConfirm) {
          if (isConfirm) {
            deleteExpenses({
              id,
              success() {
                swal("حذف", "", "success");
                row.remove().draw();
                __DATA__.expenses = [
                  ...__DATA__.expenses.slice(0, index),
                  ...__DATA__.expenses.slice(index + 1)
                ];
              }
            });
          }
        }
      );
    });
    $("body").on("click", "#expenses-table .edit-table", function() {
      const id = $(this).data("id");
      const data = __DATA__.expenses.find(e => e._id == id);

      $("#expenses-modal #modal").modal("show");
      vueObj.H_.title = "تعديل  المصروف";
      vueObj.H_.edit = true;
      vueObj.H_.okBtnTitle = "تعديل";
      vueObj.H_.partner = __DATA__.partners;
      vueObj.H_.id = id;
      vueObj.date = data.date;
      vueObj.amount = data.amount;
      vueObj.reason = data.reason;
      vueObj.onCar = data.onCar;
      vueObj.onDriver = data.onDriver;
      vueObj.onPartner = data.onPartner;
      vueObj.partner = data.partner._id;
    });

    const addToExpensesTable = obj => {
      __DATA__.expenses = [...__DATA__.expenses, obj];
      const newRow = expensesTable.row
        .add([
          moment(obj.date).format("YYYY-MM-DD"),
          obj.reason,
          obj.amount,
          obj.onCar ? TRUE : FALSE,
          obj.onDriver ? TRUE : FALSE,
          obj.onPartner ? renderPartnerLink(obj.partner) : FALSE,
          renderTableAction(obj._id)
        ])
        .draw(false)
        .node();
      $(newRow).attr("id", obj._id);
    };
    const editFromExpensesTable = ({ id, data }) => {
      __DATA__.expenses = __DATA__.expenses.map(e => (e._id == id ? data : e));
      const index = __DATA__.expenses.findIndex(e => e._id == id);

      const row = expensesTable.row("#" + id);
      if (
        new Date(data.date).getMonth() == new Date(MainDate.date).getMonth()
      ) {
        const rowNode = row
          .data([
            moment(data.date).format("YYYY-MM-DD"),
            data.reason,
            data.amount,
            data.onCar ? TRUE : FALSE,
            data.onDriver ? TRUE : FALSE,
            data.onPartner ? renderPartnerLink(data.partner) : FALSE,
            renderTableAction(data._id)
          ])
          .draw(false);
      } else {
        row.remove().draw();
        __DATA__.expenses = [
          ...__DATA__.expenses.slice(0, index),
          ...__DATA__.expenses.slice(index + 1)
        ];
      }
    };
    const clearTable = () => {
      expensesTable.clear().draw();
      __DATA__.expenses = [];
    };

    const modalInit = () => {
      const validExpenses = obj =>
        obj.amount &&
        obj.date &&
        (obj.onPartner || obj.onDriver || obj.onCar) &&
        ((obj.onPartner && obj.partner) || (!obj.onPartner && !obj.partner));

      vueObj = new Vue({
        el: "#expenses-modal #modal",
        data: {
          H_: {
            title: "",
            okBtnTitle: "",
            edit: null,
            partner: __DATA__.partners,
            options: {
              format: "YYYY-MM-DD",
              useCurrent: true
            }
          },

          date: null,
          amount: null,
          reason: "",
          onCar: false,
          onDriver: false,
          onPartner: false,
          partner: null
        },
        methods: {
          ok() {
            const obj = TO_JSON(this.$data);
            if (!obj.partner) delete obj.partner;
            obj.date = moment(obj.date).format("YYYY-MM-DD");
            delete obj.H_;

            if (!validExpenses(obj)) {
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

              putExpenses({
                id,
                data: obj,
                success({ data }) {
                  editFromExpensesTable({ data, id });
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
              obj.driver = user.user._id;
              obj.car = user.car._id;

              addExpenses({
                data: obj,
                success({ data }) {
                  if (
                    new Date(data.date).getMonth() ==
                    new Date(MainDate.date).getMonth()
                  )
                    addToExpensesTable(data);
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
            $("#expenses-modal #modal").modal("hide");
          }
        }
      });
      const newExpensesBtn = $("#new-expenses");
      const modalNode = $("#expenses-modal #modal");
      newExpensesBtn.on("click", () => {
        modalNode.modal("show");
        vueObj.H_.title = "اضافة مصروف";
        vueObj.H_.edit = false;
        vueObj.H_.partner = __DATA__.partners;
        vueObj.H_.okBtnTitle = "اضافة";
        vueObj.date = moment().format("YYYY-MM-DD");
        vueObj.amount = null;
        vueObj.reason = "";
        vueObj.onCar = false;
        vueObj.onDriver = false;
        vueObj.onPartner = false;
        vueObj.partner = null;
      });
    };
    modalInit();
    return {
      addExpensesToTable: addToExpensesTable,
      clearExpensesTable: clearTable
    };
  };

  const start = () => {
    renderSiteBar();
    const { addExpensesToTable, clearExpensesTable } = initExpenses();
    const { addPaymentToTable, clearPaymentTable } = initPayment();

    user = new Vue({
      el: "#user",
      data: {
        user: { name: "" },
        car: null
      }
    });
    MainDate = new Vue({
      el: "#MainDate",
      data: {
        date: moment(new Date()).format("YYYY-MM"),
        options: {
          format: "YYYY-MM",
          useCurrent: true
        }
      },
      watch: {
        date(val) {
          let [y, m] = val.split("-");
          m = parseInt(m);
          y = parseInt(y);

          getData({
            m,
            y,
            success({ data: { payment, expenses } }) {
              clearPaymentTable();
              clearExpensesTable();
              for (let p of payment) addPaymentToTable(p);
              for (let p of expenses) addExpensesToTable(p);
            }
          });
        }
      },
      mounted() {
        let [y, m] = this.date.split("-");
        m = parseInt(m);
        y = parseInt(y);
        getData({
          m,
          y,
          success({ data: { payment, expenses } }) {
            for (let p of expenses) addExpensesToTable(p);
            for (let p of payment) addPaymentToTable(p);
          }
        });
        console.log("9999999999999999");

        getDataConst({
          success({ data: { car, partners } }) {
            user.user = car.driver;
            console.log(car, "9999999999999999");
            __DATA__.cars = car;
            __DATA__.partners = partners;

            user.car = car;
          }
        });
      }
    });
  };
  start();
});
