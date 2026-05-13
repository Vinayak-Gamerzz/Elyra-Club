// FIREBASE CONFIG

import {
initializeApp
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";

import {
getAuth,
onAuthStateChanged,
signOut
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";

import {

getFirestore,

doc,
setDoc,
getDoc,
updateDoc,

collection,
getDocs,

deleteDoc

} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

/* CONFIG */

const firebaseConfig = {

  apiKey:
  "AIzaSyDi1ND91tW2RP23926SoY6j9GX9vKGCSOQ",

  authDomain:
  "nova-club-vinayak.firebaseapp.com",

  projectId:
  "nova-club-vinayak",

  storageBucket:
  "nova-club-vinayak.firebasestorage.app",

  messagingSenderId:
  "515398263626",

  appId:
  "1:515398263626:web:bbf69430e0f960f48617b3"
};

/* INIT */

const app =
initializeApp(firebaseConfig);

export const auth =
getAuth(app);

export const db =
getFirestore(app);

/* GET USER */

export function getCurrentUser(){

  return auth.currentUser;
}

/* AUTH STATE */

export function authState(callback){

  onAuthStateChanged(
    auth,
    callback
  );
}

/* LOGOUT */

export async function logout(){

  await signOut(auth);
}

/* =========================
   PROFILE SYSTEM
========================= */

/* SAVE PROFILE */

export async function saveProfile(profile){

  const user =
  auth.currentUser;

  if(!user) return;

  await setDoc(

    doc(
      db,
      "members",
      user.uid
    ),

    {

      username:
      profile.username || "",

      name:
      profile.name || "",

      email:
      profile.email || "",

      phone:
      profile.phone || "",

      dob:
      profile.dob || "",

      age:
      profile.age || "",

      food:
      profile.food || "",

      skill:
      profile.skill || "",

      sport:
      profile.sport || "",

      hobby:
      profile.hobby || "",

      goal:
      profile.goal || "",

      bio:
      profile.bio || "",

      avatar:
      profile.avatar || "",

      currentStreak:
      profile.currentStreak || 1,

      highestStreak:
      profile.highestStreak || 1,

      createdAt:
      new Date().toLocaleDateString()

    },

    { merge:true }
  );
}

/* LOAD PROFILE */

export async function loadProfile(){

  const user =
  auth.currentUser;

  if(!user) return null;

  const snap =
  await getDoc(

    doc(
      db,
      "members",
      user.uid
    )
  );

  if(snap.exists()){

    return snap.data();
  }

  return null;
}

/* =========================
   PROJECT SYSTEM
========================= */

/* ADD PROJECT */

export async function addProject(project){

  const user =
  auth.currentUser;

  if(!user) return;

  const profile =
  await loadProfile();

  await setDoc(

    doc(
      db,
      "members",
      user.uid,
      "projects",
      project.id
    ),

    {

      id:
      project.id,

      name:
      project.name,

      username:
      profile?.username || "champ",

      status:
      "current",

      difficulty:
      project.difficulty || "",

      time:
      project.time || "",

      reward:
      project.reward || "",

      github:"",
      demo:"",
      hackatime:"",
      description:"",

      submittedImage:"",
      approvalImage:"",

      rejectReason:"",

      addedAt:
      new Date().toLocaleDateString(),

      submittedAt:"",
      approvedAt:"",
      rejectedAt:"",
      completedAt:"",

      link:
      project.link || ""

    }

  );
}

/* LOAD PROJECTS */

export async function loadProjects(){

  const user =
  auth.currentUser;

  if(!user) return [];

  const query =
  await getDocs(

    collection(
      db,
      "members",
      user.uid,
      "projects"
    )
  );

  let arr = [];

  query.forEach((docu)=>{

    arr.push(docu.data());
  });

  return arr;
}

/* UPDATE PROJECT */

export async function updateProject(
projectId,
data
){

  const user =
  auth.currentUser;

  if(!user) return;

  await updateDoc(

    doc(
      db,
      "members",
      user.uid,
      "projects",
      projectId
    ),

    data
  );
}

/* DELETE PROJECT */

export async function deleteProject(
projectId
){

  const user =
  auth.currentUser;

  if(!user) return;

  await deleteDoc(

    doc(
      db,
      "members",
      user.uid,
      "projects",
      projectId
    )
  );
}

/* =========================
   SUBMISSION SYSTEM
========================= */

/* SUBMIT PROJECT */

export async function submitProject(
projectId,
data
){

  await updateProject(

    projectId,

    {

      status:
      "pending",

      github:
      data.github || "",

      demo:
      data.demo || "",

      hackatime:
      data.hackatime || "",

      description:
      data.description || "",

      submittedImage:
      data.submittedImage || "",

      submittedAt:
      new Date().toLocaleDateString()
    }
  );
}

/* APPROVE PROJECT */

export async function approveProject(
projectId,
data
){

  await updateProject(

    projectId,

    {

      status:
      "completed",

      approvalImage:
      data.approvalImage || "",

      approvedAt:
      data.approvedAt || "",

      completedAt:
      new Date().toLocaleDateString()
    }
  );

  await addBadge(
    "🏆 Completed: " + projectId
  );
}

/* REJECT PROJECT */

export async function rejectProject(
projectId,
data
){

  await updateProject(

    projectId,

    {

      status:
      "current",

      rejectReason:
      data.rejectReason || "",

      rejectedAt:
      data.rejectedAt || ""
    }
  );
}

/* =========================
   BADGES
========================= */

export async function addBadge(title){

  const user =
  auth.currentUser;

  if(!user) return;

  const id =
  title.replaceAll(" ","-");

  await setDoc(

    doc(
      db,
      "members",
      user.uid,
      "badges",
      id
    ),

    {

      title,

      earnedAt:
      new Date().toLocaleDateString()
    }
  );
}

/* LOAD BADGES */

export async function loadBadges(){

  const user =
  auth.currentUser;

  if(!user) return [];

  const query =
  await getDocs(

    collection(
      db,
      "members",
      user.uid,
      "badges"
    )
  );

  let arr = [];

  query.forEach((docu)=>{

    arr.push(docu.data());
  });

  return arr;
}

/* =========================
   STREAK SYSTEM
========================= */

export async function updateStreak(){

  const user =
  auth.currentUser;

  if(!user) return;

  const profile =
  await loadProfile();

  const today =
  new Date().toDateString();

  let streak =
  profile?.currentStreak || 1;

  let highest =
  profile?.highestStreak || 1;

  let lastVisit =
  profile?.lastVisit || null;

  /* SAME DAY */

  if(lastVisit === today){

    return;
  }

  /* YESTERDAY */

  const yesterday =
  new Date();

  yesterday.setDate(
    yesterday.getDate()-1
  );

  if(
    lastVisit ===
    yesterday.toDateString()
  ){

    streak++;

  }else{

    streak = 1;
  }

  if(streak > highest){

    highest = streak;
  }

  await updateDoc(

    doc(
      db,
      "members",
      user.uid
    ),

    {

      currentStreak:
      streak,

      highestStreak:
      highest,

      lastVisit:
      today
    }
  );
}