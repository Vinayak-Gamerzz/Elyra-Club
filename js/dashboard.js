
import {

auth,
authState,
logout,

loadProfile,

loadProjects,
submitProject,

approveProject,
rejectProject,

deleteProject,

loadBadges,
updateStreak

} from "./firebase.js";

/* ELEMENTS */

const current =
document.getElementById("current");

const pending =
document.getElementById("pending");

const completed =
document.getElementById("completed");

const badges =
document.getElementById("badges");

const streak =
document.getElementById("streak");

const quote =
document.getElementById("quote");

const modal =
document.getElementById("modal");

const submissionModal =
document.getElementById("submissionModal");

const approvalModal =
document.getElementById("approvalModal");

const logoutBtn =
document.getElementById("logoutBtn");

const submitBtn =
document.getElementById("submitBtn");

const approveBtn =
document.getElementById("approveBtn");

const rejectBtn =
document.getElementById("rejectBtn");

let allProjects = [];

let selectedProject = null;

/* AUTH */

authState(async(user)=>{

  if(user){

    const profile =
    await loadProfile();

    document.getElementById(
      "username"
    ).innerText =
    profile?.username || "Champ";

    await renderDashboard();

  }else{

    location.href =
    "login.html";
  }

});

/* LOGOUT */

logoutBtn.onclick = async ()=>{

  await logout();

  location.href =
  "index.html";
};

/* RENDER DASHBOARD */

async function renderDashboard(){

  allProjects =
  await loadProjects();

  current.innerHTML = "";
  pending.innerHTML = "";
  completed.innerHTML = "";

  allProjects.forEach((p)=>{

    let card =
    document.createElement("div");

    card.innerHTML = `

      <div class="
      project-chip
      ${p.status === "completed"
      ? "completed-chip"
      : ""}
      ">

        ${p.name}

      </div>

    `;

    card.onclick =
    ()=>openProject(p);

    /* CURRENT */

    if(
      p.status === "current"
    ){

      current.appendChild(card);
    }

    /* PENDING */

    else if(
      p.status === "pending"
    ){

      pending.appendChild(card);
    }

    /* COMPLETED */

    else if(
      p.status === "completed"
    ){

      completed.appendChild(card);
    }

  });

  await renderBadges();

  await renderStreak();
}

/* OPEN PROJECT */

function openProject(project){

  selectedProject = project;

  modal.style.display =
  "flex";

  document.body.style.overflow =
  "hidden";

  let buttons = "";

  /* CURRENT */

  if(project.status === "current"){

    buttons = `

      <button class="complete"
      onclick="openSubmission()">

        Submit - Waiting For Approval

      </button>
    `;
  }

  /* PENDING */

  else if(
    project.status === "pending"
  ){

    buttons = `

      <button class="complete"
      onclick="openApproval()">

        Review Project

      </button>
    `;
  }

  /* COMPLETED */

  else if(
    project.status === "completed"
  ){

    buttons = `

      <button class="open">

        Approved ✅

      </button>
    `;
  }

  modal.innerHTML = `

    <div class="modal-box">

      <h2>
        ${project.name}
      </h2>

      <p>
      ${project.description || ""}
      </p>

      <p>
      <b>Status:</b>
      ${project.status}
      </p>

      <p>
      <b>Difficulty:</b>
      ${project.difficulty}
      </p>

      <p>
      <b>Time:</b>
      ${project.time}
      </p>

      <p>
      <b>Reward:</b>
      ${project.reward}
      </p>

      <p>
      <b>User:</b>
      ${project.username}
      </p>

      <p>
      <b>Added:</b>
      ${project.addedAt}
      </p>

      ${project.submittedAt ? `

      <p>
      <b>Submitted:</b>
      ${project.submittedAt}
      </p>

      ` : ""}

      ${project.completedAt ? `

      <p>
      <b>Completed:</b>
      ${project.completedAt}
      </p>

      ` : ""}

      ${project.rejectReason ? `

      <p>
      <b>Rejected:</b>
      ${project.rejectReason}
      </p>

      ` : ""}

      <button class="open"
      onclick="window.open('${project.link}','_blank')">

        Open Project

      </button>

      ${buttons}

      <button class="remove"
      onclick="removeCurrentProject()">

        Remove

      </button>

    </div>
  `;
}

