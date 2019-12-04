import moment from "moment";
import User from "../user/user.model";
import Car from "../car/car.model";
import Payment from "../payment/payment.model";
import Expenses from "../expenses/expenses.model";
import Travel from "../travel/travel.model";

import { getFirstOfThisMonth, getFirstOfNextMonth } from "../../utils";

const reverseStr = str =>
  str
    .split(" ")
    .reverse()
    .join(" ")
    .trim();

const stayleTable = {
  headerFile: {
    alignment: "center",
    margin: [7, 7, 7, 7],
    fontSize: 20
  },
  tableTitle: {
    alignment: "center",
    fontSize: 16
  },
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
  },
  res: { alignment: "center", margin: [7, 7, 7, 7] }
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
          widths: ["*", 120, 75, 75],
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
    return res.status(400).end();
  }
};

export const accountCar = async (req, res) => {
  try {
    const { power } = req.user;
    if (power != "admin") {
      return res.status(401).end();
    }

    const data = {};
    const { y, m } = req.query;
    data.fileName = `جرد السيارات ${m} - ${y}`;
    data.doc = { ...pdfFile };

    data.doc.pageOrientation = "landscape";
    data.doc.content = [
      {
        text: reverseStr(`  جرد حساب السيارات  ${m} - ${y} `),
        style: "headerFile"
      }
    ];

    const mytable = {
      table: {
        headerRows: 1,
        widths: [56, 58, 68, 66, 56, 60, 66, "*", 50, "*"],
        body: [
          [
            { text: "الصافي", style: "header" },
            { text: "التصليح", style: "header" },
            { text: "المصروف", style: "header" },
            { text: "قيمة  السفرات ", style: "header" },

            { text: "قيمة وصول الدين ", style: "header" },
            { text: "عدد وصول الدين ", style: "header" },
            { text: "عدد السفرات ", style: "header" },
            { text: reverseStr("اسم السائق"), style: "header" },
            { text: "الرقم", style: "header" },
            { text: "النوع", style: "header" }
          ]
        ]
      }
    };

    const getData = async (m, y) => {
      m = parseInt(m) - 1;
      const obj = {};
      const start = getFirstOfThisMonth(m, y);
      const end = getFirstOfNextMonth(m, y);

      const cars = await Car.find({})
        .select("-partners")
        .populate("driver", "name")
        .lean()
        .exec();
      cars.forEach(c => {
        obj[c._id] = {
          travel: [],
          expenses: [],
          name: c.name,
          number: c.number,
          expensesMax: c.expensesMax,
          driverName: c.driver.name
        };
      });
      const travel = await Travel.find({ date: { $gt: start, $lt: end } })
        .populate("car", "-driver -partners")
        .lean()
        .exec();

      travel.forEach(e => {
        const index = e.car._id.toString();
        obj[index].travel = [...obj[index].travel, e];
      });
      const expenses = await Expenses.find({
        onCar: true,
        date: { $gt: start, $lt: end }
      })
        .select("car amount")
        .lean()
        .exec();

      expenses.forEach(e => {
        const index = e.car;

        obj[index].expenses = [...obj[index].expenses, e];
      });
      return obj;
    };
    const processingData = obj => {
      let array = [];
      for (let a of Object.values(obj)) {
        const { name, number, driverName, travel, expenses } = a;
        const numberTravel = travel.length;
        const numberRepairing = travel.reduce(
          (a, b) => a + b.repairing.length,
          0
        );
        const totalRepairing = travel.reduce(
          (a, b) => a + b.repairing.reduce((_a, _b) => _a + _b.value, 0),
          0
        );
        const totalTravel =
          travel.reduce((a, b) => a + b.cashTo + b.cashBack, 0) +
          totalRepairing;
        const travelExpenses = travel.reduce((a, b) => a + b.expenses, 0);
        const carExpenses = expenses.reduce((a, b) => a + b.amount, 0);

        const result = totalTravel - travelExpenses - carExpenses;
        array = [
          ...array,
          {
            name,
            number,
            driverName,
            numberTravel,
            numberRepairing,
            totalRepairing,
            totalTravel,
            travelExpenses,
            carExpenses,
            result
          }
        ];
      }
      return array;
    };
    const obj = await getData(m, y);
    const result = processingData(obj);

    result.forEach((e, i) => {
      const style = (i + 1) % 2 ? "odd" : "even";
      const {
        name,
        number,
        driverName,
        numberTravel,
        numberRepairing,
        totalRepairing,
        totalTravel,
        travelExpenses,
        carExpenses,
        result
      } = e;
      mytable.table.body.push([
        { text: result, style },
        { text: carExpenses, style },
        { text: travelExpenses, style },
        { text: totalTravel, style },
        { text: totalRepairing, style },
        { text: numberRepairing, style },

        { text: numberTravel, style },
        { text: reverseStr(driverName), style },

        { text: number, style },
        { text: name, style }
      ]);
    });
    data.doc.content = [...data.doc.content, mytable];

    return res.status(200).json({ data });
  } catch (e) {
    console.log(e);
    return res.status(400).end();
  }
};

