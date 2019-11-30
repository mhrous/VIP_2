import Car from "./car.model";

export const getCars = async (req, res) => {
  try {
    const { power } = req.user;
    if (power != "admin" && power != "s_admin") {
      return res.status(401).end();
    }
    const data = await Car.find({})
      .populate("driver", "name")
      .populate("partners.partner", "name")
      .lean()
      .exec();

    return res.status(200).json({
      data
    });
  } catch (e) {
    return res.status(400).end();
  }
};

export const addCar = async (req, res) => {
  try {
    const { power } = req.user;
    if (power != "admin") {
      return res.status(401).end();
    }

    const car = await Car.create(req.body);
    const data = await Car.findById(car._id)
      .populate("driver", "name")
      .populate("partners.partner", "name")
      .lean()
      .exec();

    return res.status(200).json({
      data
    });
  } catch (e) {
    return res.status(400).end();
  }
};
export const editCar = async (req, res) => {
  try {
    const { power } = req.user;
    if (power != "admin") {
      return res.status(401).end();
    }

    const { _id } = req.params;

    const data = await Car.findByIdAndUpdate(_id, req.body, {
      new: true
    })
      .populate("driver", "name")
      .populate("partners.partner", "name")
      .lean()
      .exec();

    return res.status(200).json({ data });
  } catch (e) {
    return res.status(400).end();
  }
};
export const deleteCar = async (req, res) => {
  try {
    const { power } = req.user;
    if (power != "admin") {
      return res.status(401).end();
    }

    const { _id } = req.params;
    const data = await Car.findByIdAndDelete(_id)
      .lean()
      .exec();

    return res.status(200).json({ data: true });
  } catch (e) {
    return res.status(400).end();
  }
};

export const getCarDriver = async (req, res) => {
  try {
    if (power != "admin" || power != "S") {
      return res.status(401).end();
    }

    const data = await Car.find({})
      .select("-expensesMax -partners ")
      .populate("driver name")
      .lean()
      .exec();

    return res.status(200).json({ data });
  } catch (e) {
    return res.status(400).end();
  }
};
