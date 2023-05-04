let modalTriggers = document.getElementsByClassName("modal-trigger");
let modalOverlay = document.querySelector(".modal-overlay");
let body = document.querySelector("body");
for(let trigger of modalTriggers)
{
    let modal = trigger.nextElementSibling;
    trigger.addEventListener("click",()=>{
        modalOverlay.classList.remove("is-hidden");
        body.classList.add("disable-scroll");
        modal.classList.add("modal-active");
    });
    modal.querySelector(".modal-close").addEventListener("click",()=>{
        modalOverlay.classList.add("is-hidden");
        body.classList.remove("disable-scroll");
        modal.classList.remove("modal-active");
    });
}