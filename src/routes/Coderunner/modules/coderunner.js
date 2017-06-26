// ------------------------------------
// Constants
// ------------------------------------
export const CODERUNNER_SET_PROPERTY = 'CODERUNNER_SET_PROPERTY'
export const CODERUNNER_SET_STEP = 'CODERUNNER_SET_STEP'

// ------------------------------------
// Actions
// ------------------------------------
export function setProperty (key = null,value = null) {
  return {
    type: CODERUNNER_SET_PROPERTY,
    payload: {key: key, value: value}
  }
}

export function setStep (value = 1) {
  return {
    type: CODERUNNER_SET_STEP,
    payload: value
  }
}

export const actions = {
  setProperty,
  setStep
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [CODERUNNER_SET_PROPERTY]: (state, action) => {
    return {
      ...state,
      orderParams: {
        ...state.orderParams,
        [action.payload.key]: action.payload.value
      }
    }
  },
  [CODERUNNER_SET_STEP]: (state, action) => {
    console.log('reducer',action);
    return {
      ...state,
      volatile: {
        ...state.volatile,
        step: state.volatile.step + action.payload
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
