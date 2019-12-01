$(document).ready(function() {
  const { token, power } = testLogin();
  let vueObjModal = null;

  const modalInit = () => {
    const validUser = obj => {
      if (!obj.name || !obj.address || !obj.phone || !obj.password) {
        return false;
      }
      for (let { value, phoneType } of obj.phone) {
        if (!value || !phoneType) {
          return false;
        }
      }

      return true;
    };

    vueObjModal = new Vue({
      el: "#card",
      data: {
        H_: { showPassword: false, showNewPassword: false },
        name: "",
        address: "",
        phone: [],
        password: "",
        newpPassword: ""
      },
      methods: {
        newPhone() {
          this.phone = [
            ...this.phone,
            { phoneType: "", value: "", _id: new Date().getTime() }
          ];
        },
        removePhon(_id) {
          this.phone = this.phone.filter(e => e._id !== _id);
        },
        ok() {
          const obj = JSON.parse(JSON.stringify(this.$data));
          delete obj.H_;
          if (!obj.password) {
            swal({
              title: "يجب ادخال كلمة المرور",
              type: "warning",
              confirmButtonText: "اعد التعبئة",
              closeOnConfirm: false
            });
            return;
          }
          if (!validUser(obj)) {
            swal({
              title: "بعض الحقول ناقصة",
              type: "warning",
              confirmButtonText: "اعد التعبئة",
              closeOnConfirm: false
            });
            return;
          }

          putMe({
            data: obj,
            success: ({ data }) => {
              this.name = data.name;
              this.address = data.address;
              this.phone = data.phone || [];
              this.password = "";
              this.newpPassword = "";
              this.H_ = { showPassword: false, showNewPassword: false };
              swal({
                title: "تم التغير بنجاح",
                type: "success",
                confirmButtonText: "اغلاق",
                closeOnConfirm: false
              });
              return;
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
      }
    });
  };
  const reportsInit = () => {
    const vueObjReports = new Vue({
      el: "#reports",
      data: {
        years: [2019, 2020, 2021, 2022, 2023, 2024, 2025],
        months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        ySelect: new Date().getFullYear(),
        mSelect: new Date().getMonth() + 1,
        driver: [{ name: "الكل", _id: 0 }],
        partner: [{ name: "الكل", _id: 0 }],
        sDriver: 0,
        sPartner: 0
      },
      methods: {
        reset() {
          this.ySelect = new Date().getFullYear();
          this.methods = new Date().getMonth() + 1;
          this.sDriver = 0;
          this.sPartner = 0;
        },
        printAccountDriver() {
          accountDriver({
            success({ data }) {
              data.forEach(d => {
                pdfMake.createPdf(d.doc).download(d.fileName);
              });
            },
            y: this.ySelect,
            m: this.mSelect,
            driver: this.sDriver
          });
        },
        printInfoDriver() {
          InfoDriver({
            success({ data }) {
              pdfMake.createPdf(data.doc).download(data.fileName);
            }
          });
        },
        printInfoPartner() {
          InfoPartner({
            success({ data }) {
              pdfMake.createPdf(data.doc).download(data.fileName);
            }
          });
        },
        printInfoCar() {
          InfoCar({
            success({ data }) {
              pdfMake.createPdf(data.doc).download(data.fileName);
            }
          });
        },
        printAccountInfoCar() {
          InfoAccountCar({
            success({ data }) {
              pdfMake.createPdf(data.doc).download(data.fileName);
            }
          });
        },
        PrintAccountALLPartner() {
          accountALLPartner({
            success({ data }) {
              pdfMake.createPdf(data.doc).download(data.fileName);
            },
            y: this.ySelect,
            m: this.mSelect
          });
        }
      }
    });
    getPartnerAndDriverName({
      success({ data }) {
        data.forEach(e => {
          if (e.power == "D")
            vueObjReports.driver = [...vueObjReports.driver, e];
          else if (e.power == "P")
            vueObjReports.partner = [...vueObjReports.partner, e];
        });
      }
    });
  };

  const start = () => {
    renderSiteBar();
    getMe({
      success({ data }) {
        vueObjModal.name = data.name;
        vueObjModal.address = data.address;
        vueObjModal.phone = data.phone || [];
      }
    });
    modalInit();
    reportsInit();
  };

  start();
});
