  // JavaScript for modal
// JavaScript for modal
function openModal(modalId, imgSrc) {
    var modal = document.getElementById(modalId);
    modal.style.display = "block";
    var modalImg = modal.querySelector(".modal-content");
    modalImg.src = imgSrc;
  }
  
  function closeModal(modalId) {
    var modal = document.getElementById(modalId);
    modal.style.display = "none";
  }
