import { injectReducer } from '../../store/reducers'

export default (store) => ({
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const Coderunner = require('./containers/CoderunnerContainer').default
      const reducer = require('./modules/coderunner').default

      /*  Add the reducer to the store on key 'counter'  */
      injectReducer(store, { key: 'coderunner', reducer })

      /*  Return getComponent   */
      cb(null, Coderunner)

    /* Webpack named bundle   */
    }, 'coderunner')
  }
})
