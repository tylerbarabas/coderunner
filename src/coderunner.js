import * as Service from './service';

export default class Coderunner {
    constructor(){
        //Variables
        this.animations = null;
        this.orderNumber = null;
        this.progress = null;
        this.throttle = null; 

        //Elements
        this.previewImage = null;
        this.previewOverlay = null;

        //Events
        this.setScreenOrientation = this.setScreenOrientation.bind(this);
        this.scanDestinationChanged = this.scanDestinationChanged.bind(this);
        this.previewImageLoaded = this.previewImageLoaded.bind(this);
        this.previewImageError = this.previewImageError.bind(this);
        this.makePreviewSquare = this.makePreviewSquare.bind(this);
    }

    init(){
        this.previewImage = document.getElementById('preview-img');
        this.previewOverlay = document.getElementById('preview-overlay');

        this.getAnimations();
        this.setScreenOrientation();
        this.enableListeners();
    }

    enableListeners(){
        window.addEventListener( 'resize', this.setScreenOrientation );
        document.getElementById( 'scan-destination' ).addEventListener( 'keydown', this.scanDestinationChanged );
        this.previewImage.addEventListener( 'load', this.previewImageLoaded );
        this.previewImage.addEventListener( 'error', this.previewImageError );
    }

    getAnimations(){    
        Service.getAnimsJson().then( json => {
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

        window.setTimeout( this.makePreviewSquare, 0 );
    }

    makePreviewSquare(){
        this.previewImage.style.height = null;
        this.previewImage.style.width = null; 
        this.previewOverlay.style.height = null;
        this.previewOverlay.style.width = null;

        let height = this.previewImage.offsetHeight;
        let width = this.previewImage.offsetWidth;
        let smaller = Math.min( height, width );

        this.previewImage.style.height = smaller+'px';
        this.previewImage.style.width = smaller+'px';
        this.previewImage.style.left = 'calc(50% - ' + smaller/2+'px)';

        this.previewOverlay.style.height = smaller+'px';
        this.previewOverlay.style.width = smaller+'px';
        this.previewOverlay.style.left = 'calc(50% - ' + smaller/2+'px)';
    }


    scanDestinationChanged( e ) {
        let params = { 
            xres: '500',
            yres: '500',
            anim: 'staticCodeOnly',
            msg: e.target.value 
        }; 

        window.clearTimeout( this.throttle );
        this.throttle = window.setTimeout( this.sendNewOrder.bind(this, params), 500 );
    }

    sendNewOrder( params ){
        Service.newOrder( params ).then( res => {
            this.orderNumber = res.orderNumber;
            if ( this.progressLoop !== null ) this.stopProgressLoop();
            this.stopProgressLoop();
            this.startProgressLoop();
        });
    }

    startProgressLoop(){
        this.showPreviewOverlay();
        this.progressLoop = window.setInterval(() => {
            if (this.progress < 100) {
                this.getProgress();
            } else {
                this.stopProgressLoop();
                this.showFirstFrame();
            }
        }, 1000);
    }

    stopProgressLoop(){
        window.clearInterval( this.progressLoop );
        this.progressLoop = null;
    }

    getProgress( orderNumber = this.orderNumber ) {
        Service.checkProgress( orderNumber ).then( json => {
            this.progress = json.progress;
        });
    }

    showFirstFrame(){
        this.previewImage.src = Service.domain + '/orders/' + this.orderNumber + '/frames/1';
    }

    isImageOk( img = this.previewImage ) {
        if (!img.complete || img.naturalWidth === 0) return false;
        return true;
    }

    previewImageLoaded(){
        this.hidePreviewOverlay();
    }

    showPreviewOverlay(){
       this.previewOverlay.className = this.previewOverlay.className.split(' hide')[0]; 
    }

    hidePreviewOverlay(){
        if (this.previewOverlay.className.search(/hide/) === -1) {
            this.previewOverlay.className = this.previewOverlay.className + ' hide';
        }
    }

    previewImageError(){
        this.showFirstFrame();
    }
}
