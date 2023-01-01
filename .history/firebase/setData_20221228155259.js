const db = require("./firebase.js");
var cookieSession = require("cookie-session");
const { FieldValue } = require("firebase-admin/firestore");
var admin = require("firebase-admin");
const { generateApiKey } = require("generate-api-key");

class FirebaseData {
  // create user
  static async createUser(data, key) {
    if (
      key == "4173c4a9edff6a1d4850c3e25ed462c0df670cd9218beac91a5f9ae1be57b629"
    ) {
      let ref = db.collection("master");
      const snapshot = await ref.where("email", "==", data.email).get();

      if (snapshot.empty) {
        let ref = db.collection("master");
        ref.add({
          name: data.name,
          email: data.email,
          phone: data.phone,
          _id: data._id,
          date: data.date,
          location: data.location,
          timesheet: [
            {
              day: "Monday",
              start: "",
              end: "",
            },
            {
              day: "Tuesday",
              start: "",
              end: "",
            },
            {
              day: "Wednesday",
              start: "",
              end: "",
            },
            {
              day: "Thursday",
              start: "",
              end: "",
            },
            {
              day: "Friday",
              start: "",
              end: "",
            },
            {
              day: "Saturday",
              start: "",
              end: "",
            },
            {
              day: "Sunday",
              start: "",
              end: "",
            },
          ],
        });
        return {
          name: data.name,
          email: data.email,
          phone: data.phone,
          _id: data._id,
          date: data.date,
          location: data.location,
          timesheet: [
            {
              day: "Monday",
              start: "",
              end: "",
            },
            {
              day: "Tuesday",
              start: "",
              end: "",
            },
            {
              day: "Wednesday",
              start: "",
              end: "",
            },
            {
              day: "Thursday",
              start: "",
              end: "",
            },
            {
              day: "Friday",
              start: "",
              end: "",
            },
            {
              day: "Saturday",
              start: "",
              end: "",
            },
            {
              day: "Sunday",
              start: "",
              end: "",
            },
          ],
          key: generateApiKey({
            method: "string",
            length: 32,
            pool: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
          }),
        };
      } else {
        return false;
      }
    } else {
      throw new Error("You are not Authorised to create a new user!");
    }
  }

  // update user
  static async updateUser(data, key) {
    if (
      key == "4173c4a9edff6a1d4850c3e25ed462c0df670cd9218beac91a5f9ae1be57b629"
    ) {
      let ref = db.collection("master");
      const snapshot = await ref.where("_id", "==", data.id).get();
      if (snapshot.empty) {
        return false;
      }

      let docID = snapshot.docs[0].id;
      let user = db.collection("master").doc(docID);

      user.update({
        name: data.name,
        phone: data.phone,
        addr1: data.addr1,
        addr2: data.addr2,
        city: data.city,
        state: data.state,
        zip: data.zip,
      });

      return false;
    } else {
      return false;
    }
  }

  static async updateTimesheet(data, id, key) {
    if (
      key == "4173c4a9edff6a1d4850c3e25ed462c0df670cd9218beac91a5f9ae1be57b629"
    ) {
      let snapshot = db.collection("master").where("_id", "=", id).get();
      let docid = (await snapshot).docs[0].id;
      let user = db.collection("master").doc(docid);
      user.update({
        timesheet: data,
      });

      return true;
    } else {
      return false;
    }
  }

  static async updateKey(data, key) {
    if (
      key == "4173c4a9edff6a1d4850c3e25ed462c0df670cd9218beac91a5f9ae1be57b629"
    ) {
      let user = db.collection("master").doc("master");

      user.update({
        key: data,
      });

      return true;
    } else {
      return false;
    }
  }

  static async updateKey() {
    let ref = await db.collection("master").get();
    ref.forEach((doc) => {
      let user = db.collection("master").doc(doc.id);

      user.update({
        key: generateApiKey({
          method: "string",
          length: 32,
          pool: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
        }),
      });
    });
  }

  static async createAppointment(data) {
    let snapshot = await db
      .collection("master")
      .where("_id", "=", data.uid)
      .get();

    if (snapshot.empty) {
      return false;
    }
    console.log("createAppointment");
    if (snapshot.docs[0].data().appointment != undefined) {
      let oldAppArray = snapshot.docs[0].data().appointment;
      let check = oldAppArray.find((obj) => obj.email == data.email);
      if (check == undefined) {
        oldAppArray.push(data);
        let user = db.collection("master").doc(snapshot.docs[0].id);

        let test = await user.update({
          appointment: oldAppArray,
        });
        return oldAppArray;
      } else {
        return false;
      }
    } else {
      let user = db.collection("master").doc(snapshot.docs[0].id);

      let test = await user.update({
        appointment: [data],
      });
      return data;
    }
  }

  static async getData(uid) {
    let snapshot = await db.collection("master").where("_id", "==", uid).get();
    if (!snapshot.empty) {
      // console.log(snapshot.docs[0].data());
      return snapshot.docs[0].data();
    } else {
      return false;
    }
  }

  // appoint edit methods

  static async appAccept(id, appid) {
    console.log(id, appid);
    let ref = db.collection("master");
    const snapshot = await ref.where("_id", "==", id).get();
    if (snapshot.empty) {
      return false;
    }

    let docID = snapshot.docs[0].id;
    let user = db.collection("master").doc(docID);
    let appoinment = snapshot.docs[0].data().appointment;
    let editedList = new Array();

    for (let index = 0; index < appoinment.length; index++) {
      if (appoinment[index]._id == appid) {
        let app = appoinment[index];
      } else {
        editedList.push(appoinment[index]);
      }
    }
    // user.update({
    //   name: data.name,
    //   phone: data.phone,
    //   addr1: data.addr1,
    //   addr2: data.addr2,
    //   city: data.city,
    //   state: data.state,
    //   zip: data.zip,
    // });

    return true;
  }
  static async appReject(id, appid) {
    console.log(id, appid);
  }

  static async appComplete(id, appid) {
    console.log(id, appid);
  }

  static async appPush(id, appid) {
    console.log(id, appid);
  }
  static async appDelete(id, appid) {
    console.log(id, appid);
  }
}

module.exports = FirebaseData;
