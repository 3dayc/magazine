function HorizontalSmoothScroll(target, ease){
  let content = document.querySelector(target);
  let children = content.children;
  let contentWidth = 0 ;
  let requestId = null;
  let wrapper = content.parentElement;
  let wrapperBounds = wrapper.getBoundingClientRect();
  let firstW = document.querySelector('.global-nav').offsetWidth + 100; //네비의 너비값 
  let progressbar = document.querySelector('.progress-bar'); 
  let stickyNav =  document.querySelector('.sticky'); 
  let lastX = 0; 

  content.querySelectorAll('section').forEach(function(item, index){
    contentWidth += item.offsetWidth; 
    if(index === 0 ){
      firstW = item.offsetWidth; 
    }
  }); 

  let scroller = {  
    wheelMultiplier: getLineHeight(),
    ease: ease,
    speed: 0,
    minX: 0,
    maxX: contentWidth - wrapperBounds.width,
    x: 0
  };

  wrapper.style.position = 'relative';
  wrapper.style.overflow = 'hidden';
  wrapper.addEventListener("wheel", onWheel);
  document.querySelector('#go-main-btn').addEventListener('click', function(e){
    let scrollContainer = document.querySelector('.scroll-container')
    scrollContainer.classList.add('go'); 
    scrollContainer.addEventListener('transitionend', function moveEnd(){
      this.classList.remove('go'); 
      this.style.transform = 'translate3d(0px, 0px, 0px)'; 
       scroller.x = 0; 
       this.removeEventListener('transitionend', moveEnd)
    })
  })

  $('.scroll-container').addClass('go'); 
    $('.scroll-container').on('transitionend', function(){
      $(this).removeClass('go').css('transform', 'translate3d(0px, 0px, 0px)'); 
      $(this).off('transitionend');
    })


  function onWheel(event) {
    event.preventDefault();
    let normalized;  
    let delta = event.wheelDelta;

    if (delta) {
      normalized = (delta % 120) == 0 ? delta / 120 : delta / 12;
    } else {
      delta = event.deltaY || event.detail || 0;
      normalized = -(delta % 3 ? delta * 10 : delta / 3);
    }

    scroller.speed += normalized * scroller.wheelMultiplier;

    if (scroller.speed && !requestId) {
      requestId = requestAnimationFrame(onFrame);
    }
  }

  function onFrame() {
    scroller.speed += -scroller.speed * scroller.ease;
    // scroller.y -= scroller.speed;
    scroller.x -= (Math.floor(scroller.speed * 1000) / 700).toFixed(0);

    if (scroller.x < scroller.minX) {
      scroller.x = scroller.minX;
      scroller.speed = 0;
    } else if (scroller.x > scroller.maxX) {
      scroller.x = scroller.maxX;
      scroller.speed = 0;
    }

    var progress = (scroller.x / scroller.maxX) * 100;
    content.style.transform = "translate3d(" + -scroller.x + "px, 0px,1px)";
    //progressbar.style.width = progress + '%';

    requestId = null;

    if(Math.abs(scroller.x) > firstW){
      stickyNav.classList.add('show'); 
      progressbar.parentNode.classList.add('show'); 
      progressbar.style.width = progress + '%'
    }else{
      stickyNav.classList.remove('show')
      progressbar.parentNode.classList.remove('show'); 
    }

    // if (scroller.speed) {
    //   requestId = requestAnimationFrame(onFrame);
    // }

    if(lastX != scroller.x){
      requestId = requestAnimationFrame(onFrame);
    }
    lastX = scroller.x
  }

  function getLineHeight() {
    let element = document.createElement("div");
    element.style["font-size"] = "128ex";
    document.body.appendChild(element);
    let value = getComputedStyle(element).getPropertyValue("font-size");
    let size = parseFloat(value, 10) / 128;
    document.body.removeChild(element);
    return size;
  }
}

new HorizontalSmoothScroll('.scroll-container', 0.1);