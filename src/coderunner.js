import formSerialize from 'form-serialize';
import * as Service from './service';
import colors from 'colors.json';
console.log('colors', colors);

export default class Coderunner {
    constructor(){
        //Variables
        this.animations = null;
        this.orderNumber = null;
        this.progress = null;
        this.throttle = null; 
        this.currentStep = null;
        this.message = null;

        //Elements
        this.previewImage = null;
        this.previewOverlay = null;
        this.progressBar = null;
        this.nextButton = null;
        this.prevButton = null;
        this.shapeSelector = null;
        this.backgroundColorButton = null;
        this.dotsColorButton = null;
        this.colorPicker = null;

        //Events
        this.setScreenOrientation = this.setScreenOrientation.bind(this);
        this.scanDestinationChanged = this.scanDestinationChanged.bind(this);
        this.previewImageLoaded = this.previewImageLoaded.bind(this);
        this.previewImageError = this.previewImageError.bind(this);
        this.makePreviewSquare = this.makePreviewSquare.bind(this);
        this.nextButtonClicked = this.nextButtonClicked.bind(this);
        this.prevButtonClicked = this.prevButtonClicked.bind(this);
        this.orderParamChanged = this.orderParamChanged.bind(this);
        this.colorButtonClicked = this.colorButtonClicked.bind(this);
    }

    init(){
        this.currentStep = 1;
        this.message = '';

        this.previewImage = document.getElementById('preview-img');
        this.previewOverlay = document.getElementById('preview-overlay');
        this.progressBar = document.getElementById('progress-bar-inner');
        this.nextButton = document.getElementById('next-button');
        this.prevButton = document.getElementById('prev-button');
        this.shapeSelector = document.getElementById('shape');
        this.backgroundColorButton = document.getElementById('background-color-button');
        this.dotsColorButton = document.getElementById('dots-color-button');
        this.colorPicker = document.getElementById('color-picker-container');

        this.getAnimations();
        this.setScreenOrientation();
        this.enableListeners();
        this.refreshStep();
    }

    enableListeners(){
        window.addEventListener( 'resize', this.setScreenOrientation );
        document.getElementById( 'scan-destination' ).addEventListener( 'keyup', this.scanDestinationChanged );
        this.previewImage.addEventListener( 'load', this.previewImageLoaded );
        this.previewImage.addEventListener( 'error', this.previewImageError );
        this.nextButton.addEventListener( 'click', this.nextButtonClicked );
        this.prevButton.addEventListener( 'click', this.prevButtonClicked );
        this.shapeSelector.addEventListener( 'change', this.orderParamChanged );
        this.backgroundColorButton.addEventListener( 'click', this.colorButtonClicked );
        this.dotsColorButton.addEventListener( 'click', this.colorButtonClicked );
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
        if (e.target.value === '')
            this.nextButton.style.display = 'none';
        else
            this.nextButton.style.display = 'block';       

        if (e.target.value === '' && e.target.value === this.message) return;
        this.message = e.target.value;

        window.clearTimeout( this.throttle );
        this.throttle = window.setTimeout( this.orderParamChanged.bind(this), 500 );
    }

    orderParamChanged(){
        let form = document.getElementById('form-data');
        let params = formSerialize(form, {hash: true});
        this.sendNewOrder( params );
    }

    sendNewOrder( params ){
        if (this.currentStep < 3) { 
            params.frameNumber = 1;
            params.anim = 'staticCodeOnly';
        }
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
 
        if (this.message === '' || this.currentStep >= allSteps.length) {
            this.nextButton.style.display = 'none';
        } else {
            this.nextButton.style.display = 'block';
        }
    }

    colorButtonClicked(e){
        let type = e.target.id.split('-')[0];
        let target = e.target;
        let sibling = e.target.nextElementSibling || e.target.previousElementSibling;

        if (target.className.search('selected') === -1) {
            target.className = 'color-btn selected';
            sibling.className = 'color-btn';
            this.colorPicker.style.display = 'block';
            this.buildColorPicker(type);
        } else { 
            this.colorPicker.style.display = 'none';
            target.className = 'color-btn';
        }
    }

    buildColorPicker(type){
        let colorSwatches = document.getElementsByClassName('color-swatch');
        for (let i=colorSwatches.length-1;i>-1;i-=1){
            colorSwatches[i].parentNode.removeChild(colorSwatches[i]);
        }

        let container = document.getElementById('color-picker');
        let arr = colors[type];
        for (let i=0;i<arr.length;i+=1){
            let swatch = document.createElement('DIV');
            swatch.className = 'color-swatch';
            swatch.style.backgroundColor = arr[i];
            container.appendChild(swatch);
        }

        let bgColor = 'rgba(255,255,255,0.9)';
        if (type === 'dots') bgColor = 'rgba(0,0,0,0.9)';
        container.parentNode.style.backgroundColor = bgColor;
    }
}
