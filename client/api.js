let url = "http://localhost:8000/api/score/all-players";
let players;

const boardBtn = document.querySelector("#board-button");
const boardModal = document.querySelector("#board-modal-element");
const boardEl = document.getElementById("board-element");
const closeIcon = document.querySelector("#close-icon");
const boardName = document.querySelector("#board-name");
const boardScore = document.querySelector("#board-score");
console.log(boardName);

const getScore = async () => {
  try {
    const result = await fetch(url);
    const data = await result.json();
    console.log(data);

    data.map((item, index) => {
      // console.log(index);
      console.log(item.score.toLocaleString(`en-US`));
      const boardContent = document.querySelector("#board-content");
      const headingName = document.createElement("h1");
      const pScore = document.createElement("h2");
      headingName.innerHTML = `#${index + 1}  ${item.name}`;
      headingName.style["color"] = `${index === 0 ? "#B026FF" : "#04e7e7"}`;
      headingName.innerHTML = `${
        index === 0
          ? "#" + (index + 1) + " 👑" + item.name
          : "#" + (index + 1) + " " + item.name
      }`;
      headingName.style["font-size"] = "30px";
      headingName.style["font-weight"] = `${index === 0 ? "900" : ""}`
      pScore.innerHTML = item.score.toLocaleString("en-US");
      pScore.style["color"] = ` ${
        index === 0 ? "#B026FF" : "rgb(100, 226, 100)"
      }`;
      pScore.style["text-align"] = "end";
      pScore.style["font-size"] = "25px";
      pScore.style["font-weight"] = "900";

      boardContent.appendChild(headingName);
      boardContent.appendChild(pScore);
    });
  } catch (error) {
    console.log(error);
  }

  // look up how to create fetch and display a list of data
  // data.forEach((name)=>{
  //   document.querySelector("#player-name").innerHTML = name.name
  // })
  // document.querySelector("#player-name").innerHTML = data[0].name;
  // document.querySelector("#score-num").innerHTML = data[0].score;
};

// this is used to refresh the page to try and solve the update to show
// player name without this, would have to load page manuelly after submit
//  to see updated user
const refreshModal = () => {
  document.location.reload(true);
};

boardBtn.addEventListener("mousedown", () => {
  // console.log("click");
  boardModal.style.display = "block";

  //   // animating the modal any time animating html elements good to use gsap
  //   // https://greensock.com/ease-visualizer/ to get different visual effects of the modal to fade bouncing and all kinds of ways
  gsap.to("#board-modal-element", {
    opacity: 1,
    scale: 0.9,
    duration: 0.25,
    ease: "expo.out",

    onComplete: () => {
      boardModal.style.display = "block";
    },
  });
});

closeIcon.addEventListener("mousedown", () => {
  boardModal.style.display = "none";
  gsap.to("#board-modal-element", {
    opacity: 0,
    duration: 0.25,
    ease: "expo.out",
    onComplete: () => {
      boardModal.style.display = "none";
    },
  });
});

window.addEventListener("load", getScore());

// const createScore = async (id, score) => {
//   const message = await getScore(id, score);
//   const form = document.querySelector("form");
//   const span = document.createElement("span");
//   span.style.color = "red";
//   span.textContent = message.result;
//   form.appendChild(span);
// };
{
  /* <div class="event" id="NFL-1234">
    <span id="NFL-1234-status">FINAL</span><br />
    <img src="logo url here">Seattle Seahawks
    <strong class="score" id="NFL-1234-away-score">26</strong><br />
    <img src="logo url here">San Francisco 
    <strong class="score" id="NFL-1234-home-score">23</strong><br />
</div> */
}

// function updateAllEvents() {
//   //events_in_progress is a list of endpoints with event data
//   events_in_progress.forEach(function (event_endpoint, index) {
//       $.get(event_endpoint, function(data, status){
//           updateEvent(data);
//       });
//   });
// }

// function updateEvent(data) {
//   var event_tile_id = data.sport + “-” + data.id;
//   var away_score = document.getElementById(event_tile_id + “-away-score”);
//   var home_score = document.getElementById(event_tile_id + “-home-score”);
//   if (away_score && home_score) {
//       away_score.innerHTML = new_data.away_score;
//       home_score.innerHTML = new_data.home_score;
//   }
// }

// using 10000 runs the task every 10 seconds
// setInterval(updateAllEvents, 10000);
