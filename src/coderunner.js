import braintree from 'braintree-web-drop-in';
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
        this.preloadingImages = null;
        this.preloadingBacklog = null;
        this.preloadedImages = null;
        this.tryLoadingCount = null;
        this.colorPalettes = null;
        this.customImageInterval = null;
        this.params = null;

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
        this.anim = null;
        this.animationBoxes = null;
        this.submitPayment = null;

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
        this.preloadingBacklog = [];
        this.preloadingImages = [];
        this.preloadedImages = [];
        this.tryLoadingCount = 0;
        this.colorPalettes = {};

        this.form = document.getElementById('form');
        this.previewImage = document.getElementById('preview-img');
        this.previewOverlay = document.getElementById('preview-overlay');
        this.progressBar = document.getElementById('progress-bar-inner');
        this.nextButton = document.getElementById('next-button');
        this.prevButton = document.getElementById('prev-button');
        //this.shapeSelector = document.getElementById('shape');
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
        this.anim = document.getElementById('anim');
        this.animationBoxes = [];
        this.submitPayment = document.getElementById('submit-payment');

        this.getInitData();
        this.setScreenOrientation();
        this.enableListeners();
        this.refreshStep();
    }

    enableListeners(){
        window.addEventListener( 'resize', this.setScreenOrientation );
        this.form.addEventListener( 'submit', e=>{e.preventDefault();});
        this.scanDestination.addEventListener( 'keyup', this.scanDestinationChanged );
        this.previewImage.addEventListener( 'load', this.previewImageLoaded );
        this.previewImage.addEventListener( 'error', this.previewImageError );
        this.nextButton.addEventListener( 'click', this.nextButtonClicked );
        this.prevButton.addEventListener( 'click', this.prevButtonClicked );
        //this.shapeSelector.addEventListener( 'change', this.orderParamChanged );
        this.backgroundColorButton.addEventListener( 'click', this.colorButtonClicked );
        this.dotsColorButton.addEventListener( 'click', this.colorButtonClicked );
        this.xClose.addEventListener( 'click', this.xCloseClicked );
        this.customImageButton.addEventListener( 'click', this.customImageButtonClicked );
        this.customImageInput.addEventListener( 'change', this.customImageInputChanged );
    }

    getInitData(){
        Service.getAnimsJson().then( json => {
            this.animations = json;
            let orientation = ( window.innerHeight > window.innerWidth ) ? 'portrait' : 'landscape';
            Object.keys( this.animations ).map( a => {
                let thumb = `${Service.production}/anims/${a}/thumbnails/anim.gif`;
                return this.preloadImage(thumb);
            });
            this.populateAnimationSelector( orientation );
        });

	    Service.getColorsJson().then( json => {
            this.colorPalettes = json;
        });

        //https://www.npmjs.com/package/braintree-web-drop-in
        Service.getClientToken().then( json => {
            braintree.create({
                authorization: json.clientToken,
                selector: '#braintree-widget'
            },function (err, dropinInstance){
                if (err) {
                    // Handle any errors that might've occurred when creating Drop-in
                    console.error(err);
                    return;
                }
                this.submitPayment.addEventListener( 'click', this.submitPaymentClicked.bind( this, dropinInstance ) );
            }.bind(this));
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

        let h = (orientation === 'landscape') ? 1 : 0.5;
        let subtract = (orientation === 'landscape') ? 150 : 130;
        this.animationContainer.style.height = `${(window.innerHeight * h) - subtract}px`;
        this.populateAnimationSelector( orientation );

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
        this.params = formSerialize(this.form, {hash: true});
        this.sendNewOrder( this.params );
    }

    sendNewOrder( params = this.params ){
        if (this.currentStep < 4) { 
            params.frameNumber = 1;
            params.anim = 'staticCodeOnly';
        }
        Service.newOrder( params ).then( res => {
            this.orderNumber = res.orderNumber;
            if (params.anim === 'staticCodeOnly') {
                this.showNextPreview( Service.api + '/orders/' + this.orderNumber + '/frames/1' );
            } else {
                if ( this.progressLoop !== null ) this.stopProgressLoop();
                this.startProgressLoop();
            }
        });
    }

    startProgressLoop(){
        this.nextButton.style.display = 'none';
        this.progress = 0;
        this.setProgressBar();
        this.showPreviewOverlay();
        this.progressLoop = window.setInterval(() => {
            this.setProgressBar();
            if (this.progress < 100) {
                this.getProgress();
            } else {
                this.stopProgressLoop();
                this.showNextPreview( Service.api + '/orders/' + this.orderNumber + '/gif' );
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

    showNextPreview( src ){
        let index = this.preloadedImages.indexOf( src );
        this.previewImage.style.opacity = 0.5;
        if (index !== -1) {
            this.previewImage.src = src;
            this.previewImage.style.opacity = 1;
            this.hideCustomImagePreview();
            this.hidePreviewOverlay();
            this.nextButton.style.display = 'block';
        } else {
            this.preloadImage( src, this.showNextPreview.bind( this ) );
        }
    }

    hideCustomImagePreview() {
        clearInterval(this.customImageInterval);
        this.customImagePreview.style.opacity = 0;
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
            this.nextButton.style.display = 'block';
        } else {
            this.preloadImage( src, this.showCustomImagePreview.bind( this ) );
        }
    }

    preloadImage( src, cb = null ) {
        let backlogIndex = this.preloadingBacklog.indexOf( src );
        if (this.preloadingImages.length < 3 
            || src.indexOf('order') !== -1
            || src.indexOf('modules') !== -1) {
            if (backlogIndex !== -1) this.preloadingBacklog.splice( backlogIndex, 1 );
            this.preloadingImages.push( src );
            let img = new Image();
            img.addEventListener('load', () => {
                this.preloadedImages.push( src );
                this.preloadingImages.splice( this.preloadingImages.indexOf(src),1 );
                if (this.preloadingBacklog.length > 0) this.preloadImage( this.preloadingBacklog[0] );
                if (typeof cb === 'function') cb( src );
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
        } else { 
            if (backlogIndex === -1) this.preloadingBacklog.push( src );
        }
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
 
        if (this.message === '' 
            || ( this.currentStep === 3 && this.img1.value === '' )
            || ( this.currentStep === 4 && this.anim.value === '' )
            || this.currentStep >= allSteps.length ) {
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
        let fullpath = Service.production + res.filepath;
        this.img1.value = fullpath;
        this.showCustomImagePreview( fullpath );
    }

    populateAnimationSelector( orientation ){
        this.animationContainer.innerHTML = '';
        this.animationBoxes = [];

        let d = ( orientation === 'landscape' ) ? 8 : 4;
        let length = ( window.innerWidth / d ) - 30;

        for (let i in this.animations) {
            let a = this.animations[i];
            let arr = i.split('_');
            let formattedName = arr[arr.length-1];
            let nameText = document.createElement('DIV');
            nameText.innerText = formattedName;
            nameText.className = 'animation-text';
            nameText.style.fontSize = `${length / 11}px`;
            let priceText = document.createElement('DIV');
            priceText.innerText = `$${a.price}`;
            priceText.className = 'price-text';
            priceText.style.fontSize = `${length / 8}px`;

            let box = document.createElement('DIV');
            box.className = 'animation-box';
            box.id = 'animation-box-'+i;
            box.style.width = `${length}px`;
            box.style.height = `${length}px`;
            box.style.backgroundImage = `url(${Service.production}/anims/${i}/thumbnails/anim.gif)`;

            box.addEventListener('click', this.animationBoxClicked.bind(this));
            this.animationBoxes.push( box );
            box.setAttribute('anim', i);

            box.appendChild( nameText );
            box.appendChild( priceText );
            this.animationContainer.appendChild( box );
        }
    }

    animationBoxClicked(e){
        for (let i=0;i<this.animationBoxes.length;i+=1){
            let a = this.animationBoxes[i];
            if (a.className.indexOf('selected') !== -1) a.className = a.className.split(' selected')[0];
        }
        e.target.className += ' selected';
        let input = document.getElementById('anim');
        let anim = e.target.getAttribute('anim');
        if (anim !== input.value) {
            input.value = anim;
            this.orderParamChanged();
        }
    }

    submitPaymentClicked(dropinInstance){
        dropinInstance.requestPaymentMethod((err, payload) =>  {
            if (err) {
                console.error(err);
            }

            let amount = this.animations[this.params.anim].price;
            Service.processPayment( amount, payload.nonce ).then(json=>{
                console.log('payment sent', json);
            });
        });
    }
}
