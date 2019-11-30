import User from "../user/user.model";
import Car from "../car/car.model";

const reverseStr = str =>
  str
    .split(" ")
    .reverse()
    .join(" ")
    .trim();

const stayleTable = {
  header: {
    bold: true,
    fontSize: 12,
    color: "#fff",
    fillColor: "#172b4d",
    margin: [7, 7, 7, 7],
    alignment: "center"
  },
  odd: { margin: [0, 4, 0, 4], alignment: "right" },
  even: {
    fillColor: "#ddd",
    margin: [0, 4, 0, 4],
    alignment: "right"
  },
  title: {
    color: "#172b4d",
    fontSize: 20,
    alignment: "center"
  }
};
const pdfFile = {
  pageSize: "A4",

  content: [],
  styles: stayleTable,
  defaultStyle: { font: "Tajawal" }
};

export const InfoDriver = async (req, res) => {
  try {
    const { power } = req.user;
    if (power != "admin") {
      return res.status(401).end();
    }
    const users = await User.find({ power: "D", active: true })
      .select("name phone address")
      .lean()
      .exec();
    const data = {};
    data.fileName = "معلومات السائقين";
    data.doc = { ...pdfFile };
    data.doc.content = [
      {
        headerRows: 1,
        table: {
          widths: ["*", "*", "auto"],
          body: [
            [
              { text: "العنوان", style: "header" },
              { text: "الهاتف", style: "header" },
              { text: "الاسم", style: "header" }
            ]
          ]
        }
      }
    ];
    users.forEach((e, i) => {
      const style = (i + 1) % 2 ? "odd" : "even";
      let phoneString = "";
      e.phone.forEach(p => {
        phoneString += `${p.value}s : ${reverseStr(p.phoneType)}\n`;
      });
      data.doc.content[0].table.body.push([
        { text: reverseStr(e.address), style },
        { text: phoneString, style },
        { text: reverseStr(e.name), style }
      ]);
    });

    return res.status(200).json({ data });
  } catch (e) {
    return res.status(400).end();
  }
};

export const InfoPartner = async (req, res) => {
  try {
    const { power } = req.user;
    if (power != "admin") {
      return res.status(401).end();
    }
    const users = await User.find({ power: "P", active: true })
      .select("name phone address")
      .lean()
      .exec();
    const data = {};
    data.fileName = "معلومات الشركاء";
    data.doc = { ...pdfFile };
    data.doc.content = [
      {
        table: {
          headerRows: 1,
          widths: ["*", "*", "auto"],
          body: [
            [
              { text: "العنوان", style: "header" },
              { text: "الهاتف", style: "header" },
              { text: "الاسم", style: "header" }
            ]
          ]
        }
      }
    ];
    users.forEach((e, i) => {
      const style = (i + 1) % 2 ? "odd" : "even";
      let phoneString = "";
      e.phone.forEach(p => {
        phoneString += `${p.value}s : ${reverseStr(p.phoneType)}\n`;
      });
      data.doc.content[0].table.body.push([
        { text: reverseStr(e.address), style },
        { text: phoneString, style },
        { text: reverseStr(e.name), style }
      ]);
    });

    return res.status(200).json({ data });
  } catch (e) {
    console.log(e);
    return res.status(400).end();
  }
};

export const InfoCar = async (req, res) => {
  try {
    const { power } = req.user;
    if (power != "admin") {
      return res.status(401).end();
    }

    const cars = await Car.find({})
      .populate("driver", "name phone")
      .lean()
      .exec();
    const data = {};
    data.fileName = "معلومات السيارات";
    data.doc = { ...pdfFile };
    data.doc.content = [
      {
        table: {
          headerRows: 1,
          widths: ["*", "*", "auto", "*"],
          body: [
            [
              { text: reverseStr("رقم السائق"), style: "header" },
              { text: reverseStr("اسم السائق"), style: "header" },
              { text: "الرقم", style: "header" },
              { text: "النوع", style: "header" }
            ]
          ]
        }
      }
    ];
    console.log(cars);
    cars.forEach((e, i) => {
      const style = (i + 1) % 2 ? "odd" : "even";
      let phoneString = "";
      e.driver.phone.forEach(p => {
        phoneString += `${p.value}s : ${reverseStr(p.phoneType)}\n`;
      });
      data.doc.content[0].table.body.push([
        { text: phoneString, style },
        { text: reverseStr(e.driver.name), style },
        { text: reverseStr(e.name), style },
        { text: reverseStr(e.name), style }
      ]);
    });

    return res.status(200).json({ data });
  } catch (e) {
    console.log(e);
    return res.status(400).end();
  }
};

