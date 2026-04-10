// favoritesActions.js

export const ADD_FAVORITE = 'ADD_FAVORITE';
export const REMOVE_FAVORITE = 'REMOVE_FAVORITE';
export const ADD_WISHLIST = 'ADD_WISHLIST';
export const REMOVE_WISHLIST = 'REMOVE_WISHLIST';
export const LOAD_PERSISTED_DATA = 'LOAD_PERSISTED_DATA';

// Action creators
export const addFavorite = (game) => ({
    type: ADD_FAVORITE,
    payload: game,
});

export const removeFavorite = (gameId) => ({
    type: REMOVE_FAVORITE,
    payload: gameId,
});

export const addWishlist = (game) => ({
    type: ADD_WISHLIST,
    payload: game,
});

export const removeWishlist = (gameId) => ({
    type: REMOVE_WISHLIST,
    payload: gameId,
});

export const loadPersistedData = (data) => ({
    type: LOAD_PERSISTED_DATA,
    payload: data,
});
