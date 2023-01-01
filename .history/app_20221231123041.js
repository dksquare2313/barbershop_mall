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
      res.render("pricing", { loggedIn: true });
    })
    .catch((error) => {
      res.render("pricing", { loggedIn: false });
    });
});

app.get("/barber", (req, res) => {
  const sessionCookie = req.cookies.session || "";
  admin
    .auth()
    .verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then(async (userData) => {
      let ref = db.collection("master");
      const snapshot = await ref.where("email", "==", userData.email).get();
      const user = snapshot.docs[0].data();

      if (user.appointment != undefined) {
        let allapp = user.appointment;

        let appointments = await db
          .collection("master")
          .doc(snapshot.docs[0].id)
          .collection("appointments")
          .get();

        for (let i = 0; i < appointments.size; i++) {
          for (
            let j = 0;
            j < appointments.docs[i].data().appointment.length;
            j++
          ) {
            let tempArray = appointments.docs[i].data().appointment;
            allapp.push(tempArray[j]);
          }
        }

        let incoming = user.appointment.filter((obj) => obj.accepted == false);
        let accepted = user.appointment.filter(
          (obj) => obj.accepted == true && obj.completed == false
        );

        const data = {
          user: user,
          allapp: allapp,
          ongoing: accepted.slice(0, 7),
          incoming: incoming.slice(0, 7),
        };
        res.render("barber", { loggedIn: true, user: data });
      } else {
        const data = {
          user: user,
          ongoing: [],
          incoming: [],
          allapp: [],
        };
        res.render("barber", { loggedIn: true, user: data });
      }
    })
    .catch((error) => {
      res.redirect("/login");
    });
});

