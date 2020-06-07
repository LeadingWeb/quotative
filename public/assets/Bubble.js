class Bubble{
    constructor(d, a, i, n, afterAnimation) {
        this.x = Math.floor(Math.random() * 100);
        this.y = Math.floor(Math.random() * 100);
        this.d = d;
        this.el = document.createElement('div');
        this.el.style.position = 'absolute';
        this.el.style.width = `${this.d}px`;
        this.el.style.height = `${this.d}px`;
        this.el.style.left = `${this.x}%`;
        this.el.style.top = `${this.y}%`;
        this.r = Math.floor(Math.random() * 127);
        this.g = Math.floor(Math.random() * 127);
        this.b = Math.floor(Math.random() * 127);
        this.a = a;
        this.el.style.background = `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
        this.el.style.borderRadius = '50%';
        
        document.querySelector('body').appendChild(this.el);
        
        this.el.style.animation = 'register 1.5s';
        this.el.addEventListener('animationend', (e) => {
            this.el.remove();
            if(i == n-1){
                afterAnimation();
                
            }
        })
    }
}