const App = new Vue({
  el: '#app',
  data: {
    urlToCounters: './data/counters.json',
    defaultStartCounter: 124,
    defaultCounter: 54871,
    startCounter: '',
    counter: 0,
    // startCounter: 1214,
    // counter: 54869,
    menuHeight: 80,
    modal: false,
    modalHTML: ''
  },
  methods: {
    scrollToAnchor(event) {
      event.preventDefault();
      let currentLink = event.target;
      let target = currentLink.getAttribute('href')
      gsap.to(window, {duration: 1, scrollTo:target})
    },
    girlAnimate(event) {
      let x = (window.innerWidth / 2 - event.clientX) / 30
      let y = (window.innerHeight / 2 - event.clientY) / 30
      gsap.to(this.$refs.girl, {duration: 0.2, rotateX: y, rotateY: x})
    },
    girlOut() {
      gsap.to(this.$refs.girl, {duration: 1, rotateX: 0, rotateY: 0, z: 0})
    },
    girlIn() {
      gsap.to(this.$refs.girl, {duration: 0.3, z: 30})
    },
    animateCounter(newVal) {
      gsap.to(this.$data, { duration: 2.5, ease: Power4.easeOut, startCounter: newVal});
    },
    removePreloader() {
      gsap.to(this.$refs.preloader,{duration: 0.5, scale: 1.5, opacity: 0, onComplete: () => {
        this.$refs.preloader.remove()
        // this.animateCounter(this.counter)
        this.getCounters()
      }})
    },
    showModal(id) {
      this.modal = !this.modal
      this.modalHTML = `<iframe width="1000" height="400" src="https://www.youtube.com/embed/${id}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
    },
    modalEnter(el,done) {
      gsap.fromTo(el,{opacity:0, scale:1.2}, {opacity:1, scale:1, duration: 1, onComplete: done})
    },
    modalLeave(el,done) {
      gsap.to(el,{opacity:0, scale:1.2, duration: 0.5, onComplete: done})
    },
    getCounters() {
      fetch(this.urlToCounters)
        .then(response => response.json())
        .then(item => {
          this.startCounter = item.startCounter
          this.counter = item.counter
          this.animateCounter(this.counter)
        })
        .catch(error => {
          console.log(error)
          this.startCounter = this.defaultStartCounter
          this.counter = this.defaultCounter
          this.animateCounter(this.counter)
        });
    }
  },
  computed: {
    animatedNumber: function() {
      let formated
      if (typeof this.startCounter === "number") {
        let fixed = this.startCounter.toFixed(0)
        formated = new Intl.NumberFormat('ru-RU').format(fixed)
      } else {
        formated = this.startCounter
      }
      return formated
    }
  },
  mounted () {
    setTimeout(()=> {
      this.removePreloader()
    },300)
    
    

    if ( document.querySelector('.ya-share2') ) {
      let shareScript = document.createElement('script');
      shareScript.src = '//yastatic.net/share2/share.js';
      document.body.appendChild(shareScript);
    }
  }
})

//якоря
const menu = document.querySelectorAll('.app-nav a');
document.addEventListener('scroll',function(e){
  let scroll = window.pageYOffset || document.documentElement.scrollTop
  menu.forEach((el,index) => {
    let target = el.getAttribute('href')
    let offset = getOffset(target) + scroll;
    if (scroll + App.$data.menuHeight > offset) {
      [].forEach.call(menu, (item) => {
        item.classList.remove('active');
      })
      el.classList.add('active');
    } else if (document.body.scrollHeight - document.documentElement.clientHeight === scroll) {
      [].forEach.call(menu, (item) => {
        item.classList.remove('active');
      })
      menu[menu.length - 1].classList.add('active');
    }
  })
},false)

function getOffset(el){
  return document.querySelector(el).getBoundingClientRect().top
}