app.get("/gallery", (req, res) => {
  const sessionCookie = req.cookies.session || "";
  admin
    .auth()
    .verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then(async (userData) => {
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
      try {
        let ref = db.collection("master");
        const snapshot = await ref.where("email", "==", userData.email).get();

        if (snapshot.empty) {
          const user = new User({
            _id: userData.uid,
            name: " ",
            email: userData.email,
            phone: " ",
          });

          await FirebaseData.createUser(
            user,
            "4173c4a9edff6a1d4850c3e25ed462c0df670cd9218beac91a5f9ae1be57b629"
          ).then(
            function (value) {
              res.render("user_account", {
                user: value,
              });
            },
            function (error) {
              res.status(404).send("ERROR: " + error.message);
            }
          );
        } else {
          const user = snapshot.docs[0].data();

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
      res.redirect("/user");
    })
    .catch(async (error) => {
      res.render("login");
    });
});

app.get("/logout", (req, res) => {
  res.render("login");
});

// ********************************* update user *********************************
app.post("/user", (req, res) => {
  const data = req.body;

  const reqData = FirebaseData.updateUser(
    data,
    "4173c4a9edff6a1d4850c3e25ed462c0df670cd9218beac91a5f9ae1be57b629"
  );
  res.redirect(req.get("referer"));
});

app.post("/timesheet", (req, res) => {
  const data = req.body;
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

  const reqData = FirebaseData.updateTimesheet(
    refactor,
    data.id,
    "4173c4a9edff6a1d4850c3e25ed462c0df670cd9218beac91a5f9ae1be57b629"
  );
  res.redirect(req.get("referer"));
});

// ********************************* update user *********************************

app.get("/book", async (req, res) => {
  const key = req.query.key;
  let ref = db.collection("master");
  const snapshot = await (
    await ref.where("key", "==", key).get()
  ).docs[0].data();

  if (snapshot.key != undefined) {
    res.render("book", { user: snapshot });
  } else {
    res.redirect(req.get("referer"));
  }
});

app.get("/qr", async (req, res) => {
  const sessionCookie = req.cookies.session || "";
  admin
    .auth()
    .verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then(async (userData) => {
      let ref = db.collection("master");
      const snapshot = await (
        await ref.where("_id", "==", userData.uid).get()
      ).docs[0].data();

      if (snapshot.key != undefined) {
        res.render("key", {
          key: snapshot.key,
          loggedIn: true,
        });
      } else {
        res.redirect(req.get("referer"));
      }
    })
    .catch(async (error) => {
      res.redirect("/login");
    });
});

// ********************************* book appointment *********************************

app.post("/appoinment", async (req, res) => {
  const data = req.body;
  console.log(data);
  let count = 1;
  let ref = db.collection("master");
  const snapshot = await ref.where("_id", "==", data.id).get();
  if (snapshot.empty) {
    count = 1;
  } else {
    let appoinment = snapshot.docs[0].data().appointment;
    if (appoinment == undefined) {
      count = 1;
    } else {
      count = appoinment.length + 1;
    }
  }

  let app = {
    uid: data.id,
    _id: generateApiKey({
      method: "string",
      length: 24,
      pool: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    }),
    time: Date.now(),
    len: parseInt(data.service.split(" - ")[1]),
    name: data.name,
    email: data.email,
    phone: data.phone,
    service: data.service.split(" - ")[0],
    accepted: false,
    completed: false,
    index: count,
    barber: data.barber.split(" - ")[0],
    barber_email: data.barber.split(" - ")[1],
  };

  const appointment = await FirebaseData.createAppointment(app);

  let string = "/confirm?appid=" + app._id + "&id=" + app.uid;
  res.redirect(string);
});

app.post("/appoinment1", async (req, res) => {
  const data = req.body;
  let count = 1;
  let ref = db.collection("master");
  const snapshot = await ref.where("_id", "==", data.id).get();
  if (snapshot.empty) {
    count = 1;
  } else {
    let appoinment = snapshot.docs[0].data().appointment;
    if (appoinment == undefined) {
      count = 1;
    } else {
      count = appoinment.length + 1;
    }
  }

  let app = {
    uid: data.id,
    _id: generateApiKey({
      method: "string",
      length: 24,
      pool: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    }),
    time: Date.now(),
    len: parseInt(data.service.split(" - ")[1]),
    name: data.name,
    email: data.email,
    phone: data.phone,
    service: data.service.split(" - ")[0],
    accepted: false,
    completed: false,
    index: count,
    barber: data.barber.split(" - ")[0],
    barber_email: data.barber.split(" - ")[1],
  };

  const appointment = await FirebaseData.createAppointment(app);

  res.redirect("/barber");
});

app.post("/employee", async (req, res) => {
  const data = req.body;

  const sessionCookie = req.cookies.session || "";
  admin
    .auth()
    .verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then(async (userData) => {
      let ref = db.collection("master");
      const snapshot = await (
        await ref.where("_id", "==", userData.uid).get()
      ).docs[0].data();

      if (snapshot.key != undefined) {
        const appointment = await FirebaseData.addEmployee(data, userData.uid);
        res.redirect(req.get("referer"));
      } else {
        res.redirect(req.get("referer"));
      }
    })
    .catch(async (error) => {
      res.redirect("/login");
    });
});
app.post("/employeedelete", async (req, res) => {
  const data = req.body;

  const sessionCookie = req.cookies.session || "";
  admin
    .auth()
    .verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then(async (userData) => {
      let ref = db.collection("master");
      const snapshot = await (
        await ref.where("_id", "==", userData.uid).get()
      ).docs[0].data();

      if (snapshot.key != undefined) {
        const appointment = await FirebaseData.deleteEmployee(
          data,
          userData.uid
        );
        res.redirect(req.get("referer"));
      } else {
        res.redirect(req.get("referer"));
      }
    })
    .catch(async (error) => {
      res.redirect("/login");
    });
});

app.get("/confirm", async (req, res) => {
  const appid = req.query.appid;
  const id = req.query.id;

  const appointment = await FirebaseData.getData(id);
  if (appointment.appointment == undefined) {
    res.redirect(req.get("referer"));
  } else {
    let time = 0;
    let barber = "";

    for (let j = 0; j < appointment.appointment.length; j++) {
      if (appointment.appointment[j]._id == appid) {
        barber = appointment.appointment[j].barber;
        break;
      }
    }

    for (let index = 0; index < appointment.appointment.length; index++) {
      if (
        appointment.appointment[index].completed == false &&
        // appointment.appointment[index].barber == barber
      ) {
        if (appointment.appointment[index]._id == appid) {
          break;
        }
        time = time + appointment.appointment[index].len;
      } else {
        continue;
      }
    }

    if (appointment) {
      const dataSend = {
        data: appointment.appointment.find((obj) => obj._id == appid),
        time: time,
      };

      res.render("confirm", { data: dataSend });
    } else {
      res.redirect(req.get("referer"));
    }
  }
});

// ********************************* appointment methods *********************************

app.post("/accept", async (req, res) => {
  const data = req.body;

  const appointment = await FirebaseData.appAccept(data.id, data.appid);

  res.redirect("/barber");
});

app.post("/reject", async (req, res) => {
  const data = req.body;

  const appointment = await FirebaseData.appReject(data.id, data.appid);

  res.redirect("/barber");
});

app.post("/complete", async (req, res) => {
  const data = req.body;

  const appointment = await FirebaseData.appComplete(data.id, data.appid);

  res.redirect("/barber");
});

app.post("/push", async (req, res) => {
  const data = req.body;

  const appointment = await FirebaseData.appPush(data.id, data.appid);

  res.redirect("/barber");
});

app.post("/delete", async (req, res) => {
  const data = req.body;

  const appointment = await FirebaseData.appDelete(data.id, data.appid);

  res.redirect("/barber");
});




module.exports = app;
