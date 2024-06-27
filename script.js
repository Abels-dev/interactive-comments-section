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
const sendMsg = document.getElementById("send");
const newComment = document.getElementById("commentField");
const fetchingJson = async () => {
   try {
      const response = await fetch("data.json");
      const data = await response.json();
      return data;
   } catch {
      console.error("Error fetching the JSON:", error);
   }
};
const disableButton = (editBtn, deleteBtn, condition, strength) => {
   editBtn.disabled = condition;
   deleteBtn.disabled = condition;
   editBtn.style.opacity = strength;
   deleteBtn.style.opacity = strength;
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
commentHolder.addEventListener("click", (e) => {
   if (
      e.target.classList.contains("delete") ||
      e.target.classList.contains("deleteImg") ||
      e.target.classList.contains("deleteText")
   ) {
      const commentWrapper = e.target.closest(".commentInfo");
      const deleteBn = commentWrapper.querySelector(".delete");
      const editBn = commentWrapper.querySelector(".edit");
      disableButton(editBn, deleteBn, true, "0.5");
      deleteConfirmBox.style.display = "block";
      cancelDelete.onclick = () => {
         deleteConfirmBox.style.display = "none";
         disableButton(editBn, deleteBn, false, "1");
      };
      confirmDelete.onclick = () => {
         e.target.closest(".container").remove();
         deleteConfirmBox.style.display = "none";
         disableButton(editBn, deleteBn, false, "1");
      };
   }
});
commentHolder.addEventListener("click", (e) => {
   if (
      e.target.classList.contains("edit") ||
      e.target.classList.contains("editImg") ||
      e.target.classList.contains("editText")
   ) {
      const commentWrapper = e.target.closest(".commentInfo");
      const text = commentWrapper.querySelector(".comment");
      const deleteBn = commentWrapper.querySelector(".delete");
      const editBn = commentWrapper.querySelector(".edit");
      disableButton(editBn, deleteBn, true, "0.5");
      let comment = text.textContent;
      text.innerHTML = `<textarea
               name=""
               rows="6"
               cols="45"
               class="editMsg" >${comment}</textarea>`;
      const updateComment = commentWrapper.querySelector(".update");
      updateComment.style.display = "block";
      updateComment.onclick = () => {
         disableButton(editBn, deleteBn, false, "1");
         const editedMsg = document.querySelector(".editMsg");
         comment = editedMsg.value;
         text.innerHTML = comment;
         updateComment.style.display = "none";
         editMsg.disabled = false;
         deleteBtn.disabled = false;
         editMsg.style.opacity = 1;
         deleteBtn.style.opacity = 1;
      };
   }
});

sendMsg.onclick = () => {
   const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
   ];
   const date = new Date();
   let currentDate = monthNames[date.getMonth()] + " " + date.getDate();
   commentHolder.innerHTML += `<div class="container">
                  <div class="voting">
                     <button class="plus">
                        <img src="images/icon-plus.svg" alt="" />
                     </button>
                     <p class="voteNo">0</p>
                     <button class="minus">
                        <img src="images/icon-minus.svg" alt="" />
                     </button>
                  </div>
                  <div class="commentInfo">
                     <section class="commentHeader">
                        <div class="commentDetails">
                           <figure>
                              <img
                                 src="images/avatars/image-juliusomo.png"
                                 alt="" />
                           </figure>
                           <p class="userName">juliusomo <span class="youText"> you</span>  </p>
                           <p class="time">${currentDate}</p>
                        </div>
                        <div class="modify">
                           <button class="delete">
                              <img src="images/icon-delete.svg" alt="" class="deleteImg"/>
                              <span class="deleteText">Delete</span>
                           </button>
                           <button class="edit">
                              <img src="images/icon-edit.svg" alt="" class="editImg"/>
                              <span class="editText">Edit</span>
                           </button>
                        </div>
                     </section>
                     <p class="comment">${newComment.value}</p>
                     <button class="update">UPDATE</button>
                  </div>
               </div>
   `;
   newComment.value = "";
};
