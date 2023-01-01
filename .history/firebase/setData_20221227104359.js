const db = require("./firebase.js");
var cookieSession = require("cookie-session");
const { FieldValue } = require("firebase-admin/firestore");
var admin = require("firebase-admin");

class FirebaseData {
  static setData(collection, data, key) {
    if (
      key == "4173c4a9edff6a1d4850c3e25ed462c0df670cd9218beac91a5f9ae1be57b629"
    ) {
      // change this to env
      let ref = db.collection(collection);
      ref.add({
        name: data.name,
        email: data.email,
        phone: data.phone,
        _id: data._id,
        date: data.date,
        location: data.location,
      });
    } else {
      throw new Error("ERROR!");
    }
  }

  // create user
  static async createUser(data, key) {
    if (
      key == "4173c4a9edff6a1d4850c3e25ed462c0df670cd9218beac91a5f9ae1be57b629"
    ) {
      let ref = db.collection("master");
      const snapshot = await ref.where("email", "==", data.email).get();

      if (snapshot.empty) {
        FirebaseData.setData(
          "master",
          data,
          "4173c4a9edff6a1d4850c3e25ed462c0df670cd9218beac91a5f9ae1be57b629"
        );
        return true;
      } else {
        return true;
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

  static async updateTimesheet(data, key) {
    if (
      key == "4173c4a9edff6a1d4850c3e25ed462c0df670cd9218beac91a5f9ae1be57b629"
    ) {
      let user = db.collection("master").doc("master");

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

  static async getKey(key) {
    if (
      key == "4173c4a9edff6a1d4850c3e25ed462c0df670cd9218beac91a5f9ae1be57b629"
    ) {
      let user = (await db.collection("master").doc("master").get()).data().key;

      return user;
    } else {
      return false;
    }
  }

  static async updateKey() {}
}

module.exports = FirebaseData;
