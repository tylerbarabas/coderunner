import { getAnimsJson, newOrder, checkProgress } from './service';

export default class Coderunner {
    constructor(){
        this.animations = null;
        this.orderNumber = null;
        this.progress = null;

        this.setScreenOrientation = this.setScreenOrientation.bind(this);
        this.scanDestinationChanged = this.scanDestinationChanged.bind(this);
    }

    init(){
        this.getAnimations();
        this.setScreenOrientation();
        this.enableListeners();
    }

    enableListeners(){
        window.addEventListener('resize', this.setScreenOrientation);
        document.getElementById('scan-destination').addEventListener('change', this.scanDestinationChanged);
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

    scanDestinationChanged( e ) {
        newOrder({ msg: e.target.value }).then( res => {
            this.orderNumber = res.orderNumber;
            if ( this.progressLoop !== null ) this.stopProgressLoop();
            this.startProgressLoop();
        });
    }

    startProgressLoop(){
        this.progressLoop = window.setInterval(() => {
            if (this.progress < 100) {
                this.getProgress();
            } else {
                this.stopProgressLoop();
            }
        }, 1000);
    }

    stopProgressLoop(){
        window.clearInterval( this.progressLoop );
        this.progressLoop = null;
    }

    getProgress( orderNumber = this.orderNumber ) {
        checkProgress( orderNumber ).then( json => {
            this.progress = json.progress;
        });
    }
}
