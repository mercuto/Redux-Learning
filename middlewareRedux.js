const redux = require("redux");
const reduxLogger = require("redux-logger");
const axios = require("axios");
const reduxThunk = require("redux-thunk").default;

const createStore = redux.createStore;
const reduxMiddleware = redux.applyMiddleware;
const logger = reduxLogger.createLogger();

const BUY_CAKE = "BUY_CAKE";
const BUY_ICECREAM = "BUY_ICECREAM";

const FETCH_USERS_REQUEST = "FETCH_USERS_REQUEST";
const FETCH_USERS_SUCCESS = "FETCH_USERS_SUCCESS";
const FETCH_USERS_FAILURE = "FETCH_USERS_FAILURE";

const buyCake = () => {
  return {
    type: BUY_CAKE,
  };
};

const buyIcecream = () => {
  return {
    type: BUY_ICECREAM,
  };
};

const fetchUserRequest = () => {
  return {
    type: FETCH_USERS_REQUEST,
  };
};

const fetchUserSuccess = (users) => {
  return {
    type: FETCH_USERS_SUCCESS,
    payload: users,
  };
};

const fetchUserFailure = (error) => {
  return {
    type: FETCH_USERS_FAILURE,
    payload: error,
  };
};

const initialState = {
  loading: false,
  users: [],
  error: "",
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USERS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_USERS_SUCCESS:
      return {
        loading: false,
        users: action.payload,
        error: "",
      };
    case FETCH_USERS_FAILURE:
      return {
        users: [],
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

/*
const initialState = {
  cakeCount: 10,
  iceCreamCount: 20,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case BUY_CAKE:
      return {
        ...state,
        cakeCount: state.cakeCount - 1,
      };
    case BUY_ICECREAM:
      return {
        ...state,
        iceCreamCount: state.iceCreamCount - 1,
      };

    default:
      return state;
  }
};
*/

const fetchUsers = () => {
  return function (dispatch) {
    dispatch(fetchUserRequest());
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((response) => {
        const users = response.data.map((user) => user.id);
        dispatch(fetchUserSuccess(users));
      })
      .catch((error) => {
        dispatch(fetchUserFailure(error.message));
      });
  };
};

const store = createStore(reducer, reduxMiddleware(reduxThunk, logger));
const unsubscribe = store.subscribe(() => {
  console.log(store.getState());
});

/*
store.dispatch(buyCake());
store.dispatch(buyCake());
store.dispatch(buyIcecream());
store.dispatch(buyCake());
store.dispatch(buyIcecream());
store.dispatch(buyIcecream());
*/

store.dispatch(fetchUsers());

unsubscribe();
