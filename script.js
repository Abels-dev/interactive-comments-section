const commentHolder = document.getElementById("commentHolder");
const voteNo = document.querySelectorAll(".voteNo");
const userName = document.querySelectorAll(".userName");
const postedTime = document.querySelectorAll(".time");
const reply = document.querySelectorAll(".reply");
const postedComment = document.querySelectorAll(".comment");
const deleteBtn = document.querySelector(".delete");
const deleteConfirmBox = document.getElementById("deleteBox");
const confirmDelete = document.getElementById("yes");
const cancelDelete = document.getElementById("no");
const editMsg = document.querySelector(".edit");
const updateComment = document.querySelector(".update");
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
                  `<span class="repliedUser">@${givenData.comments[1].replies[0].user.username}</span>` +
                  " " +
                  givenData.comments[1].replies[i - 2].content;
         }
         if (i == 3) {
            userName[i].innerHTML =
               givenData.comments[1].replies[i - 2].user.username +
               `<span class="youText"> you</span>`;
         }
      }
   } catch (error) {
      console.error("Error fetching the JSON:", error);
   }
};
handlingData();
deleteBtn.addEventListener("click", (e) => {
   deleteConfirmBox.style.display = "block";
   cancelDelete.onclick = () => (deleteConfirmBox.style.display = "none");
   confirmDelete.onclick = () => {
      e.target.closest(".container").remove();
      deleteConfirmBox.style.display = "none";
   };
});
editMsg.addEventListener("click", (e) => {
   editMsg.disabled = true;
   deleteBtn.disabled = true;
   editMsg.style.opacity = "0.5";
   deleteBtn.style.opacity = "0.5";
   const commentWrapper = e.target.closest(".commentInfo");
   const text = commentWrapper.querySelector(".comment");
   let comment = text.textContent;
   text.innerHTML = `<textarea
               name=""
               rows="6"
               cols="45"
               class="editMsg" >${comment}</textarea>`;
   updateComment.style.display = "block";

   updateComment.onclick = () => {
      const editedMsg = document.querySelector(".editMsg");
      comment = editedMsg.value;
      text.innerHTML = comment;
      updateComment.style.display = "none";
      editMsg.disabled = false;
      deleteBtn.disabled = false;
      editMsg.style.opacity = 1;
      deleteBtn.style.opacity = 1;
   };
});
