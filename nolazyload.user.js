// ==UserScript==
// @name nolazyload
// @namespace https://greasyfork.org/zh-CN/scripts/791-nolazyload
// @version    7.0.1
// @description  将lazyload图片提前读进缓存,提高加载速度 preload all lazyload pictures at once
// @include *
// @grant none
// @icon https://async.date/icons/nolazyload.ico
// @homepageURL https://greasyfork.org/zh-CN/scripts/791-nolazyload
// @installURL https://greasyfork.org/scripts/791-nolazyload/code/nolazyload.user.js
// @updateURL  https://greasyfork.org/scripts/791-nolazyload/code/nolazyload.user.js
// @copyright  反馈和建议 feedback & suggest E-mail: nolazyload@foxmail.com
// ==/UserScript==

//图片的真实标签 pics's real tags
let nolz_lazytags = ["src9","data-url","data-ks-lazyload","data-ks-lazyload-custom","data-lazy-load-src","data-lazyload","original","file","data-src","data-cover","data-original","data-thumb","real_src","src2","data-imageurl","data-defer-src","data-placeholder","origin-src","data-actualsrc","org_src","data-lazyload-src","src1","#src"];
//已加载图片 loaded pics
let nolz_lazypics = [];

//直接加载图片,看起来会比缓存快一些 instant load pics,it will be seems faster then cache 
let nolz_inspics = ["item.taobao.com","detail.tmall.com","detail.1688.com","mp.weixin.qq.com"]; 

//白名单 以下域名不启用脚本 white list ,at those domains ,this script wont's work 
let nolz_wlist = ["search.taobao.com","list.tmall.com","s.taobao.com"];
let nolz_prehref = document.location.href;

let nolz_nolazyload = function() //主函数
{
    try
    {
        if (document.location.href != nolz_prehref){
        //与上一次URL不一至,清一下内存
            nolz_prehref = document.location.href;
            nolz_lazypics = null;
            nolz_lazypics = [];
        }
        
        let hostn = document.location.hostname;
        
        for(let i=0; i<nolz_wlist.length; i++)
        {
            if(hostn.indexOf(nolz_wlist[i])>-1) //检测白名单
            {
                return;
            }
        }
        
        let imgs = document.images;
        
        for(let i=0;i<imgs.length;i++) //所有图片循环
        {
            for(let j=0; j<nolz_lazytags.length; j++) //所有lazy标签循环
            {
                for(let k=0; k<imgs[i].attributes.length; k++) //图片的所有属性循环
                {
                    if(imgs[i].attributes[k].nodeName == nolz_lazytags[j])
                    {
                        //console.log(imgs[i].attributes[k].nodeName);
                        //console.log(i);
                        if(imgs[i].attributes[k].nodeValue != imgs[i].src){
                            nolz_preload(imgs[i].attributes[k].nodeValue,nolz_lazytags[j], i);
                        }
                        
                    }
                }
            }
        }
        //console.log("nolazyload times ");
    }catch(e)
    {
        console.log("error"+e);
    }
}

let nolz_preload = function(url,tag,img)
{
    let loaded = false;
    for(let i = 0; i<nolz_lazypics.length;i++) //检查是否加载过
    {
        if(url == nolz_lazypics[i])
        {
            loaded = true;
            break;
        }
    }
    if(loaded)
    {
        return;
    }
    else
    {
        nolz_loading(url,tag,img);
        console.log("preload "+url);
    }
    
}
let nolz_loading = function(url,tag,img)
{
    if(nolz_di_check())
    {
        document.images[img].src=url;
        document.images[img].removeAttribute(tag);
    }
    else
    {
        new Image().src = url;
    }
    nolz_lazypics.push(url)
}

let nolz_di_check = function()
{
    let hn = document.location.hostname;
    for(let i=0;i<nolz_inspics.length;i++)
    {
        if(hn.indexOf(nolz_inspics[i])>-1) //检测页面hostname里是否包含直接加载域名
        {
            return true;
        }
    }
    return false;
}

 //监控网页变化
let nolz_observer = new MutationObserver(function(mutations)
{
    nolz_nolazyload();
});

nolz_observer.observe(document.documentElement, {
  childList: true,
  subtree: true
});
