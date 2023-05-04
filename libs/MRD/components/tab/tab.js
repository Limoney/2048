let tabsElements = document.getElementsByClassName('tabs');
let uwu;
for(let tabs of tabsElements)
{
    //i know use getElementsByClassName, maybe later
    let tabNav = tabs.getElementsByClassName('tabs-nav')[0].getElementsByClassName("tab-nav-element");
    let tabPages = tabs.getElementsByClassName('tabs-content')[0].children;
    uwu = tabs.getElementsByClassName('tabs-nav')[0];
    //hash is used to redirecting from url
    let hash = location.hash.substring(1);
    let tabFromHash = document.getElementById(hash);
    let activeTab = tabFromHash ?? tabNav[0];

    for(let i=0;i<tabNav.length;i++)
    {
        tabNav[i].addEventListener('click',()=>{
            tabNav[i].classList.add('tab-nav-active');
            tabPages[i].classList.add('tab-content-active');
            for(let j=0;j<tabPages.length;j++)
            {
                if(i==j) continue;
                tabNav[j].classList.remove('tab-nav-active');
                tabPages[j].classList.remove('tab-content-active');
            }
        });
    }
    activeTab.click();
}