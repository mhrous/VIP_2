$(document).ready(function() {
  const { token, power } = testLogin("oneDriver");

  const start = () => {
    renderSiteBar();
  };
  start();

  const tableNode = $("table");

  const tableConfig = {
    paging: false,
    searching: false
  };
  const driverTable = tableNode.DataTable(tableConfig);

 
  $("#new-travel").on("click", function() {
    $("#travel-modal #modal").modal("show");
  });

  $("#new-3").on("click", function() {
    $("#a3-modal #modal").modal("show");
  });
  $("#new-4").on("click", function() {
    $("#a4-modal #modal").modal("show");
  });
  new Vue({
    el: "#travel-modal",
    data: {
      H_: {
        title: "اضافة رحلة"
      },
      t: []
    },
    methods: {
      addT() {
        this.t = [
          ...this.t,

          {
            id: new Date().getTime(),
            name: "",
            number: "",
            l: "",
            from: "",
            value: ""
          }
        ];
      },

      removeT(id) {
        this.t = this.t.filter(e => e.id !== id);
      }
    }
  });

  new Vue({
    el: "#a3-modal",
    data: {
      H_: {
        title: "اضافة رحلة"
      }
    }
  });

  new Vue({
    el: "#a4-modal",
    data: {
      H_: {
        title: "اضافة دفعة"
      }
    }
  });
});

new Vue({
  el: "#lkkkkkkkkkkkkkk",
  data: {
    date: null,
    options: {
      format: "MM/YYYY ",
      useCurrent: true,
      showClear: true,
      showClose: true
    }
  }
});
