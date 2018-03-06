import formSerialize from 'form-serialize';
import * as Service from './service';
import colors from 'colors.json';

export default class Coderunner {
    constructor(){
        //Variables
        this.animations = null;
        this.orderNumber = null;
        this.progress = null;
        this.throttle = null; 
        this.currentStep = null;
        this.message = null;
        this.preloadedImages = null;
        this.tryLoadingCount = null;
        this.colorPalettes = null;
        this.customImageInterval = null;

        //Elements
        this.previewImage = null;
        this.previewOverlay = null;
        this.progressBar = null;
        this.nextButton = null;
        this.prevButton = null;
//        this.shapeSelector = null;
        this.backgroundColorButton = null;
        this.dotsColorButton = null;
        this.colorPicker = null;
        this.xClose = null;
        this.scanDestination = null;
        this.bgpColor = null;
        this.pixelColor = null;
        this.customImageButton = null;
        this.customImageInput = null;
        this.customImagePreview = null;
        this.img1 = null;
        this.animationContainer = null;

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
        this.xCloseClicked = this.xCloseClicked.bind(this);
        this.customImageButtonClicked = this.customImageButtonClicked.bind(this);
        this.customImageInputChanged = this.customImageInputChanged.bind(this);
    }

    init(){
        this.currentStep = 1;
        this.message = '';
        this.preloadedImages = [];
        this.tryLoadingCount = 0;
        this.colorPalettes = {};

        this.previewImage = document.getElementById('preview-img');
        this.previewOverlay = document.getElementById('preview-overlay');
        this.progressBar = document.getElementById('progress-bar-inner');
        this.nextButton = document.getElementById('next-button');
        this.prevButton = document.getElementById('prev-button');
//        this.shapeSelector = document.getElementById('shape');
        this.backgroundColorButton = document.getElementById('background-color-button');
        this.dotsColorButton = document.getElementById('dots-color-button');
        this.colorPicker = document.getElementById('color-picker-container');
        this.xClose = document.getElementById('x-close');
        this.scanDestination = document.getElementById('scan-destination');
        this.pixelColor = document.getElementById('pixel-color');
        this.bgpColor = document.getElementById('bgp-color');
        this.customImageButton = document.getElementById('upload-file-button');
        this.customImageInput = document.getElementById('custom-image');
        this.customImagePreview = document.getElementById('custom-image-preview');
        this.img1 = document.getElementById('img1');
        this.animationContainer = document.getElementById('animation-container');

        this.getAnimations();
        this.setScreenOrientation();
        this.enableListeners();
        this.refreshStep();
    }

    enableListeners(){
        window.addEventListener( 'resize', this.setScreenOrientation );
        this.scanDestination.addEventListener( 'keyup', this.scanDestinationChanged );
        this.previewImage.addEventListener( 'load', this.previewImageLoaded );
        this.previewImage.addEventListener( 'error', this.previewImageError );
        this.nextButton.addEventListener( 'click', this.nextButtonClicked );
        this.prevButton.addEventListener( 'click', this.prevButtonClicked );
//        this.shapeSelector.addEventListener( 'change', this.orderParamChanged );
        this.backgroundColorButton.addEventListener( 'click', this.colorButtonClicked );
        this.dotsColorButton.addEventListener( 'click', this.colorButtonClicked );
        this.xClose.addEventListener( 'click', this.xCloseClicked );
        this.customImageButton.addEventListener( 'click', this.customImageButtonClicked );
        this.customImageInput.addEventListener( 'change', this.customImageInputChanged );
    }

