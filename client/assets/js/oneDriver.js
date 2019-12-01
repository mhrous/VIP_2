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

            if (!validUser(obj)) {
              swal({
                title: "بعض الحقول ناقصة",
                type: "warning",
                confirmButtonText: "اعد التعبئة",
                closeOnConfirm: false
              });
              return;
            }
            console.log(obj);
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
    const tableNode = $("#expenses-table");
    const tableConfig = {
      paging: false,
      searching: false
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
      vueObj.H_.id = id;
      vueObj.date = data.date;
      vueObj.amount = data.amount;
    });

    const addToExpensesTable = obj => {
      __DATA__.expenses = [...__DATA__.expenses, obj];
      const newRow = expensesTable.row
        .add([
          moment(obj.date).format("YYYY-MM-DD"),
          obj._for,
          obj.amount,
          obj._onCar,
          obj._onDriver,
          obj._onPartner,
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
            data._for,
            data.amount,
            data._onCar,
            data._onDriver,
            data._onPartner,
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
    const clearTable = () => expensesTable.clear().draw();

    const modalInit = () => {
      const validExpenses = obj => obj.amount && obj.date;

      vueObj = new Vue({
        el: "#expenses-modal #modal",
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

            if (!validUser(obj)) {
              swal({
                title: "بعض الحقول ناقصة",
                type: "warning",
                confirmButtonText: "اعد التعبئة",
                closeOnConfirm: false
              });
              return;
            }
            console.log(obj);
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
      const newPaymentBtn = $("#new-expenses");
      const modalNode = $("#expenses-modal #modal");
      newPaymentBtn.on("click", () => {
        modalNode.modal("show");
        vueObj.H_.title = "اضافة مصروف";
        vueObj.H_.edit = false;
        vueObj.H_.okBtnTitle = "اضافة";
        vueObj.date = moment().format("YYYY-MM-DD");
        vueObj.amount = null;
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
            success({ data }) {
              clearPaymentTable();
              clearExpensesTable();
              __DATA__.payment = data.payment || [];
              __DATA__.expenses = data.expenses || [];

              for (let p of __DATA__.payment) addPaymentToTable(p);
              for (let p of __DATA__.expenses) addExpensesToTable(p);
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
          success({ data }) {
            __DATA__.payment = data.payment || [];
            __DATA__.expenses = data.expenses || [];
            for (let p of __DATA__.expenses) addExpensesToTable(p);
            for (let p of __DATA__.payment) addPaymentToTable(p);
          }
        });
        getDataConst({
          success({ data: { user: _rUser, cars, partners } }) {
            user.user = _rUser;
            __DATA__.cars = cars;
            __DATA__.partners = partners;
            console.log(__DATA__);

            const car = cars.find(e => e.driver === _rUser._id);

            user.car = car;
          }
        });
      }
    });
  };
  start();
});
