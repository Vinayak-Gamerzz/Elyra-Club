
import {

authState,
logout,

saveProfile,
loadProfile,

loadProjects,
loadBadges

} from "./firebase.js";

/* ELEMENTS */

const logoutBtn =
document.getElementById("logoutBtn");

const saveBtn =
document.getElementById("saveBtn");

/* INPUTS */

const username =
document.getElementById("username");

const nameInput =
document.getElementById("name");

const email =
document.getElementById("email");

const phone =
document.getElementById("phone");

const dob =
document.getElementById("dob");

const age =
document.getElementById("age");

const food =
document.getElementById("food");

const skill =
document.getElementById("skill");

const sport =
document.getElementById("sport");

const hobby =
document.getElementById("hobby");

const goal =
document.getElementById("goal");

const bio =
document.getElementById("bio");

/* PROFILE PREVIEW */

const avatar =
document.getElementById("avatar");

const profileUsername =
document.getElementById("profileUsername");

const profileBio =
document.getElementById("profileBio");

/* STATS */

const currentCount =
document.getElementById("currentCount");

const pendingCount =
document.getElementById("pendingCount");

const completedCount =
document.getElementById("completedCount");

const badgeCount =
document.getElementById("badgeCount");

const currentStreak =
document.getElementById("currentStreak");

const highestStreak =
document.getElementById("highestStreak");

/* AUTH */

authState(async(user)=>{

  if(user){

    await loadEverything();

  }else{

    location.href =
    "login.html";
  }

});

/* LOAD EVERYTHING */

async function loadEverything(){

  /* PROFILE */

  const profile =
  await loadProfile();

  if(profile){

    username.value =
    profile.username || "";

    nameInput.value =
    profile.name || "";

    email.value =
    profile.email || "";

    phone.value =
    profile.phone || "";

    dob.value =
    profile.dob || "";

    age.value =
    profile.age || "";

    food.value =
    profile.food || "";

    skill.value =
    profile.skill || "";

    sport.value =
    profile.sport || "";

    hobby.value =
    profile.hobby || "";

    goal.value =
    profile.goal || "";

    bio.value =
    profile.bio || "";

    /* PREVIEW */

    profileUsername.innerText =
    profile.username || "Champ";

    profileBio.innerText =
    profile.bio ||
    "Future builder of Elyra 🚀";

    avatar.innerText =

    profile.username
    ? profile.username[0]
      .toUpperCase()

    : "E";

    currentStreak.innerText =
    profile.currentStreak || 1;

    highestStreak.innerText =
    profile.highestStreak || 1;
  }

  /* PROJECT STATS */

  const projects =
  await loadProjects();

  currentCount.innerText =

  projects.filter(
    p=>p.status === "current"
  ).length;

  pendingCount.innerText =

  projects.filter(
    p=>p.status === "pending"
  ).length;

  completedCount.innerText =

  projects.filter(
    p=>p.status === "completed"
  ).length;

  /* BADGES */

  const badges =
  await loadBadges();

  badgeCount.innerText =
  badges.length;
}

/* LIVE PREVIEW */

username.oninput = ()=>{

  profileUsername.innerText =

  username.value || "Champ";

  avatar.innerText =

  username.value
  ? username.value[0]
    .toUpperCase()

  : "E";
};

bio.oninput = ()=>{

  profileBio.innerText =

  bio.value ||
  "Future builder of Elyra 🚀";
};

/* SAVE */

saveBtn.onclick =
async ()=>{

  await saveProfile({

    username:
    username.value,

    name:
    nameInput.value,

    email:
    email.value,

    phone:
    phone.value,

    dob:
    dob.value,

    age:
    age.value,

    food:
    food.value,

    skill:
    skill.value,

    sport:
    sport.value,

    hobby:
    hobby.value,

    goal:
    goal.value,

    bio:
    bio.value
  });

  saveBtn.innerText =
  "Saved ✅";

  setTimeout(()=>{

    saveBtn.innerText =
    "Save Profile 🚀";

  },2000);
};

/* LOGOUT */

logoutBtn.onclick =
async ()=>{

  await logout();

  location.href =
  "index.html";
};
