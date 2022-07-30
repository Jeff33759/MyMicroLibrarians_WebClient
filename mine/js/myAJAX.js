function loginFunc(role){
	let json;
	switch (role) {
		case 'admin': {
			json = {id:"admin",password:"admin"}
			break;
		}
		case 'advanced': {
			json = {id:"advanced",password:"advanced"}
			break;
		}
		case 'normal': {
			json = {id:"normal",password:"normal"}
			break;
		}
		default: {
			json = {id:"admin",password:"admin"}
			break;
		}
	}
	let jsonStr = JSON.stringify(json);

	$.ajax({
		url: `http://localhost:8080/authn/login`,
		type: 'post' , 
		crossDomain: true, 
		dataType :  'json',
		contentType: 'application/json',
		data: jsonStr
	}).done(function (data, textStatus, jqXHR) { 
		refreshToken = data.refreshToken;
		accessToken = data.accessToken;
		refreshTokenObj = decodeTokenToJsonObj(refreshToken,"rt");
		accessTokenObj = decodeTokenToJsonObj(accessToken,"at");
		setUserInfoToView(accessTokenObj.claims);
		enableAuthComponent();
		removeTheMarkOfFakeData();
		showSweetAlert(gSUCCESS,"login success!",genResStatusAlertTemplate(jqXHR.status));
	}).fail(function (jqXHR, textStatus, errorThrown) {
		showSweetAlert(gERROR,"login failed.",genResStatusAlertTemplate(jqXHR.status,jqXHR.responseJSON.msg));
	}); 
}

function refreshAT() {
	$.ajax({
		url: encodeURI(`http://localhost:8080/authn/refreshing/at`),
		type: 'post' , 
		crossDomain: true, 
		dataType :  'json',  
		headers : {
			'Authorization' : refreshToken
		}
	}).done(function (data, textStatus, jqXHR) { 
		accessToken = data.accessToken;
		accessTokenObj = decodeTokenToJsonObj(accessToken,"at");
		setUserInfoToView(accessTokenObj.claims);
		setValueIntoATDetails();
		removeTheMarkOfFakeData();
	}).fail(function (jqXHR, textStatus, errorThrown) {
		showSweetAlert(gERROR,"Execute failed.",genResStatusAlertTemplate(jqXHR.status,jqXHR.responseJSON.msg));
	}); 
}


function queryAllBooks(){
	let nowPage = $("#all-books-param .par-1").val();
	let pageSize = $("#all-books-param .par-2").val();
	let sortRule = $("#all-books-param .par-3").val();

	let queryStr = `nowPage=${nowPage}&pageSize=${pageSize}&sortRule=${sortRule == null ? "" : sortRule}`;

	$.ajax({
		url: encodeURI(`http://localhost:8080/book?${queryStr}`),
		type: 'get' , 
		crossDomain: true, 
		dataType :  'json' 
	}).done(function (data, textStatus, jqXHR) {
		bookData = data.result;
		showBookResult("m",jqXHR);
		showSweetAlert(gSUCCESS,"Execute success!",genResStatusAlertTemplate(jqXHR.status));
	}).fail(function (jqXHR, textStatus, errorThrown) {
		showSweetAlert(gERROR,"Execute failed.",genResStatusAlertTemplate(jqXHR.status,jqXHR.responseJSON.msg));
	});  
}

function queryBookById(){
	let bookId = $("#book-byid-param .par-1").val();

	$.ajax({
		url: encodeURI(`http://localhost:8080/book/byid/${bookId}`),
		type: 'get' , 
		crossDomain: true, 
		dataType :  'json',  
		headers : {
			'Authorization' : accessToken
		}
	}).done(function (data, textStatus, jqXHR) { 
		bookData = data;
		showBookResult("s",jqXHR);
		showSweetAlert(gSUCCESS,"Execute success!",genResStatusAlertTemplate(jqXHR.status));
	}).fail(function (jqXHR, textStatus, errorThrown) {
		showSweetAlert(gERROR,"Execute failed.",genResStatusAlertTemplate(jqXHR.status,jqXHR.responseJSON.msg));
	}); 
}

function queryBooksByCond(){
	let nowPage = $("#book-cond-param .par-1").val();
	let pageSize = $("#book-cond-param .par-2").val();
	let sortRule = $("#book-cond-param .par-3").val();
	let titleKw = $("#book-cond-param .par-4").val();
	let yearFrom = $("#book-cond-param .par-5").val();
	let yearTo = $("#book-cond-param .par-6").val();

	let queryStr = `nowPage=${nowPage}&pageSize=${pageSize}&sortRule=${sortRule == null ? "" : sortRule}&titleKw=${titleKw}&yearFrom=${yearFrom}&yearTo=${yearTo}`;
	
	$.ajax({
		url: encodeURI(`http://localhost:8080/book/cond?${queryStr}`),
		type: 'get' , 
		crossDomain: true, 
		dataType :  'json',  
		headers : {
			'Authorization' : accessToken
		},
	}).done(function (data, textStatus, jqXHR) { 
		bookData = data.result;
		showBookResult("m",jqXHR);
		showSweetAlert(gSUCCESS,"Execute success!",genResStatusAlertTemplate(jqXHR.status));
	}).fail(function (jqXHR, textStatus, errorThrown) {
		showSweetAlert(gERROR,"Execute failed.",genResStatusAlertTemplate(jqXHR.status,jqXHR.responseJSON.msg));
	}); 
}



