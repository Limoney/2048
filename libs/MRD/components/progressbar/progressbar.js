function setProgress(progressbar,value)
{
    progressbar.children[0].style.background=`conic-gradient(var(--primary) ${value * 3.6}deg,var(--primary-dark) 0deg)`;
    progressbar.children[0].children[0].innerText =  `${value}%`;
}