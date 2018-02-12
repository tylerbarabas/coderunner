import * as Service from './service';

export default class Coderunner {
    constructor(){
        //Variables
        this.animations = null;
        this.orderNumber = null;
        this.progress = null;
        this.throttle = null; 
        this.currentStep = null;

        //Elements
        this.previewImage = null;
        this.previewOverlay = null;
        this.progressBar = null;
        this.nextButton = null;
        this.prevButton = null;

        //Events
        this.setScreenOrientation = this.setScreenOrientation.bind(this);
        this.scanDestinationChanged = this.scanDestinationChanged.bind(this);
        this.previewImageLoaded = this.previewImageLoaded.bind(this);
        this.previewImageError = this.previewImageError.bind(this);
        this.makePreviewSquare = this.makePreviewSquare.bind(this);
        this.nextButtonClicked = this.nextButtonClicked.bind(this);
        this.prevButtonClicked = this.prevButtonClicked.bind(this);
    }

    init(){
        this.currentStep = 1;

        this.previewImage = document.getElementById('preview-img');
        this.previewOverlay = document.getElementById('preview-overlay');
        this.progressBar = document.getElementById('progress-bar-inner');
        this.nextButton = document.getElementById('next-button');
        this.prevButton = document.getElementById('prev-button');

        this.getAnimations();
        this.setScreenOrientation();
        this.enableListeners();
        this.refreshStep();
    }

    enableListeners(){
        window.addEventListener( 'resize', this.setScreenOrientation );
        document.getElementById( 'scan-destination' ).addEventListener( 'keydown', this.scanDestinationChanged );
        this.previewImage.addEventListener( 'load', this.previewImageLoaded );
        this.previewImage.addEventListener( 'error', this.previewImageError );
        this.nextButton.addEventListener( 'click', this.nextButtonClicked );
        this.prevButton.addEventListener( 'click', this.prevButtonClicked );
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
        var charcode = e.charCode;
        var c = String.fromCharCode(charcode);

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
        this.progress = 0;
        this.setProgressBar();
        this.showPreviewOverlay();
        this.progressLoop = window.setInterval(() => {
            this.setProgressBar();
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

    setProgressBar( progress = this.progress ){
        this.progressBar.innerText = this.progress + '%';
        this.progressBar.style.width = this.progress + '%';
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

    nextButtonClicked(){
        this.currentStep += 1;
        this.refreshStep();
    }

    prevButtonClicked(){
        this.currentStep -= 1;
        this.refreshStep();
    }

    refreshStep(){
        let allSteps = [].slice.call(document.getElementsByClassName('step'));
        if (this.currentStep < 1) this.currentStep = 1;
        if (this.currentStep > allSteps.length) this.currentStep = allSteps.length;

        let selectedElement = document.getElementById('step'+this.currentStep);
        selectedElement.style.display = 'block';

        let otherElements = allSteps.filter(e => e !== selectedElement);
        for (let i=0;i<otherElements.length;i+=1){
            otherElements[i].style.display = 'none';
        }

        if (this.currentStep < 2) {
            this.prevButton.style.display = 'none';
        } else {
            this.prevButton.style.display = 'block';
        }
 
        if (this.currentStep >= allSteps.length) {
            this.nextButton.style.display = 'none';
        } else {
            this.nextButton.style.display = 'block';
        }
    }
}
