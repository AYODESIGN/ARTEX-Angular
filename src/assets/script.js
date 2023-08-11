const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');

if (bar) {
    bar.addEventListener('click', () => {
        nav.classList.add('active');
    })
}

if (close) {
    close.addEventListener('click', () => {
        nav.classList.remove('active');
    })
}

const wrapper = document.querySelector('wrapper')

let pressed = false 
let startX = 0

wrapper.addEventListener('mouseleave', function (e) {
    pressed = true
    startX = e.clientX
    this.style.cursor = 'grabbing'

})
wrapper.addEventListener('mouseup', function (e) {
    pressed = false
    
})

window.addEventListener('mousemove', function (e) {
  if(!pressed) {
      return
  }
  this.scrollleft = startX - e.clientX

})