export const accountDriver = async (req, res) => {
  try {
    const { power } = req.user;
    if (power != "admin") {
      return res.status(401).end();
    }
    let users = [];
    const { d, m, y } = req.query;
    if (d == 0) {
      users = await User.find({ power: "D", active: true });
    } else {
      const driver = await User.findById(d);
      users.push(driver);
    }
    const array = [];
    users.forEach(e => {
      const data = {};
      data.fileName = ` ${reverseStr(e.name)} ${m} - ${y} `;
      data.doc = { ...pdfFile };

      data.doc.content = [
        { text: "\n\nالسفرات\n\n", style: "title" },
        {
          table: {
            headerRows: 1,
            widths: ["*", "*", "*", "*", "*", "auto"],
            body: [
              [
                { text: "صافي", style: "header" },
                { text: "اياب", style: "header" },
                { text: "ذهاب", style: "header" },
                { text: "مصروف", style: "header" },
                { text: "تاريخ", style: "header" },
                { text: "", style: "header" }
              ]
            ]
          }
        },
        { text: "\n\n" + reverseStr("وصول الدين") + "\n\n", style: "title" },

        {
          table: {
            headerRows: 1,
            widths: ["*", "*", "*", "auto", "auto", "*", "auto"],
            body: [
              [
                { text: "قيمة", style: "header" },
                { text: reverseStr(" من قبل"), style: "header" },
                { text: "مكتب", style: "header" },
                { text: reverseStr("اسم الزبون"), style: "header" },
                { text: reverseStr("رقم الزبون"), style: "header" },
                { text: "تاريخ", style: "header" },
                { text: "", style: "header" }
              ]
            ]
          }
        },
        { text: "\n\n" + reverseStr("مصاريف اضافية") + "\n\n", style: "title" },

        {
          table: {
            headerRows: 1,
            widths: ["*", "*", "*", "auto"],
            body: [
              [
                { text: "فيمة", style: "header" },
                { text: "السبب", style: "header" },
                { text: "تاريخ", style: "header" },
                { text: "", style: "header" }
              ]
            ]
          }
        },
        { text: "\n\nدفعات\n\n", style: "title" },

        {
          table: {
            headerRows: 1,
            widths: ["*", "*", "auto"],
            body: [
              [
                { text: "فيمة", style: "header" },
                { text: "تاريخ", style: "header" },
                { text: "", style: "header" }
              ]
            ]
          }
        }
      ];

      for (let i = 1; i < 25; i++) {
        data.doc.content[1].table.body.push(["", "", "", "", "", `${i}`]);
        data.doc.content[3].table.body.push(["", "", "", "", "", "", `${i}`]);
        data.doc.content[5].table.body.push(["", "", "", `${i}`]);
        data.doc.content[7].table.body.push(["", "", `"${i}`]);
      }

      array.push(data);
    });
    return res.status(200).json({ data: array });
  } catch (e) {
    return res.status(400).end();
  }
};

export const accountPartner = async (req, res) => {
  try {
    const { power } = req.user;
    if (power != "admin") {
      return res.status(401).end();
    }
  } catch (e) {}
};

export const accountALLDriver = async (req, res) => {
  try {
    const { power } = req.user;
    if (power != "admin") {
      return res.status(401).end();
    }
  } catch (e) {}
};

export const accountALLPartner = async (req, res) => {
  try {
    const { power } = req.user;
    if (power != "admin") {
      return res.status(401).end();
    }
    const data = {};
    const { y, m } = req.query;
    data.fileName = `جرد  حساب الشركاء ${m} - ${y} `;
    data.doc = { ...pdfFile };
    data.doc.pageOrientation = "landscape";

    data.doc.content = [
      {
        table: {
          headerRows: 1,
          widths: ["auto", "auto", "auto", "auto", "auto", "auto", "auto", "*"],
          body: [
            [
              { text: reverseStr("المتبقي"), style: "header" },
              { text: reverseStr("الدفعات"), style: "header" },
              { text: reverseStr("الصافي"), style: "header" },
              { text: reverseStr("اجمالي الحصص"), style: "header" },
              { text: reverseStr("الطلبات الخارجية"), style: "header" },
              { text: reverseStr("اجمالي وصول الدين"), style: "header" },
              { text: reverseStr("عدد وصول الدين"), style: "header" },
              { text: "الاسم", style: "header" }
            ]
          ]
        }
      }
    ];
    const users = await User.find({ power: "P", active: true })
      .select("name ")
      .lean()
      .exec();

    users.forEach((e, i) => {
      const style = (i + 1) % 2 ? "odd" : "even";
      data.doc.content[0].table.body.push([
        { text: "", style },
        { text: "", style },
        { text: "", style },
        { text: "", style },
        { text: "", style },
        { text: "", style },

        { text: "", style },
        { text: reverseStr(e.name), style }
      ]);
    });

    return res.status(200).json({ data });
  } catch (e) {
    return res.status(400).end();
  }
};
