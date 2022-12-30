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
          appointment: [],
          key: generateApiKey({
            method: "string",
            length: 32,
            pool: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
          }),
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
    if (snapshot.docs[0].data().appointment != undefined) {
      let oldAppArray = snapshot.docs[0].data().appointment;
      oldAppArray.push(data);

      let newAppArray = new Array();
      let storeAppArray = new Array();

      for (let index = 0; index < oldAppArray.length; index++) {
        if (oldAppArray[index].completed) {
          storeAppArray.push(oldAppArray[index]);
        } else {
          newAppArray.push(oldAppArray[index]);
        }
      }

      let user = db.collection("master").doc(snapshot.docs[0].id);

      let appointments = db
        .collection("master")
        .doc(snapshot.docs[0].id)
        .collection("appointments");

      let appsnapshot = await appointments.get();

      for (let index = 0; index < appsnapshot.size; index++) {
        let apptemp = appsnapshot.docs[index].data().appointment;
        if (apptemp.length <= 100) {
        }
      }

      let test = await user.update({
        appointment: newAppArray,
      });
      return oldAppArray;
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
        appoinment[index].accepted = true;
        editedList.push(appoinment[index]);
      } else {
        editedList.push(appoinment[index]);
      }
    }

    user.update({
      appointment: editedList,
    });

    return true;
  }
  static async appReject(id, appid) {

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
      if (appoinment[index]._id != appid) {
        editedList.push(appoinment[index]);
      } else {
        continue;
      }
    }

    user.update({
      appointment: editedList,
    });

    return true;
  }

  static async appComplete(id, appid) {

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
        appoinment[index].completed = true;
        editedList.push(appoinment[index]);
      } else {
        editedList.push(appoinment[index]);
      }
    }

    user.update({
      appointment: editedList,
    });

    return true;
  }

  static async appPush(id, appid) {

    let ref = db.collection("master");
    const snapshot = await ref.where("_id", "==", id).get();
    if (snapshot.empty) {
      return false;
    }

    let docID = snapshot.docs[0].id;
    let user = db.collection("master").doc(docID);
    let appoinment = snapshot.docs[0].data().appointment;
    let editedList = new Array();
    let position = 0;

    for (let index = 0; index < appoinment.length; index++) {
      if (appoinment[index]._id == appid) {
        position = index;
      } else {
        continue;
      }
    }
    if (position != appoinment.length - 1) {
      let temp = appoinment[position];
      appoinment[position] = appoinment[position + 1];
      appoinment[position + 1] = temp;
    }

    user.update({
      appointment: appoinment,
    });

    return true;
  }
  static async appDelete(id, appid) {

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
      if (appoinment[index]._id != appid) {
        editedList.push(appoinment[index]);
      } else {
        continue;
      }
    }

    user.update({
      appointment: editedList,
    });

    return true;
  }
}

module.exports = FirebaseData;
