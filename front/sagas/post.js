import { all, fork, call, put, takeLatest, throttle } from 'redux-saga/effects';
import axios from 'axios';
import {
	LIKE_POST_REQUEST,
	LIKE_POST_SUCCESS,
	LIKE_POST_FAILURE,
	UNLIKE_POST_REQUEST,
	UNLIKE_POST_SUCCESS,
	UNLIKE_POST_FAILURE,
	ADD_POST_SUCCESS,
	ADD_POST_REQUEST,
	ADD_POST_FAILURE,
	REMOVE_POST_SUCCESS,
	REMOVE_POST_REQUEST,
	REMOVE_POST_FAILURE,
	ADD_COMMENT_REQUEST,
	ADD_COMMENT_SUCCESS,
	ADD_COMMENT_FAILURE,
	LOAD_POSTS_REQUEST,
	LOAD_POSTS_SUCCESS,
	LOAD_POSTS_FAILURE,
} from '../reducers/post';
import { ADD_POST_TO_ME, REMOVE_POST_OF_ME } from '../reducers/user';

function loadPostsAPI(data) {
	return axios.get('/posts', data);
}

function* loadPosts(action) {
	try {
		const result = yield call(loadPostsAPI, action.data);

		yield put({
			type: LOAD_POSTS_SUCCESS,
			data: result.data,
		});
	} catch (err) {
		console.log(err);
		yield put({
			type: LOAD_POSTS_FAILURE,
			// error: err.response.data,
		});
	}
}

function addPostAPI(data) {
	return axios.post('/post', { content: data });
}

function* addPost(action) {
	try {
		const result = yield call(addPostAPI, action.data);

		yield put({
			type: ADD_POST_SUCCESS,
			data: result.data,
		});
		yield put({
			type: ADD_POST_TO_ME,
			data: result.data.id,
		});

	} catch (err) {
		console.log(err);
		yield put({
			type: ADD_POST_FAILURE,
			error: err.response.data,
		});
	}
}

function likePostAPI(data) {
	return axios.patch(`/post/${data}/like`);
}

function* likePost(action) {
	try {
		const result = yield call(likePostAPI, action.data);

		yield put({
			type: LIKE_POST_SUCCESS,
			data: result.data,
		});

	} catch (err) {
		console.log(err);
		yield put({
			type: LIKE_POST_FAILURE,
			error: err.response.data,
		});
	}
}

function unLikePostAPI(data) {
	return axios.delete(`/post/${data}/like`);
}

function* unLikePost(action) {
	try {
		const result = yield call(unLikePostAPI, action.data);

		yield put({
			type: UNLIKE_POST_SUCCESS,
			data: result.data,
		});
	} catch (err) {
		console.log(err);
		yield put({
			type: UNLIKE_POST_FAILURE,
			error: err.response.data,
		});
	}
}

function removePostAPI(data) {
	return axios.delete(`/post/${data}`);
}

function* removePost(action) {
	try {
		const result = yield call(removePostAPI, action.data);

		yield put({
			type: REMOVE_POST_SUCCESS,
			data: result.data,
		});
		yield put({
			type: REMOVE_POST_OF_ME,
			data: action.data,
		});

	} catch (err) {
		yield put({
			type: REMOVE_POST_FAILURE,
			error: err.response.data,
		});
	}
}

function addCommentAPI(data) {
	return axios.post(`/post/${data.postId}/comment`, data);
}

function* addComment(action) {
	try {
		const result = yield call(addCommentAPI, action.data);

		yield put({
			type: ADD_COMMENT_SUCCESS,
			data: result.data,
		});
	} catch (err) {
		console.error(err);
		yield put({
			type: ADD_COMMENT_FAILURE,
			error: err.response.data,
		});
	}
}

function* watchLoadPosts() {
	yield throttle(5000, LOAD_POSTS_REQUEST, loadPosts);
}

function* watchAddPost() {
	yield takeLatest(ADD_POST_REQUEST, addPost);
}

function* watchRemovePost() {
	yield takeLatest(REMOVE_POST_REQUEST, removePost);
}

function* watchAddComment() {
	yield takeLatest(ADD_COMMENT_REQUEST, addComment);
}

function* watchLikePost() {
	yield takeLatest(LIKE_POST_REQUEST, likePost);
}

function* watchUnlikePost() {
	yield takeLatest(UNLIKE_POST_REQUEST, unLikePost);
}


export default function* postSaga() {
	yield all([
		fork(watchLikePost),
		fork(watchUnlikePost),
		fork(watchAddPost),
		fork(watchLoadPosts),
		fork(watchRemovePost),
		fork(watchAddComment),
	]);
}