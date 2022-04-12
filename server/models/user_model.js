require("dotenv").config();
const argon2 = require("argon2");
const got = require("got");
const { pool } = require("./mysqlcon");
const salt = parseInt(process.env.BCRYPT_SALT);
const { TOKEN_EXPIRE, TOKEN_SECRET } = process.env; // 30 days by seconds
const jwt = require("jsonwebtoken");
const axios = require("axios");

const signUp = async (name, email, password) => {
  const conn = await pool.getConnection();
  try {
    await conn.query("START TRANSACTION");

    const emails = await conn.query(
      "SELECT email FROM users WHERE email = ? FOR UPDATE",
      [email]
    );
    if (emails[0].length > 0) {
      await conn.query("COMMIT");
      return { error: "Email Already Exists" };
    }

    const loginAt = new Date();
    const hash = await argon2.hash(password);

    const user = {
      provider: "native",
      email: email,
      password: hash,
      name: name,
      picture: null,
      create_time: loginAt,
    };

    const accessToken = jwt.sign(
      {
        provider: user.provider,
        name: user.name,
        email: user.email,
        picture: user.picture,
      },
      TOKEN_SECRET
    );
    // user.access_token = accessToken;

    const queryStr = "INSERT INTO users SET ?";
    const [result] = await conn.query(queryStr, user);

    user.id = result.insertId;
    await conn.query("COMMIT");
    return { user };
  } catch (error) {
    console.log(error);
    await conn.query("ROLLBACK");
    return { error };
  } finally {
    await conn.release();
  }
};

const nativeSignIn = async (email, password) => {
  const conn = await pool.getConnection();
  try {
    await conn.query("START TRANSACTION");

    const [users] = await conn.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    const user = users[0];
    if (!bcrypt.compareSync(password, user.password)) {
      await conn.query("COMMIT");
      return { error: "Password is wrong" };
    }

    const loginAt = new Date();
    const accessToken = jwt.sign(
      {
        provider: user.provider,
        name: user.name,
        email: user.email,
        picture: user.picture,
      },
      TOKEN_SECRET
    );

    const queryStr =
      "UPDATE user SET access_token = ?, access_expired = ?, login_at = ? WHERE id = ?";
    await conn.query(queryStr, [accessToken, TOKEN_EXPIRE, loginAt, user.id]);

    await conn.query("COMMIT");

    user.access_token = accessToken;
    user.login_at = loginAt;
    user.access_expired = TOKEN_EXPIRE;

    return { user };
  } catch (error) {
    await conn.query("ROLLBACK");
    return { error };
  } finally {
    await conn.release();
  }
};

const facebookSignIn = async (id, name, email) => {
  const conn = await pool.getConnection();
  try {
    await conn.query("START TRANSACTION");
    const loginAt = new Date();
    let user = {
      provider: "facebook",

      email: email,
      name: name,
      picture: "https://graph.facebook.com/" + id + "/picture?type=large",
      access_expired: TOKEN_EXPIRE,
      login_at: loginAt,
    };
    const accessToken = jwt.sign(
      {
        provider: user.provider,
        name: user.name,
        email: user.email,
        picture: user.picture,
      },
      TOKEN_SECRET
    );
    user.access_token = accessToken;

    const [users] = await conn.query(
      "SELECT id FROM users WHERE email = ? AND provider = 'facebook' FOR UPDATE",
      [email]
    );
    let userId;
    if (users.length === 0) {
      // Insert new user
      const queryStr = "insert into user set ?";
      const [result] = await conn.query(queryStr, user);
      userId = result.insertId;
    } else {
      // Update existed user
      userId = users[0].id;
      const queryStr =
        "UPDATE user SET access_token = ?, access_expired = ?, login_at = ?  WHERE id = ?";
      await conn.query(queryStr, [accessToken, TOKEN_EXPIRE, loginAt, userId]);
    }
    user.id = userId;

    await conn.query("COMMIT");

    return { user };
  } catch (error) {
    await conn.query("ROLLBACK");
    return { error };
  } finally {
    await conn.release();
  }
};

const getUserDetail = async (email) => {
  try {
    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    return users[0];
  } catch (e) {
    return null;
  }
};

const getFacebookProfile = async function (accessToken) {
  try {
    let res = await axios.get(
      "https://graph.facebook.com/me?fields=id,name,email&access_token=" +
        accessToken
    );
    console.log("fb res", res);
    return res.data;
  } catch (e) {
    console.log(e);
    throw "Permissions Error: facebook access token is wrong";
  }
};

const getCouponByUser = async (user_id) => {
  const [activitiesWithCoupon] = await pool.query(
    "SELECT coupon.* FROM users_coupon INNER JOIN coupon ON coupon.id = user_coupon.coupon_id WHERE user_coupon.user_id = ?;s",
    user_id
  );

  return activitiesWithCoupon;
};

const getGroupOrderByUser = async (user_id) => {
  const [orderGroup] = await pool.query(
    "SELECT group_order.id,group_order.size,group_order.color,group_order.price,group_order.product_name,group_order.qty,group_order.number,group_order.email,group_order.p_id,group_order.g_id,group.limit_p,group.current_p,group.discount_type,group.discount_value,group.create_time,group.persistent_s,group.status FROM group_order INNER JOIN `group` ON group_order.g_id = `group`.id  WHERE group_order.u_id = ? AND group_order.status = 1;",
    user_id
  );

  return orderGroup;
};

module.exports = {
  signUp,
  nativeSignIn,
  facebookSignIn,
  getUserDetail,
  getFacebookProfile,
  getCouponByUser,
  getGroupOrderByUser,
};
