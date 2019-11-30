import User from "../user/user.model";

export const onePartner = async (req, res) => {
  try {
    const { query } = req;
    console.log(query);
    const data = {};
    const user = await User.findById(query._id)
      .select("name")
      .lean()
      .exec();

    data.user = user;
    res.json({ data });
  } catch (e) {
    console.error(e);
  }
};
