require("dotenv").config();
const validator = require("validator");
const User = require("../models/user_model");

const util = require("../util/util");
const _ = require("lodash");

const signUp = async (req, res) => {
  let { name } = req.body;
  const { email, password } = req.body;

  if (!name || !email || !password) {
    res
      .status(400)
      .send({ error: "Request Error: name, email and password are required." });
    return;
  }

  if (!validator.isEmail(email)) {
    res.status(400).send({ error: "Request Error: Invalid email format" });
    return;
  }

  name = validator.escape(name);

  const result = await User.signUp(name, email, password);
  if (result.error) {
    res.status(403).send({ error: result.error });
    return;
  }

  const user = result.user;
  if (!user) {
    res.status(500).send({ error: "Database Query Error" });
    return;
  }

  res.status(200).send({
    data: {
      access_token: user.access_token,
      access_expired: user.access_expired,
      login_at: user.login_at,
      user: {
        id: user.id,
        provider: user.provider,
        name: user.name,
        email: user.email,
        picture: user.picture,
      },
    },
  });
};

const nativeSignIn = async (email, password) => {
  if (!email || !password) {
    return {
      error: "Request Error: email and password are required.",
      status: 400,
    };
  }

  try {
    return await User.nativeSignIn(email, password);
  } catch (error) {
    return { error };
  }
};

const facebookSignIn = async (accessToken) => {
  if (!accessToken) {
    return { error: "Request Error: access token is required.", status: 400 };
  }

  try {
    const profile = await User.getFacebookProfile(accessToken);
    console.log("profile", profile);
    const { id, name, email } = profile;

    if (!id || !name || !email) {
      return {
        error:
          "Permissions Error: facebook access token can not get user id, name or email",
      };
    }

    return await User.facebookSignIn(id, name, email);
  } catch (error) {
    return { error: error };
  }
};

const signIn = async (req, res) => {
  const data = req.body;

  let result;
  switch (data.provider) {
    case "native":
      result = await nativeSignIn(data.email, data.password);
      break;
    case "facebook":
      result = await facebookSignIn(data.access_token);
      break;
    default:
      result = { error: "Wrong Request" };
  }

  if (result.error) {
    const status_code = result.status ? result.status : 403;
    res.status(status_code).send({ error: result.error });
    return;
  }

  const user = result.user;
  if (!user) {
    res.status(500).send({ error: "Database Query Error" });
    return;
  }

  res.status(200).send({
    data: {
      access_token: user.access_token,
      access_expired: user.access_expired,
      login_at: user.login_at,
      user: {
        id: user.id,
        provider: user.provider,
        name: user.name,
        email: user.email,
        picture: user.picture,
      },
    },
  });
};

const getUserProfile = async (req, res) => {
  // get user's success group oreder and it's group
  const groupOrderByUser = await User.getGroupOrderByUser(req.user.id);

  // get user's coupon
  const getCouponByUser = await Activity.getCouponByUser(req.user.id);

  // get all p id by groupOrderByUser
  const getAllProductId = _.groupBy(groupOrderByUser, (v) => v.p_id);
  const allProduct = Object.keys(getAllProductId);

  // get all g id by groupOrderByUser
  const getAllGroupId = _.groupBy(groupOrderByUser, (v) => v.g_id);
  const allGroup = Object.keys(getAllGroupId);

  let finalDetail = [];
  // each group need to get detail
  for (let i = 0; i < allGroup.length; i++) {
    const group = await Group.getGroupDetail(allGroup[i], [1, 2]);
    const nowProductID = getAllGroupId[allGroup[i]][0]["p_id"];

    const image = await Product.getProductsMainImage(nowProductID);

    console.log("getAllGroupId[i]", getAllGroupId[allGroup[i]]);
    const nowGroup = getAllGroupId[allGroup[i]][0];

    if (group !== undefined) {
      group.end_time = new Date(
        group.create_time.getTime() + group.persistent_s * 1000
      );
      const productColor = await Product.getProductsColors(nowGroup.color);
      console.log("productColor", productColor);
      group.product = {
        size: nowGroup.size,
        color: productColor[0],
        price: nowGroup.price,
        product_name: nowGroup.product_name,
        qty: nowGroup.qty,
        id: nowGroup.p_id,
        main_image: image,
      };

      const imagePath = util.getImagePath(
        req.protocol,
        req.hostname,
        nowProductID
      );
      group.product.main_image = group.product.main_image
        ? imagePath + image[0].main_image
        : null;

      finalDetail.push(group);
    }
  }

  res.status(200).send({
    data: {
      provider: req.user.provider,
      name: req.user.name,
      email: req.user.email,
      picture: req.user.picture,
      coupon: getCouponByUser,
      group: finalDetail,
    },
  });
  return;
};

module.exports = {
  signUp,
  signIn,
  getUserProfile,
};