export const _driver = async (req, res) => {
  try {
    const { power } = req.user;
    if (power != "admin") {
      return res.status(401).end();
    }

    const data = {};
    const { y, m, d } = req.query;

    const driver = await User.findById(d)
      .select("name")
      .lean()
      .exec();

    data.fileName = `جرد ${driver.name} ${m} - ${y}`;
    data.doc = { ...pdfFile };

    data.doc.content = [
      {
        text: reverseStr(`  جرد حساب ${driver.name}  ${m} - ${y} `),
        style: "headerFile"
      },
      "\n",
      "\n"
    ];

    const travelTable = {
      table: {
        headerRows: 1,
        widths: [54, "*", 75, 75, 58, 70, 20],
        body: [
          [
            { text: "الصافي", style: "header" },
            { text: reverseStr("وصول الدين"), style: "header" },
            { text: reverseStr("عودة كاش "), style: "header" },
            { text: reverseStr("ذهاب كاش "), style: "header" },
            { text: "مصروف", style: "header" },
            { text: "التاريخ", style: "header" },
            { text: "", style: "header" }
          ]
        ]
      }
    };

    const repairingTable = {
      table: {
        headerRows: 1,
        widths: [50, "*", 70, 70, "*", 70, 20],
        body: [
          [
            { text: "القيمة", style: "header" },
            { text: reverseStr("من قبل"), style: "header" },
            { text: reverseStr("مكتب"), style: "header" },
            { text: reverseStr("رقم الزبون"), style: "header" },
            { text: reverseStr(" اسم الزبون"), style: "header" },
            { text: "التاريخ", style: "header" },
            { text: "", style: "header" }
          ]
        ]
      }
    };
    const expensesTable = {
      table: {
        headerRows: 1,
        widths: ["*", 80, 70],
        body: [
          [
            { text: reverseStr("السبب"), style: "header" },
            { text: reverseStr("القيمة"), style: "header" },
            { text: "التاريخ", style: "header" }
          ]
        ]
      }
    };
    const paymentTable = {
      table: {
        headerRows: 1,
        widths: ["*", 70],
        body: [
          [
            { text: reverseStr("القيمة"), style: "header" },
            { text: "التاريخ", style: "header" }
          ]
        ]
      }
    };

    const getData = async (m, y, d) => {
      m = parseInt(m) - 1;
      const obj = {
        travel: [],
        payment: [],
        expenses: []
      };
      const start = getFirstOfThisMonth(m, y);
      const end = getFirstOfNextMonth(m, y);

      const travel = await Travel.find({
        date: { $gt: start, $lt: end },
        driver: d
      })
        .populate("repairing.partner", "name")
        .select("date expenses cashBack cashTo repairing")
        .lean()
        .exec();

      obj.travel = travel;

      const expenses = await Expenses.find({
        driver: d,
        onDriver: true,
        date: { $gt: start, $lt: end }
      })
        .select("reason amount date")
        .lean()
        .exec();
      obj.expenses = expenses;

      const payment = await Payment.find({
        user: d,
        date: { $gt: start, $lt: end }
      })
        .lean()
        .exec();

      obj.payment = payment;

      return obj;
    };

    const obj = await getData(m, y, d);
    console.log(obj);
    // const result = processingData(obj);
    let repairigArray = [];

    obj.travel.forEach((e, i) => {
      const style = (i + 1) % 2 ? "odd" : "even";
      const { date, cashBack, cashTo, expenses, repairing } = e;
      let repairigString = "";
      repairing.forEach((_e, _i) => {
        _e.date = date;
        repairigArray = [...repairigArray, _e];
        repairigString += `(${_e.value}) ${reverseStr(_e.partner.name)} \n`;
      });

      const result =
        cashTo +
        cashBack +
        repairing.reduce((a, b) => a + b.value, 0) -
        expenses;
      travelTable.table.body.push([
        { text: result, style },
        { text: repairigString, style },
        { text: cashBack, style },
        { text: cashTo, style },
        { text: expenses, style },
        { text: moment(date).format("YYYY/MM/DD"), style },
        { text: i + 1, style }
      ]);
    });

    repairigArray.forEach((_e, _i) => {
      const style = (_i + 1) % 2 ? "odd" : "even";

      const { clientName, clientPhone, value, from } = _e;
      repairingTable.table.body.push([
        { text: value, style },
        { text: from, style },
        { text: reverseStr(_e.partner.name), style },
        { text: clientPhone, style },
        { text: clientName, style },
        { text: moment(_e.date).format("YYYY/MM/DD"), style },
        { text: _i + 1, style }
      ]);
    });
    obj.expenses.forEach((e, i) => {
      const style = (i + 1) % 2 ? "odd" : "even";

      const { date, amount, reason } = e;
      expensesTable.table.body.push([
        { text: reason, style },
        { text: amount, style },
        { text: moment(date).format("YYYY/MM/DD"), style }
      ]);
    });
    obj.payment.forEach((e, i) => {
      const style = (i + 1) % 2 ? "odd" : "even";
      const { date, amount } = e;
      paymentTable.table.body.push([
        { text: amount, style },
        { text: moment(date).format("YYYY/MM/DD"), style }
      ]);
    });

    const travelPrint =
      travelTable.table.body.length > 1
        ? [
            { text: reverseStr("السفرات"), style: "tableTitle" },
            "\n",
            travelTable
          ]
        : [];
    const repairigPrint =
      repairingTable.table.body.length > 1
        ? [
            {
              text: reverseStr("وصول الدين"),
              style: "tableTitle",
              pageBreak: "before"
            },
            "\n",
            repairingTable
          ]
        : [];

    const expensesPrint =
      expensesTable.table.body.length > 1
        ? [
            {
              text: reverseStr("مصاريف دفعها السائق"),
              style: "tableTitle",
              pageBreak: "before"
            },
            "\n",
            expensesTable
          ]
        : [];

    const paymentPrint =
      paymentTable.table.body.length > 1
        ? [
            {
              text: reverseStr(" دفعات السائق السائق"),
              style: "tableTitle",
              pageBreak: "before"
            },
            "\n",
            paymentTable
          ]
        : [];

    const totalTravel = obj.travel.reduce(
      (a, b) =>
        a +
        b.cashTo +
        b.cashBack +
        b.repairing.reduce((_a, _b) => _a + _b.value, 0),
      0
    );
    const totalMainExpenses = obj.travel.reduce((a, b) => a + b.expenses, 0);
    const totalRepairing = repairigArray.reduce((a, b) => a + b.value, 0);
    const totalExpenses = obj.expenses.reduce((a, b) => a + b.amount, 0);
    const totalPayment = obj.payment.reduce((a, b) => a + b.amount, 0);
    const finalRes =
      totalTravel -
      totalMainExpenses -
      totalRepairing -
      totalExpenses -
      totalPayment;
    const resTable = {
      table: {
        headerRows: 1,
        widths: ["*", "*"],
        body: [
          [
            { text: totalTravel, style: "res" },
            { text: reverseStr("اجمالي السفرات"), style: "res" }
          ],
          [
            { text: totalMainExpenses, style: "res" },
            { text: reverseStr("مصروف السفرات"), style: "res" }
          ],
          [
            { text: totalRepairing, style: "res" },
            { text: reverseStr("وصول الدين"), style: "res" }
          ],
          [
            { text: totalExpenses, style: "res" },
            { text: reverseStr("المصاريف"), style: "res" }
          ],
          [
            { text: totalPayment, style: "res" },
            { text: reverseStr("الدفعات"), style: "res" }
          ],

          [
            { text: finalRes, style: "header" },
            { text: reverseStr(""), style: "header" }
          ]
        ]
      }
    };

    data.doc.content = [
      ...data.doc.content,
      ...travelPrint,
      ...repairigPrint,
      ...expensesPrint,
      ...paymentPrint,
      {
        text: reverseStr(" الحساب"),
        style: "tableTitle",
        pageBreak: "before"
      },
      "\n",
      resTable
    ];

    return res.status(200).json({ data });
  } catch (e) {
    console.log(e);
    return res.status(400).end();
  }
};

export const _partner = async (req, res) => {
  try {
    const { power } = req.user;
    if (power != "admin") {
      return res.status(401).end();
    }
    const data = {};
    const { y, m, p } = req.query;
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
    return res.status(200).json({ data: { m, y, p, name: "p" } });

    return res.status(200).json({ data });
  } catch (e) {
    return res.status(400).end();
  }
};