/* CLOSE MODAL */

modal.onclick = (e)=>{

  if(e.target.id === "modal"){

    modal.style.display =
    "none";

    document.body.style.overflow =
    "auto";
  }

};

submissionModal.onclick = (e)=>{

  if(
    e.target.id ===
    "submissionModal"
  ){

    submissionModal.style.display =
    "none";
  }

};

approvalModal.onclick = (e)=>{

  if(
    e.target.id ===
    "approvalModal"
  ){

    approvalModal.style.display =
    "none";
  }

};

/* OPEN SUBMISSION */

window.openSubmission = function(){

  submissionModal.style.display =
  "flex";
};

/* SUBMIT */

submitBtn.onclick =
async ()=>{

  await submitProject(

    selectedProject.id,

    {

      github:
      githubLink.value,

      demo:
      demoLink.value,

      hackatime:
      hackatimeProject.value,

      description:
      submissionDesc.value,

      submittedImage:
      submittedImage.value
    }

  );

  submissionModal.style.display =
  "none";

  modal.style.display =
  "none";

  await renderDashboard();
};

/* OPEN APPROVAL */

window.openApproval = function(){

  approvalModal.style.display =
  "flex";
};

const approvedMode =
document.getElementById(
  "approvedMode"
);

const rejectedMode =
document.getElementById(
  "rejectedMode"
);

const approvedFields =
document.getElementById(
  "approvedFields"
);

const rejectedFields =
document.getElementById(
  "rejectedFields"
);

/* MODES */

approvedMode.onclick = ()=>{

  approvedFields.style.display =
  "block";

  rejectedFields.style.display =
  "none";
};

rejectedMode.onclick = ()=>{

  rejectedFields.style.display =
  "block";

  approvedFields.style.display =
  "none";
};

/* APPROVE */

approveBtn.onclick =
async ()=>{

  await approveProject(

    selectedProject.id,

    {

      approvalImage:
      approvalImage.value,

      approvalMessage:
      approvalMessage.value,

      approvedAt:
      approvalDate.value
    }

  );

  approvalModal.style.display =
  "none";

  modal.style.display =
  "none";

  await renderDashboard();
};

/* REJECT */

rejectBtn.onclick =
async ()=>{

  await rejectProject(

    selectedProject.id,

    {

      rejectReason:
      rejectReason.value,

      rejectImage:
      rejectImage.value,

      rejectedAt:
      rejectDate.value
    }

  );

  approvalModal.style.display =
  "none";

  modal.style.display =
  "none";

  await renderDashboard();
};

/* REMOVE */

window.removeCurrentProject =
async function(){

  await deleteProject(
    selectedProject.id
  );

  modal.style.display =
  "none";

  await renderDashboard();
};

/* BADGES */

async function renderBadges(){

  const arr =
  await loadBadges();

  badges.innerHTML =
  arr.map(b=>`

    <div class="badge">

      ${b.title}

    </div>

  `).join("");
}

/* STREAK */

async function renderStreak(){

  await updateStreak();

  const profile =
  await loadProfile();

  streak.innerHTML = `

    <h2>

      ${profile?.currentStreak || 1}
      Day Streak!!

    </h2>

    <p style="
    margin-top:10px;
    color:#CBD5E1;
    ">

      Highest:
      ${profile?.highestStreak || 1}

    </p>
  `;
}

/* QUOTES */

const quotes = [

  "Build daily 🚀",

  "Consistency wins 🔥",

  "Ship fast ⚡",

  "Level up every day 👑",

  "Small progress is still progress 💫",

  "Every commit counts 🛠️"

];

quote.innerText =

quotes[
Math.floor(
Math.random()*quotes.length
)
];
