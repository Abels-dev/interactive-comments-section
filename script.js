const commentHolder = document.getElementById("commentHolder");
const voteNo = document.querySelectorAll(".voteNo");
const userName = document.querySelectorAll(".userName");
const postedTime = document.querySelectorAll(".time");
const reply = document.querySelectorAll(".reply");
const postedComment = document.querySelectorAll(".comment");

const fetchingJson = async () => {
   try {
      const response = await fetch("data.json");
      const data = await response.json();
      return data;
   } catch {
      console.error("Error fetching the JSON:", error);
   }
};

const handlingData = async () => {
   try {
      const givenData = await fetchingJson();
      for (let i = 0; i < 4; i++) {
         if (i <= 1) {
            voteNo[i].textContent = givenData.comments[i].score;
            userName[i].textContent = givenData.comments[i].user.username;
            postedTime[i].textContent = givenData.comments[i].createdAt;
            postedComment[i].textContent = givenData.comments[i].content;
         } else {
            voteNo[i].textContent = givenData.comments[1].replies[i - 2].score;
            userName[i].textContent =
               givenData.comments[1].replies[i - 2].user.username;
            postedTime[i].textContent =
               givenData.comments[1].replies[i - 2].createdAt;
            if (i == 2)
               postedComment[i].innerHTML =
                  `<span class="repliedUser">@${givenData.comments[1].user.username}</span>` +
                  " " +
                  givenData.comments[1].replies[i - 2].content;
            else
               postedComment[i].innerHTML =
                   `<span class="repliedUser">@${givenData.comments[1].replies[0].user.username}</span>`+
                  " " +
                  givenData.comments[1].replies[i - 2].content;
         }
         if (i == 3) {
            userName[i].innerHTML =
               givenData.comments[1].replies[i - 2].user.username +
               "<span> You</span>";
         }
      }
   } catch (error) {
      console.error("Error fetching the JSON:", error);
   }
};
handlingData();
