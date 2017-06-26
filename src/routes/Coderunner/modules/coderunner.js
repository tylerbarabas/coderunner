// ------------------------------------
// Constants
// ------------------------------------
export const CODERUNNER_SET_PROPERTY = 'CODERUNNER_SET_PROPERTY'
// ------------------------------------
// Actions
// ------------------------------------
export function setProperty (key = null,value = null) {
  return {
    type: CODERUNNER_SET_PROPERTY,
    payload: {key: key, value: value}
  }
}

export const actions = {
  setProperty
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [CODERUNNER_SET_PROPERTY]: (state, action) => {
    console.log('action',action);
    return {
      ...state,
      orderParams: {
        ...state.orderParams,
        [action.payload.key]: action.payload.value
      }
    }
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  orderParams: {
    encodeString: '',
    resolution: 400,
    tileShape: 'square',
    bgpColor: '#FFFFFF',
    pixelColor: '#000000',
    anim: 'Breathe'
  },
  volatile: {
    step: 1
  }
}
export default function coderunnerReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