    getAnimations(){ 
        Service.getAnimsJson().then( json => {
            this.animations = json;
        });

	Service.getColorsJson().then( json => {
            this.colorPalettes = json;
            console.log('this.colorPalettes', this.colorPalettes);
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

        let animationContainerHeight = (orientation === 'landscape') ? 0.8 : 0.25;
        this.animationContainer.style.height = `${window.innerHeight * animationContainerHeight}px`;

        window.setTimeout( this.makePreviewSquare, 0 );
    }

    makePreviewSquare(){
        this.previewImage.style.height = null;
        this.previewImage.style.width = null; 
        this.previewOverlay.style.height = null;
        this.previewOverlay.style.width = null;
        this.customImagePreview.style.width = null;
        this.customImagePreview.style.height = null;

        let height = this.previewImage.offsetHeight;
        let width = this.previewImage.offsetWidth;
        let smaller = Math.min( height, width );

        this.previewImage.style.height = smaller+'px';
        this.previewImage.style.width = smaller+'px';
        this.previewImage.style.left = 'calc(50% - ' + smaller/2+'px)';

        this.previewOverlay.style.height = smaller+'px';
        this.previewOverlay.style.width = smaller+'px';
        this.previewOverlay.style.left = 'calc(50% - ' + smaller/2+'px)';

        this.customImagePreview.style.height = smaller+'px';
        this.customImagePreview.style.width = smaller+'px';
        this.customImagePreview.style.left = 'calc(50% - ' + smaller/2+'px)';
    }

    scanDestinationChanged( e ) {
        if (e.target.value === '')
            this.nextButton.style.display = 'none';
        else
            this.nextButton.style.display = 'block';       

        if (e.target.value === '' || e.target.value === this.message) return;
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
        if (this.currentStep < 4) { 
            params.frameNumber = 1;
            params.anim = 'staticCodeOnly';
        }
        Service.newOrder( params ).then( res => {
            this.orderNumber = res.orderNumber;
            //if ( this.progressLoop !== null ) this.stopProgressLoop();
            if (params.anim === 'staticCodeOnly') {
                this.showNextPreview( Service.domain + '/orders/' + this.orderNumber + '/frames/1' );
            } else {
                this.startProgressLoop();
            }
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
            }
        }, 1000);
    }

    stopProgressLoop(){
        window.clearInterval( this.progressLoop );
        this.progressLoop = null;
        this.showNextPreview( Service.domain + '/orders/' + this.orderNumber );
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

    showNextPreview( src ){
        let index = this.preloadedImages.indexOf( src );;
        this.previewImage.style.opacity = 0.5;
        if (index !== -1) {
            this.previewImage.src = src;
            this.previewImage.style.opacity = 1;
        } else {
            this.preloadImage( src, this.showNextPreview.bind( this ) );
        }
    }

    showCustomImagePreview( src ) {
        let index = this.preloadedImages.indexOf( src );
        if (index !== -1) {
            this.customImagePreview.src = src;
            this.customImagePreview.style.display = 'block';
            clearInterval(this.customImageInterval);
            this.customImageInterval = setInterval(()=>{
                let opacity = parseFloat( this.customImagePreview.style.opacity );
                this.customImagePreview.style.opacity = ( opacity === 0.9 ) ? 0.1 : 0.9;
            },1000);
        } else {
            this.preloadImage( src, this.showCustomImagePreview.bind( this ) );
        }
    }

    preloadImage( src, cb ){
        let img = new Image();
        img.addEventListener('load', () => {
            this.tryLoadingCount = 0;
            this.preloadedImages.push( src );
            cb( src );
        });
        img.addEventListener('error', () => {
            this.tryLoadingCount += 1;
            if (this.tryLoadingCount > 50) {
                throw "Could not load image " + src;
            } else {
                img.src = src;
            }
        });
        img.src = src;
    }

    isImageOk( img = this.previewImage ) {
        if (!img.complete || img.naturalWidth === 0) return false;
        return true;
    }

    previewImageLoaded(){
        this.previewImage.style.opacity = 1;
    }

    previewImageError(){
        this.showNextPreview();
    }

    showPreviewOverlay(){
       this.previewOverlay.className = this.previewOverlay.className.split(' hide')[0]; 
    }

    hidePreviewOverlay(){
        if (this.previewOverlay.className.search(/hide/) === -1) {
            this.previewOverlay.className = this.previewOverlay.className + ' hide';
        }
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
            this.openColorPicker();
            this.buildColorPicker(type);
        } else { 
            target.className = 'color-btn';
            this.closeColorPicker();
        }
    }

    xCloseClicked(){
        let selected = document.getElementsByClassName('selected');
        for (let i=0;i<selected.length;i+=1){
            selected[i].className = 'color-btn';
        }
        this.closeColorPicker();
    }

    openColorPicker(){
        this.colorPicker.style.opacity = 1;
        this.colorPicker.style.left = '0px';
    }

    closeColorPicker(){
        this.colorPicker.style.left = '-1000px';
        this.colorPicker.style.opacity = 0;
    }

    colorSwatchClicked(type, e){
        let color = e.target.getAttribute('color');
        let input = null;
        if (type === 'dots'){
            input = this.pixelColor;
        } else {
            input = this.bgpColor;
        }
        input.value = color.replace('#','');
        this.orderParamChanged();
        this.xCloseClicked();
    }

    buildColorPicker(type){
        let colorSwatches = document.getElementsByClassName('color-swatch');
        for (let i=colorSwatches.length-1;i>-1;i-=1){
            colorSwatches[i].parentNode.removeChild(colorSwatches[i]);
        }

        let container = document.getElementById('color-picker');
        let arr = this.colorPalettes[type];
        for (let i=0;i<arr.length;i+=1){
            let swatch = document.createElement('DIV');
            swatch.className = 'color-swatch';
            swatch.style.backgroundColor = arr[i];
            swatch.setAttribute('color', arr[i]);
            swatch.addEventListener('click',this.colorSwatchClicked.bind(this, type));
            container.appendChild(swatch);
        }

        let bgColor = 'rgba(0,0,0,0.8)';
        let xColor = 'rgba(255,255,255,1)';
        if (type === 'dots') {
            bgColor = 'rgba(255,255,255,0.8)';
            xColor = 'rgba(0,0,0,1)';
        }
        container.parentNode.style.backgroundColor = bgColor;
        this.xClose.style.color = xColor;
    }

    customImageButtonClicked(){
        this.customImageInput.click();
    }

    async customImageInputChanged(e){
        let formData = new FormData();
        formData.append( 'file', e.target.files[0] );
        let res = await Service.uploadImage( formData );
        let fullpath = Service.imghost + res.filepath;
        this.img1.value = fullpath;
        this.showCustomImagePreview( fullpath );
    }
}