function createBook(){ 
	let mainTitleVal = $("#create-book-param .par-1").val();
	let typeVal = $("#create-book-param .par-2").val();
	let acquiredYearVal = $("#create-book-param .par-3").val();

	let json = {mainTitle:mainTitleVal, type:typeVal};
	acquiredYearVal == "" ? false : json.acquiredYear = acquiredYearVal;
	let jsonStr = JSON.stringify(json);

	$.ajax({
		url: encodeURI(`http://localhost:8080/book`),
		type: 'post' , 
		crossDomain: true, 
		dataType :  'json',  
		contentType: 'application/json',
		data: jsonStr, 
		headers : {
			'Authorization' : accessToken
		}
	}).done(function (data, textStatus, jqXHR) { 
		bookData = data;
		showBookResult("s",jqXHR);
		showSweetAlert(gSUCCESS,"Execute success!",genResStatusAlertTemplate(jqXHR.status));
	}).fail(function (jqXHR, textStatus, errorThrown) {
		showSweetAlert(gERROR,"Execute failed.",genResStatusAlertTemplate(jqXHR.status,jqXHR.responseJSON.msg));
	}); 
}


function replaceBookById(){ 
	let bookId = $("#replace-book-param .par-1").val();
	let mainTitleVal = $("#replace-book-param .par-2").val();
	let typeVal = $("#replace-book-param .par-3").val();
	let acquiredYearVal = $("#replace-book-param .par-4").val();

	let json = {mainTitle:mainTitleVal, type:typeVal};
	acquiredYearVal == "" ? false : json.acquiredYear = acquiredYearVal;
	let jsonStr = JSON.stringify(json);

	$.ajax({
		url: encodeURI(`http://localhost:8080/book/${bookId}`),
		type: 'put' , 
		crossDomain: true, 
		dataType :  'json', 
		contentType: 'application/json',
		data: jsonStr,  
		headers : {
			'Authorization' : accessToken
		}
	}).done(function (data, textStatus, jqXHR) { 
		bookData = data;
		showBookResult("s",jqXHR);
		showSweetAlert(gSUCCESS,"Execute success!",genResStatusAlertTemplate(jqXHR.status));
	}).fail(function (jqXHR, textStatus, errorThrown) {
		showSweetAlert(gERROR,"Execute failed.",genResStatusAlertTemplate(jqXHR.status,jqXHR.responseJSON.msg));
	});  
}

function updateBookById(){ 
	let bookId = $("#update-book-param .par-1").val();
	let mainTitleVal = $("#update-book-param .par-2").val();
	let typeVal = $("#update-book-param .par-3").val();
	let acquiredYearVal = $("#update-book-param .par-4").val();

	let json = {};
	mainTitleVal == "" ? false : json.mainTitle = mainTitleVal;
	typeVal == "" ? false : json.type = typeVal;
	acquiredYearVal == "" ? false : json.acquiredYear = acquiredYearVal;
	let jsonStr = JSON.stringify(json);

	$.ajax({
		url: encodeURI(`http://localhost:8080/book/${bookId}`),
		type: 'patch' , 
		crossDomain: true, 
		dataType :  'json', 
		contentType: 'application/json',
		data: jsonStr,  
		headers : {
			'Authorization' : accessToken
		}
	}).done(function (data, textStatus, jqXHR) { 
		bookData = data;
		showBookResult("s",jqXHR);
		showSweetAlert(gSUCCESS,"Execute success!",genResStatusAlertTemplate(jqXHR.status));
	}).fail(function (jqXHR, textStatus, errorThrown) {
		showSweetAlert(gERROR,"Execute failed.",genResStatusAlertTemplate(jqXHR.status,jqXHR.responseJSON.msg));
	});  
}

function deleteBookById(){
	let bookId = $("#delete-book-param .par-1").val();

	$.ajax({
		url: encodeURI(`http://localhost:8080/book/${bookId}`),
		type: 'delete' , 
		crossDomain: true, 
		dataType :  'json', 
		headers : {
			'Authorization' : accessToken
		}
	}).done(function (data, textStatus, jqXHR) { 
		resetBookResult();
		showSweetAlert(gSUCCESS,"Execute success!",genResStatusAlertTemplate(jqXHR.status));
	}).fail(function (jqXHR, textStatus, errorThrown) {
		showSweetAlert(gERROR,"Execute failed.",genResStatusAlertTemplate(jqXHR.status,jqXHR.responseJSON.msg));
	});  
}

