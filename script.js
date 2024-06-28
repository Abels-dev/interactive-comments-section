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
const date = new Date();
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
let currentDate = monthNames[date.getMonth()] + " " + date.getDate();
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

const getPost = (element, className1,className2, messageBody, userNameField) => {
   element.innerHTML += `<div class="${className1} ${className2}" >
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
                     <p class="comment">${userNameField} 
                  ${messageBody}</p>
                     <button class="update">UPDATE</button>
                  </div>
               </div>`;
};

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
   } else if (
      e.target.classList.contains("edit") ||
      e.target.classList.contains("editImg") ||
      e.target.classList.contains("editText")
   ) {
      const commentWrapper = e.target.closest(".commentInfo");
      const text = commentWrapper.querySelector(".comment");
      const deleteBn = commentWrapper.querySelector(".delete");
      const editBn = commentWrapper.querySelector(".edit");
      disableButton(editBn, deleteBn, true, "0.5"); // disables the edit and delete buttons while editing the comment
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
         let modifiedComment = comment.split(" ");
         const username = modifiedComment[0];
         modifiedComment = modifiedComment.splice(1, comment.length).join(" ");
         text.innerHTML =
            `<span class="repliedUser">${username}</span> ` + modifiedComment;
         updateComment.style.display = "none";
      };
   } else if (
      e.target.classList.contains("reply") ||
      e.target.classList.contains("replyImg") ||
      e.target.classList.contains("replyText")
   ) {
      const commentArticle = e.target.closest("article");
      let username = commentArticle.querySelector(".userName").textContent;
      if (commentArticle.classList.contains("nestedReply")) {
         commentArticle.innerHTML += `<section class="addComment replied">
         <figure>
            <img src="images/avatars/image-juliusomo.png" alt="" />
         </figure>
         <textarea
            name=""
            id="commentField"
            rows="4"
            cols="55"
            ></textarea>
         <button class="replyBtn">REPLY</button>
      </section>`;
      } else {
         commentArticle.innerHTML += `<section class="addComment">
            <figure>
               <img src="images/avatars/image-juliusomo.png" alt="" />
            </figure>
            <textarea
               name=""
               id="commentField"
               rows="4"
               cols="55"
               placeholder="Add a comment"></textarea>
            <button class="replyBtn">REPLY</button>
         </section>`;
      }
      commentArticle.querySelector("textarea").value = "@" + username + " ,";
      const replyBtn = commentArticle.querySelector(".replyBtn");
      replyBtn.onclick = () => {
         let theReply = commentArticle.querySelector("textarea").value;
         const modifiedReply = theReply
            .split(",")
            .splice(1, theReply.length)
            .join("");
         const userNameField = `<span class='repliedUser'>@${username}</span> `;
         commentArticle.querySelector(".addComment").remove();
         getPost(commentArticle, "container","replied", modifiedReply, userNameField);
      };
   }
});
sendMsg.onclick = () => {
   getPost(commentHolder, "container","", newComment.value, "");
   newComment.value = "";
};
