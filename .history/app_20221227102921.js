const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const bodyParser = require("body-parser");
const express = require("express");
const admin = require("firebase-admin");
const FirebaseData = require("./firebase/setData");
const User = require("./Models/user");
const { generateApiKey } = require("generate-api-key");
const db = require("./firebase/firebase");

require("./firebase/firebase_service");

// ********************************* middleware *********************************
const csrfMiddleware = csrf({ cookie: true });

const app = express();

app.set("view engine", "ejs");
app.use("/static", express.static("public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(csrfMiddleware);

// ********************************* routes *********************************

// app.all("/login", (req, res, next) => {
//   res.cookie("XSRF-TOKEN", req.csrfToken());
//   next();
// });

// app.all("/signup", (req, res, next) => {
//   res.cookie("XSRF-TOKEN", req.csrfToken());
//   next();
// });

// ********************************* sessions *********************************

app.post("/sessionLogin", (req, res) => {
  const idToken = req.body.idToken.toString();

  const expiresIn = 60 * 60 * 24 * 5 * 1000;

  admin
    .auth()
    .createSessionCookie(idToken, { expiresIn })
    .then(
      (sessionCookie) => {
        const options = { maxAge: expiresIn, httpOnly: true };
        res.cookie("session", sessionCookie, options);
        res.end(JSON.stringify({ status: "success" }));
      },
      (error) => {
        res.status(401).send("UNAUTHORIZED REQUEST!");
      }
    );
});

app.get("/sessionLogout", (req, res) => {
  res.clearCookie("session");
  res.redirect("/login");
});
// ********************************* session end *********************************

app.get("/", (req, res) => {
  const sessionCookie = req.cookies.session || "";
  admin
    .auth()
    .verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then(async (userData) => {
      // console.log("Logged in:", userData);
      res.render("index", { loggedIn: true });
    })
    .catch((error) => {
      res.render("index", { loggedIn: false });
    });
});

// ********************************* date select *********************************

app.get("/pricing", (req, res) => {
  const sessionCookie = req.cookies.session || "";
  admin
    .auth()
    .verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then(async (userData) => {
      // console.log("Logged in:", userData);
      res.render("pricing", { loggedIn: true });
    })
    .catch((error) => {
      res.render("pricing", { loggedIn: false });
    });
});


app.get("/gallery", (req, res) => {
  const sessionCookie = req.cookies.session || "";
  admin
    .auth()
    .verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then(async (userData) => {
      // console.log("Logged in:", userData);
      res.render("gallery", { loggedIn: true });
    })
    .catch((error) => {
      res.render("gallery", { loggedIn: false });
    });
});

app.get("/contact", (req, res) => {
  res.sendFile(__dirname + "/views/contact.html");
});

app.get("/user", function (req, res) {
  const sessionCookie = req.cookies.session || "";

  admin
    .auth()
    .verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then(async (userData) => {
      // console.log("Logged in:", userData);

      try {
        let ref = db.collection("users");
        const snapshot = await ref.where("email", "==", userData.email).get();

        if (snapshot.empty) {
          const user = new User({
            _id: userData.uid,
            name: " ",
            email: userData.email,
            phone: " ",
          });

          FirebaseData.createUser(
            user,
            "4173c4a9edff6a1d4850c3e25ed462c0df670cd9218beac91a5f9ae1be57b629"
          ).then(
            function (value) {
              res.render("user_account", {
                user: user,
              });
            },
            function (error) {
              res.status(404).send("ERROR: " + error.message);
            }
          );
        } else {
          const user = snapshot.docs[0].data();

          console.log(user);
          const timesheet = {
            mon_start: parseTime(user.timesheet[0].start),
          };
          res.render("user_account", { user: user });
        }
      } catch (e) {
        console.log(e);
      }
    })
    .catch((error) => {
      res.redirect("/login");
    });
});

// ********************************* register / login / logout *********************************
app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/login", (req, res) => {
  const sessionCookie = req.cookies.session || "";
  admin
    .auth()
    .verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then(async (userData) => {
      // console.log("Logged in:", userData);
      res.redirect("/user");
    })
    .catch(async (error) => {
      res.redirect("/login");
    });
});

app.get("/logout", (req, res) => {
  res.render("login");
});

// ********************************* update user *********************************
app.post("/user", (req, res) => {
  const data = req.body;

  console.log(data);

  const reqData = FirebaseData.updateUser(
    data,
    "4173c4a9edff6a1d4850c3e25ed462c0df670cd9218beac91a5f9ae1be57b629"
  );
  res.redirect(req.get("referer"));
});

app.post("/timesheet", (req, res) => {
  const data = req.body;
  console.log("time sheet data");
  console.log(data);
  let refactor = [
    {
      day: "Monday",
      start: data.Monday_start,
      end: data.Monday_end,
    },
    {
      day: "Tuesday",
      start: data.Tuesday_start,
      end: data.Tuesday_end,
    },
    {
      day: "Wednesday",
      start: data.Wednesday_start,
      end: data.Wednesday_end,
    },
    {
      day: "Thursday",
      start: data.Thursday_start,
      end: data.Thursday_end,
    },
    {
      day: "Friday",
      start: data.Friday_start,
      end: data.Friday_end,
    },
    {
      day: "Saturday",
      start: data.Saturday_start,
      end: data.Saturday_end,
    },
    {
      day: "Sunday",
      start: data.Sunday_start,
      end: data.Sunday_end,
    },
  ];

  console.log(refactor);

  const reqData = FirebaseData.updateTimesheet(
    refactor,
    "4173c4a9edff6a1d4850c3e25ed462c0df670cd9218beac91a5f9ae1be57b629"
  );
  res.redirect(req.get("referer"));
});

// ********************************* update user *********************************

app.get("/book", (req, res) => {
  const key = req.query.key;
  const sessionCookie = req.cookies.session || "";
  admin
    .auth()
    .verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then(async (userData) => {
      // console.log("Logged in:", userData);
      const sessionKey = await FirebaseData.getKey(
        "4173c4a9edff6a1d4850c3e25ed462c0df670cd9218beac91a5f9ae1be57b629"
      );

      if (sessionKey == key) {
        res.render("book", { user: userData });
      } else {
        res.redirect("/login");
      }
    })
    .catch(async (error) => {
      res.redirect("/login");
    });
});

app.get("/qr", async (req, res) => {
  const sessionCookie = req.cookies.session || "";
  admin
    .auth()
    .verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then(async (userData) => {
      // console.log("Logged in:", userData);
      res.render("key", {
        key: await FirebaseData.getKey(
          "4173c4a9edff6a1d4850c3e25ed462c0df670cd9218beac91a5f9ae1be57b629"
        ),
        loggedIn: true,
      });
    })
    .catch(async (error) => {
      res.redirect("/login");
    });
});

function parseTime(time) {
  const { hours, minutes } = time.split(":");
  console.log(hours, minutes);
}


module.exports = app;