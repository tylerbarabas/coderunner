import './index.scss';
import { getAnimsJson } from './service';

let animations = null;
getAnimsJson().then( json => {
    animations = json;
});
