import { getAnimsJson } from './service';

export default class Coderunner {
    constructor(){
        this.animations = null;
        this.setScreenOrientation = this.setScreenOrientation.bind(this);
    }

    init(){
        this.getAnimations();
        this.setScreenOrientation();
        this.enableListeners();
    }

    enableListeners(){
        window.addEventListener('resize', this.setScreenOrientation);
    }

    getAnimations(){    
        getAnimsJson().then( json => {
            this.animations = json;
        });
    }

    setScreenOrientation(){
        let containers = document.getElementsByClassName( 'container' );
        let orientation = ( window.innerHeight > window.innerWidth ) ? 'portrait' : 'landscape';
        for (let i=0;i<containers.length;i+=1){
            let c = containers[i];
            c.className = c.className.split(' portrait')[0].split(' landscape')[0];
            c.className += ' ' + orientation;
        }
    }
}
