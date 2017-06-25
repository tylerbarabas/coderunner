// ------------------------------------
// Constants
// ------------------------------------
export const CODERUNNER_SET_PROPERTY = 'CODERUNNER_SET_PROPERTY'
// ------------------------------------
// Actions
// ------------------------------------
export function setProperty (value = {}) {
  return {
    type: CODERUNNER_SET_PROPERTY,
    payload: value
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
    return {
      ...state,
//      action.delta
    }
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  encodeString: '',
  resolution: 400,
  tileShape: 'square',
  bgpColor: '#FFFFFF',
  pixelColor: '#000000',
  anim: 'Breathe' 
}
export default function coderunnerReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
